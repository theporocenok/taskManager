import React from 'react'
import {BrowserRouter} from "react-router-dom"
import {useRoutes} from './routes'
import dotenv from 'dotenv'
import {AuthContext} from "./contextes/AuthContext";
import {useAuth} from "./hooks/requests/auth.hook";
import {Navbar} from "./components/Navbar";
import 'react-google-flight-datepicker/dist/main.css';

function App() {
  const {token, login, logout} = useAuth();
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);
  dotenv.config();
  return (
    <AuthContext.Provider value={{token, login, logout, isAuthenticated}}>
      <BrowserRouter>
        { isAuthenticated && <Navbar /> }
        <div className="container">
          {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
