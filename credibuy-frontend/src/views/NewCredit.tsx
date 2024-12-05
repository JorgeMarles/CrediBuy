import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Client, listClientsCustom } from '../services/ClientService';
import { Product } from '../types/products';
import { listProductsCustom } from '../services/ProductService';
import { createCredit } from '../services/CreditService';


const NewCredit = () => {
    // States
    const [clientSearch, setClientSearch] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [payments, setPayments] = useState<number>(1);
    const [loading, setLoading] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
    };

    // Búsqueda de clientes
    const searchClients = async (query: string) => {
        if (query.length < 2) {
            setClients([]);
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('search', query);
            const data = await listClientsCustom(params.toString());
            console.log(data);

            setClients(data.results || []);
        } catch (error) {
            console.error('Error buscando clientes:', error);
        } finally {
            setLoading(false);
        }
    };

    // Búsqueda de productos
    const searchProducts = async (query: string) => {
        if (query.length < 2) {
            setProducts([]);
            return;
        }

        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('search', query);
            const data = await listProductsCustom(params.toString());
            setProducts(data.results || []);
        } catch (error) {
            console.error('Error buscando productos:', error);
        } finally {
            setLoading(false);
        }
    };

    // Asignar crédito
    const handleAssignCredit = async () => {
        if (!selectedClient || !selectedProduct) {
            alert('Por favor selecciona un cliente y un producto');
            return;
        }

        try {
            const response = await createCredit(selectedClient.id, selectedProduct.id,payments)

            if (response.status === 201) {
                alert('Crédito asignado exitosamente');
                // Resetear selecciones
                setSelectedClient(null);
                setSelectedProduct(null);
                setClientSearch('');
                setProductSearch('');
            } else {
                alert('Error al asignar el crédito');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al asignar el crédito');
        }
    };

    // Debounce para las búsquedas
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (clientSearch) searchClients(clientSearch);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [clientSearch]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (productSearch) searchProducts(productSearch);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [productSearch]);

    return (
        <div className="max-w-2xl mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Asignar Crédito</h1>

            {/* Búsqueda de Cliente */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Buscar Cliente
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Buscar por nombre, email o teléfono..."
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {clients.length > 0 && !selectedClient && (
                    <div className="mt-1 border rounded-lg shadow-lg bg-white">
                        {clients.map((client) => (
                            <div
                                key={client.id}
                                onClick={() => setSelectedClient(client)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <p className="font-medium">
                                    {client.first_name} {client.last_name}
                                </p>
                                <p className="text-sm text-gray-600">{client.email}</p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedClient && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">
                                    {selectedClient.first_name} {selectedClient.last_name}
                                </p>
                                <p className="text-sm text-gray-600">{selectedClient.email}</p>
                            </div>
                            <button
                                onClick={() => setSelectedClient(null)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Cambiar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Búsqueda de Producto */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Buscar Producto
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Buscar por nombre o tipo..."
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                {products.length > 0 && !selectedProduct && (
                    <div className="mt-1 border rounded-lg shadow-lg bg-white">
                        {products.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => setSelectedProduct(product)}
                                className="p-2 hover:bg-gray-100 cursor-pointer"
                            >
                                <p className="font-medium">{product.name}</p>
                                <p className="text-sm text-gray-600">
                                    {product.product_type_name} - {formatCurrency(product.price)}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {selectedProduct && (
                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="font-medium">{selectedProduct.name}</p>
                                <p className="text-sm text-gray-600">
                                    {selectedProduct.product_type_name} - {formatCurrency(selectedProduct.price)}
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                            >
                                Cambiar
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                    Cantidad de Pagos
                </label>
                <input
                    type="number"
                    min="1"
                    max="72"
                    value={payments}
                    onChange={(e) => setPayments(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Número de pagos"
                />
                <p className="text-sm text-gray-500">
                    Ingresa un número entre 1 y 72 pagos
                </p>
            </div>

            {/* Botón de Asignar */}
            <button
                onClick={handleAssignCredit}
                disabled={!selectedClient || !selectedProduct || loading}
                className={`w-full py-2 px-4 rounded-lg text-white font-medium
          ${!selectedClient || !selectedProduct || loading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
            >
                {loading ? 'Procesando...' : 'Asignar Crédito'}
            </button>
        </div>
    );
};

export default NewCredit;