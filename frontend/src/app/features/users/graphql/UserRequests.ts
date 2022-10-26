import gql from 'graphql-tag'
export const FETCH_USERS = gql`
  query{
    findUsers{
      name
      id
      email
    }
  }`


export const ADD_USER = gql`
  mutation createUser($user:CreateUserDto!){
    createUser(user:$user){
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