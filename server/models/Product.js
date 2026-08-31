import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Product title is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Product description is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Product price is required'],
            min: [0, 'Price cannot be negative'],
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative'],
            max: [100, 'Discount cannot exceed 100%'],
        },
        stock: {
            type: Number,
            required: [true, 'Stock is required'],
            min: [0, 'Stock cannot be negative'],
            default: 0,
        },
        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String, default: '' },
            },
        ],
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
        },
        subCategory: {
            type: String,
            trim: true,
            default: '',
        },
        brand: {
            type: String,
            required: [true, 'Brand is required'],
            trim: true,
        },
        rating: {
            average: {
                type: Number,
                default: 0,
                min: 0,
                max: 5,
            },
            count: {
                type: Number,
                default: 0,
            },
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            // required: [true, 'Creator (Admin) ID is required'],
        },
    },
    {
        timestamps: true,
    }
);

// Virtual: discounted price
productSchema.virtual('discountedPrice').get(function () {
    return parseFloat((this.price - (this.price * this.discount) / 100).toFixed(2));
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

export const Product = mongoose.model('Product', productSchema);
