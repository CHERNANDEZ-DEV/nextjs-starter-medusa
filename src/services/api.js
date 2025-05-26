"use client";
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:9000/store/products',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-publishable-api-key': 'pk_dd5d96cf87f17625b31602730e8302c00cf0ea7f80a15638a95252877e787b25',
    },
});

export default api;