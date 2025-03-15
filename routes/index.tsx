import Layout from "../components/Layout.tsx"; // Importa el componente Layout, que define la estructura de la página.
import { Handlers, PageProps } from "$fresh/server.ts"; // Importa tipos de Fresh para manejar peticiones y props de la página.
import { State } from "./_middleware.ts"; // Importa el estado definido en el middleware.

/**
 * Handler para la petición GET de la página.
 * - `ctx.state` contiene datos del middleware (ej. autenticación).
 * - `ctx.render()` pasa esos datos a la página.
 */
export const handler: Handlers<any, State> = {
  GET(_req, ctx) {
    return ctx.render({ ...ctx.state }); // Renderiza la página con los datos del estado.
  },
};

/**
 * Componente principal de la página de inicio.
 * - Recibe `props` con la información renderizada por el handler.
 * - Muestra diferentes mensajes dependiendo de si el usuario ha iniciado sesión.
 */
export default function Home(props: PageProps) {
  return (
    <Layout isLoggedIn={props.data.token}> {/* Pasa la autenticación al layout */}
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        {props.data.token ? ( // Si hay un token, significa que el usuario está autenticado.
          <div class="mx-auto text-center">
            <h1 class="text-2xl font-bold mb-5">Genial! Haz iniciado sesión</h1>
            <a 
              href="/auth/secret" 
              type="button" 
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Secret
            </a>
          </div>
        ) : ( // Si no hay token, muestra el mensaje de inicio de sesión.
          <div class="mx-auto text-center">
            <h1 class="text-2xl font-bold mb-5">Inicia sesión para acceder a todas las páginas</h1>
            <a 
              href="/login" 
              type="button" 
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
              Login
            </a>
          </div>
        )}
      </div>
    </Layout>
  );
}
