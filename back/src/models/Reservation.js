import mangoose from 'mongoose';

const reservationSchema = new mangoose.Schema({
    userId: {
        type: mangoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
        default: null
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,   
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    }, 
    time: {
        type: String,
        required: true, 
        trim: true
    },
    numberOfGuests: {
        type: Number,
        required: true,
        min: 1
    },
    specialRequests: {
        type: String,
        trim: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    }
}, {timestamps: true});

const Reservation = mangoose.model('Reservation', reservationSchema);
export default Reservation;