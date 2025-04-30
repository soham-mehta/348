# Database Indexes Documentation

## Overview
This document describes the indexes implemented in my job application tracking system, their purposes, and the queries they support. My application uses MongoDB with Mongoose ODM, and I have implemented certain indexes to optimize query performance for common operations.

## Index Definitions
All indexes are defined in `backend/models/Application.js`:

### 1. Status Index
```javascript
status: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Status',
  required: true,
  index: true
}
```
**Purpose**: Optimizes queries filtering applications by their status
**Supported Queries**:
- Status statistics dashboard (`backend/utils/sanitizedQueries.js:getApplicationStatistics`)
- Status-based filtering in application list
- Quick status lookups for individual applications

### 2. Position Title Index
```javascript
position_title: {
  type: String,
  required: true,
  index: true
}
```
**Purpose**: Optimizes searches and aggregations based on position titles
**Supported Queries**:
- Position-based statistics (`backend/utils/sanitizedQueries.js:getPositionStatistics`)
- Position title search functionality
- Position-based grouping in reports

### 3. Date Applied Index
```javascript
date_applied: {
  type: Date,
  default: Date.now,
  index: true
}
```
**Purpose**: Optimizes date-range queries and timeline-based reports
**Supported Queries**:
- Application timeline views (`backend/utils/sanitizedQueries.js:getApplicationTimeline`)
- Date range filtering
- Chronological sorting and reporting

### 4. Compound Index (Status + Date)
```javascript
applicationSchema.index({ status: 1, date_applied: -1 });
```
**Purpose**: Optimizes queries that combine status filtering with date ordering
**Supported Queries**:
- Status-based reports with date ranges
- Timeline views filtered by status
- Status statistics with date constraints

## Query Examples and Usage

### Status Statistics Query
```javascript
// In backend/utils/sanitizedQueries.js
const getApplicationStatistics = async (filters = {}) => {
  const query = {};
  if (filters.status) {
    query.status = mongoose.Types.ObjectId(filters.status);
  }
  // Uses status index for efficient filtering
  const applications = await Application.find(query).populate('status');
};
```

### Position Statistics Query
```javascript
// In backend/utils/sanitizedQueries.js
const getPositionStatistics = async (filters = {}) => {
  // Uses position_title index for efficient grouping and counting
  const applications = await Application.find(query);
  // Calculate position statistics
};
```

### Timeline Query
```javascript
// In backend/utils/sanitizedQueries.js
const getApplicationTimeline = async (userId = null) => {
  // Uses date_applied index for efficient date-based grouping
  const applications = await Application.find(query).sort({ date_applied: 1 });
};
```



## Monitoring Index Usage
We use MongoDB's explain() function to verify index usage:
