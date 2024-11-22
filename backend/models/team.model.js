import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true }, // Reference to the admin
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users in the team
}, { timestamps: true });

const Team = mongoose.model('Team', teamSchema);
export default Team;
