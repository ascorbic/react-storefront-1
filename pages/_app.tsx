import "styles/globals.css";

import { ApolloProvider } from "@apollo/client";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode } from "react";

import apolloClient from "@/lib/graphql";
import ChannelsProvider from "@/components/ChannelsProvider";
import React from "react";
import SaleorProviderWithChannels from "@/components/SaleorProviderWithChannels";

import apolloClient from "@/lib/graphql";

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page: ReactElement) => page);

  return (
    <ChannelsProvider>
      <ApolloProvider client={apolloClient}>
        <SaleorProviderWithChannels>
          {getLayout(<Component {...pageProps} />)}
        </SaleorProviderWithChannels>
      </ApolloProvider>
    </ChannelsProvider>
  );
};

export default MyApp;
