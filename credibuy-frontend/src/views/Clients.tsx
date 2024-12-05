import React, { useState, useEffect } from 'react';
import { ApiResponse } from '../types/products';
import { Client, listClientsCustom } from '../services/ClientService';
import { Link } from 'react-router-dom';


interface QueryParams {
  search?: string;
  ordering?: string;
  is_active?: boolean;
  last_name?: string;
  page?: number;
  page_size?: number;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
  const [ordering, setOrdering] = useState<string>('first_name');
  const [isAsc, setIsAsc] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10; // Items per page

  const fetchClients = async (params: QueryParams) => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams();

      if (params.search) queryString.append('search', params.search);
      if (params.ordering) queryString.append('ordering', params.ordering);
      if (params.is_active !== null && params.is_active !== undefined) {
        queryString.append('is_active', params.is_active.toString());
      }
      if (params.last_name) queryString.append('last_name', params.last_name);
      if (params.page) queryString.append('page', params.page.toString());
      if (params.page_size) queryString.append('page_size', params.page_size.toString());

      const data: ApiResponse<Client> = await listClientsCustom(queryString.toString());
      setClients(data.results);
      setTotalItems(data.count);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params: QueryParams = {
      page: currentPage,
      page_size: pageSize
    };

    if (searchTerm) params.search = searchTerm;
    if (activeFilter !== null) params.is_active = activeFilter;
    params.ordering = `${isAsc ? '' : '-'}${ordering}`;

    const debounceTimeout = setTimeout(() => {
      fetchClients(params);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm, activeFilter, ordering, isAsc, currentPage]);

  const handleSort = (field: string) => {
    if (field === ordering) {
      setIsAsc(!isAsc);
    } else {
      setOrdering(field);
      setIsAsc(true);
    }
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar..."
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page when search changes
          }}
        />
        <select
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={activeFilter === null ? '' : activeFilter.toString()}
          onChange={(e) => {
            setActiveFilter(e.target.value === '' ? null : e.target.value === 'true');
            setCurrentPage(1); // Reset to first page when filter changes
          }}
        >
          <option value="">Todos</option>
          <option value="true">Activos</option>
          <option value="false">Inactivos</option>
        </select>
        <Link to='/clients/new'>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Nuevo Cliente
          </button>

        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              {[
                { key: 'first_name', label: 'Nombre' },
                { key: 'last_name', label: 'Apellido' },
                { key: 'email', label: 'Email' },
                { key: 'is_active', label: 'Estado' },
                { key: 'address', label: 'Dirección' },
                { key: 'phone', label: 'Teléfono' }
              ].map(({ key, label }) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-600 uppercase cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort(key)}
                >
                  <div className="flex items-center gap-2">
                    {label}
                    {ordering === key && (
                      <span>{isAsc ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                </td>
              </tr>
            ) : clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron clientes
                </td>
              </tr>
            ) : (
              clients.map((client, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{client.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${client.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {client.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{client.phone}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && clients.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {((currentPage - 1) * pageSize) + 1} a {Math.min(currentPage * pageSize, totalItems)} de {totalItems} resultados
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>

            {getPageNumbers().map(pageNum => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-1 border rounded hover:bg-gray-100 ${pageNum === currentPage ? 'bg-blue-500 text-white hover:bg-blue-600' : ''
                  }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;