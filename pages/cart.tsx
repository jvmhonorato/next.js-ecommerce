import { StoreContext } from '../utils/Store';
import React, { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiOutlineXCircle } from 'react-icons/hi';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import axios from 'axios';
import { toast } from 'react-toastify';

const CartScreen = () => {
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);
  const {
    cart: { cartItems },
  } = state;

  const removeItemHandler = (item: any) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: item });
    toast.info('Item removido do carrinho');
  };

  const updateCartHandler = async (item: any, qty: any) => {
    const quantity = Number(qty);
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      return toast.error('Desculpe. Produto fora de estoque');
    }
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...item, quantity } });
    toast.success('Carrinho atualizado');
  };

  const itemsCount = cartItems.reduce((a: any, c: any) => a + c.quantity, 0);
  const subtotal = cartItems.reduce((a: any, c: any) => a + c.quantity * c.price, 0);
  const subtotalFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(subtotal);

  return (
    <section className="pb-10">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Checkout</p>
        <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">Seu carrinho</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Revise seus produtos antes de finalizar a compra.
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Seu carrinho esta vazio</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Explore a vitrine e adicione os produtos que combinam com seu estilo.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
          >
            Continuar comprando
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <div className="hidden grid-cols-[1.8fr_1fr_1fr_auto] gap-3 border-b border-slate-200 px-6 py-4 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:border-slate-700 dark:text-slate-400 md:grid">
                <span>Produto</span>
                <span className="text-right">Quantidade</span>
                <span className="text-right">Total</span>
                <span className="text-right">Acao</span>
              </div>

              <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                {cartItems.map((item: any) => (
                  <li key={item.slug} className="p-4 md:px-6 md:py-5">
                    <div className="grid gap-4 md:grid-cols-[1.8fr_1fr_1fr_auto] md:items-center">
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
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            className="text-sm font-semibold text-slate-900 transition hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-300"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                            Preco unitario:{' '}
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            }).format(item.price)}
                          </p>
                        </div>
                      </div>

                      <div className="md:text-right">
                        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400 md:hidden">
                          Quantidade
                        </label>
                        <select
                          value={item.quantity}
                          onChange={(e) => updateCartHandler(item, e.target.value)}
                          className="w-24 border-slate-300 bg-white text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                        >
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option key={x + 1} value={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:text-right">
                        <label className="mb-1 block text-xs font-medium text-slate-500 dark:text-slate-400 md:hidden">
                          Total
                        </label>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(item.price * item.quantity)}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <button
                          onClick={() => removeItemHandler(item)}
                          className="inline-flex rounded-full border border-slate-300 p-2 text-slate-500 transition hover:border-red-300 hover:text-red-500 dark:border-slate-600 dark:text-slate-300 dark:hover:border-red-400 dark:hover:text-red-400"
                          aria-label={`Remover ${item.name}`}
                        >
                          <HiOutlineXCircle className="text-xl" />
                        </button>
                      </div>
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
                  <span>{itemsCount}</span>
                </div>
                <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  <span>Subtotal</span>
                  <span>{subtotalFormatted}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                  <span>Total</span>
                  <span>{subtotalFormatted}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/login?redirect=/shipping')}
                className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
              >
                Finalizar compra
              </button>

              <Link
                href="/"
                className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
              >
                Continuar comprando
              </Link>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default dynamic(() => Promise.resolve(CartScreen), { ssr: false });
