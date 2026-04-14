import { getError } from '@/utils/error';
import axios from 'axios';
import Link from 'next/link';
import React, { useEffect, useReducer } from 'react';

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, orders: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

const OrderHistoryScreen = () => {
  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    orders: [],
    error: '',
  });

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

  const formatBRL = (value: number) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get('/api/orders/history');
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchOrders();
  }, []);

  return (
    <section className="pb-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Minha conta</p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Historico de pedidos</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Acompanhe status, pagamento e entrega dos seus pedidos.
        </p>
      </div>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Carregando pedidos...
        </div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : orders.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Nenhum pedido encontrado</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Quando voce finalizar uma compra, ela aparecera aqui.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
          >
            Ir para a vitrine
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left">Pedido</th>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Pagamento</th>
                  <th className="px-4 py-3 text-left">Entrega</th>
                  <th className="px-4 py-3 text-right">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {orders.map((order: any) => (
                  <tr key={order._id} className="text-sm text-slate-700 dark:text-slate-200">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-slate-100">#{order._id.slice(-6)}</td>
                    <td className="px-4 py-4">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-4 font-semibold">{formatBRL(order.totalPrice)}</td>
                    <td className="px-4 py-4">
                      {order.isPaid ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-300">
                          Pago em {formatDate(order.paidAt)}
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                          Pendente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {order.isDelivered ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-500/20 dark:text-green-300">
                          Entregue em {formatDate(order.deliveredAt)}
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                          Em preparo
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <Link
                        href={`/order/${order._id}`}
                        className="inline-flex rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
                      >
                        Ver detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

OrderHistoryScreen.auth = true;
export default OrderHistoryScreen;
