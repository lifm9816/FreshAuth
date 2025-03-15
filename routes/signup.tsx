// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";

// Define el handler para manejar la solicitud POST del formulario de registro
export const handler: Handlers<any, State> = {
  async POST(req, ctx) {
    // Obtiene los datos del formulario enviado por el usuario
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // Intenta registrar al usuario con Supabase
    const { error } = await ctx.state.supabaseClient.auth.signUp({ email, password });

    // Configura los encabezados para la redirección
    const headers = new Headers();
    let redirect = "/";
    
    // Si hay un error, redirige a la página de registro con el mensaje de error en la URL
    if (error) {
      redirect = `/signup?error=${error.message}`;
    }
    
    headers.set("location", redirect);
    return new Response(null, {
      status: 303, // Redirección con estado 303 (See Other)
      headers,
    });
  }
};

// Componente para la página de registro
export default function SignUp(props: PageProps) {
  // Obtiene el parámetro de error de la URL si existe
  const err = props.url.searchParams.get("error");

  return (
    <section class="bg-blue-950">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="mx-auto">
          <h2 class="text-white text-2xl font-bold mb-5 text-center">Crear cuenta</h2>
        </div>

        {/* Contenedor del formulario */}
        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            {/* Muestra el mensaje de error si existe */}
            {err && (
              <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
              </div>
            )}
            
            {/* Formulario de registro */}
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
                  required
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
                  required
                />
              </div>

              {/* Botón de enviar */}
              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Crear cuenta
              </button>
              
              {/* Enlace para iniciar sesión si ya tiene una cuenta */}
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Ya tienes una cuenta?{" "}
                <a
                  href="/Login"
                  class="font-medium text-blue-600 hover:underline dark:text-blue-500"
                >
                  Inicia sesión
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
