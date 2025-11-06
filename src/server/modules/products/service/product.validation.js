class ProductValidation {

    async validate(data) {
        if (!data.title || !data.description || !data.price) {
            throw new Error('Title, description, and price are required');
        }

        if (!data.sellerId) {
            throw new Error('Seller ID is required');
        }

        // Validate UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(data.sellerId)) {
            throw new Error('Seller ID must be a valid UUID');
        }

        if (data.price <= 0) {
            throw new Error('Price must be greater than 0');
        }

    }

}

export default new ProductValidation();