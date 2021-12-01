import { channels } from "@/components/ChannelsProvider/channelsConfig";
import { useRouter } from "next/router";
import { stringify } from "qs";

// interface LocalPath<TParams extends Object> {
//   key: string;
//   // could be typed better
//   getPathWithParams: (params?: TParams) => string;
// }

const basicPaths = [{ key: "products" }];

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

const localPaths = basicPaths.map(({ key }) => ({
  key,
  getPathWithParams: getParsedPath(key),
}));

// export type PathKeys = keyof typeof localPaths;

export const useLinksWithChannelsAndLol = () => {
  const { asPath, locales = [] } = useRouter();
  const [channelName, localeName] = asPath.split("/").filter(Boolean);
  // console.log({ channelName, localeName });

  const channel = channels.find(({ slug }) => slug === channelName)?.slug;
  const locale = locales.find((loc) => loc === localeName);

  const getPathWithChannelAndLocale = (path: string) =>
    `/${channel}/${locale}${path}`;

  const paths = localPaths.reduce((result, { key, getPathWithParams }) => {
    return {
      ...result,
      [key]: (...args) =>
        getPathWithChannelAndLocale(getPathWithParams(...args)),
    };
  }, {});

  return { paths };
};

// ==========================

export const useLinksWithChannelsAndLocale = () => {
  const { asPath, locales = [] } = useRouter();
  const [channelName, localeName] = asPath.split("/").filter(Boolean);
  // console.log({ channelName, localeName });

  const channel = channels.find(({ slug }) => slug === channelName)?.slug;
  const locale = locales.find((loc) => loc === localeName);

  const getLink = (path: string) => `/${channel}/${locale}${path}`;

  return { getLink };
};
