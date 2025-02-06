
import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
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
        default: [],
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

// export const Note = mongoose.model('Note', noteSchema);
const Note = mongoose.models.Note || mongoose.model('Note', noteSchema);
export default Note;