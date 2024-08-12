const mongoose = require('mongoose');
const {Schema} = mongoose;

const courseSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    }
}, {
    timestamps: true
});
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);


module.exports = Course;
