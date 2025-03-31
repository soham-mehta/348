import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ApplicationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user: '',
    company: '',
    status: '',
    position_title: '',
    date_applied: '',
    source: '',
    notes: ''
  });
  
  // Additional company details
  const [companyDetails, setCompanyDetails] = useState({
    industry: '',
    location: '',
    website: ''
  });
  
  const [showCompanyDetails, setShowCompanyDetails] = useState(false);
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyInputType, setCompanyInputType] = useState('new'); // 'new' or 'existing'

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
        const [usersRes, companiesRes, statusesRes] = await Promise.all([
          axios.get('http://localhost:5001/api/users'),
          axios.get('http://localhost:5001/api/companies'),
          axios.get('http://localhost:5001/api/statuses')
        ]);
        
        setUsers(usersRes.data);
        setCompanies(companiesRes.data);
        setStatuses(statusesRes.data);
        
        // Set default values if data exists
        if (usersRes.data.length > 0) {
          setFormData(prev => ({ ...prev, user: usersRes.data[0]._id }));
        }
        if (statusesRes.data.length > 0) {
          setFormData(prev => ({ ...prev, status: statusesRes.data[0]._id }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCompanyDetailsChange = (e) => {
    setCompanyDetails({ ...companyDetails, [e.target.name]: e.target.value });
  };

  const toggleCompanyDetails = () => {
    setShowCompanyDetails(!showCompanyDetails);
  };

  const handleCompanyInputTypeChange = (type) => {
    setCompanyInputType(type);
    // Reset company value when switching input types
    setFormData({ ...formData, company: '' });
    setShowCompanyDetails(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If creating a new company with details
      if (companyInputType === 'new' && showCompanyDetails && companyDetails.industry) {
        const companyData = {
          name: formData.company,
          industry: companyDetails.industry,
          location: companyDetails.location,
          website: companyDetails.website
        };
        
        // Create the company
        await axios.post('http://localhost:5001/api/companies', companyData);
      }
      
      // Submit the application
      await axios.post('http://localhost:5001/api/applications', formData);
      navigate('/');
    } catch (err) {
      console.error('Error adding application:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><h3>Loading...</h3></div>;
  }

  return (
    <div>
      <h2 className="mb-4">Add New Application</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="user" className="form-label">User</label>
          <select 
            className="form-select" 
            id="user" 
            name="user" 
            value={formData.user} 
            onChange={handleChange}
            required
          >
            <option value="">Select User</option>
            {users.map(user => (
              <option key={user._id} value={user._id}>{user.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="company" className="form-label">Company</label>
          <div className="d-flex">
            <select 
              className="form-select" 
              id="company" 
              name="company" 
              value={formData.company} 
              onChange={handleChange}
              required
            >
              <option value="">Select Company</option>
              {companies.map(company => (
                <option key={company._id} value={company._id}>{company.name}</option>
              ))}
            </select>
            <Link to="/companies" className="btn btn-outline-primary ms-2">
              Add New Company
            </Link>
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="status" className="form-label">Status</label>
          <select 
            className="form-select" 
            id="status" 
            name="status" 
            value={formData.status} 
            onChange={handleChange}
            required
          >
            <option value="">Select Status</option>
            {statuses.map(status => (
              <option key={status._id} value={status._id}>{status.label}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="position_title" className="form-label">Position Title</label>
          <select 
            className="form-select" 
            id="position_title" 
            name="position_title" 
            value={formData.position_title} 
            onChange={handleChange}
            required
          >
            <option value="">Select Position</option>
            {positionOptions.map((position, index) => (
              <option key={index} value={position}>{position}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="date_applied" className="form-label">Date Applied</label>
          <input 
            type="date" 
            className="form-control" 
            id="date_applied" 
            name="date_applied" 
            value={formData.date_applied} 
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="source" className="form-label">Source</label>
          <input 
            type="text" 
            className="form-control" 
            id="source" 
            name="source" 
            value={formData.source} 
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="notes" className="form-label">Notes</label>
          <textarea 
            className="form-control" 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange}
            rows="3"
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};

export default ApplicationForm; 