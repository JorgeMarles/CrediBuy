import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import type { 
  Product, 
  PaginationData, 
  FilterState, 
  OrderDirection, 
  OrderingField,
  ApiResponse 
} from '../types/products';
import { listProductsCustom } from '../services/ProductService';

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [pagination, setPagination] = useState<PaginationData>({
    count: 0,
    next: null,
    previous: null,
    current: 1
  });
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    name: '',
    price: '',
    product_type__name: ''
  });
  const [ordering, setOrdering] = useState<OrderingField>('name');
  const [orderDirection, setOrderDirection] = useState<OrderDirection>('asc');

  const fetchProducts = async (page: number = 1): Promise<void> => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams({
        page: page.toString(),
        search: filters.search,
        ordering: `${orderDirection === 'desc' ? '-' : ''}${ordering}`,
        ...(filters.name && { name: filters.name }),
        ...(filters.price && { price: filters.price }),
        ...(filters.product_type__name && { product_type__name: filters.product_type__name })
      });

      const data: ApiResponse<Product> = await listProductsCustom(searchParams.toString());
      setProducts(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        current: page
      });
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [ordering, orderDirection, filters]);

  const handleSort = (field: OrderingField): void => {
    if (ordering === field) {
      setOrderDirection(orderDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setOrdering(field);
      setOrderDirection('asc');
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchProducts(1);
  };

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const renderSortIcon = (field: OrderingField): JSX.Element | null => {
    if (ordering !== field) return null;
    return orderDirection === 'asc' ? 
      <ChevronUp className="h-4 w-4 ml-1" /> : 
      <ChevronDown className="h-4 w-4 ml-1" />;
  };

  return (
    <div className="p-6 space-y-4">
      {/* Filtros y búsqueda */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3"
              placeholder="Buscar..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
            />
          </div>
          <input
            type="text"
            className="rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 py-2 px-3"
            placeholder="Tipo de producto"
            name="product_type__name"
            value={filters.product_type__name}
            onChange={handleFilterChange}
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    onClick={() => handleSort('name')} 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center">
                      Nombre {renderSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('price')} 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center">
                      Precio {renderSortIcon('price')}
                    </div>
                  </th>
                  <th 
                    onClick={() => handleSort('product_type__name')} 
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                  >
                    <div className="flex items-center">
                      Tipo {renderSortIcon('product_type__name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${Number(product.price).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.product_type_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {product.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.stock}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="mt-6 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => fetchProducts(pagination.current - 1)}
                disabled={!pagination.previous}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="px-4 py-2 border border-indigo-500 rounded-md text-sm font-medium text-white bg-indigo-600">
                {pagination.current}
              </span>
              <button
                onClick={() => fetchProducts(pagination.current + 1)}
                disabled={!pagination.next}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;