const mongoose = require('mongoose');
const { Schema } = mongoose; // Destructure Schema for readability

const attendanceSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true }, // Create index for efficient querying
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }, // Create index for efficient querying
  date: { type: Date, default: Date.now, index: true }, // Create index for efficient querying
  status: { type: String, enum: ['present', 'absent'], required: true }
}, { timestamps: true });

attendanceSchema.index({ course: 1, student: 1, date: 1 }, { unique: true }); // Create a compound index for efficient querying

module.exports = mongoose.model('Attendance', attendanceSchema);
