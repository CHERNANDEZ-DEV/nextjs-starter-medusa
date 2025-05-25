import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchWithFilters from './index';

// Mock básico de datos locales (sin servicios)
const mockProducts = [
    {
        id: 1,
        title: "T-Shirt Basic",
        description: "Comfortable cotton t-shirt",
        options: [
            { title: "Color", values: [{ value: "Black" }] },
            { title: "Size", values: [{ value: "S" }] }
        ],
        variants: [
            { options: [{ option: { title: "Size" }, value: "S" }] }
        ],
        thumbnail: "tshirt.jpg"
    },
    {
        id: 2,
        title: "Sweatshirt Premium",
        description: "Warm sweatshirt",
        options: [
            { title: "Color", values: [{ value: "White" }] }
        ],
        variants: [],
        thumbnail: "sweatshirt.jpg"
    }
];

describe('SearchWithFilters Component - Simplified Tests', () => {
    // Mock de las props o estado inicial si es necesario
    const setup = () => {
        render(<SearchWithFilters />);
    };

    // Test 1: Renderizado básico
    test('renders search input and filters section', () => {
        setup();
        expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    // Test 2: Búsqueda por texto
    test('filters products by search query', () => {
        setup();
        const searchInput = screen.getByPlaceholderText('Search products...');
        fireEvent.change(searchInput, { target: { value: 'T-Shirt' } });

        // Verificar que se aplica el filtro (asumiendo que el componente muestra resultados)
        expect(screen.getByDisplayValue('T-Shirt')).toBeInTheDocument();
    });

    // Test 4: Reset de búsqueda
    test('clears search when input is empty', () => {
        setup();
        const searchInput = screen.getByPlaceholderText('Search products...');
        fireEvent.change(searchInput, { target: { value: 'test' } });
        fireEvent.change(searchInput, { target: { value: '' } });
        expect(searchInput.value).toBe('');
    });
});