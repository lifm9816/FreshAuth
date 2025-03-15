// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { setCookie } from "$std/http/cookie.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
  
  async POST(req, ctx) {
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    const {data, error} = await ctx.state.supabaseClient.auth.signInWithPassword({email, password});

    const headers = new Headers();

    if (data.session) {
      setCookie(headers, {
        name: 'supaLogin',
        value: data.session?.access_token,
        maxAge: data.session.expires_in
      })
    }
    
    let redirect = "/"
    if (error) {
      redirect = `/login?error=${error.message}`
    }
    
    headers.set("location", redirect);
    return new Response(null, {
      status: 303,
      headers,
    });
  }
}

export default function login(props: PageProps) {
  const err = props.url.searchParams.get("error");

  return (
    <section class="bg-blue-950">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="mx-auto">
          <h2 class="text-white text-2xl font-bold mb-5 text-center">
            Iniciar sesión
          </h2>
        </div>

        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {err && (
              <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
              </div>
            )}
            <form class="space-y-4 md:space-y-6" method="POST">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Iniciar sesión
              </button>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Aún no tienes una cuenta?{" "}
                <a
                  href="/signup"
                  class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Regístrate
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
