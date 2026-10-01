import mongoose from 'mongoose';

const reviewSchema = mongoose.Schema({
    garageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },

    ipAddress: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },

    comment: {
        type: String,
        trim: true,
        maxlength: 500
    }
}, {
    timestamps: true
});


reviewSchema.index({
    garageId: 1
});


reviewSchema.index(
    {
        garageId: 1,
        ipAddress: 1
    },
    {
        unique: true
    }
);


export default mongoose.model('Review', reviewSchema);