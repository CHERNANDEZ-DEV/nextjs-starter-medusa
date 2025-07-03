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

    test('renderiza el texto de sugerencias si existen', () => {
        render(<SearchWithFilters />)

        expect(screen.getByText('Suggested products')).toBeInTheDocument()
    }
    )

    test('renderiza mensaje si no hay productos', () => {
        render(<SearchWithFilters initialProducts={[]} />)

        expect(screen.getByText('No products found. Try a different search!')).toBeInTheDocument()
    }
    )

})
