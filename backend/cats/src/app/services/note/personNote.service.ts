import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatePersonNote } from "../../dto/note/createPersonNote.dto";
import { DeletePersonNote } from "../../dto/note/deletePersonNote.dto";
import { UpdatePersonNote } from "../../dto/note/updatePersonNote.dto";
import { PersonNote } from "../../entities/personNote.entity";
import { LoggerService } from "../../logger/logger.service";
import { UserTypeEum } from "../../utilities/enums/userType";
import { IsNull, Repository } from "typeorm";

@Injectable()
export class PersonNoteService {
    constructor(
      @InjectRepository(PersonNote)
      private readonly personNoteRepository: Repository<PersonNote>,
      private readonly loggerSerivce: LoggerService,
    ) {}

    async getPersonNotesByPersonId(personId: number, user: any) {
        this.loggerSerivce.log('NoteService.getNotesByPersonId() start'); // Log start of the method
        try {
            // Log input parameters for better traceability
            this.loggerSerivce.debug(`Fetching notes for personId: ${personId} by user: ${user?.givenName}`);
    
            if (user?.identity_provider === UserTypeEum.IDIR) {
                // Log the condition where the identity_provider matches IDIR
                this.loggerSerivce.debug(`Identity provider is IDIR for user: ${user?.givenName}`);
                
                const notes = await this.personNoteRepository.findBy({ personId, deletedDatetime: IsNull(), deletedBy: IsNull()});
    
                if (notes?.length > 0) {
                    this.loggerSerivce.log(`Found ${notes.length} notes for personId: ${personId}`);
                    // Return the notes in the required format
                    return notes.map(note => ({
                        id: note?.id,
                        noteDescription: note?.noteDescription,
                        user: note?.createdBy ?? note?.updatedBy,
                        date: note?.createdDatetime ?? note?.updatedDatetime,
                    }));
                } 
                else 
                {
                    // Log when no notes are found for the given personId
                    this.loggerSerivce.log(`No notes found for personId: ${personId}`);
                    return [];
                }
            } 
            else 
            {
                // Log when the identity provider does not match IDIR
                this.loggerSerivce.warn(`Invalid identity_provider for user: ${user?.givenName}. Expected IDIR but got ${user?.identity_provider}`);
                return [];
            }
        } catch (err) {
            // Log the error in case of any failure during execution
            this.loggerSerivce.error(`Exception occurred in NoteService.getNotesByPersonId() for personId: ${personId}`, JSON.stringify(err));
            throw new HttpException(`Failed to retrieve notes for person id: ${personId}`, HttpStatus.NOT_FOUND);
        } finally {
            // Log method end
            this.loggerSerivce.log('NoteService.getNotesByPersonId() end');
        }
    }
    
    async createPersonNote(createNote: CreatePersonNote, user: any) {
        this.loggerSerivce.log('NoteService.createNote() start'); // Log the start of the method
    
        try {
            // Log the input parameters for better traceability
            this.loggerSerivce.debug(`Attempting to create note with description: ${createNote?.noteDescription} by user: ${user?.givenName}`);
    
            // Check if the user identity_provider is 'IDIR'
            if (user?.identity_provider === UserTypeEum.IDIR) {
                this.loggerSerivce.debug(`User with username: ${user?.givenName} is using IDIR identity provider.`);
                
                // Create the new note only if the identity provider is IDIR
                const newNote = this.personNoteRepository.create({
                    personId:createNote.personId,
                    noteDescription: createNote.noteDescription,
                    createdBy: user?.givenName,
                    createdDatetime: new Date(),
                });
    
                // Save the new note
                const savedNote = await this.personNoteRepository.save(newNote);
    
                if (savedNote) {
                    this.loggerSerivce.log(`Note created successfully with ID: ${savedNote.id}`);
                    return {
                        id: savedNote.id,
                        noteDescription: savedNote.noteDescription,
                        user: savedNote.createdBy,
                        date: savedNote.createdDatetime,
                    };
                } 
                else 
                {
                    this.loggerSerivce.warn('Note creation failed, no data returned from save operation');
                    return null;
                }
            } 
            else 
            {
                // If the identity provider is not IDIR, log a warning and prevent note creation
                this.loggerSerivce.warn(`Note creation blocked: User ${user?.givenName} is not using IDIR identity provider.`);
                throw new HttpException('Only users with IDIR identity provider are allowed to create notes', HttpStatus.FORBIDDEN);
            }
        } 
        catch (err) 
        {
            // Log the error with the exception details
            this.loggerSerivce.error('Exception occurred in NoteService.createNote()', JSON.stringify(err));
            throw new HttpException('Failed to create note', HttpStatus.BAD_REQUEST);
        } 
        finally 
        {
            // Log the end of the method
            this.loggerSerivce.log('NoteService.createNote() end');
        }
    }
    
    async updatePersonNote(noteId: string, updateNote: UpdatePersonNote, user: any) {
        // Early return if the user is not authorized to perform this action
        if (user?.identity_provider !== UserTypeEum.IDIR) {
            this.loggerSerivce.warn(`User ${user?.givenName} blocked from updating note. IDIR is required.`);
            throw new HttpException('Only users with IDIR identity provider are allowed to update notes', HttpStatus.FORBIDDEN);
        }
    
        this.loggerSerivce.debug(`Attempting to update note with ID: ${noteId} by user: ${user?.givenName}`);
    
        try {
            // Retrieve the note to be updated
            const note = await this.personNoteRepository.findOne({ where: { id: noteId } });
    
            if (!note) {
                // If no note is found, log a warning and throw an exception
                this.loggerSerivce.warn(`Note with ID: ${noteId} not found for user: ${user?.givenName}`);
                throw new HttpException('Note not found', HttpStatus.NOT_FOUND);
            }
    
            // Check if the update data is actually different from the current data
            const isUpdated = updateNote.noteDescription !== note.noteDescription;
    
            if (isUpdated) 
            {
                // If there is an actual change in note description
                note.noteDescription = updateNote.noteDescription ?? note.noteDescription;
                note.updatedBy = user?.givenName;
                note.updatedDatetime = new Date();
    
                // Save the updated note
                const updatedNote = await this.personNoteRepository.save(note);
    
                // Log success
                this.loggerSerivce.log(`Note updated successfully with ID: ${updatedNote.id}`);
    
                // Return the updated note in ViewNote DTO format
                return {
                    id: updatedNote.id,
                    noteDescription: updatedNote.noteDescription,
                    user: updatedNote.updatedBy,
                    date: updatedNote.updatedDatetime,
                };
            } 
            else 
            {
                // If no actual change is detected
                this.loggerSerivce.log(`No changes detected for note with ID: ${noteId}. No update required.`);
    
                // Return the existing note details without making changes
                return {
                    id: note.id,
                    noteDescription: note.noteDescription,
                    user: note.updatedBy,
                    date: note.updatedDatetime,
                };
            }
        } 
        catch (err) 
        {
            // Handle and log any internal errors
            this.loggerSerivce.error('Exception occurred in NoteService.updateNote()', JSON.stringify(err));
            throw new HttpException('Failed to update note', HttpStatus.BAD_REQUEST);
        } 
        finally 
        {
            // Log the end of the method execution
            this.loggerSerivce.log('NoteService.updateNote() end');
        }
    }
    
    async deletePersonNote(notes: DeletePersonNote[], user: any) {
        // Early return if the user is not authorized to perform this action (e.g., only IDIR users are allowed)
        if (user?.identity_provider !== UserTypeEum.IDIR) 
        {
            this.loggerSerivce.warn(`User ${user?.givenName} blocked from deleting note. IDIR is required.`);
            throw new HttpException('Only users with IDIR identity provider are allowed to delete notes', HttpStatus.FORBIDDEN);
        }
    
        this.loggerSerivce.debug(`Attempting to delete note(s) with ID(s): ${notes} by user: ${user?.givenName}`);
    
        // Perform bulk delete operation regardless of the number of IDs in the array
        const results = await Promise.all(notes.map(async (personNote) => {
            try {
                // Retrieve the note to be deleted
                const note = await this.personNoteRepository.findOne({ where: { id: personNote.id, deletedDatetime: IsNull(), deletedBy: IsNull() } });
    
                if (!note) 
                {
                    // If no note is found, log a warning and continue with the next
                    this.loggerSerivce.warn(`Note with ID: ${personNote.id} not found for user: ${user?.givenName}`);
                    return false;
                }
    
                // Soft delete the note by setting the 'deletedBy' and 'deletedDatetime' fields
                note.deletedBy = user?.givenName;
                note.deletedDatetime = new Date(); // Sets the current date and time
    
                // Save the updated note with the soft delete fields
                const result = await this.personNoteRepository.save(note);
                if (result) 
                {
                    // Log the successful deletion
                    this.loggerSerivce.log(`Note with ID: ${personNote.id} successfully deleted by user: ${user?.givenName}`);
                    return true;
                } 
                else 
                {
                    // Log the unsuccessful deletion
                    this.loggerSerivce.log(`Note with ID: ${personNote.id} is not successfully deleted by user: ${user?.givenName}`);
                    return false;
                }
            } 
            catch (err) 
            {
                // Handle and log any internal errors
                this.loggerSerivce.error('Exception occurred in NoteService.deleteNote()', JSON.stringify(err));
                throw new HttpException( `Failed to delete ${failedDeletes.length} note(s). See details for failed IDs.`,  HttpStatus.BAD_REQUEST);
            }
        }));
    
        // Return the results of the bulk delete operation
        const failedDeletes = results.filter(result => !result);
        if (failedDeletes.length > 0) 
        {
            // Log the failed deletes
            this.loggerSerivce.warn(`Failed to delete ${failedDeletes.length} notes`);
            return false;
        }
        return true;
    }
}