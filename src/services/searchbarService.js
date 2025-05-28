"use client";
import axios from 'axios';
import api from './api';

const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const getProducts = async (query) => {
    try {
        const response = await axios.get(`http://localhost:9000/store/products?title=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': PUBLISHABLE_API_KEY,
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
                'x-publishable-api-key': PUBLISHABLE_API_KEY,
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