import { saleorClient } from "@/lib/graphql";
import { SaleorProvider } from "@saleor/sdk";
import React, { useEffect } from "react";
import useChannels from "../ChannelsProvider/useChannels";

const SaleorProviderWithChannels: React.FC = ({ children }) => {
  const { currentChannel } = useChannels();

  const {
    config: { setChannel },
  } = saleorClient;

  useEffect(() => setChannel(currentChannel.slug), [currentChannel]);

  return <SaleorProvider client={saleorClient}>{children}</SaleorProvider>;
};

export default SaleorProviderWithChannels;
