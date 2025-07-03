import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchWithFilters from '../index.jsx'
import searchService from '../../../services/searchbarService'

jest.mock('../../../services/searchbarService')

const mockProducts = [
    {
        id: 'prod_1',
        title: 'Test Product',
        description: 'Test desc',
        thumbnail: '',
        options: [],
        variants: []
    }
    ]

    describe('SearchWithFilters - Integration Tests', () => {
    beforeEach(() => {
        searchService.getProducts.mockResolvedValue({ products: mockProducts })
        searchService.getSuggestions.mockResolvedValue({ products: mockProducts })
    })

    test('muestra mensaje si no hay resultados', async () => {
        searchService.getProducts.mockResolvedValue({ products: [] })

        render(<SearchWithFilters />)

        fireEvent.change(screen.getByPlaceholderText('Search products...'), {
        target: { value: 'unknown' }
        })
        fireEvent.click(screen.getByText('Search'))

        expect(await screen.findByText('No products found. Try a different search!')).toBeInTheDocument()
    })

    test('muestra error si falla la API', async () => {
        searchService.getProducts.mockRejectedValue(new Error('API failure'))

        render(<SearchWithFilters />)

        fireEvent.change(screen.getByPlaceholderText('Search products...'), {
        target: { value: 'test' }
        })
        fireEvent.click(screen.getByText('Search'))

        expect(await screen.findByText(/Error loading products/i)).toBeInTheDocument()
    })

    it("llama a getSuggestions al montar el componente", async () => {
        searchService.getSuggestions.mockResolvedValueOnce({ products: [] })
        render(<SearchWithFilters />)
        await waitFor(() => {
        expect(searchService.getSuggestions).toHaveBeenCalled()
        })
    })

})
