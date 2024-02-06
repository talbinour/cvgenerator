const mongoose = require('mongoose');
const UserInfo = require('./userDetails'); // Adjust the path accordingly

async function runMigration() {
  try {
    // Provide your MongoDB connection URI here
    const mongoUri = 'mongodb://localhost:27017/database';

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 30000,
    });

    // Example: Add a new field to existing documents
    await UserInfo.updateMany({}, { $set: { newField: 'default value' } });

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.disconnect();
  }
}

// Run the migration script
runMigration();