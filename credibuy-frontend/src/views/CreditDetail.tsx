import { useState, useEffect } from 'react';
import { detailCredit, FullCredit, markPaymentAs, Payment } from '../services/CreditService';
import { useParams } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';


const CreditDetail = () => {
    const [credit, setCredit] = useState<FullCredit | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        fetchCreditDetail();
    }, [id]);

    const fetchCreditDetail = async () => {
        try {
            const data = await detailCredit(parseInt(id!));
            setCredit(data);
        } catch (error) {
            console.error('Error fetching credit details:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(amount);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusColor = (status: Payment['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'delayed':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: Payment['status']) => {
        console.log(status);

        const statusMap = {
            completed: 'Completado',
            pending: 'Pendiente',
            delayed: 'Retrasado'
        };
        return statusMap[status];
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg">Cargando información del crédito...</div>
            </div>
        );
    }

    if (!credit) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-lg text-red-600">No se encontró el crédito</div>
            </div>
        );
    }

    const changePaid = async (payment: Payment) => {
        try {
            const op = payment.paid;
            if(confirm(`Estas seguro de marcar este pago como${op? ' no': ''} completado?`)){
                await markPaymentAs(payment.id, !op)
                alert("Operacion realizada exitosamente")
                await fetchCreditDetail();
            }
        } catch (error) {
            alert(error)
        }
        
    }

    const getValue = (payment: Payment): string => {
        if (payment.status === 'completed') return "-";
        if (payment.status === 'delayed') return formatCurrency(payment.value_delayed)
        return formatCurrency(payment.value)
    }

    const totalPaid = credit.payments
        .filter(payment => payment.status === 'completed')
        .reduce((sum, payment) => sum + payment.value, 0);
    
    const total= credit.payments
        .reduce((sum, payment) => sum + payment.value, 0);

    return (
        <div className="max-w-6xl mx-auto p-6">
            {/* Encabezado del crédito */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-2xl font-bold mb-2">Crédito #{credit.id}</h1>
                        <p className="text-gray-600">Cliente: {credit.client_name}</p>
                        <p className="text-gray-600">Producto: {credit.product_name}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm ${credit.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                        {credit.status === 'active' ? 'Activo' : 'Completado'}
                    </span>
                </div>

                {/* Información financiera */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Pagado</p>
                        <p className="text-xl font-semibold">{formatCurrency(totalPaid)}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600">Restante</p>
                        <p className="text-xl font-semibold">{formatCurrency(credit.debt)}</p>
                    </div>
                </div>

                {/* Barra de progreso */}
                <div className="mb-6">
                    <div className="h-2 w-full bg-gray-200 rounded-full">
                        <div
                            className="h-2 bg-blue-500 rounded-full"
                            style={{ width: `${(totalPaid / total) * 100}%` }}
                        />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Progreso: {((totalPaid / total) * 100).toFixed(1)}%
                    </p>
                </div>

                {/* Tabla de pagos */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold mb-4">Historial de Pagos</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Vencimiento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor a pagar</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {credit.payments.map((payment, idx) => (
                                    <tr key={payment.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{idx + 1}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(payment.due_to)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getValue(payment)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.status)}`}>
                                                {getStatusText(payment.status)}
                                            </span>
                                        </td>
                                        <td>

                                            <div className="flex space-x-2">
                                                {payment.status === 'completed' ? (
                                                    <button
                                                        onClick={() => changePaid(payment)}
                                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-full transition-colors duration-200 flex items-center"
                                                    >
                                                        Marcar como no pago
                                                        &nbsp;
                                                        <XCircle size={20} />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => changePaid(payment)}
                                                        className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-colors duration-200 flex items-center"
                                                    >
                                                        Marcar como pago
                                                        &nbsp;
                                                        <CheckCircle2 size={20} />
                                                    </button>
                                                )
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditDetail;