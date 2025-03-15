import Layout from "../components/Layout.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "./_middleware.ts";

export const handler: Handlers<any, State> = {
  GET(_req, ctx){
    return ctx.render({...ctx.state})
  }
}

export default function Home(props: PageProps){
  return(
    <Layout isLoggedIn = { props.data.token }>
      <div class="mt-10 px-5 mx-auto flex max-w-screen-md flex-col justify-center">
        {props.data.token ?
          (
            <div class="mx-auto text-center">
              <h1 class="text-2xl font-bold mb-5">Genial! Haz iniciado sesión</h1>
              <a href="/auth/secret" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Secret</a>
            </div>
          ) :
          (
            <div class="mx-auto text-center">
              <h1 class="text-2xl font-bold mb-5">Inicia sesión para acceder a todas las páginas</h1>
              <a href="/login" type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Login</a>
            </div>
          )
        }
      </div>
    </Layout>
  )
}