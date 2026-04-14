import CheckoutWizard from '@/components/CheckoutWizard'
import React, { useContext, useEffect, useState } from 'react'

import { useRouter } from 'next/router'
import { StoreContext } from '@/utils/Store';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

const PaymentScreen = () => {
    const [selectPaymentMethod, setSelectedPaymentMethod] = useState('');
    const { state, dispatch } = useContext(StoreContext);
    const { cart } = state;
    const { shippingAddress, paymentMethod } = cart;
    const router = useRouter();

    const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectPaymentMethod) {
           return toast.error('Selecione uma forma de pagamento');
        }
        dispatch({ type:'SAVE_PAYMENT_METHOD', payload: selectPaymentMethod});
        Cookies.set(
            'cart',
            JSON.stringify({
                ...cart,
                paymentMethod: selectPaymentMethod,
            })
         );
        router.push('/placeorder');
    };

    useEffect(() => {
        if (!shippingAddress?.address) {
          router.push('/shipping');
          return;
        }
        setSelectedPaymentMethod(paymentMethod || '');
    }, [paymentMethod, router, shippingAddress?.address]);
  return (
    <>
      <CheckoutWizard activeStep={2} />

      <form className='mx-auto max-w-3xl' onSubmit={submitHandler}>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8'>
          <p className='text-xs font-semibold uppercase tracking-wider text-amber-600'>Etapa 3 de 4</p>
          <h1 className='mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100'>Forma de pagamento</h1>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
            Escolha o metodo de pagamento para concluir seu pedido.
          </p>

          <div className='mt-6 space-y-3'>
            {[
              { id: 'PayPal', label: 'PayPal', description: 'Pagamento rapido e seguro com sua conta PayPal.' },
              { id: 'Stripe', label: 'Cartao via Stripe', description: 'Pague com cartao de credito ou debito.' },
              { id: 'CashOnDelivery', label: 'Pagamento na entrega', description: 'Disponivel para regioes selecionadas.' },
            ].map((payment) => (
              <label
                key={payment.id}
                htmlFor={payment.id}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                  selectPaymentMethod === payment.id
                    ? 'border-amber-400 bg-amber-50 dark:bg-amber-500/10'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <input
                  name='paymentMethod'
                  className='mt-1 h-4 w-4 border-slate-300 text-amber-500 focus:ring-amber-400 dark:border-slate-600'
                  id={payment.id}
                  type='radio'
                  checked={selectPaymentMethod === payment.id}
                  onChange={() => setSelectedPaymentMethod(payment.id)}
                />
                <div>
                  <p className='text-sm font-semibold text-slate-900 dark:text-slate-100'>{payment.label}</p>
                  <p className='text-xs text-slate-500 dark:text-slate-400'>{payment.description}</p>
                </div>
              </label>
            ))}
          </div>

          <div className='mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={() => router.push('/shipping')}
              className='rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300'
            >
              Voltar para entrega
            </button>
            <button
              className='rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400'
              type='submit'
            >
              Continuar para revisao
            </button>
          </div>
        </div>
      </form>
    </>
  
  );
};
PaymentScreen.auth = true;
export default PaymentScreen;
