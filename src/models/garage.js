import mongoose from 'mongoose';

const garageSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    managerIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    

    address: {
        type: String,
        required: true,
        trim: true,
        maxlength: 300
    },

    location: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },

        coordinates: {
            type: [Number],
            required: true
        }
    },

    capacity: {
        type: Number,
        required: true,
        min: 1
    },

    availableSpaces: {
        type: Number,
        required: true,
        min: 0
    },

    pricePerHour: {
        type: Number,
        required: true,
        min: 0
    },

    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },

    totalReviews: {
        type: Number,
        default: 0,
        min: 0
    }
}, {
    timestamps: true
});

garageSchema.index({
    location: '2dsphere'
});

garageSchema.index({
    ownerId: 1
});

export default mongoose.model('Garage', garageSchema);