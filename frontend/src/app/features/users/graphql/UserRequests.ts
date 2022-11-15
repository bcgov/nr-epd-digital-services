import gql from 'graphql-tag'
export const FETCH_USERS = gql`
  query{
    users{      
      data{
        name
      }
    }
  }`


export const ADD_USER = gql`
  mutation createUser($user:CreateUserInput!){
    createUser(createUserInput:$user){
      id
    }
  }`


export const DELETE_USER = gql`
  mutation removeUser($userId:Int!){
    removeUser(id:$userId){
      id
    }
  }`

export const UPDATE_USER = gql`
  mutation updateUser($updateUser:UpdateUserInput!){
    updateUser(updateUserInput:$updateUser){
      name
    }
  }`

// mutation{
// 	createUser(user:{
//     name:"Ryan"
//     email:"Email.com"
//   }){
//     id
//   }
// }