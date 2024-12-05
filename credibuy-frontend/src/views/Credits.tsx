import { useState, useEffect } from 'react';
import { Credit, CreditResponse, listCredits } from '../services/CreditService';
import { Link, useNavigate } from 'react-router-dom';


const Credits = () => {
  const [credits, setCredits] = useState<Credit[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [ordering, setOrdering] = useState('-debt');
  const pageSize = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCredits();
  }, [page, search, ordering]);

  const fetchCredits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
        ordering,
      });
      const data: CreditResponse<Credit> = await listCredits(params.toString());
      setCredits(data.results);
      setTotalPages(Math.ceil(data.count / pageSize));
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
    setLoading(false);
  };

  const handleSort = (field: string) => {
    setOrdering(ordering === field ? `-${field}` : field);
    setPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por cliente o estado..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-3/4 p-2 border rounded-lg"
        />
        <Link to='/credits/new'>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 mx-5 rounded shadow-lg transition duration-300 ease-in-out transform hover:scale-105">
            Nuevo Crédito
          </button>

        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th onClick={() => handleSort('id')} className="p-3 text-left cursor-pointer hover:bg-gray-200">
                ID {ordering === 'id' ? '↑' : ordering === '-id' ? '↓' : ''}
              </th>
              <th className="p-3 text-left">Cliente</th>
              <th className="p-3 text-left">Producto</th>
              <th onClick={() => handleSort('created_at')} className="p-3 text-left cursor-pointer hover:bg-gray-200">
                Fecha {ordering === 'created_at' ? '↑' : ordering === '-created_at' ? '↓' : ''}
              </th>
              <th className="p-3 text-left">Estado</th>
              <th onClick={() => handleSort('debt')} className="p-3 text-left cursor-pointer hover:bg-gray-200">
                Deuda {ordering === 'debt' ? '↑' : ordering === '-debt' ? '↓' : ''}
              </th>
              <th className="p-3 text-left">Pagos Totales</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center p-4">Cargando...</td>
              </tr>
            ) : credits.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center p-4">No se encontraron créditos</td>
              </tr>
            ) : (
              credits.map((credit) => (
                <tr key={credit.id} className="border-t hover:bg-gray-50 hover:cursor-pointer" onClick={() => navigate(`/credits/${credit.id}`)}>
                  <td className="p-3">{credit.id}</td>
                  <td className="p-3">{credit.client_name}</td>
                  <td className="p-3">{credit.product_name}</td>
                  <td className="p-3">{credit.created_at.toLocaleString()}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-sm ${credit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {credit.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                  </td>
                  <td className="p-3">{formatCurrency(credit.debt)}</td>
                  <td className="p-3">{credit.total_payments}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-600">
          Página {page} de {totalPages}
        </span>
        <div className="space-x-2">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Credits;