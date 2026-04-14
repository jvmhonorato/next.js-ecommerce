import ProductItem from '@/components/ProductItem';
import Product from '@/models/Product';
import db from '@/utils/db';
import { StoreContext } from '@/utils/Store';
import axios from 'axios';
import Link from 'next/link';
import React, { useContext, useMemo } from 'react';
import { toast } from 'react-toastify';

const Home = ({ products }: { products: any[] }) => {
  const { state, dispatch } = useContext(StoreContext);
  const { cart } = state;

  const addToCartHandler = async (product: any) => {
    const existItem = cart.cartItems.find((x: any) => x.slug === product.slug);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);

    if (data.countInStock < quantity) {
      return toast.error('Desculpe. Produto fora de estoque.');
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    toast.success('Produto adicionado ao carrinho');
  };

  const categories = useMemo(() => {
    return Array.from(new Set(products.map((product) => product.category)));
  }, [products]);

  const topRated = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
  }, [products]);

  return (
    <div className="pb-16">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-amber-700 px-6 py-10 text-white shadow-xl md:px-12 md:py-14">
        <div className="absolute -right-20 -top-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute -bottom-20 left-8 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest">
              Colecao Premium 2026
            </p>
            <h1 className="max-w-xl text-3xl font-extrabold leading-tight md:text-5xl">
              Seu estilo em destaque com uma experiencia de compra profissional
            </h1>
            <p className="mt-4 max-w-lg text-sm text-slate-100 md:text-base">
              Descubra pecas selecionadas com qualidade, entrega rapida e uma jornada simples para comprar com seguranca.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="#vitrine"
                className="rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-amber-300"
              >
                Ver produtos
              </Link>
              <Link
                href="/cart"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Ir para o carrinho
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">+1200</p>
              <p className="mt-1 text-sm text-slate-100">Clientes satisfeitos</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">48h</p>
              <p className="mt-1 text-sm text-slate-100">Envio para todo Brasil</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">98%</p>
              <p className="mt-1 text-sm text-slate-100">Avaliacao positiva</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-3xl font-bold">24/7</p>
              <p className="mt-1 text-sm text-slate-100">Suporte online</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Categorias em alta</h2>
            <p className="text-sm text-slate-500">Navegue rapido pelas secoes mais buscadas.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <span
                key={category}
                className="rounded-full border border-slate-300 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Mais avaliados</h2>
          <span className="text-sm font-medium text-slate-500">Selecao especial da semana</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {topRated.map((product) => (
            <div key={`featured-${product.slug}`} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-600">Top produto</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{product.name}</p>
              <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
              <p className="mt-3 text-sm font-medium text-slate-700">Nota {product.rating} / 5</p>
            </div>
          ))}
        </div>
      </section>

      <section id="vitrine" className="mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Nossa vitrine</h2>
          <p className="text-sm text-slate-500">{products.length} produtos disponiveis</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product: any) => (
            <ProductItem addToCartHandler={addToCartHandler} product={product} key={product.slug} />
          ))}
        </div>
      </section>
    </div>
  );
};

export async function getServerSideProps() {
  await db.connect();
  const products = await Product.find().lean();
  return {
    props: {
      products: products.map(db.convertDocToObj),
    },
  };
}

export default Home;
