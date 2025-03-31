const mongoose = require('mongoose');
const User = require('./models/User');
const Company = require('./models/Company');
const Status = require('./models/Status');
const Application = require('./models/Application');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected for test data generation'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample data arrays
const users = [
  { name: 'John Doe', email: 'john@example.com' },
  { name: 'Jane Smith', email: 'jane@example.com' },
  { name: 'Bob Johnson', email: 'bob@example.com' },
  { name: 'Alice Williams', email: 'alice@example.com' },
  { name: 'Charlie Brown', email: 'charlie@example.com' }
];

const companies = [
  { name: 'Google', industry: 'Technology', location: 'Mountain View, CA', website: 'https://google.com' },
  { name: 'Microsoft', industry: 'Technology', location: 'Redmond, WA', website: 'https://microsoft.com' },
  { name: 'Amazon', industry: 'E-commerce', location: 'Seattle, WA', website: 'https://amazon.com' },
  { name: 'Apple', industry: 'Technology', location: 'Cupertino, CA', website: 'https://apple.com' },
  { name: 'Facebook', industry: 'Social Media', location: 'Menlo Park, CA', website: 'https://facebook.com' },
  { name: 'Netflix', industry: 'Entertainment', location: 'Los Gatos, CA', website: 'https://netflix.com' },
  { name: 'Tesla', industry: 'Automotive', location: 'Palo Alto, CA', website: 'https://tesla.com' },
  { name: 'IBM', industry: 'Technology', location: 'Armonk, NY', website: 'https://ibm.com' },
  { name: 'Oracle', industry: 'Technology', location: 'Redwood City, CA', website: 'https://oracle.com' },
  { name: 'Intel', industry: 'Technology', location: 'Santa Clara, CA', website: 'https://intel.com' }
];

const statuses = [
  { label: 'Applied', description: 'Application submitted' },
  { label: 'OA', description: 'Online Assessment' },
  { label: 'Interview', description: 'Interview stage' },
  { label: 'Offer', description: 'Received job offer' },
  { label: 'Rejected', description: 'Application rejected' },
  { label: 'Declined', description: 'Offer declined' }
];

const positions = [
  'Software Engineer',
  'Product Manager',
  'Quantitative Analyst',
  'Data Scientist',
  'Data Engineer'
];

const sources = [
  'LinkedIn',
  'Indeed',
  'Company Website',
  'Referral',
  'Career Fair',
  'Glassdoor',
  'AngelList',
  'Hired',
  'Triplebyte',
  'University Job Board',
  'Recruiter',
  'Hackathon',
  'GitHub Jobs',
  'Stack Overflow Jobs',
  'Twitter'
];

// Helper function to get random item from array
const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];

// Helper function to get random date within range
const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Helper function to generate random notes
const generateNotes = () => {
  const noteTemplates = [
    'Spoke with {name} from HR. They mentioned the team is looking for someone with {skill} experience.',
    'The job requires {years} years of experience with {technology}.',
    'Need to follow up by {date}.',
    'Position offers {salary} per year with {benefits} benefits.',
    'Remote work is {remote}.',
    'Interview scheduled for {date} at {time}.',
    'Received feedback: {feedback}',
    '',  // Empty notes sometimes
  ];
  
  const names = ['Sarah', 'Michael', 'David', 'Jennifer', 'Robert', 'Lisa'];
  const skills = ['React', 'Node.js', 'Python', 'AWS', 'Docker', 'Kubernetes', 'Machine Learning'];
  const years = ['2', '3', '4', '5+'];
  const technologies = ['JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'Go', 'Rust'];
  const salaries = ['$80K', '$90K', '$100K', '$120K', '$150K'];
  const benefits = ['standard', 'excellent', 'competitive', 'minimal'];
  const remote = ['possible', 'required', 'not an option', 'hybrid', 'flexible'];
  const feedback = [
    'positive overall, they liked my experience',
    'need more experience with their tech stack',
    'good cultural fit',
    'moving to next round',
    'they went with another candidate'
  ];
  
  // Generate 0-3 notes
  const numNotes = Math.floor(Math.random() * 4);
  let notes = [];
  
  for (let i = 0; i < numNotes; i++) {
    let note = getRandomItem(noteTemplates);
    note = note.replace('{name}', getRandomItem(names))
               .replace('{skill}', getRandomItem(skills))
               .replace('{years}', getRandomItem(years))
               .replace('{technology}', getRandomItem(technologies))
               .replace('{date}', new Date().toLocaleDateString())
               .replace('{time}', `${Math.floor(Math.random() * 12) + 1}:${Math.random() > 0.5 ? '30' : '00'} ${Math.random() > 0.5 ? 'AM' : 'PM'}`)
               .replace('{salary}', getRandomItem(salaries))
               .replace('{benefits}', getRandomItem(benefits))
               .replace('{remote}', getRandomItem(remote))
               .replace('{feedback}', getRandomItem(feedback));
    notes.push(note);
  }
  
  return notes.join('\n\n');
};

// Generate test data
const generateTestData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await Status.deleteMany({});
    await Application.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log(`${createdUsers.length} users created`);
    
    // Insert companies
    const createdCompanies = await Company.insertMany(companies);
    console.log(`${createdCompanies.length} companies created`);
    
    // Insert statuses
    const createdStatuses = await Status.insertMany(statuses);
    console.log(`${createdStatuses.length} statuses created`);
    
    // Generate applications
    const applications = [];
    const startDate = new Date(2023, 0, 1);  // Jan 1, 2023
    const endDate = new Date();  // Current date
    
    // Generate 50 random applications
    for (let i = 0; i < 50; i++) {
      const application = {
        user: getRandomItem(createdUsers)._id,
        company: getRandomItem(createdCompanies)._id,  // Always use company ObjectId
        status: getRandomItem(createdStatuses)._id,
        position_title: getRandomItem(positions),
        date_applied: getRandomDate(startDate, endDate),
        source: getRandomItem(sources),
        notes: generateNotes()
      };
      
      applications.push(application);
    }
    
    const createdApplications = await Application.insertMany(applications);
    console.log(`${createdApplications.length} applications created`);
    
    console.log('Test data generation complete!');
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
    
  } catch (error) {
    console.error('Error generating test data:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the data generation
generateTestData(); 