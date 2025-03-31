const mongoose = require('mongoose');
const Application = require('../models/Application');

// This function acts like a stored procedure - it's a predefined operation
// that runs on the database server
const getApplicationStatusSummary = async () => {
  const result = await Application.aggregate([
    {
      $lookup: {
        from: 'statuses',
        localField: 'status',
        foreignField: '_id',
        as: 'statusDetails'
      }
    },
    { $unwind: '$statusDetails' },
    {
      $group: {
        _id: '$statusDetails.label',
        count: { $sum: 1 },
        applications: { $push: { id: '$_id', position: '$position_title', date: '$date_applied' } }
      }
    },
    {
      $project: {
        status: '$_id',
        count: 1,
        applications: { $slice: ['$applications', 5] },  // Limit to 5 examples
        _id: 0
      }
    }
  ]);
  
  return result;
};

// Another "stored procedure" to get application trends over time
const getApplicationTrends = async (timeFrame = 'month') => {
  let groupByFormat;
  
  // Define time grouping based on timeFrame parameter
  if (timeFrame === 'day') {
    groupByFormat = { $dateToString: { format: '%Y-%m-%d', date: '$date_applied' } };
  } else if (timeFrame === 'week') {
    groupByFormat = { 
      $dateToString: { 
        format: '%Y-W%U', 
        date: '$date_applied' 
      } 
    };
  } else if (timeFrame === 'month') {
    groupByFormat = { $dateToString: { format: '%Y-%m', date: '$date_applied' } };
  } else {
    groupByFormat = { $dateToString: { format: '%Y', date: '$date_applied' } };
  }
  
  const result = await Application.aggregate([
    {
      $group: {
        _id: groupByFormat,
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } },
    {
      $project: {
        timePeriod: '$_id',
        count: 1,
        _id: 0
      }
    }
  ]);
  
  return result;
};

module.exports = {
  getApplicationStatusSummary,
  getApplicationTrends
}; 