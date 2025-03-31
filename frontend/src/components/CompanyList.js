import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCompany, setNewCompany] = useState({ 
    name: '', 
    industry: '', 
    location: '',
    website: ''
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/companies');
      console.log('Companies API Response:', res.data);
      setCompanies(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to load companies. Please try again later.');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewCompany({ ...newCompany, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/companies', newCompany);
      setNewCompany({ name: '', industry: '', location: '', website: '' }); // Reset form
      fetchCompanies(); // Refresh company list
    } catch (err) {
      console.error('Error adding company:', err);
      setError('Failed to add company. Please try again.');
    }
  };

  const deleteCompany = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This will also delete all applications associated with this company.`)) {
      try {
        await axios.delete(`http://localhost:5001/api/companies/${id}`);
        setCompanies(companies.filter(company => company._id !== id));
      } catch (err) {
        console.error('Error deleting company:', err);
        setError('Failed to delete company. Please try again.');
      }
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><h3>Loading...</h3></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <h2 className="mb-4">Company Management</h2>
      
      {/* Add Company Form */}
      <div className="card mb-4">
        <div className="card-header">
          <h5>Add New Company</h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Company Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={newCompany.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="industry" className="form-label">Industry</label>
              <input
                type="text"
                className="form-control"
                id="industry"
                name="industry"
                value={newCompany.industry}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={newCompany.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="website" className="form-label">Website</label>
              <input
                type="url"
                className="form-control"
                id="website"
                name="website"
                value={newCompany.website}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Add Company</button>
          </form>
        </div>
      </div>
      
      {/* Company List */}
      <div className="card">
        <div className="card-header">
          <h5>Existing Companies</h5>
        </div>
        <div className="card-body">
          {companies.length === 0 ? (
            <p>No companies found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Industry</th>
                    <th>Location</th>
                    <th>Website</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {companies.map(company => (
                    <tr key={company._id}>
                      <td>{company.name}</td>
                      <td>{company.industry || 'N/A'}</td>
                      <td>{company.location || 'N/A'}</td>
                      <td>
                        {company.website ? (
                          <a href={company.website} target="_blank" rel="noopener noreferrer">
                            {company.website}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <button 
                          onClick={() => deleteCompany(company._id, company.name)} 
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList; 