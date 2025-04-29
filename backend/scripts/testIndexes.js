const mongoose = require('mongoose');
const { analyzeQuery } = require('../utils/queryAnalyzer');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/cs348_project', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testQueries() {
  try {
    // Test 1: Query by status
    console.log('\n1. Testing status index:');
    const statusQuery = await analyzeQuery({ status: '644b2d5c8a3c672345678901' });
    console.log(JSON.stringify(statusQuery, null, 2));

    // Test 2: Query by position title
    console.log('\n2. Testing position_title index:');
    const positionQuery = await analyzeQuery({ position_title: 'Software Engineer' });
    console.log(JSON.stringify(positionQuery, null, 2));

    // Test 3: Query by date range
    console.log('\n3. Testing date_applied index:');
    const dateQuery = await analyzeQuery({
      date_applied: {
        $gte: new Date('2024-01-01'),
        $lte: new Date('2024-12-31')
      }
    });
    console.log(JSON.stringify(dateQuery, null, 2));

    // Test 4: Compound index (status + date)
    console.log('\n4. Testing compound index (status + date):');
    const compoundQuery = await analyzeQuery({
      status: '644b2d5c8a3c672345678901',
      date_applied: { $gte: new Date('2024-01-01') }
    });
    console.log(JSON.stringify(compoundQuery, null, 2));

  } catch (error) {
    console.error('Error running tests:', error);
  } finally {
    await mongoose.disconnect();
  }
}

testQueries(); 