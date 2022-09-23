import './App.css';
import { useEffect, useState } from 'react'
import getHello from './utilities/api/hello';
import {getAllUsers, addUser, deleteUser} from './utilities/api/users';



import UsersList from './app/features/users/UsersList';
import AddUserForm from './app/features/users/AddUserForm';

function App() {
  const [hello,setHello] = useState(null)
  const [users,setUsers] = useState(null)
  useEffect(() =>{
    getHello().then(r => setHello(r));
    getUsers();
  },[])
  
  function addDefaultUser(){  
    addUser({name:"Banana Bruce", email: "banana@rama.ca"})
    .then(()=>{
      getUsers();
    })
  }

  function getUsers(){
    getAllUsers().then(u => setUsers(u));
  }

  function deleteListener(id){
    deleteUser(id).then( ()=>{
      getUsers();
    });
  }
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Basic HelloWorld App</h1>
      </header>
      <p>{hello || "No Data"}</p>
      <div>
        {users?.length ? users.map((u) =>{
           return(
            <>
                <h3>{u.name} <br/> {u.email}</h3>
                <p>{u.id}</p>
                <button onClick={ () => deleteListener(u.id)}>Delete User</button>
                <hr/>
            </>
            
           )})            
       :
        <p>No User</p>
       }
      </div>

          
        
      
      <hr/>
      <button onClick={addDefaultUser}>Add A Default User?</button>
     <UsersList></UsersList>
     <AddUserForm></AddUserForm>
    </div>
  );
}

export default App;
