import { Product } from '../models/Product';

export class ProductService {
    static async getAll(userId) {
        return await Product.find({ userId }).sort({ createdAt: -1 });
    }

    static async create(productData, userId) {
        try {
            const product = new Product({
                userId,
                ...productData
            });

            const savedProduct = await product.save();
            console.log('Product saved:', savedProduct);
            return savedProduct;
        } catch (error) {
            console.error('Error in ProductService.create:', error);
            throw error;
        }
    }

    static async update(id, productData, userId) {
        try {
            const product = await Product.findOneAndUpdate(
                { _id: id, userId },
                productData,
                { new: true }
            );
            return product;
        } catch (error) {
            console.error(`Error updating product with id: ${id}`, error);
            throw error;
        }
    }

    static async delete(id, userId) {
        try {
            const product = await Product.findOneAndDelete({ _id: id, userId });
            return product;
        } catch (error) {
            console.error(`Error deleting product with id: ${id}`, error);
            throw error;
        }
    }
}