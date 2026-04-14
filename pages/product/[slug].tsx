import Product from '@/models/Product';
import db from '@/utils/db';
import { StoreContext } from '@/utils/Store';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

const ProductScreen = (props: any) => {
  const { product } = props;
  const router = useRouter();
  const { state, dispatch } = useContext(StoreContext);

  if (!product) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
        Produto nao encontrado.
      </div>
    );
  }

  const addToCartHandler = async () => {
    const existItem = state.cart.cartItems.find((x: any) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Desculpe. Produto fora de estoque');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    router.push('/cart');
  };

  const price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <section className="pb-10">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700 transition hover:border-amber-400 hover:text-amber-700 dark:border-slate-600 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
        >
          Voltar para vitrine
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="relative bg-slate-100 dark:bg-slate-800">
              <Image
                src={product.image}
                alt={product.name}
                width={900}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
              <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800">
                {product.category}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">{product.brand}</p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{product.name}</h1>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{product.description}</p>

            <div className="mt-5 flex items-center gap-3">
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                {product.rating} de 5
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400">{product.numReviews} avaliacoes</span>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Preco</p>
                <p className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{price}</p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  product.countInStock > 0
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300'
                    : 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300'
                }`}
              >
                {product.countInStock > 0 ? 'Em estoque' : 'Indisponivel'}
              </span>
            </div>

            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li>Pagamento seguro e protegido</li>
              <li>Envio rapido para todo o Brasil</li>
              <li>Suporte dedicado para seu pedido</li>
            </ul>

            <button
              onClick={addToCartHandler}
              disabled={product.countInStock <= 0}
              className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
            >
              {product.countInStock > 0 ? 'Adicionar ao carrinho' : 'Produto indisponivel'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps(context: any) {
  const { params } = context;
  const { slug } = params;

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  return {
    props: {
      product: product ? db.convertDocToObj(product) : null,
    },
  };
}

export default ProductScreen;
