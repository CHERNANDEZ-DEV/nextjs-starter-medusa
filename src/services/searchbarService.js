"use client";
import axios from 'axios';
import api from './api';

const getProducts = async (query) => {
    try {
        const response = await axios.get(`https://barato.cfd/store/products?title=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_4a21e6acda0b5787b02049c5e7fb8f5f27c62f0a9cf33f3bdc251af98375e19d',
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
        const response = await axios.get('https://barato.cfd/store/products', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_4a21e6acda0b5787b02049c5e7fb8f5f27c62f0a9cf33f3bdc251af98375e19d',
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
        const response = await axios.get('/', {
            params: { q: query },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_4a21e6acda0b5787b02049c5e7fb8f5f27c62f0a9cf33f3bdc251af98375e19d',
            },
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