const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter product Name"],
        trim: true
    },
    desciption: {
        type: String,
        required: [true, "Please Enter product Desciption"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter prodcut Price"],
        maxlength: [8, "Pirce connot exceed 8 characters"]
    },
    ratings: {
        type: Number,
        default: 0
    },

    images: [
        {
            public_id: {
                required: true,
                type: String
            },
            url: {
                type: String,
                required: true
            }

        }
    ],
    category: {
        type: String,
        required: [true, "Please Enter Product Category"],

    },
    Stock: {
        type: Number,
        required: [true, "Please Enter product Stock"],
        maxlength: [4, "Stock connect exceed 4 charaters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rading: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Product', productSchema);