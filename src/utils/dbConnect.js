// This is a database connection function
import mongoose from 'mongoose';

// Creating connection object
const connection = {};

async function dbConnect() {
  // Check if we have connection to our databse
  if (connection.isConnected) {
    return;
  }

  // Connecting to our database
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });

  connection.isConnected = db.connections[0].readyState;
}

export default dbConnect;
