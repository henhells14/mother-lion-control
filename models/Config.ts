import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IConfig extends Document {
    key: string;
    value: any;
}

const ConfigSchema = new Schema<IConfig>({
    key: {
        type: String,
        required: true,
        unique: true
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    timestamps: true
});

const Config: Model<IConfig> =
    mongoose.models.Config ||
    mongoose.model<IConfig>('Config', ConfigSchema);

export default Config;
