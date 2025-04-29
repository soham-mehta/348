const mongoose = require('mongoose');
const Application = require('../models/Application');
const User = require('../models/User');
const Company = require('../models/Company');
const Status = require('../models/Status');

/**
 * Sanitized query to get applications by date range
 * Uses proper parameter sanitization to prevent injection attacks
 */
const getApplicationsByDateRange = async (startDate, endDate) => {
  // Sanitize inputs by creating proper Date objects
  const sanitizedStartDate = new Date(startDate);
  const sanitizedEndDate = new Date(endDate);
  
  // Validate dates
  if (isNaN(sanitizedStartDate.getTime()) || isNaN(sanitizedEndDate.getTime())) {
    throw new Error('Invalid date format');
  }
  
  // Use Mongoose's query builder with sanitized parameters
  const applications = await Application.find({
    date_applied: {
      $gte: sanitizedStartDate,
      $lte: sanitizedEndDate
    }
  })
  .populate('user')
  .populate('company')
  .populate('status')
  .sort({ date_applied: -1 });
  
  return applications;
};

/**
 * Sanitized query to get application statistics
 * Uses proper parameter sanitization to prevent injection attacks
 */
const getApplicationStatistics = async (filters = {}) => {
  // First, it creates a sanitized query object
  const query = {};
  
  // It sanitizes each filter parameter before adding to query
  if (filters.user) {
    try {
      query.user = mongoose.Types.ObjectId(filters.user);  // Sanitizes by ensuring valid MongoDB ObjectId
    } catch (err) {
      throw new Error('Invalid user ID format');
    }
  }
  
  if (filters.company) {
    try {
      query.company = mongoose.Types.ObjectId(filters.company);
    } catch (err) {
      throw new Error('Invalid company ID format');
    }
  }
  
  if (filters.status) {
    try {
      query.status = mongoose.Types.ObjectId(filters.status);
    } catch (err) {
      throw new Error('Invalid status ID format');
    }
  }
  
  if (filters.dateFrom) {
    const sanitizedDateFrom = new Date(filters.dateFrom);
    if (!isNaN(sanitizedDateFrom.getTime())) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$gte = sanitizedDateFrom;
    }
  }
  
  if (filters.dateTo) {
    const sanitizedDateTo = new Date(filters.dateTo);
    if (!isNaN(sanitizedDateTo.getTime())) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$lte = sanitizedDateTo;
    }
  }
  
  // Gets applications using the sanitized query
  const applications = await Application.find(query).populate('status');
  
  // Calculates statistics in memory
  const total = applications.length;
  const statusCounts = {};
  applications.forEach(app => {
    if (app.status && app.status.label) {
      statusCounts[app.status.label] = (statusCounts[app.status.label] || 0) + 1;
    }
  });
  
  return {
    total,
    statusCounts
  };
};

/**
 * Sanitized query to get position statistics
 * Uses proper parameter sanitization to prevent injection attacks
 */
const getPositionStatistics = async (filters = {}) => {
  // Build query with sanitized parameters
  const query = {};
  
  if (filters.user) {
    // Sanitize ObjectId
    try {
      query.user = mongoose.Types.ObjectId(filters.user);
    } catch (err) {
      throw new Error('Invalid user ID format');
    }
  }
  
  if (filters.company) {
    try {
      query.company = mongoose.Types.ObjectId(filters.company);
    } catch (err) {
      throw new Error('Invalid company ID format');
    }
  }
  
  if (filters.status) {
    try {
      query.status = mongoose.Types.ObjectId(filters.status);
    } catch (err) {
      throw new Error('Invalid status ID format');
    }
  }
  
  if (filters.dateFrom) {
    const sanitizedDateFrom = new Date(filters.dateFrom);
    if (!isNaN(sanitizedDateFrom.getTime())) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$gte = sanitizedDateFrom;
    }
  }
  
  if (filters.dateTo) {
    const sanitizedDateTo = new Date(filters.dateTo);
    if (!isNaN(sanitizedDateTo.getTime())) {
      query.date_applied = query.date_applied || {};
      query.date_applied.$lte = sanitizedDateTo;
    }
  }
  
  // Get applications with the sanitized query
  const applications = await Application.find(query);
  
  // Calculate position statistics
  const total = applications.length;
  const positionCounts = {};
  
  applications.forEach(app => {
    if (app.position_title) {
      positionCounts[app.position_title] = (positionCounts[app.position_title] || 0) + 1;
    }
  });
  
  // Format the result
  const positionBreakdown = Object.entries(positionCounts).map(([position, count]) => ({
    position,
    count,
    percentage: Math.round((count / total) * 100)
  }));
  
  // Sort by count descending
  positionBreakdown.sort((a, b) => b.count - a.count);
  
  return {
    total,
    positionBreakdown
  };
};

/**
 * Simple sanitized query to get position counts
 */
const getSimplePositionCounts = async () => {
  // Get all applications
  const applications = await Application.find();
  
  // Calculate position counts
  const positionCounts = {};
  
  applications.forEach(app => {
    if (app.position_title) {
      positionCounts[app.position_title] = (positionCounts[app.position_title] || 0) + 1;
    }
  });
  
  // Format the result
  const result = Object.entries(positionCounts).map(([position, count]) => ({
    position,
    count
  }));
  
  // Sort by count descending
  result.sort((a, b) => b.count - a.count);
  
  return result;
};

/**
 * Sanitized query to get application timeline by month
 * Uses proper parameter sanitization to prevent injection attacks
 */
const getApplicationTimeline = async (userId = null) => {
  // Build query with sanitized parameters
  const query = {};
  
  if (userId) {
    try {
      query.user = mongoose.Types.ObjectId(userId);
    } catch (err) {
      throw new Error('Invalid user ID format');
    }
  }
  
  // Get applications with the sanitized query
  const applications = await Application.find(query).sort({ date_applied: 1 });
  
  // Group applications by month
  const monthlyGroups = {};
  
  applications.forEach(app => {
    if (app.date_applied) {
      const date = new Date(app.date_applied);
      const month = date.getMonth(); // 0-11
      
      // Convert month number to name
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      
      const monthName = monthNames[month];
      
      if (!monthlyGroups[monthName]) {
        monthlyGroups[monthName] = {
          period: monthName,
          count: 0,
          applications: []
        };
      }
      
      monthlyGroups[monthName].count++;
      monthlyGroups[monthName].applications.push(app);
    }
  });
  
  // Convert to array and sort by month
  const monthOrder = {
    'January': 0, 'February': 1, 'March': 2, 'April': 3, 'May': 4, 'June': 5,
    'July': 6, 'August': 7, 'September': 8, 'October': 9, 'November': 10, 'December': 11
  };
  
  const result = Object.values(monthlyGroups).sort((a, b) => 
    monthOrder[a.period] - monthOrder[b.period]
  );
  
  return result;
};

module.exports = {
  getApplicationsByDateRange,
  getApplicationStatistics,
  getPositionStatistics,
  getSimplePositionCounts,
  getApplicationTimeline
}; 