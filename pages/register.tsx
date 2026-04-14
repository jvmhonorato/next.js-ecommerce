import { getError } from '@/utils/error';
import axios from 'axios';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  confirmpassword: string;
}

const validationSchema = Yup.object({
  name: Yup.string().min(3, 'Nome deve ter pelo menos 3 caracteres').required('Nome e obrigatorio'),
  email: Yup.string().email('Formato de email invalido').required('Email e obrigatorio'),
  password: Yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres').required('Senha e obrigatoria'),
  confirmpassword: Yup.string()
    .oneOf([Yup.ref('password')], 'As senhas nao conferem')
    .required('Confirme sua senha'),
});

const initialValues: RegisterFormValues = {
  name: '',
  email: '',
  password: '',
  confirmpassword: '',
};

const RegisterScreen = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { redirect }: any = router.query;

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [redirect, router, session]);

  const handleSubmit = async ({ name, email, password }: RegisterFormValues) => {
    try {
      await axios.post('/api/auth/signup', { name, email, password });

      const result: any = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success('Conta criada com sucesso');
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
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Bem-vindo</p>
              <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Criar conta</h1>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                Cadastre-se para acompanhar pedidos e finalizar compras mais rapido.
              </p>

              <div className="mt-6 space-y-4">
                <div>
                  <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Nome
                  </label>
                  <Field
                    autoFocus
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Seu nome"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-amber-400 dark:focus:ring-amber-500/20"
                  />
                  <ErrorMessage name="name" component="div" className="mt-1 text-sm text-red-500" />
                </div>

                <div>
                  <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <Field
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

                <div>
                  <label
                    htmlFor="confirmpassword"
                    className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    Confirmar senha
                  </label>
                  <Field
                    type="password"
                    id="confirmpassword"
                    name="confirmpassword"
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-amber-400 dark:focus:ring-amber-500/20"
                  />
                  <ErrorMessage name="confirmpassword" component="div" className="mt-1 text-sm text-red-500" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
              >
                {isSubmitting ? 'Criando conta...' : 'Criar conta'}
              </button>

              <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-300">
                Ja tem uma conta?
                <Link
                  className="ml-1 font-semibold text-amber-600 hover:text-amber-500 dark:text-amber-300 dark:hover:text-amber-200"
                  href={`/login?redirect=${redirect || '/'}`}
                >
                  Entrar
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </section>
  );
};

export default RegisterScreen;
