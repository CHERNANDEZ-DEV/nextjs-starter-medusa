"use client";
import { useState, useMemo } from "react";

const SearchWithFilters = () => {
    // Array de productos simulado
    const allProducts = [
        { id: 1, name: "Refrigerador Samsung", category: "Appliances", brand: "Samsung", price: 1200 },
        { id: 2, name: "Sofá moderno", category: "Home", brand: "Mabe", price: 800 },
        { id: 3, name: "Zapatillas Nike Air", category: "Sport", brand: "Nike", price: 150 },
        { id: 4, name: "Laptop Lenovo", category: "Appliances", brand: "Lenovo", price: 950 },
        { id: 5, name: "Juego de mesa", category: "Home", brand: "Mabe", price: 120 },
        { id: 6, name: "Balón de fútbol", category: "Sport", brand: "Nike", price: 50 },
        { id: 7, name: "TV Samsung 4K", category: "Appliances", brand: "Samsung", price: 750 },
        { id: 8, name: "Monitor Lenovo", category: "Appliances", brand: "Lenovo", price: 300 },
    ];

    const [query, setQuery] = useState("");
    const [filters, setFilters] = useState({
        categories: {
            Appliances: false,
            Home: false,
            Sport: false
        },
        brands: {
            Lenovo: false,
            Mabe: false,
            Nike: false,
            Samsung: false
        },
        priceSort: "",
        priceRange: [50, 1500]
    });

    // Función para filtrar y ordenar productos
    const filteredProducts = useMemo(() => {
        let result = [...allProducts];

        // Filtrar por búsqueda
        if (query.trim()) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        // Filtrar por categorías seleccionadas
        const activeCategories = Object.keys(filters.categories).filter(
            cat => filters.categories[cat]
        );
        if (activeCategories.length > 0) {
            result = result.filter(product =>
                activeCategories.includes(product.category)
            );
        }

        // Filtrar por marcas seleccionadas
        const activeBrands = Object.keys(filters.brands).filter(
            brand => filters.brands[brand]
        );
        if (activeBrands.length > 0) {
            result = result.filter(product =>
                activeBrands.includes(product.brand)
            );
        }

        // Filtrar por rango de precio
        result = result.filter(
            product =>
                product.price >= filters.priceRange[0] &&
                product.price <= filters.priceRange[1]
        );

        // Ordenar por precio
        if (filters.priceSort === "low-high") {
            result.sort((a, b) => a.price - b.price);
        } else if (filters.priceSort === "high-low") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [query, filters, allProducts]);

    const handleSearch = (e) => {
        e.preventDefault();
        // La búsqueda se maneja automáticamente con el estado
    };

    const handleCheckboxChange = (filterType, name) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: {
                ...prev[filterType],
                [name]: !prev[filterType][name]
            }
        }));
    };

    const handlePriceSortChange = (value) => {
        setFilters(prev => ({
            ...prev,
            priceSort: prev.priceSort === value ? "" : value
        }));
    };

    const handlePriceRangeChange = (index, value) => {
        const newRange = [...filters.priceRange];
        newRange[index] = Number(value);
        setFilters(prev => ({
            ...prev,
            priceRange: newRange
        }));
    };

    const renderCheckboxGroup = (title, items, filterType) => (
        <div className="mb-8">
            <h3 className="font-semibold mb-3">{title}</h3>
            {Object.keys(items).map(item => (
                <div key={item} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        id={`${filterType}-${item}`}
                        checked={items[item]}
                        onChange={() => handleCheckboxChange(filterType, item)}
                        className="mr-2 h-4 w-4"
                    />
                    <label htmlFor={`${filterType}-${item}`}>{item}</label>
                </div>
            ))}
        </div>
    );

    const renderPriceRange = () => (
        <div className="mb-4">
            <h3 className="font-semibold mb-3">Price range</h3>
            <div className="flex gap-4">
                {filters.priceRange.map((value, index) => (
                    <input
                        key={index}
                        type="number"
                        value={value}
                        onChange={(e) => handlePriceRangeChange(index, e.target.value)}
                        className="w-1/2 p-2 border rounded"
                    />
                ))}
            </div>
        </div>
    );

    return (
        <div className="flex flex-col md:flex-row gap-8 p-4 max-w-6xl mx-auto">
            {/* Filtros */}
            <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6">Filters</h2>

                {renderCheckboxGroup("Categories", filters.categories, "categories")}
                {renderCheckboxGroup("Brand", filters.brands, "brands")}

                <div className="mb-8">
                    <h3 className="font-semibold mb-3">Price</h3>
                    {[
                        { id: "price-low-high", label: "Lowest price to highest", value: "low-high" },
                        { id: "price-high-low", label: "Highest to lowest price", value: "high-low" }
                    ].map(({ id, label, value }) => (
                        <div key={id} className="flex items-center mb-2">
                            <input
                                type="checkbox"
                                id={id}
                                checked={filters.priceSort === value}
                                onChange={() => handlePriceSortChange(value)}
                                className="mr-2 h-4 w-4"
                            />
                            <label htmlFor={id}>{label}</label>
                        </div>
                    ))}
                </div>

                {renderPriceRange()}
            </div>

            {/* Contenido principal */}
            <div className="w-full md:w-3/4">
                <form onSubmit={handleSearch} className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                        >
                            Buscar
                        </button>
                    </div>
                </form>

                <div className="bg-white p-6 rounded-lg shadow">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <h3 className="font-semibold text-lg">{product.name}</h3>
                                    <p className="text-gray-600">{product.brand}</p>
                                    <p className="text-gray-500">{product.category}</p>
                                    <p className="font-bold text-blue-600 mt-2">${product.price.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-8">No se encontraron productos que coincidan con tu búsqueda</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchWithFilters;