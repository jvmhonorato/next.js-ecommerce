import Link from 'next/link';
import React from 'react';

const ProductItem = ({ product, addToCartHandler }: any) => {
  const price = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(product.price);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-slate-100">
          <img
            src={product.image}
            alt={product.name}
            className="h-72 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800">
            {product.category}
          </span>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{product.brand}</p>
          <Link href={`/product/${product.slug}`} className="mt-1 block text-lg font-semibold text-slate-900 transition hover:text-amber-600">
            {product.name}
          </Link>
          <p className="mt-2 max-h-10 overflow-hidden text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs text-slate-500">Preco</p>
            <p className="text-2xl font-bold text-slate-900">{price}</p>
          </div>
          <p className="text-sm font-medium text-amber-600">{product.rating} ★</p>
        </div>

        <button
          onClick={() => addToCartHandler(product)}
          className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900"
          type="button"
        >
          Adicionar ao carrinho
        </button>
      </div>
    </article>
  );
};

export default ProductItem;
