import './App.css';
import Header from './app/components/navigation/Header';
import {
  Outlet,
} from 'react-router-dom';
import '@bcgov/bc-sans/css/BCSans.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SideBar from './app/components/navigation/SideBar';
import '@bcgov/bc-sans/css/BCSans.css';

function App() {
  // const routes:RouteObject[] = [

  // ];
  // const bBrowser = createBrowserRouter(routes)
  return (
    <div className="container-fluid p-0">
      <Header />
      <div className="row m-0 p-0">
        <div className="col-md-1 p-0 display-from-medium">
          <SideBar />
        </div>
        <div className="col-md-11  p-0">
          {/* */}
          <Outlet />
        </div>
      </div>
      {/* <Footer/>  */}

      <ToastContainer />
    </div>
  );
}

export default App;
