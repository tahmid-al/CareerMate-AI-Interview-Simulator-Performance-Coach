// components/Layout.tsx
import Head from "next/head";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>CareerMate</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <main className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 text-white min-h-screen overflow-hidden">
        <div id="particles-js" className="absolute inset-0 z-0"></div>
        <div className="relative z-10">{children}</div>
      </main>
    </>
  );
}
