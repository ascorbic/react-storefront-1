import { channels } from "@/components/ChannelsProvider/channelsConfig";
import { locales } from "@/components/LocaleSelectDialog/locales";
import router, { useRouter } from "next/router";
import { stringify } from "qs";

// interface LocalPath<TParams extends Object> {
//   key: string;
//   // could be typed better
//   getPathWithParams: (params?: TParams) => string;
// }

// type PathParams<TKey extends keyof Paths> = Paths[TKey];

// keyof produces union, we want to require all of the keys

export type GetPathFunction<
  TParams extends Record<string, string> | undefined = undefined
> = (id?: string, params?: TParams) => string;

export interface Paths {
  products: GetPathFunction<{ variant: string }>;
  categories: GetPathFunction;
  collections: GetPathFunction;
  home: () => string;
}
const basicPaths: Array<keyof Paths> = {
  // why is products plural and the rest is not
  products: "products",
  categories: "category",
  collections: "collection",
};

function getParsedPath<TParams extends Object>(key: string) {
  return (id?: string, params?: TParams) => {
    const basePath = `/${key}`;

    if (!id && !params) {
      return basePath;
    }

    if (!params) {
      return `${basePath}/${id}`;
    }

    const parsedParams = `?${stringify(params)}`;

    return id
      ? `${basePath}/${id}${parsedParams}`
      : `${basePath}${parsedParams}`;
  };
}

export const usePaths = (): { paths: Paths } => {
  const { asPath } = useRouter();

  console.log({ asPath });
  const [channelName, localeName] = asPath.split("/").filter(Boolean);

  const channel = channels.find(({ slug }) => slug === channelName)?.slug;
  const locale = locales.find((loc) => loc === localeName);

  console.log({ channel, locale });
  const getPathWithChannelAndLocale = (path: string) =>
    channel && locale ? `/${channel}/${locale}${path}` : "/";

  const homePath = {
    home: () => getPathWithChannelAndLocale("/"),
  };

  const paths = Object.entries(basicPaths).reduce((result, [key, value]) => {
    const getPathWithParams = getParsedPath(value);

    return {
      ...result,
      [key]: (...args) =>
        getPathWithChannelAndLocale(getPathWithParams(...args)),
    };
  }, {});

  return { paths: { ...paths, ...homePath } };
};

interface Edge<T> {
  node: T;
}

interface Connection<T> {
  edges: Array<Edge<T>> | undefined;
}

export function mapEdgesToItems<T>(
  data: Connection<T> | undefined
): T[] | undefined {
  return data?.edges?.map(({ node }) => node);
}
