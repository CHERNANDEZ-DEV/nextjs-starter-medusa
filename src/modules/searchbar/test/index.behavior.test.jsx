import React, { act } from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SearchWithFilters from '../index.jsx'
import searchService from '../../../services/searchbarService'

jest.mock('../../../services/searchbarService')

const mockProducts = [
    {
        id: 'prod_1',
        title: 'Medusa T-Shirt',
        description: 'Shirt',
        thumbnail: '',
        options: [{ title: 'Size', values: [{ value: 'M' }] }],
        variants: [
        {
            options: [{ option: { title: 'Size' }, value: 'M' }],
            manage_inventory: true
        }
        ]
    }
    ]

    describe('SearchWithFilters - Behavioral Tests', () => {

        test('muestra sugerencias al inicio y las oculta después de búsqueda', async () => {
            render(<SearchWithFilters />)

            expect(await screen.findByText('Suggested products')).toBeInTheDocument()

            fireEvent.change(screen.getByPlaceholderText('Search products...'), {
            target: { value: 'shirt' }
            })
            fireEvent.click(screen.getByText('Search'))

            await waitFor(() => {
            expect(screen.queryByText('Suggested products')).not.toBeInTheDocument()
            })
        })

        test('muestra alerta si se busca sin ingresar texto', () => {
            const alertMock = jest.spyOn(window, 'alert').mockImplementation()

            render(<SearchWithFilters />)
            fireEvent.click(screen.getByText('Search'))

            expect(alertMock).toHaveBeenCalledWith('Please enter a search term')
            alertMock.mockRestore()
        })

        test('muestra mensaje si no hay resultados al buscar', async () => {
            searchService.getProducts.mockResolvedValue({ products: [] })

            render(<SearchWithFilters />)

            fireEvent.change(screen.getByPlaceholderText('Search products...'), {
                target: { value: 'unknown' }
            })
            fireEvent.click(screen.getByText('Search'))

            expect(await screen.findByText('No products found. Try a different search!')).toBeInTheDocument()
        })
})


