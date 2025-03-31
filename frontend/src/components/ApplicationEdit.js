import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ApplicationEdit = () => {
  const { id } = useParams();
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
  
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appRes, usersRes, companiesRes, statusesRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/applications/${id}`),
          axios.get('http://localhost:5001/api/users'),
          axios.get('http://localhost:5001/api/companies'),
          axios.get('http://localhost:5001/api/statuses')
        ]);
        
        const app = appRes.data;
        
        setFormData({
          user: app.user._id,
          company: app.company._id,
          status: app.status._id,
          position_title: app.position_title,
          date_applied: new Date(app.date_applied).toISOString().split('T')[0],
          source: app.source || '',
          notes: app.notes || ''
        });
        
        setUsers(usersRes.data);
        setCompanies(companiesRes.data);
        setStatuses(statusesRes.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5001/api/applications/${id}`, formData);
      navigate('/');
    } catch (err) {
      console.error('Error updating application:', err);
    }
  };

  if (loading) {
    return <div className="text-center mt-5"><h3>Loading...</h3></div>;
  }

  return (
    <div>
      <h2 className="mb-4">Edit Application</h2>
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
          <input 
            type="text" 
            className="form-control" 
            id="position_title" 
            name="position_title" 
            value={formData.position_title} 
            onChange={handleChange}
            required
          />
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

        <button type="submit" className="btn btn-primary">Update</button>
      </form>
    </div>
  );
};

export default ApplicationEdit; 