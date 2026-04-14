import CheckoutWizard from '@/components/CheckoutWizard'
import { getError } from '@/utils/error'
import { StoreContext } from '@/utils/Store'
import axios from 'axios'
import Cookies from 'js-cookie'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const PlaceorderScreen = () => {
    const { state, dispatch } = useContext(StoreContext)
    const { cart } = state
    const { cartItems, shippingAddress, paymentMethod } = cart
    const round2 = (num: any) => Math.round(num * 100 + Number.EPSILON) / 100
    const router = useRouter()

    const itemsPrice = round2(cartItems.reduce((a: any, c: any) => a + c.quantity * c.price, 0))
    const shippingPrice = itemsPrice > 200 ? 0 : 15
    const taxPrice = round2(itemsPrice * 0.15)
    const totalPrice = round2(itemsPrice + shippingPrice + taxPrice)

    const formatBRL = (value: number) =>
      new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)

    useEffect(() => {
        if (!paymentMethod) {
            router.push('/payment')
        }
    }, [paymentMethod, router])

    const [loading, setLoading] = useState(false)

    const placeOrderHandler = async () => {
        try {
            setLoading(true)
            const { data } = await axios.post('/api/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            })
            setLoading(false)
            dispatch({ type: 'CART_CLEAR_ITEMS' })
            Cookies.set(
                'cart',
                JSON.stringify({
                    ...cart,
                    cartItems: [],
                })
            )
            router.push(`/order/${data._id}`)
        } catch (err) {
            setLoading(false)
            toast.error(getError(err))
        }
    }

    return (
      <>
        <CheckoutWizard activeStep={3} />

        <section className="pb-10">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Etapa 4 de 4</p>
            <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Revisar e confirmar pedido</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Confira as informacoes abaixo antes de finalizar a compra.
            </p>
          </div>

          {cartItems.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Seu carrinho esta vazio</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Adicione produtos para concluir um pedido.</p>
              <Link
                href="/"
                className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
              >
                Ir para a vitrine
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-12">
              <div className="space-y-6 lg:col-span-8">
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Endereco de entrega</h2>
                    <Link href="/shipping" className="text-sm font-semibold text-amber-600 hover:text-amber-500">
                      Editar
                    </Link>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
                    {shippingAddress.fullName}, {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.cep},{' '}
                    {shippingAddress.country}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pagamento</h2>
                    <Link href="/payment" className="text-sm font-semibold text-amber-600 hover:text-amber-500">
                      Editar
                    </Link>
                  </div>
                  <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{paymentMethod}</p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 dark:border-slate-700">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Itens do pedido</h2>
                    <Link href="/cart" className="text-sm font-semibold text-amber-600 hover:text-amber-500">
                      Editar
                    </Link>
                  </div>

                  <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {cartItems.map((item: any) => (
                      <li key={item.slug} className="p-4 md:px-6 md:py-5">
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
                            <div>
                              <Link
                                href={`/product/${item.slug}`}
                                className="text-sm font-semibold text-slate-900 transition hover:text-amber-600 dark:text-slate-100 dark:hover:text-amber-300"
                              >
                                {item.name}
                              </Link>
                              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                Unitario: {formatBRL(item.price)}
                              </p>
                            </div>
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
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Resumo</h2>
                  <div className="mt-5 space-y-3 text-sm">
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Itens</span>
                      <span>{formatBRL(itemsPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                      <span>Frete</span>
                      <span>{shippingPrice === 0 ? 'Gratis' : formatBRL(shippingPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-slate-600 dark:border-slate-700 dark:text-slate-300">
                      <span>Impostos</span>
                      <span>{formatBRL(taxPrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-bold text-slate-900 dark:text-slate-100">
                      <span>Total</span>
                      <span>{formatBRL(totalPrice)}</span>
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    onClick={placeOrderHandler}
                    className="mt-6 w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
                  >
                    {loading ? 'Finalizando...' : 'Confirmar pedido'}
                  </button>
                </div>
              </aside>
            </div>
          )}
        </section>
      </>
    )
}
PlaceorderScreen.auth = true
export default PlaceorderScreen
