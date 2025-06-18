import "../styles/globals.css";
import Layout from "../components/Layout";
import { useRouter } from "next/router";

export default function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  // Don't use Layout on the homepage
  if (pathname === "/") {
    return <Component {...pageProps} />;
  }

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}