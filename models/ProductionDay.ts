import mongoose, { Schema, Document, Model } from 'mongoose';

// Event interface
export interface IEvent {
    title: string;
    time: string;
    utcTime?: string;
    location: 'H1' | 'H2' | 'Studio' | 'MFR' | 'TBC' | 'H1/2';
    city: 'Milano' | 'Oslo' | 'Local' | 'TBC' | '-' | 'Milano/Oslo';
    commentator: string;
    experts: string[];
    note?: string;
}

// ProductionDay interface
export interface IProductionDay extends Document {
    dayId: number;
    date: string;
    label: string;
    noStudio?: string[];
    mainEvents: IEvent[];
}

// Event Schema
const EventSchema = new Schema<IEvent>({
    title: { type: String, required: true },
    time: { type: String, required: true },
    utcTime: { type: String },
    location: {
        type: String,
        enum: ['H1', 'H2', 'Studio', 'MFR', 'TBC', 'H1/2'],
        required: true
    },
    city: {
        type: String,
        enum: ['Milano', 'Oslo', 'Local', 'TBC', '-', 'Milano/Oslo'],
        required: true
    },
    commentator: { type: String, required: true },
    experts: [{ type: String }],
    note: { type: String, default: '' }
}, { _id: false });

// ProductionDay Schema
const ProductionDaySchema = new Schema<IProductionDay>({
    dayId: {
        type: Number,
        required: true,
        unique: true,
        min: 1,
        max: 21
    },
    date: { type: String, required: true },
    label: { type: String, required: true },
    noStudio: [{ type: String }],
    mainEvents: [EventSchema]
}, {
    timestamps: true
});

// Create or retrieve the model
const ProductionDay: Model<IProductionDay> =
    mongoose.models.ProductionDay ||
    mongoose.model<IProductionDay>('ProductionDay', ProductionDaySchema);

export default ProductionDay;
