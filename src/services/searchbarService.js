"use client";
import axios from 'axios';
import api from './api';

const getProducts = async (query) => {
    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}?title=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',

                'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
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