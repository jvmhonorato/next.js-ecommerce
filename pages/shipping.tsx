import CheckoutWizard from '@/components/CheckoutWizard'
import { StoreContext } from '@/utils/Store';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react'
import { useForm } from 'react-hook-form'

type FormValues = {
    fullName: string;
    address: string;
    city: string;
    cep: string;
    country: string;
  };

const ShippingScreen = () => {
    const router = useRouter();
    const {state, dispatch } = useContext(StoreContext);
    const { cart } = state;
    const { shippingAddress } = cart;

    const { handleSubmit, register, formState: {errors}, setValue} = useForm<FormValues>();


    useEffect(()=> {
        setValue('fullName',shippingAddress.fullName);
        setValue('address',shippingAddress.address);
        setValue('city',shippingAddress.city);
        setValue('cep',shippingAddress.cep);
        setValue('country',shippingAddress.country);
    },[setValue, shippingAddress]);

    const submitHandler = async ({fullName, address, city, cep, country}:FormValues ) => {
        dispatch({
            type: 'SAVE_SHIPPING_ADDRESS',
            payload: { fullName, address, city, cep, country },
        });
        Cookies.set('cart',JSON.stringify({
            ...cart
            ,shippingAddress: {
                fullName,
                address,
                city,
                cep,
                country
                

            },
        }));
        router.push('/payment');
        
    };
  return (
    <>
      <CheckoutWizard activeStep={1}/>
      <form className='mx-auto max-w-3xl' onSubmit={handleSubmit(submitHandler)}>
        <div className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8'>
          <p className='text-xs font-semibold uppercase tracking-wider text-amber-600'>Etapa 2 de 4</p>
          <h1 className='mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100'>Endereco de entrega</h1>
          <p className='mt-2 text-sm text-slate-500 dark:text-slate-400'>
            Informe seus dados para calcular envio e continuar o checkout.
          </p>

          <div className='mt-6 grid gap-4 md:grid-cols-2'>
            <div className='md:col-span-2'>
              <label htmlFor='fullName' className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Nome completo
              </label>
              <input
                id='fullName'
                type='text'
                className='w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                {...register('fullName', { required: true, minLength: 3 })}
              />
              {errors.fullName && <span className='mt-1 block text-sm text-red-500'>Informe seu nome completo (minimo de 3 caracteres).</span>}
            </div>

            <div className='md:col-span-2'>
              <label htmlFor='address' className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Endereco
              </label>
              <input
                id='address'
                type='text'
                className='w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                {...register('address', { required: true, minLength: 3 })}
              />
              {errors.address && <span className='mt-1 block text-sm text-red-500'>Informe um endereco valido (minimo de 3 caracteres).</span>}
            </div>

            <div>
              <label htmlFor='city' className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Cidade
              </label>
              <input
                id='city'
                type='text'
                className='w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                {...register('city', { required: true })}
              />
              {errors.city && <span className='mt-1 block text-sm text-red-500'>Informe a cidade.</span>}
            </div>

            <div>
              <label htmlFor='cep' className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                CEP
              </label>
              <input
                id='cep'
                type='text'
                inputMode='numeric'
                placeholder='00000-000'
                className='w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                {...register('cep', { required: true, pattern: /^[0-9]{5}(?:-[0-9]{3})?$/i })}
              />
              {errors.cep && <span className='mt-1 block text-sm text-red-500'>Use o formato 00000-000.</span>}
            </div>

            <div className='md:col-span-2'>
              <label htmlFor='country' className='mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300'>
                Pais
              </label>
              <input
                id='country'
                type='text'
                className='w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'
                {...register('country', { required: true })}
              />
              {errors.country && <span className='mt-1 block text-sm text-red-500'>Informe o pais.</span>}
            </div>
          </div>

          <div className='mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end'>
            <button
              type='button'
              onClick={() => router.push('/cart')}
              className='rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300'
            >
              Voltar ao carrinho
            </button>
            <button
              className='rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400'
              type='submit'
            >
              Continuar para pagamento
            </button>
          </div>
        </div>
      </form>
    </>
  )
}

ShippingScreen.auth = true;
export default ShippingScreen
