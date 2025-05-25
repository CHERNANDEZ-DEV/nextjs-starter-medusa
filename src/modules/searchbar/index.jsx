"use client";
import { useState, useMemo } from "react";
import searchService from "../../services/searchbarService.js";
import { Item } from "@radix-ui/react-accordion";

const SearchWithFilters = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [query, setQuery] = useState("");

    const [filters, setFilters] = useState({
        categories: {
            "T-Shirt": false,
            "Sweatshirt": false,
            "Shorts": false,
            "Sweatpants": false
        },
        sizes: {
            S: false,
            M: false,
            L: false,
            XL: false
        },
        colors: {
            Black: false,
            White: false
        },
        priceSort: "",
        priceRange: [0, 1000]
    });

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) {
            alert("Please enter a search term");
            return;
        }

        setLoading(true);
        try {
            const data = await searchService.getProducts(query);
            setProducts(data.products || []);
            setLoading(false);
        } catch (error) {
            setError(error);
            setLoading(false);
        }
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

    // Extraer todas las opciones de color disponibles
    const extractColors = (products) => {
        const colors = new Set();
        products.forEach(product => {
            const colorOption = product.options.find(opt => opt.title === "Color");
            if (colorOption) {
                colorOption.values.forEach(val => colors.add(val.value));
            }
        });
        return Array.from(colors);
    };

    // Obtener el precio mínimo de las variantes de un producto
    const getProductPrice = (product) => {
        // En una implementación real, esto vendría de las variantes
        // Por ahora usamos un valor fijo basado en el tipo de producto
        if (product.title.includes("T-Shirt")) return 25;
        if (product.title.includes("Sweatshirt")) return 45;
        if (product.title.includes("Shorts")) return 35;
        if (product.title.includes("Sweatpants")) return 50;
        return 30;
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        // Filtrar por categoría (basado en el título del producto)
        const activeCategories = Object.keys(filters.categories).filter(
            cat => filters.categories[cat]
        );
        if (activeCategories.length > 0) {
            result = result.filter(product =>
                activeCategories.some(cat =>
                    product.title.toLowerCase().includes(cat.toLowerCase())
                )
            );
        }

        // Filtrar por tallas
        const activeSizes = Object.keys(filters.sizes).filter(
            size => filters.sizes[size]
        );
        if (activeSizes.length > 0) {
            result = result.filter(product =>
                product.variants.some(variant =>
                    variant.options.some(opt =>
                        opt.option?.title === "Size" &&
                        activeSizes.includes(opt.value)
                    ))
            );
        }

        // Filtrar por colores
        const activeColors = Object.keys(filters.colors).filter(
            color => filters.colors[color]
        );

        if (activeColors.length > 0) {
            result = result.filter(product => {
                // Productos con opción de color
                const hasColorOption = product.options.some(opt => opt.title === "Color");
                if (!hasColorOption) return false;

                return product.variants.some(variant =>
                    variant.options.some(opt =>
                        opt.option?.title === "Color" &&
                        activeColors.includes(opt.value)
                    ))
            });
        }

        // Filtrar por rango de precio
        const [minPrice, maxPrice] = filters.priceRange;
        result = result.filter(product => {
            const price = getProductPrice(product);
            return price >= minPrice && price <= maxPrice;
        });

        // Ordenar por precio
        if (filters.priceSort) {
            result.sort((a, b) => {
                const aPrice = getProductPrice(a);
                const bPrice = getProductPrice(b);
                return filters.priceSort === "low-high"
                    ? aPrice - bPrice
                    : bPrice - aPrice;
            });
        }

        return result;
    }, [products, filters]);

    const renderCheckboxGroup = (title, items, filterType) => (
        <div className="mb-8">
            <h3 className="font-semibold mb-3">{title}</h3>
            {Object.keys(items).map(item => (
                <div key={item} className="flex mb-2">
                    <input
                        type="checkbox"
                        id={`${filterType}-${item}`}
                        checked={items[item]}
                        onChange={() => handleCheckboxChange(filterType, item)}
                        className="mr-2 h-4 w-4"
                    />
                    <label className="mt-2">{item}</label>
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
                        min="0"
                    />
                ))}
            </div>
        </div>
    );

    const renderProducts = () => {
        if (loading) {
            return <div className="text-center py-8">Loading products...</div>;
        }

        if (error) {
            return <div className="text-center py-8 text-red-500">Error loading products: {error.message}</div>;
        }

        if (filteredProducts.length === 0) {
            return <div className="text-center py-8">Products not found. Try a different search!</div>;
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => {
                    const price = getProductPrice(product);
                    const colorOption = product.options.find(opt => opt.title === "Color");
                    const sizeOption = product.options.find(opt => opt.title === "Size");
                    const availableColors = colorOption ? colorOption.values.map(v => v.value) : [];
                    const availableSizes = sizeOption ? sizeOption.values.map(v => v.value) : [];

                    return (
                        <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <img
                                    src={product.thumbnail || product.images[0]?.url}
                                    alt={product.title}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://via.placeholder.com/300";
                                    }}
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                                <p className="text-gray-600 mb-2 line-clamp-2">{product.description}</p>

                                <div className="mb-2">
                                    {availableColors.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            Colors: {availableColors.join(", ")}
                                        </div>
                                    )}
                                    {availableSizes.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            Sizes: {availableSizes.join(", ")}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between items-center">
                                    <span className="font-bold text-gray-600">${price}</span>
                                    <span className={`px-2 py-1 text-xs rounded-full ${product.variants.some(v => v.allow_backorder || v.manage_inventory)
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}>
                                        {product.variants.some(v => v.allow_backorder || v.manage_inventory)
                                            ? "In Stock"
                                            : "Out of Stock"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 p-4  mx-auto">
            {/* Filtros */}
            <div className="w-full md:w-1/4 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-bold mb-6">Filters</h2>

                {renderCheckboxGroup("Categories", filters.categories, "categories")}
                {renderCheckboxGroup("Sizes", filters.sizes, "sizes")}
                {renderCheckboxGroup("Colors", filters.colors, "colors")}

                <div className="mb-8">
                    <h3 className="font-semibold mb-3">Price</h3>
                    {[
                        { id: "price-low-high", label: "Lowest price to highest", value: "low-high" },
                        { id: "price-high-low", label: "Highest to lowest price", value: "high-low" }
                    ].map(({ id, label, value }) => (
                        <div key={id} className="flex items-center mb-2">
                            <input
                                type="radio"
                                name="priceSort"
                                id={id}
                                checked={filters.priceSort === value}
                                onChange={() => handlePriceSortChange(value)}
                                className="mr-2 h-4 w-4"
                            />
                            <label className="mt-4">{label}</label>
                        </div>
                    ))}
                </div>

                {/* {renderPriceRange()} */}
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
                            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-700"
                        />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-500 text-white p-2 rounded-md hover:bg-gray-600 transition-colors"
                        >
                            Search
                        </button>
                    </div>
                </form>

                {renderProducts()}
            </div>
        </div>
    );
};

export default SearchWithFilters;