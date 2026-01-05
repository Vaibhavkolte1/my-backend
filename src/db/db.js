import mongoose from 'mongoose';

function connectDB() {
    mongoose.connect(process.env.MONGODB_URI).then(() => {
        console.log('Database connected successfully');
    }).catch((err) => {
        console.error('Database connection error:', err);
    });
}


export default connectDB;