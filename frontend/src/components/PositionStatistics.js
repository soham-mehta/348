import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PositionStatistics = ({ filters }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Build query string from filters
        const queryParams = new URLSearchParams();
        if (filters.user) queryParams.append('user', filters.user);
        if (filters.company) queryParams.append('company', filters.company);
        if (filters.status) queryParams.append('status', filters.status);
        if (filters.dateFrom) queryParams.append('dateFrom', filters.dateFrom);
        if (filters.dateTo) queryParams.append('dateTo', filters.dateTo);
        
        const response = await axios.get(`http://localhost:5001/api/reports/position-statistics?${queryParams}`);
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching position statistics:', err);
        setError('Failed to load position statistics');
        setLoading(false);
      }
    };

    fetchStats();
  }, [filters]);

  if (loading) {
    return <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0 fs-6 fw-bold">Position Statistics</h5>
      </div>
      <div className="card-body text-center">
        <p className="small">Loading position statistics...</p>
      </div>
    </div>;
  }

  if (error) {
    return <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0 fs-6 fw-bold">Position Statistics</h5>
      </div>
      <div className="card-body">
        <div className="alert alert-danger small py-2">{error}</div>
      </div>
    </div>;
  }

  if (!stats || stats.total === 0) {
    return <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0 fs-6 fw-bold">Position Statistics</h5>
      </div>
      <div className="card-body">
        <p className="small text-muted">No position data available for the selected filters.</p>
      </div>
    </div>;
  }

  return (
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0 fs-6 fw-bold">Position Statistics</h5>
      </div>
      <div className="card-body">
        <p className="small"><strong>Total:</strong> {stats.total}</p>
        <ul className="list-group list-group-flush">
          {stats.positionBreakdown.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center py-2 px-0 border-bottom">
              <span className="small">{item.position}</span>
              <span className="badge bg-primary rounded-pill">{item.count} ({item.percentage}%)</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PositionStatistics; 