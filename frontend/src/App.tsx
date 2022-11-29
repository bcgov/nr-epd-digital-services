import './App.css';
import Header from './app/components/navigation/Header'
import Footer from './app/components/navigation/Footer';
import {
  BrowserRouter as Router
} from "react-router-dom";
import AppRoutes from './app/routes/Routes';
import '@bcgov/bc-sans/css/BCSans.css'

function App() {
  return (
    <div  className="container-fluid p-0">
      <Router >
        <Header/>
        <AppRoutes/>
      </Router>   
      <Footer/> 
    </div>
  );
}

export default App;
