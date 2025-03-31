import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import PositionStatistics from './PositionStatistics';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  
  // Filter states
  const [filters, setFilters] = useState({
    user: '',
    company: '',
    status: '',
    position: '',
    dateFrom: '',
    dateTo: ''
  });

  // Add position options
  const positionOptions = [
    'Software Engineer',
    'Product Manager',
    'Quantitative Analyst',
    'Data Scientist',
    'Data Engineer'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, usersRes, statusesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/applications'),
          axios.get('http://localhost:5001/api/users'),
          axios.get('http://localhost:5001/api/statuses')
        ]);
        
        console.log('API Response:', appsRes.data);
        setApplications(appsRes.data);
        setFilteredApplications(appsRes.data);
        setUsers(usersRes.data);
        setStatuses(statusesRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load applications. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Apply filters whenever filters state changes
    applyFilters();
  }, [filters, applications]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const applyFilters = () => {
    let filtered = [...applications];
    
    // Filter by user
    if (filters.user) {
      filtered = filtered.filter(app => 
        app.user && app.user._id === filters.user
      );
    }
    
    // Filter by company
    if (filters.company) {
      filtered = filtered.filter(app => 
        app.company && app.company.name && 
        app.company.name.toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(app => 
        app.status && app.status._id === filters.status
      );
    }
    
    // Filter by position
    if (filters.position) {
      filtered = filtered.filter(app => 
        app.position_title === filters.position
      );
    }
    
    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(app => 
        app.date_applied && new Date(app.date_applied) >= new Date(filters.dateFrom)
      );
    }
    
    if (filters.dateTo) {
      filtered = filtered.filter(app => 
        app.date_applied && new Date(app.date_applied) <= new Date(filters.dateTo)
      );
    }
    
    setFilteredApplications(filtered);
  };

  const resetFilters = () => {
    setFilters({
      user: '',
      company: '',
      status: '',
      position: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  // Calculate statistics
  const calculateStats = () => {
    if (filteredApplications.length === 0) return null;
    
    // Count applications by status
    const statusCounts = {};
    filteredApplications.forEach(app => {
      if (app.status && app.status.label) {
        statusCounts[app.status.label] = (statusCounts[app.status.label] || 0) + 1;
      }
    });
    
    return {
      total: filteredApplications.length,
      statusCounts
    };
  };
  
  const stats = calculateStats();

  const deleteApplication = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      try {
        await axios.delete(`http://localhost:5001/api/applications/${id}`);
        const updatedApps = applications.filter(app => app._id !== id);
        setApplications(updatedApps);
        setFilteredApplications(filteredApplications.filter(app => app._id !== id));
      } catch (err) {
        console.error('Error deleting application:', err);
        setError('Failed to delete application. Please try again.');
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
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3">
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-light">
              <h5 className="mb-0 fs-6 fw-bold">Filters</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label htmlFor="user" className="form-label small text-muted">User</label>
                <select 
                  className="form-select form-select-sm" 
                  id="user" 
                  name="user" 
                  value={filters.user} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Users</option>
                  {users.map(user => (
                    <option key={user._id} value={user._id}>{user.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="company" className="form-label small text-muted">Company</label>
                <input 
                  type="text" 
                  className="form-control form-control-sm" 
                  id="company" 
                  name="company" 
                  value={filters.company} 
                  onChange={handleFilterChange}
                  placeholder="Search by company name"
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="status" className="form-label small text-muted">Status</label>
                <select 
                  className="form-select form-select-sm" 
                  id="status" 
                  name="status" 
                  value={filters.status} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status._id} value={status._id}>{status.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="position" className="form-label small text-muted">Position</label>
                <select 
                  className="form-select form-select-sm" 
                  id="position" 
                  name="position" 
                  value={filters.position} 
                  onChange={handleFilterChange}
                >
                  <option value="">All Positions</option>
                  {positionOptions.map((position, index) => (
                    <option key={index} value={position}>{position}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="dateFrom" className="form-label small text-muted">Date From</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm" 
                  id="dateFrom" 
                  name="dateFrom" 
                  value={filters.dateFrom} 
                  onChange={handleFilterChange}
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="dateTo" className="form-label small text-muted">Date To</label>
                <input 
                  type="date" 
                  className="form-control form-control-sm" 
                  id="dateTo" 
                  name="dateTo" 
                  value={filters.dateTo} 
                  onChange={handleFilterChange}
                />
              </div>
              
              <button 
                className="btn btn-sm btn-outline-secondary w-100" 
                onClick={resetFilters}
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Statistics Cards */}
          {stats && (
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-light">
                <h5 className="mb-0 fs-6 fw-bold">Status Statistics</h5>
              </div>
              <div className="card-body">
                <p className="small"><strong>Total:</strong> {stats.total}</p>
                <ul className="list-group list-group-flush">
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <li key={status} className="list-group-item d-flex justify-content-between align-items-center py-2 px-0 border-bottom">
                      <span className="small">{status}</span>
                      <span className="badge bg-primary rounded-pill">{count} ({Math.round((count / stats.total) * 100)}%)</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          
          {/* Position Statistics Component */}
          <PositionStatistics filters={filters} />
        </div>
        
        {/* Main Content */}
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">Applications</h2>
            <Link to="/add" className="btn btn-primary btn-sm">
              <i className="bi bi-plus"></i> Add Application
            </Link>
          </div>
          
          {/* Applications Table */}
          {filteredApplications.length === 0 ? (
            <div className="alert alert-info">
              No applications found. <Link to="/add">Add one</Link>!
            </div>
          ) : (
            <div className="card shadow-sm">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>User</th>
                      <th>Company</th>
                      <th>Position</th>
                      <th>Date Applied</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map(app => (
                      <tr key={app._id}>
                        <td>{app.user && app.user.name ? app.user.name : 'N/A'}</td>
                        <td>{app.company && app.company.name ? app.company.name : 'N/A'}</td>
                        <td>{app.position_title || 'N/A'}</td>
                        <td>{app.date_applied ? new Date(app.date_applied).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className="badge bg-secondary">
                            {app.status && app.status.label ? app.status.label : 'N/A'}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group btn-group-sm">
                            <Link to={`/edit/${app._id}`} className="btn btn-outline-primary">
                              <i className="bi bi-pencil"></i>
                            </Link>
                            <button 
                              onClick={() => deleteApplication(app._id)} 
                              className="btn btn-outline-danger"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationList; 