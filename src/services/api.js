"use client";
import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
    },
});

export default api;