import { channels } from "@/components/ChannelsProvider/channelsConfig";
import { Channel } from "@/components/ChannelsProvider/types";
import { locales } from "@/components/LocaleSelectDialog/locales";
import apolloClient from "@/lib/graphql";
import {
  ProductDetailsFragment,
  ProductPathsDocument,
  ProductPathsQuery,
} from "@/saleor/api";
import { ApolloQueryResult } from "@apollo/client";
import { mapEdgesToItems } from "@/components/utils/paths";

interface ProductPath {
  channel: string;
  slug: string;
  locale: string;
}

const getAllProductsPerChannel = async ({ slug }: Channel) => {
  let products: ProductDetailsFragment[] = [];
  let hasMore = true;

  while (hasMore) {
    // why doesnt the type work out of the box??

    // const result: ApolloQueryResult<ProductPathsQuery | undefined> =
    const result: ApolloQueryResult<ProductPathsQuery | undefined> =
      await apolloClient.query({
        query: ProductPathsDocument,
        variables: {
          channel: slug,
        },
      });

    hasMore = result.data?.products?.pageInfo?.hasNextPage || false;

    // @ts-ignore
    const moreProducts = mapEdgesToItems(result.data?.products) || [];

    // @ts-ignore
    products = [...products, ...moreProducts];
  }

  return { products, channel: slug };
};

export const generateProductPaths = async () => {
  const productsDataPerChannel = await Promise.all(
    channels.map(getAllProductsPerChannel)
  );

  const pathsWithChannels = productsDataPerChannel.reduce(
    (result, { products, channel }) => [
      ...result,
      ...products.map(({ slug }) => ({ slug, channel })),
    ],
    [] as Pick<ProductPath, "channel" | "slug">[]
  ); // [{ slug: 'lol', channel: 'channel-pln' }]

  const pathsWithChannelsAndLocales = pathsWithChannels.reduce(
    (result, path) => [
      ...result,
      ...locales.map((locale) => ({ ...path, locale })),
    ],
    [] as ProductPath[]
  ); // [{ slug: 'lol', channel: 'channel-pln', locale: 'pl-pl' }]

  return pathsWithChannelsAndLocales;
};
