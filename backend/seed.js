const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User');
const Company = require('./models/Company');
const Status = require('./models/Status');

// Log the connection string (without sensitive info)
console.log('Connecting to MongoDB...');
console.log(`Database: ${process.env.MONGODB_URI.split('/').pop()}`);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected for seeding');
    seedDatabase();
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const seedDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    
    // Clear existing data
    await User.deleteMany({});
    console.log('Users collection cleared');
    
    await Company.deleteMany({});
    console.log('Companies collection cleared');
    
    await Status.deleteMany({});
    console.log('Statuses collection cleared');

    console.log('Inserting new data...');
    
    // Seed users
    const users = await User.insertMany([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' }
    ]);
    console.log(`${users.length} users inserted`);

    // Seed companies
    const companies = await Company.insertMany([
      { name: 'Google', industry: 'Technology', location: 'Mountain View, CA', website: 'https://google.com' },
      { name: 'Microsoft', industry: 'Technology', location: 'Redmond, WA', website: 'https://microsoft.com' },
      { name: 'Amazon', industry: 'E-commerce', location: 'Seattle, WA', website: 'https://amazon.com' }
    ]);
    console.log(`${companies.length} companies inserted`);

    // Seed statuses
    const statuses = await Status.insertMany([
      { label: 'Applied' },
      { label: 'Phone Screen' },
      { label: 'Interview' },
      { label: 'Offer' },
      { label: 'Rejected' }
    ]);
    console.log(`${statuses.length} statuses inserted`);

    console.log('Database seeded successfully');
    
    // Print a summary of what was inserted
    console.log('\nSeed Data Summary:');
    console.log('Users:', users.map(u => u.name).join(', '));
    console.log('Companies:', companies.map(c => c.name).join(', '));
    console.log('Statuses:', statuses.map(s => s.label).join(', '));
    
    process.exit(0);
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
}; 