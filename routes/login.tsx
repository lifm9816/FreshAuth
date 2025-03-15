// deno-lint-ignore-file no-explicit-any
import { Handlers, PageProps } from "$fresh/server.ts"; // Importa las interfaces necesarias para manejar peticiones en Fresh.
import { setCookie } from "$std/http/cookie.ts"; // Importa la función para establecer cookies en la respuesta HTTP.
import { State } from "./_middleware.ts"; // Importa el estado global definido en el middleware.

/**
 * Manejador de solicitudes HTTP para la página de inicio de sesión.
 * - Maneja solicitudes `POST` para autenticar al usuario con Supabase.
 * - Guarda el token de sesión en una cookie si la autenticación es exitosa.
 * - Redirige al usuario dependiendo del resultado de la autenticación.
 */
export const handler: Handlers<any, State> = {
  
  async POST(req, ctx) {
    // Obtiene los datos del formulario enviado en la solicitud.
    const form = await req.formData();
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    // Autentica al usuario con Supabase usando email y contraseña.
    const { data, error } = await ctx.state.supabaseClient.auth.signInWithPassword({ email, password });

    // Inicializa los encabezados de la respuesta.
    const headers = new Headers();

    // Si la autenticación es exitosa, almacena el token en una cookie.
    if (data.session) {
      setCookie(headers, {
        name: "supaLogin", // Nombre de la cookie
        value: data.session.access_token, // Token de sesión
        maxAge: data.session.expires_in, // Duración de la sesión en segundos
      });
    }

    // Define la URL de redirección después del intento de inicio de sesión.
    let redirect = "/";
    if (error) {
      // Si hay un error, redirige a la página de login con el mensaje de error en la URL.
      redirect = `/login?error=${encodeURIComponent(error.message)}`;
    }

    // Establece la ubicación de redirección en los encabezados.
    headers.set("location", redirect);
    
    // Devuelve una respuesta con código 303 (See Other) para redirigir al usuario.
    return new Response(null, {
      status: 303,
      headers,
    });
  },
};

/**
 * Componente de la página de inicio de sesión.
 * - Muestra un formulario donde los usuarios ingresan su correo y contraseña.
 * - Si hay un error en la autenticación, lo muestra en pantalla.
 */
export default function login(props: PageProps) {
  // Obtiene el parámetro de error desde la URL.
  const err = props.url.searchParams.get("error");

  return (
    <section class="bg-blue-950">
      <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div class="mx-auto">
          <h2 class="text-white text-2xl font-bold mb-5 text-center">
            Iniciar sesión
          </h2>
        </div>

        {/* Contenedor del formulario */}
        <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
            
            {/* Si hay un error, se muestra un mensaje de alerta */}
            {err && (
              <div class="bg-red-400 border-l-4 p-4" role="alert">
                <p class="font-bold">Error</p>
                <p>{err}</p>
              </div>
            )}
            
            {/* Formulario de inicio de sesión */}
            <form class="space-y-4 md:space-y-6" method="POST">
              <div>
                <label for="email" class="block mb-2 text-sm font-medium">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  class="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                  placeholder="correo@ejemplo.com"
                />
              </div>
              <div>
                <label for="password" class="block mb-2 text-sm font-medium">
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  class="border border-gray-300 sm:text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5"
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                class="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Iniciar sesión
              </button>

              {/* Enlace de registro */}
              <p class="text-sm font-light text-gray-500">
                ¿Aún no tienes una cuenta?{" "}
                <a href="/signup" class="font-medium text-blue-600 hover:underline">
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
