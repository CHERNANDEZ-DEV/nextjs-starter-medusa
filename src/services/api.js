"use client";
import axios from 'axios';
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const MEDUSA_BACKEND_URL = process.env.MEDUSA_BACKEND_URL;

const api = axios.create({
    baseURL: 'https://barato.cfd/store/products/',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': PUBLISHABLE_API_KEY,
    },
});

export default api;


//hola
// hola