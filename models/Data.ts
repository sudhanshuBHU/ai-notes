
import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        default: 'Untitled',
    },
    description: {
        type: String,
        default: 'No description',
    },
    image: {
        type: [String],
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    audioLength: {
        type: String,
        default: '0:00',
    },
    type: {
        type: String,
        default: 'text',
    }
}, { timestamps: true });

// export const Todo = mongoose.model('Todo', todoSchema);
const Todo = mongoose.models.Todo || mongoose.model('Todo', todoSchema);
export default Todo;