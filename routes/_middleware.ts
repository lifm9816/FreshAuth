// deno-lint-ignore-file no-explicit-any
import { MiddlewareHandlerContext } from "$fresh/server.ts"; // Importa el contexto del middleware en Fresh.
import { createClient, SupabaseClient } from "@supabase/supabase-js"; // Importa Supabase para gestionar la autenticación y la base de datos.
import { getCookies } from "$std/http/cookie.ts"; // Importa la función para obtener cookies de la petición HTTP.

/**
 * Interfaz que define el estado global que se pasará a las rutas de la aplicación.
 * - `token`: Almacena el token de sesión del usuario (si existe).
 * - `supabaseClient`: Cliente de Supabase para interactuar con la base de datos.
 */
export interface State {
  token: string | null;
  supabaseClient: SupabaseClient<any, "public", any>;
}

/**
 * Middleware que se ejecuta antes de cada petición.
 * - Inicializa el cliente de Supabase.
 * - Verifica si el usuario tiene una cookie de sesión (`supaLogin`).
 * - Si el usuario está autenticado, guarda su token en el estado.
 */
export async function handler(req: Request, ctx: MiddlewareHandlerContext<State>) {
  // Crea una instancia de Supabase usando las variables de entorno.
  const client = createClient(
    Deno.env.get("SUPABASE_URL") || "", // Obtiene la URL de Supabase desde las variables de entorno.
    Deno.env.get("SUPABASE_KEY") || "" // Obtiene la clave de la API desde las variables de entorno.
  );

  // Guarda el cliente de Supabase en el estado para que esté disponible en otras partes de la app.
  ctx.state.supabaseClient = client;

  // Obtiene la cookie de sesión del usuario.
  const supaCreds = getCookies(req.headers)["supaLogin"];

  // Si no hay credenciales en las cookies, permite que la petición continúe sin autenticación.
  if (!supaCreds) {
    return ctx.next();
  }

  // Verifica la autenticación del usuario con Supabase.
  const { error } = await client.auth.getUser(supaCreds);

  // Si hay un error en la autenticación, borra el token.
  if (error) {
    console.log(error.message);
    ctx.state.token = null;
  } else {
    // Si la autenticación es exitosa, almacena el token en el estado.
    ctx.state.token = supaCreds;
  }

  // Continúa con la ejecución de la petición.
  return await ctx.next();
}
