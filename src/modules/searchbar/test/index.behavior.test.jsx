import React from 'react'
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
        beforeEach(() => {
            searchService.getSuggestions.mockResolvedValue({ products: mockProducts })
            searchService.getProducts.mockResolvedValue({ products: mockProducts })
            searchService.getSuggestions.mockResolvedValue({ products: [] })
            searchService.searchProducts.mockResolvedValue({
            products: [
                { id: "1", title: "Camiseta", thumbnail: null, images: [{ url: "img1.jpg" }] },
                { id: "2", title: "Pantalón", images: [] }, // sin imágenes
            ]
            })
        })

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

        it("muestra y oculta sugerencias al hacer búsqueda", async () => {
        render(<SearchWithFilters />)
        const input = screen.getByPlaceholderText(/buscar/i)

        fireEvent.focus(input)

        await waitFor(() => {
        expect(screen.getByTestId("sugerencias")).toBeInTheDocument()
        })

        fireEvent.change(input, { target: { value: "ropa" } })
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

        await waitFor(() => {
        expect(searchService.searchProducts).toHaveBeenCalledWith("ropa")
        })

        expect(screen.queryByTestId("sugerencias")).not.toBeInTheDocument()
    })

    it("renderiza fallback si falta 'images'", async () => {
        render(<SearchWithFilters />)

        const input = screen.getByPlaceholderText(/buscar/i)
        fireEvent.change(input, { target: { value: "pantalón" } })
        fireEvent.keyDown(input, { key: "Enter", code: "Enter" })

        await waitFor(() => {
        const imgs = screen.getAllByRole("img")
        expect(imgs.length).toBeGreaterThanOrEqual(1)
        imgs.forEach(img => {
            expect(img.getAttribute("src")).not.toBe(null)
        })
        })
    })
})
