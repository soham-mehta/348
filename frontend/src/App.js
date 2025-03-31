import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ApplicationList from './components/ApplicationList';
import ApplicationForm from './components/ApplicationForm';
import ApplicationEdit from './components/ApplicationEdit';
import UserList from './components/UserList';
import CompanyList from './components/CompanyList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<ApplicationList />} />
            <Route path="/add" element={<ApplicationForm />} />
            <Route path="/edit/:id" element={<ApplicationEdit />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/companies" element={<CompanyList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App; 