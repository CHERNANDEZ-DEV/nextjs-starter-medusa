"use client";
import axios from 'axios';
import api from './api';

const getProducts = async (query) => {
    try {
        const response = await axios.get(`https://barato.cfd/store/products?title=${query}`, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_6a45c54d0c42101703e99759a49e921c4e8c40246fa52484930baa7c992ee765',
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

// hola

const getSuggestions = async () => {
    try {
        const response = await axios.get('https://barato.cfd/store/products', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'x-publishable-api-key': 'pk_6a45c54d0c42101703e99759a49e921c4e8c40246fa52484930baa7c992ee765',
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
                'x-publishable-api-key': 'pk_6a45c54d0c42101703e99759a49e921c4e8c40246fa52484930baa7c992ee765',
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