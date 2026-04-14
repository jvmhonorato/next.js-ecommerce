import { getError } from '@/utils/error';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface LoginFormValues {
  email: string;
  password: string;
}

const validationSchema = Yup.object({
  email: Yup.string().email('Formato de email invalido').required('Email e obrigatorio'),
  password: Yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha e obrigatoria'),
});

const initialValues: LoginFormValues = {
  email: '',
  password: '',
};

const LoginScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect }: any = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, router, session]);

  const handleSubmit = async ({ email, password }: LoginFormValues) => {
    try {
      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Login realizado com sucesso');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <section className="pb-10">
      <div className="mx-auto max-w-md">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ isSubmitting }) => (
            <Form className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Bem-vindo de volta</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Entrar na conta</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Acesse sua conta para acompanhar pedidos e finalizar compras.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <Field
                    autoFocus
                    type="email"
                    id="email"
                    name="email"
                    placeholder="voce@exemplo.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-amber-400 dark:focus:ring-amber-500/20"
                  />
                  <ErrorMessage name="email" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Senha
                  </label>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-amber-400 dark:focus:ring-amber-500/20"
                  />
                  <ErrorMessage name="password" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
              >
                {isSubmitting ? 'Entrando...' : 'Entrar'}
              </button>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Ainda nao tem conta?
                <Link
                  className="ml-1 font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200"
                  href={`/register?redirect=${redirect || '/'}`}
                >
                  Criar conta
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default LoginScreen;
