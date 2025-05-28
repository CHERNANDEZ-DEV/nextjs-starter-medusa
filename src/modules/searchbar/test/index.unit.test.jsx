import React from 'react'
import { render, screen } from '@testing-library/react'
import SearchWithFilters from '../index.jsx'

describe('SearchWithFilters - Unit Tests', () => {
    test('renderiza campo de búsqueda y botón', () => {
        render(<SearchWithFilters />)

        expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument()
    })

    test('renderiza el texto de filtros y categorías si existen', () => {
        render(<SearchWithFilters />)

        expect(screen.getByText('Filters')).toBeInTheDocument()
    })

    it("renderiza correctamente sin props", () => {
        const { getByPlaceholderText } = render(<SearchWithFilters />)
        expect(getByPlaceholderText(/buscar/i)).toBeInTheDocument()
    })

    it("muestra imagen por defecto si el producto no tiene imágenes", () => {
        const mockProducts = [{ id: "1", title: "Producto", thumbnail: null, images: null }]
        const { getByAltText } = render(<SearchWithFilters initialProducts={mockProducts} />)
        expect(getByAltText("Producto").src).toContain("default")
    })
})
