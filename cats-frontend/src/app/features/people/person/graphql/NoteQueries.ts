import gql from 'graphql-tag';

export const GET_NOTES_BY_PERSON_ID = gql`
  query getNotesByPersonId($id: Float!) 
  {
    getNotesByPersonId(id: $id)
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
  mutation updateNote($id: String!, $note: UpdateNote!)
  {
    updateNote(id: $id, note: $note)
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
  mutation createNote($note: CreateNote!)
  {
    createNote(note: $note)
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
  query deleteNote($ids: [String!]!) 
  {
    deleteNote(ids: $ids)
    {
      message
      httpStatusCode
      success
      timestamp
    }
  }
`;