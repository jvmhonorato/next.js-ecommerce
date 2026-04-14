import { getError } from '@/utils/error';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

type FormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const ProfileScreen = () => {
  const { data: session } = useSession();
  const {
    handleSubmit,
    register,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  useEffect(() => {
    setValue('name', session?.user?.name ?? '');
    setValue('email', session?.user?.email ?? '');
  }, [session?.user, setValue]);

  const submitHandler = async ({ name, email, password }: FormValues) => {
    try {
      await axios.put('/api/auth/update', {
        name,
        email,
        password,
      });

      // Re-authenticate only when password was changed.
      if (password) {
        const result = await signIn('credentials', {
          redirect: false,
          email,
          password,
        });
        if (result?.error) {
          toast.error(result.error);
          return;
        }
      }

      toast.success('Perfil atualizado com sucesso');
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <section className="pb-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-600">Minha conta</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Atualizar perfil</h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Mantenha seus dados atualizados para uma experiencia de compra mais rapida.
          </p>
        </div>

        <form
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8"
          onSubmit={handleSubmit(submitHandler)}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Nome
              </label>
              <input
                type="text"
                className="w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                id="name"
                autoFocus
                {...register('name', {
                  required: 'Informe seu nome',
                  minLength: { value: 3, message: 'Nome deve ter ao menos 3 caracteres' },
                })}
              />
              {errors.name && <div className="mt-1 text-sm text-red-500">{errors.name.message}</div>}
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                type="email"
                className="w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                id="email"
                {...register('email', {
                  required: 'Informe seu email',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/i,
                    message: 'Informe um email valido',
                  },
                })}
              />
              {errors.email && <div className="mt-1 text-sm text-red-500">{errors.email.message}</div>}
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Nova senha
              </label>
              <input
                className="w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                type="password"
                id="password"
                placeholder="Deixe em branco para manter a senha atual"
                {...register('password', {
                  minLength: { value: 6, message: 'Senha deve ter ao menos 6 caracteres' },
                })}
              />
              {errors.password && <div className="mt-1 text-sm text-red-500">{errors.password.message}</div>}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirmar nova senha
              </label>
              <input
                className="w-full border-slate-300 bg-white text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  validate: (value) =>
                    !getValues('password') || value === getValues('password') || 'As senhas nao conferem',
                })}
              />
              {errors.confirmPassword && (
                <div className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</div>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-amber-500 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-amber-400"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar alteracoes'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

ProfileScreen.auth = true;
export default ProfileScreen;
