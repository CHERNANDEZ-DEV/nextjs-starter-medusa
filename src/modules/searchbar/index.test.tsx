import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchWithFilters from './index.jsx';
import searchService from '../../services/searchbarService';

// Mock del servicio con datos realistas basados en la API
jest.mock('../../services/searchbarService', () => ({
    getSuggestions: jest.fn(),
    getProducts: jest.fn()
}));

// Datos de prueba basados en la estructura real de la API
const mockProducts = [
    {
        id: "prod_01JR6VYG3MB3359RGSV8EV8MT2",
        title: "Medusa T-Shirt",
        description: "Reimagine the feeling of a classic T-shirt.",
        thumbnail: "https://example.com/tshirt.jpg",
        options: [
            {
                title: "Size",
                values: [{ value: "S" }, { value: "M" }, { value: "L" }, { value: "XL" }]
            },
            {
                title: "Color",
                values: [{ value: "Black" }, { value: "White" }]
            }
        ],
        variants: [
            {
                options: [
                    { option: { title: "Size" }, value: "S" },
                    { option: { title: "Color" }, value: "Black" }
                ],
                manage_inventory: true
            }
        ]
    },
    {
        id: "prod_01JR6VYG3MBYSAC21J7CRBMM35",
        title: "Medusa Sweatshirt",
        description: "Reimagine the feeling of a classic sweatshirt.",
        thumbnail: "https://example.com/sweatshirt.jpg",
        options: [
            {
                title: "Size",
                values: [{ value: "S" }, { value: "M" }, { value: "L" }, { value: "XL" }]
            }
        ],
        variants: [
            {
                options: [{ option: { title: "Size" }, value: "M" }],
                manage_inventory: true
            }
        ]
    }
];

describe('SearchWithFilters Component', () => {
    beforeEach(() => {
        // Reset mocks antes de cada test
        searchService.getSuggestions.mockResolvedValue({ products: mockProducts });
        searchService.getProducts.mockResolvedValue({ products: mockProducts });
    });

    // 1. Renderizado inicial con sugerencias
    // test('renderiza correctamente los elementos principales y muestra sugerencias', async () => {
    //     render(<SearchWithFilters />);

    //     // Input y botón de búsqueda
    //     expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    //     expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();

    //     // Filtros
    //     expect(screen.getByText('Filters')).toBeInTheDocument();
    //     expect(screen.getByLabelText('T-Shirt')).toBeInTheDocument();
    //     expect(screen.getByLabelText('Sweatshirt')).toBeInTheDocument();

    //     // Esperar a que carguen las sugerencias
    //     expect(await screen.findByText('Suggested products')).toBeInTheDocument();
    //     expect(screen.getByText('Medusa T-Shirt')).toBeInTheDocument();
    // });

    // 2. Búsqueda con término válido
    test('realiza una búsqueda con término válido y muestra resultados', async () => {
        render(<SearchWithFilters />);

        fireEvent.change(screen.getByPlaceholderText('Search products...'), {
            target: { value: 'shirt' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Verificar que se llamó a la API
        await waitFor(() => {
            expect(searchService.getProducts).toHaveBeenCalled();
        });

        // Verificar que se muestran los resultados
        expect(await screen.findByText('Medusa T-Shirt')).toBeInTheDocument();
    });

    // 3. Búsqueda con término vacío (muestra alerta)
    test('muestra alerta cuando se busca sin término', () => {
        const alertMock = jest.spyOn(window, 'alert').mockImplementation();

        render(<SearchWithFilters />);
        fireEvent.click(screen.getByText('Search'));

        expect(alertMock).toHaveBeenCalledWith('Please enter a search term');
        alertMock.mockRestore();
    });

    // 4. Filtrado por categoría
    // test('filtra productos por categoría (T-Shirt)', async () => {
    //     render(<SearchWithFilters />);

    //     // Activar filtro de T-Shirt
    //     fireEvent.click(screen.getByLabelText('T-Shirt'));

    //     // Realizar búsqueda
    //     fireEvent.change(screen.getByPlaceholderText('Search products...'), {
    //         target: { value: 'shirt' }
    //     });
    //     fireEvent.click(screen.getByText('Search'));

    //     // Verificar que solo se muestran T-Shirts
    //     await waitFor(() => {
    //         expect(screen.getByText('Medusa T-Shirt')).toBeInTheDocument();
    //         expect(screen.queryByText('Medusa Sweatshirt')).not.toBeInTheDocument();
    //     });
    // });

    // 5. Filtrado por tamaño (M)
    // test('filtra productos por tamaño (M)', async () => {
    //     render(<SearchWithFilters />);

    //     // Activar filtro de talla M
    //     fireEvent.click(screen.getByLabelText('M'));

    //     // Realizar búsqueda
    //     fireEvent.change(screen.getByPlaceholderText('Search products...'), {
    //         target: { value: 'shirt' }
    //     });
    //     fireEvent.click(screen.getByText('Search'));

    //     // Verificar que se aplicó el filtro
    //     await waitFor(() => {
    //         expect(searchService.getProducts).toHaveBeenCalled();
    //     });
    // });

    // 6. Ordenamiento por precio (mayor a menor)
    // test('ordena productos por precio de mayor a menor', async () => {
    //     render(<SearchWithFilters />);

    //     // Seleccionar ordenamiento
    //     fireEvent.click(screen.getByLabelText('Highest to lowest price'));

    //     // Realizar búsqueda
    //     fireEvent.change(screen.getByPlaceholderText('Search products...'), {
    //         target: { value: 'shirt' }
    //     });
    //     fireEvent.click(screen.getByText('Search'));

    //     // Verificar que se aplicó el ordenamiento
    //     await waitFor(() => {
    //         expect(searchService.getProducts).toHaveBeenCalled();
    //     });
    // });

    // 7. Manejo de errores de API
    test('muestra mensaje de error cuando la API falla', async () => {
        searchService.getProducts.mockRejectedValue(new Error('API Error'));

        render(<SearchWithFilters />);
        fireEvent.change(screen.getByPlaceholderText('Search products...'), {
            target: { value: 'shirt' }
        });
        fireEvent.click(screen.getByText('Search'));

        expect(await screen.findByText(/Error loading products/)).toBeInTheDocument();
    });

    // 8. Sin resultados de búsqueda
    test('muestra mensaje cuando no hay resultados', async () => {
        searchService.getProducts.mockResolvedValue({ products: [] });

        render(<SearchWithFilters />);
        fireEvent.change(screen.getByPlaceholderText('Search products...'), {
            target: { value: 'xyz' }
        });
        fireEvent.click(screen.getByText('Search'));

        expect(await screen.findByText('No products found. Try a different search!')).toBeInTheDocument();
    });

    // 9. Estado de stock
    // test('muestra correctamente el estado de stock', async () => {
    //     render(<SearchWithFilters />);

    //     // Realizar búsqueda
    //     fireEvent.change(screen.getByPlaceholderText('Search products...'), {
    //         target: { value: 'shirt' }
    //     });
    //     fireEvent.click(screen.getByText('Search'));

    //     // Verificar que se muestra el estado de stock
    //     expect(await screen.findByText('In Stock')).toBeInTheDocument();
    // });

    // 10. Comportamiento de las sugerencias
    test('oculta sugerencias al realizar una búsqueda', async () => {
        render(<SearchWithFilters />);

        // Verificar que las sugerencias están visibles inicialmente
        expect(await screen.findByText('Suggested products')).toBeInTheDocument();

        // Realizar búsqueda
        fireEvent.change(screen.getByPlaceholderText('Search products...'), {
            target: { value: 'shirt' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Verificar que las sugerencias se ocultan
        await waitFor(() => {
            expect(screen.queryByText('Suggested products')).not.toBeInTheDocument();
        });
    });
});