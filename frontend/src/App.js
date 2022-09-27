import './App.css';
import UsersList from './app/features/users/UsersList';
import AddUserForm from './app/features/users/AddUserForm';
import Header from './app/components/common/Header'
import Footer from './app/components/common/Footer';

function App() {
  return (
    <div className="App">
      <Header></Header>
      <UsersList></UsersList>
      <AddUserForm></AddUserForm>
      <Footer></Footer>
    </div>
  );
}

export default App;
