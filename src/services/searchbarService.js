"use client";
import axios from 'axios';
import api from './api';

const getProducts = async (query) => {
    try {
        const response = await axios.get(`http://localhost:9000/store/products?title=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_c6b84fb008681ac9ff24be015490e656be7decea654630000d8b50e279780590',
            },
        });
        if (response.status !== 200) {
            throw new Error('Failed to fetch products');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

const getSuggestions = async () => {
    try {
        const response = await axios.get('http://localhost:9000/store/products/', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_c6b84fb008681ac9ff24be015490e656be7decea654630000d8b50e279780590',
            },
        });
        if (response.status !== 200) {
            throw new Error('Failed to fetch products');
        }
        return response.data;
    } catch (error) {
        console.error('Error fetching suggestions:', error);
        throw error;
    }
}

const searchProducts = async (query) => {
    try {
        const response = await api.get('/', {
            params: { q: query }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching search results:', error);
        throw error;
    }
}

// Opción 2: Exportación por defecto
const searchService = {
    getProducts,
    searchProducts,
    getSuggestions
};

export default searchService;