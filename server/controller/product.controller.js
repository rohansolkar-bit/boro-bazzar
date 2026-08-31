import { Product } from "../models/Product.js";

// POST /api/products/create
export const createProductController = async (request, response) => {
    try {
        const {
            title, description, price, discount, stock,
            category, subCategory, brand, isFeatured, images, rating  
        } = request.body;

        const product = await Product.create({
            title,
            description,
            price: Number(price),
            discount: Number(discount || 0),
            stock: Number(stock),
            category,
            subCategory: subCategory || '',
            brand,
            isFeatured: isFeatured === true || isFeatured === 'true',
            images: images || [],
            rating: {
                average: rating?.average || 0,
                count: rating?.count || 0,
            },
            // createdBy: request.userId,
        });

        return response.status(201).json({
            success: true,
            error: false,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        });
    }
};

// GET /api/products/all
export const getAllProductsController = async (request, response) => {
    try {
        const { category, brand, search, page = 1, limit = 10, sort = '-createdAt' } = request.query;

        const filter = { isActive: true };
        if (category) filter.category = { $regex: category, $options: 'i' };
        if (brand)    filter.brand    = { $regex: brand,    $options: 'i' };
        if (search)   filter.title    = { $regex: search,   $options: 'i' };

        const skip  = (Number(page) - 1) * Number(limit);
        const total = await Product.countDocuments(filter);

        const products = await Product.find(filter)
            .sort(sort)
            .skip(skip)
            .limit(Number(limit))
            .populate('createdBy', 'name email');

        return response.status(200).json({
            success: true,
            error: false,
            message: "Products fetched successfully",
            data: products,
            pagination: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / Number(limit)),
            },
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        });
    }
};

// GET /api/products/:id
export const getProductByIdController = async (request, response) => {
    try {
        const product = await Product.findById(request.params.id)
            .populate('createdBy', 'name email');

        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "Product not found",
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        });
    }
};

// PUT /api/products/update/:id
export const updateProductController = async (request, response) => {
    try {
        const {
            title, description, price, discount, stock,
            category, subCategory, brand, isFeatured, images, isActive,
        } = request.body;

        const updateFields = {};
        if (title       !== undefined) updateFields.title       = title;
        if (description !== undefined) updateFields.description = description;
        if (price       !== undefined) updateFields.price       = Number(price);
        if (discount    !== undefined) updateFields.discount    = Number(discount);
        if (stock       !== undefined) updateFields.stock       = Number(stock);
        if (category    !== undefined) updateFields.category    = category;
        if (subCategory !== undefined) updateFields.subCategory = subCategory;
        if (brand       !== undefined) updateFields.brand       = brand;
        if (isFeatured  !== undefined) updateFields.isFeatured  = isFeatured === true || isFeatured === 'true';
        if (isActive    !== undefined) updateFields.isActive    = isActive   === true || isActive   === 'true';
        if (images      !== undefined) updateFields.images      = images;

        const product = await Product.findByIdAndUpdate(
            request.params.id,
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "Product not found",
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        });
    }
};

// DELETE /api/products/delete/:id
export const deleteProductController = async (request, response) => {
    try {
        const product = await Product.findByIdAndDelete(request.params.id);

        if (!product) {
            return response.status(404).json({
                success: false,
                error: true,
                message: "Product not found",
            });
        }

        return response.status(200).json({
            success: true,
            error: false,
            message: "Product deleted successfully",
        });
    } catch (error) {
        return response.status(500).json({
            success: false,
            error: true,
            message: error.message,
        });
    }
};
