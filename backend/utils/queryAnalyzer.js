const mongoose = require('mongoose');
const Application = require('../models/Application');

const analyzeQuery = async (query) => {
  try {
    // Convert string IDs to ObjectIds
    if (query.status) {
      try {
        query.status = mongoose.Types.ObjectId(query.status);
      } catch (err) {
        console.log('Invalid status ID format');
      }
    }

    // Get the explain plan for the query
    const explanation = await Application.find(query)
      .explain('executionStats');
    
    // Extract relevant information
    const queryPlan = explanation.queryPlanner.winningPlan;
    const executionStats = explanation.executionStats;

    const stats = {
      queryDetails: {
        filter: query,
        indexesAvailable: await Application.collection.getIndexes()
      },
      executionStats: {
        executionTimeMillis: executionStats.executionTimeMillis,
        totalDocsExamined: executionStats.totalDocsExamined,
        totalKeysExamined: executionStats.totalKeysExamined,
        totalDocsReturned: executionStats.nReturned
      },
      indexUsage: {
        isIndexUsed: queryPlan.inputStage.stage !== 'COLLSCAN',
        indexName: queryPlan.inputStage.indexName || 'None (Collection Scan)',
        indexDetails: queryPlan
      }
    };

    return stats;
  } catch (error) {
    console.error('Error analyzing query:', error);
    return {
      error: error.message,
      queryAttempted: query
    };
  }
};

module.exports = {
  analyzeQuery
}; 