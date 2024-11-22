import mongoose from 'mongoose'

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }] // Multiple teams an admin manages
});

const Admin = mongoose.model('Admin', adminSchema);
export default Admin;
