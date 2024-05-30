import './App.css';
import Header from './app/components/navigation/Header'
import Footer from './app/components/navigation/Footer';
import {
  BrowserRouter as Router
} from "react-router-dom";
import AppRoutes from './app/routes/Routes';
import '@bcgov/bc-sans/css/BCSans.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './app/components/navigation/SideBar';
import "@bcgov/bc-sans/css/BCSans.css";


function App() {
  return (
    <div  className="container-fluid p-0">    
      <Router >    
      <Header/>   
        <div className="row m-0 p-0">
          <div className="col-md-1 p-0 display-from-medium">
           <SideBar/>
          </div>
          <div className="col-md-11  p-0">
          <AppRoutes/>
          </div>
        </div> 
        <Footer/> 
      </Router>   
      <ToastContainer />
      
    </div>
  );
}

export default App;
