import mongoose from 'mongoose';
import { User } from './models/userSchema.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'config/config.env') });

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Function to reset admin user
async function resetAdmin() {
  try {
    // Delete existing admin
    await User.deleteOne({ email: 'admin@hospital.com' });
    console.log('Deleted existing admin if any');

    // Create new admin user with simple password
    const admin = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@hospital.com',
      phone: '1234567890',
      nic: '1234567890123',
      dob: '1990-01-01',
      gender: 'Male',
      password: '12345678',  // Simple password for testing
      role: 'Admin',
      aadhar: '123456789012'  // Added required aadhar field
    });

    console.log('New admin created successfully:', admin);
    process.exit(0);
  } catch (error) {
    console.error('Error resetting admin:', error);
    process.exit(1);
  }
}

resetAdmin(); 