"use client";
import axios from 'axios';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY

const api = axios.create({
    baseURL: 'http://localhost:9000/store/products',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
    },
});

export default api;