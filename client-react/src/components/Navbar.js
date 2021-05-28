import React, {useContext} from 'react';
import {AuthContext} from "../contextes/AuthContext";

export const Navbar = () => {
  const {logout} = useContext(AuthContext);
  return (
    <nav className="navbar navbar-dark bg-primary px-5">
      <div className="container">
        <div className="navbar-brand">Task Manager</div>
        <span
          className="btn btn-outline-secondary"
          onClick={logout}
        >
          Выход
        </span>
      </div>
    </nav>
  )
}