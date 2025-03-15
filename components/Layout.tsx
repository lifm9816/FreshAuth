import { Head } from "$fresh/runtime.ts";
import type { ComponentChild } from "preact";
import Nav from "./Nav.tsx";

interface LayoutsProps {
    isLoggedIn: boolean;
    children: ComponentChild
}

export default function Layout(props: LayoutsProps){
    return (
        <>
        <Head>
            <title>Autenticación con Fresh</title>
        </Head>
        <Nav LoggedIn = { props.isLoggedIn } />
        <div class = "p-4 mx-auto max-w-screen-md">
            { props.children }
        </div>
        </>
    )
}