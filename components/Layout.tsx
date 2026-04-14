import Head from 'next/head';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../utils/Store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signOut, useSession } from 'next-auth/react';
import { Menu } from '@headlessui/react';
import DropdownLink from './DropdownLink';
import Cookies from 'js-cookie';
import { BsInstagram, BsWhatsapp } from 'react-icons/bs';
import { FaCartArrowDown } from 'react-icons/fa';


const Layout = ({ title, children }: any) => {
  const { status, data: session }: any = useSession();
  const { state, dispatch } = useContext(StoreContext);
  const { cart } = state;
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    setCartItemsCount(cart.cartItems.reduce((a: any, c: any) => a + c.quantity, 0));
  }, [cart.cartItems]);

  const logoutClickHandler = () => {
    Cookies.remove('cart');
    dispatch({ type: 'CART_RESET' });
    signOut({ callbackUrl: '/login' });
  };

  return (
    <>
      <Head>
        <title>{title ? `${title} - Outfit Clothes` : 'Outfit Clothes'}</title>
        <meta name="description" content="store of clothes" />
        <link rel="icon" href="/ecommerce2.ico" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />

      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Outfit Store
              </Link>
              <p className="hidden rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 md:block">
                Moda premium e entrega rapida
              </p>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
             

              <Link
                href="/cart"
                className="relative rounded-full border border-slate-200 p-2 text-slate-700 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
                aria-label="Carrinho"
              >
                <FaCartArrowDown className="text-lg" />
                {cart.cartItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {status === 'loading' ? null : session?.user ? (
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300">
                    {session.user.name}
                  </Menu.Button>
                  <Menu.Items className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/profile">
                        Perfil
                      </DropdownLink>
                    </Menu.Item>
                    <Menu.Item>
                      <DropdownLink className="dropdown-link" href="/order-history">
                        Meus pedidos
                      </DropdownLink>
                    </Menu.Item>
                    {session.user.isAdmin && (
                      <Menu.Item>
                        <DropdownLink className="dropdown-link" href="/admin/dashboard">
                          Painel admin
                        </DropdownLink>
                      </Menu.Item>
                    )}
                    <Menu.Item>
                      <Link className="dropdown-link" href="/#" onClick={logoutClickHandler}>
                        Sair
                      </Link>
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              ) : (
                <Link
                  href="/login"
                  className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:text-slate-200 dark:hover:border-amber-400 dark:hover:text-amber-300"
                >
                  Entrar
                </Link>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-6 md:py-8">{children}</main>

        <footer className="border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-4 py-6 text-sm text-slate-600 dark:text-slate-300 md:flex-row md:items-center md:px-6">
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Outfit Store</p>
              <p>&copy; {new Date().getFullYear()} Todos os direitos reservados.</p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-300"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
              >
                <BsInstagram />
              </Link>
              <Link
                className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-amber-400 hover:text-amber-600 dark:border-slate-700 dark:text-slate-300 dark:hover:border-amber-400 dark:hover:text-amber-300"
                href="https://api.whatsapp.com/send?phone=5571999999999&text=Ol%C3%A1,%20gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20o%20produto"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
              >
                <BsWhatsapp />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
