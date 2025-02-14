import gql from 'graphql-tag';

export const GET_NOTES_BY_PERSON_ID = gql`
  query getPersonNotesByPersonId($id: Float!) 
  {
    getPersonNotesByPersonId(id: $id)
    {
      message
      httpStatusCode
      success
      timestamp
      data
      {
        id
        user
        date
        noteDescription
      }
    }
  }
`;



export const UPDATE_NOTE_BY_ID = gql`
  mutation updatePersonNote($id: String!, $note: UpdatePersonNote!)
  {
    updatePersonNote(id: $id, note: $note)
    {
        message
        httpStatusCode
        success
        timestamp
        data
        {
            id
            user
            date
            noteDescription
        }
    }
  }
`;

export const CREATE_NOTE = gql`
  mutation createPersonNote($note: CreatePersonNote!)
  {
    createPersonNote(note: $note)
    {
      message
      httpStatusCode
      success
      timestamp
      data
        {
            id
            user
            date
            noteDescription
        }
    }
  }
`;

export const DELETE_NOTES_BY_ID = gql`
  mutation deletePersonNote($notes: [DeletePersonNote!]!) 
  {
    deletePersonNote(notes: $notes)
    {
      message
      httpStatusCode
      success
      timestamp
    }
  }
`;