import { ApolloQueryResult } from "@apollo/client";
import { GetStaticPropsContext, InferGetStaticPropsType } from "next";
import React, { ReactElement } from "react";

import { HomepageBlock, Layout } from "@/components";
import BaseSeo from "@/components/seo/BaseSeo";
import apolloClient from "@/lib/graphql";
import { MenuQuery, MenuQueryDocument, useMainMenuQuery } from "@/saleor/api";
import Link from "next/link";
import useChannels from "@/components/ChannelsProvider/useChannels";
import { useExternalObtainAccessTokensMutation } from "@saleor/sdk/dist/apollo/types";

const Home = ({ menuData }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <>
      <BaseSeo />
      <div className="py-10">
        <header className="mb-4">
          <div className="max-w-7xl mx-auto px-8"></div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto px-8">
            {menuData?.menu?.items?.map((m) => {
              if (!!m) return <HomepageBlock key={m?.id} menuItem={m} />;
            })}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;

export const getStaticPaths = async () => {
  const result: ApolloQueryResult<MenuQuery | undefined> =
    await apolloClient.query({
      query: MenuQueryDocument,
      variables: { slug: "homepage" },
    });

  const paths =
    result.data?.menu?.items?.map(({ page, category, collection }) => {
      return {
        params: {
          slug: category?.slug || collection?.slug || page?.slug,
          channel: "default-channel",
          locale: "pln-pln",
        },
      };
    }) || [];

  return {
    paths: paths,
    fallback: true,
  };
};

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const result: ApolloQueryResult<MenuQuery | undefined> =
    await apolloClient.query({
      query: MenuQueryDocument,
      variables: { slug: "homepage" },
    });
  return {
    props: {
      menuData: result?.data,
    },
    revalidate: 60 * 60, // value in seconds, how often ISR will trigger on the server
  };
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
