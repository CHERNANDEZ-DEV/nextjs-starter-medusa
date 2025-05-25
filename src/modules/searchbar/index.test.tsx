import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchWithFilters from './index';

describe('SearchWithFilters Component', () => {
    // Mock para los productos
    const mockProducts = [
        { id: 1, name: "Refrigerador Samsung", category: "Appliances", brand: "Samsung", price: 1200 },
        { id: 2, name: "Sofá moderno", category: "Home", brand: "Mabe", price: 800 },
        { id: 3, name: "Zapatillas Nike Air", category: "Sport", brand: "Nike", price: 150 }
    ];

    // Prueba 1: Renderizado inicial
    test('renders correctly with initial state', () => {
        render(<SearchWithFilters />);

        // Verifica elementos principales
        expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
        expect(screen.getByText('Filters')).toBeInTheDocument();
        expect(screen.getByText('Categories')).toBeInTheDocument();
        expect(screen.getByText('Brand')).toBeInTheDocument();
        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Price range')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Buscar' })).toBeInTheDocument();
    });

    // Prueba 2: Búsqueda de productos
    test('filters products based on search query', async () => {
        render(<SearchWithFilters />);

        const searchInput = screen.getByPlaceholderText('Search products...');
        fireEvent.change(searchInput, { target: { value: 'Samsung' } });

        // Verifica que los productos filtrados aparezcan
        expect(await screen.findByText('Refrigerador Samsung')).toBeInTheDocument();
        expect(await screen.findByText('TV Samsung 4K')).toBeInTheDocument();
        expect(screen.queryByText('Sofá moderno')).not.toBeInTheDocument();
    });

    // Prueba 3: Filtrado por categoría
    test('filters products by category', async () => {
        render(<SearchWithFilters />);

        const checkbox = screen.getByLabelText('Appliances');
        fireEvent.click(checkbox);

        expect(await screen.findByText('Refrigerador Samsung')).toBeInTheDocument();
        expect(await screen.findByText('Laptop Lenovo')).toBeInTheDocument();
        expect(screen.queryByText('Sofá moderno')).not.toBeInTheDocument();
    });

    // Prueba 4: Filtrado por marca
    test('filters products by brand', async () => {
        render(<SearchWithFilters />);

        const checkbox = screen.getByLabelText('Samsung');
        fireEvent.click(checkbox);

        expect(await screen.findByText('Refrigerador Samsung')).toBeInTheDocument();
        expect(await screen.findByText('TV Samsung 4K')).toBeInTheDocument();
        expect(screen.queryByText('Sofá moderno')).not.toBeInTheDocument();
    });

    // Prueba 5: Ordenamiento por precio
    test('sorts products by price low to high', async () => {
        render(<SearchWithFilters />);

        const checkbox = screen.getByLabelText('Lowest price to highest');
        fireEvent.click(checkbox);

        const prices = await screen.findAllByText(/\$\d+/);
        const priceValues = prices.map(p => parseFloat(p.textContent?.replace('$', '') || '0'));

        const sortedPrices = [...priceValues].sort((a, b) => a - b);
        expect(priceValues).toEqual(sortedPrices);
    });

    // Prueba 7: Mensaje cuando no hay resultados
    test('shows no results message when no products match', async () => {
        render(<SearchWithFilters />);

        const searchInput = screen.getByPlaceholderText('Search products...');
        fireEvent.change(searchInput, { target: { value: 'XYZ123' } });

        expect(await screen.findByText('No se encontraron productos que coincidan con tu búsqueda')).toBeInTheDocument();
    });
});