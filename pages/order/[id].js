import { getError } from '@/utils/error';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useReducer } from 'react';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true, errorPay: '' };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false, errorPay: action.payload };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false, errorPay: '' };
    default:
      return state;
  }
};

const OrderScreen = () => {
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const { query } = useRouter();
  const orderId = query.id;

  const [{ loading, error, order, successPay, loadingPay, errorPay }, dispatch] = useReducer(reducer, {
    loading: true,
    order: {},
    error: '',
    loadingPay: false,
    successPay: false,
    errorPay: '',
  });

  const formatBRL = (value) =>
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value || 0);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (successPay) {
      dispatch({ type: 'PAY_RESET' });
      fetchOrder();
      return;
    }

    if (!order._id || order._id !== orderId) {
      fetchOrder();
      return;
    }

    if (!order.isPaid) {
      const loadPayPalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal');
        paypalDispatch({
          type: 'resetOptions',
          value: {
            'client-id': clientId,
            currency: 'BRL',
          },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPayPalScript();
    }
  }, [order._id, order.isPaid, orderId, paypalDispatch, successPay]);

  const createOrder = (data, actions) => {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice?.toString() || '0' },
          },
        ],
      })
      .then((id) => id);
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data: paidOrder } = await axios.put(`/api/orders/${order._id}/pay`, details);
        dispatch({ type: 'PAY_SUCCESS', payload: paidOrder });
        toast.success('Pagamento confirmado com sucesso');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  };

  const onError = (err) => {
    dispatch({ type: 'PAY_FAIL', payload: getError(err) });
    toast.error('Falha ao iniciar pagamento');
  };

  return (
    <section className="pb-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">{`Pedido ${orderId}`}</h1>

      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
          Carregando pedido...
        </div>
      ) : error ? (
        <div className="alert-error">{error}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Entrega</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                {order.shippingAddress.fullName}, {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.cep}, {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="alert-success mt-4">Entregue em {order.deliveredAt}</div>
              ) : (
                <div className="alert-error mt-4">Ainda nao entregue</div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pagamento</h2>
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{order.paymentMethod}</p>
              {order.isPaid ? (
                <div className="alert-success mt-4">Pago em {order.paidAt}</div>
              ) : (
                <div className="alert-error mt-4">Pagamento pendente</div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Itens do pedido</h2>
              </div>

              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {order.orderItems.map((item) => (
                  <li key={item._id || item.slug} className="p-4 md:px-6 md:py-5">
                    <div className="grid gap-4 md:grid-cols-[1.8fr_1fr_1fr] md:items-center">
                      <div className="flex items-center gap-4">
                        <Link href={`/product/${item.slug}`} className="shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={88}
                            height={88}
                            className="h-20 w-20 rounded-xl object-cover"
                          />
                        </Link>
                        <Link
                          href={`/product/${item.slug}`}
                          className="text-sm font-semibold text-slate-900 transition hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-300"
                        >
                          {item.name}
                        </Link>
                      </div>
                      <p className="text-sm text-slate-700 dark:text-slate-200 md:text-right">Qtd: {item.quantity}</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 md:text-right">
                        {formatBRL(item.quantity * item.price)}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Resumo do pedido</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Itens</span>
                  <span>{formatBRL(order.itemsPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Frete</span>
                  <span>{formatBRL(order.shippingPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span>Impostos</span>
                  <span>{formatBRL(order.taxPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-900 dark:border-slate-700 dark:text-slate-100">
                  <span>Total</span>
                  <span>{formatBRL(order.totalPrice)}</span>
                </div>
              </div>

              {!order.isPaid && (
                <div className="mt-6">
                  {isPending ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">Carregando PayPal...</div>
                  ) : (
                    <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError} />
                  )}
                  {loadingPay && <div className="mt-3 text-sm text-slate-500 dark:text-slate-400">Processando pagamento...</div>}
                  {errorPay && <div className="alert-error mt-3">{errorPay}</div>}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

OrderScreen.auth = true;
export default OrderScreen;
