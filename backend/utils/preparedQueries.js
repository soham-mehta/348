const { MongoClient } = require('mongodb');
require('dotenv').config();

// Connect directly using MongoDB driver instead of Mongoose
const client = new MongoClient(process.env.MONGODB_URI);

// Prepared query for applications by date range
const getApplicationsByDateRange = async (startDate, endDate) => {
  try {
    await client.connect();
    const database = client.db();
    const applications = database.collection('applications');
    
    // This is similar to a prepared statement - we're defining the query structure
    // and then passing in parameters
    const query = {
      date_applied: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };
    
    // Execute the query
    const results = await applications.find(query).toArray();
    
    // Perform manual joins since we're not using Mongoose's populate
    const users = await database.collection('users').find().toArray();
    const companies = await database.collection('companies').find().toArray();
    const statuses = await database.collection('statuses').find().toArray();
    
    // Map user, company, and status details to applications
    const populatedResults = results.map(app => {
      const user = users.find(u => u._id.toString() === app.user.toString());
      const company = companies.find(c => c._id.toString() === app.company.toString());
      const status = statuses.find(s => s._id.toString() === app.status.toString());
      
      return {
        ...app,
        user: user || null,
        company: company || null,
        status: status || null
      };
    });
    
    return populatedResults;
  } finally {
    // Close the connection when done
    await client.close();
  }
};

// Prepared query for application statistics
const getApplicationStatistics = async (filters = {}) => {
  try {
    await client.connect();
    const database = client.db();
    const applications = database.collection('applications');
    
    // Build query based on filters
    const query = {};
    
    if (filters.user) {
      query.user = filters.user;
    }
    
    if (filters.company) {
      query.company = filters.company;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.dateFrom) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$gte = new Date(filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$lte = new Date(filters.dateTo);
    }
    
    // Execute aggregation pipeline
    const stats = await applications.aggregate([
      { $match: query },
      { $lookup: { from: 'statuses', localField: 'status', foreignField: '_id', as: 'statusDetails' } },
      { $unwind: '$statusDetails' },
      { $group: {
          _id: '$statusDetails.label',
          count: { $sum: 1 }
        }
      },
      { $project: {
          status: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]).toArray();
    
    // Get total count
    const total = await applications.countDocuments(query);
    
    return {
      total,
      statusBreakdown: stats
    };
  } finally {
    await client.close();
  }
};

// Prepared query for position type statistics
const getPositionStatistics = async (filters = {}) => {
  try {
    await client.connect();
    const database = client.db();
    const applications = database.collection('applications');
    
    // Build query based on filters
    const query = {};
    
    if (filters.user) {
      query.user = filters.user;
    }
    
    if (filters.company) {
      query.company = filters.company;
    }
    
    if (filters.status) {
      query.status = filters.status;
    }
    
    if (filters.dateFrom) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$gte = new Date(filters.dateFrom);
    }
    
    if (filters.dateTo) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$lte = new Date(filters.dateTo);
    }
    
    // Execute aggregation pipeline for position statistics
    const positionStats = await applications.aggregate([
      { $match: query },
      { $group: {
          _id: '$position_title',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $project: {
          position: '$_id',
          count: 1,
          _id: 0
        }
      }
    ]).toArray();
    
    // Get total count
    const total = await applications.countDocuments(query);
    
    // Calculate percentages
    const positionBreakdown = positionStats.map(stat => ({
      position: stat.position,
      count: stat.count,
      percentage: Math.round((stat.count / total) * 100)
    }));
    
    return {
      total,
      positionBreakdown
    };
  } finally {
    await client.close();
  }
};

module.exports = {
  getApplicationsByDateRange,
  getApplicationStatistics,
  getPositionStatistics
}; 