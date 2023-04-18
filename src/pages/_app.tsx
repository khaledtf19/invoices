import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Layout from "../container/Layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session} refetchOnWindowFocus={true}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Toaster position="bottom-center" />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
