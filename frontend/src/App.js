import logo from './logo.svg';
import './App.css';
import UsersList from './app/features/users/UsersList';
import AddUserForm from './app/features/users/AddUserForm';

function App() {
  return (
    <div className="App">
     React 12
     <UsersList></UsersList>
     <AddUserForm></AddUserForm>
    </div>
  );
}

export default App;
