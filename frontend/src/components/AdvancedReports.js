import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdvancedReports = () => {
  const [successRates, setSuccessRates] = useState([]);
  const [timeline, setTimeline] = useState([]);
  const [userEfficiency, setUserEfficiency] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('successRates');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [successRatesRes, timelineRes, userEfficiencyRes] = await Promise.all([
          axios.get('http://localhost:5001/api/stored-procedures/success-rate-by-position'),
          axios.get('http://localhost:5001/api/stored-procedures/application-timeline'),
          axios.get('http://localhost:5001/api/stored-procedures/user-efficiency')
        ]);
        
        setSuccessRates(successRatesRes.data);
        setTimeline(timelineRes.data);
        setUserEfficiency(userEfficiencyRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching advanced reports:', err);
        setError('Failed to load reports. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center my-4"><p>Loading advanced reports...</p></div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Advanced Reports</h2>
      
      <div className="btn-group mb-4" role="group">
        <button 
          type="button" 
          className={`btn ${selectedReport === 'successRates' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setSelectedReport('successRates')}
        >
          Success Rates by Position
        </button>
        <button 
          type="button" 
          className={`btn ${selectedReport === 'timeline' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setSelectedReport('timeline')}
        >
          Application Timeline
        </button>
        <button 
          type="button" 
          className={`btn ${selectedReport === 'userEfficiency' ? 'btn-primary' : 'btn-outline-primary'}`}
          onClick={() => setSelectedReport('userEfficiency')}
        >
          User Efficiency
        </button>
      </div>
      
      {selectedReport === 'successRates' && (
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">Application Success Rate by Position</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Position</th>
                    <th>Total Applications</th>
                    <th>Success Rate</th>
                    <th>Status Breakdown</th>
                  </tr>
                </thead>
                <tbody>
                  {successRates.map((item, index) => (
                    <tr key={index}>
                      <td>{item.position}</td>
                      <td>{item.totalApplications}</td>
                      <td>{item.successRate.toFixed(2)}%</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {item.statusCounts.map((statusCount, idx) => (
                            <li key={idx} className="small">
                              {statusCount.status}: {statusCount.count}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {selectedReport === 'timeline' && (
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">Application Timeline</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Period</th>
                    <th>Applications</th>
                    <th>Examples</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((item, index) => (
                    <tr key={index}>
                      <td>{item.period}</td>
                      <td>{item.count}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {item.applications.slice(0, 3).map((app, idx) => (
                            <li key={idx} className="small">
                              {app.position_title} at {app.company}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {selectedReport === 'userEfficiency' && (
        <div className="card shadow-sm">
          <div className="card-header bg-light">
            <h5 className="mb-0">User Application Efficiency</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Total Applications</th>
                    <th>Efficiency Score</th>
                    <th>Success Metrics</th>
                  </tr>
                </thead>
                <tbody>
                  {userEfficiency.map((user, index) => (
                    <tr key={index}>
                      <td>{user.name}</td>
                      <td>{user.totalApplications}</td>
                      <td>{user.efficiencyScore.toFixed(2)}%</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          <li className="small">Offers: {user.successMetrics.offers}</li>
                          <li className="small">Interviews: {user.successMetrics.interviews}</li>
                          <li className="small">Rejections: {user.successMetrics.rejections}</li>
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedReports; 