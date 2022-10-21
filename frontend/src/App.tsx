import './App.css';
import Header from './app/components/common/Header'
import Footer from './app/components/common/Footer';
import {
  BrowserRouter as Router
} from "react-router-dom";

import AppRoutes from './app/routes/Routes';

function App() {
  return (
    <div  className="container-fluid p-0">
      <Header></Header>
        <Router >
          <AppRoutes/>
        </Router>   
      <Footer></Footer>
    </div>
  );
}

export default App;
