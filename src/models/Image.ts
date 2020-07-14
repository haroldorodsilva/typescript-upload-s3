import { model, Schema, Document } from 'mongoose';

export interface IImage extends Document {
    filename: string;
    size: number;
    url: string;
}

const imageSchema = new Schema({
    filename: {
        type: String,
        required: true,
    },
    size: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
});

export default model<IImage>('image', imageSchema);
