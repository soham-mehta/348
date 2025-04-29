const mongoose = require('mongoose');

/**
 * Executes operations within a transaction with specified options
 * @param {Function} operations - Async function containing the operations to perform
 * @param {Object} options - Transaction options including readConcern and writeConcern
 */
const executeTransaction = async (operations, options = {}) => {
  const session = await mongoose.startSession();
  session.startTransaction({
    readConcern: options.readConcern || 'snapshot',
    writeConcern: options.writeConcern || { w: 'majority' },
    readPreference: 'primary'
  });

  try {
    // Execute operations within transaction
    const result = await operations(session);
    
    // Commit the transaction
    await session.commitTransaction();
    return result;
  } catch (error) {
    // If an error occurred, abort the transaction
    await session.abortTransaction();
    throw error;
  } finally {
    // End the session
    session.endSession();
  }
};

// Predefined transaction levels
const TransactionLevels = {
  // Strongest isolation - reads from a snapshot, writes require majority commit
  SERIALIZABLE: {
    readConcern: 'snapshot',
    writeConcern: { w: 'majority' }
  },
  
  // Read committed isolation - only reads committed data
  READ_COMMITTED: {
    readConcern: 'local',
    writeConcern: { w: 1 }
  },
  
  // Lowest isolation - fastest but may read uncommitted data
  READ_UNCOMMITTED: {
    readConcern: 'available',
    writeConcern: { w: 1 }
  }
};

module.exports = {
  executeTransaction,
  TransactionLevels
}; 