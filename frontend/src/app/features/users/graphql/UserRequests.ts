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

// mutation{
// 	createUser(user:{
//     name:"Ryan"
//     email:"Email.com"
//   }){
//     id
//   }
// }