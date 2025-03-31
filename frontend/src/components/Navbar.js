import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">Internship Tracker</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/">Applications</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/add">Add Application</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/users">Manage Users</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/companies">Manage Companies</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 