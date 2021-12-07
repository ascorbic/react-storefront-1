import clsx from "clsx";
import React, { useState } from "react";
import useChannels from "../ChannelsProvider/useChannels";

interface ChannelSelectProps {}

const listItemStyle =
  "flex w-full items-center p-2 pl-2 border-transparent bg-white border-l-4 relative hover:text-gray-700 ";

const listItemStyleSelected = "border-blue-600";

const ChannelSelect: React.FC<ChannelSelectProps> = ({}) => {
  const [isSelectOpen, setSelectOpen] = useState(false);

  const { channels, currentChannel, setCurrentChannel } = useChannels();

  const handleSelectChannel = (slug: string) => () => {
    setCurrentChannel(slug);
    setSelectOpen(false);
  };

  return (
    <div className="flex-auto flex flex-col items-center pb-4  pl-8 pr-8">
      <div className="flex flex-col items-center relative w-full">
        <div className="w-full">
          <div className="my-2 bg-white p-1 flex border border-gray-200 rounded w-full">
            <div className="flex flex-auto flex-wrap"></div>
            <div
              onClick={() => setSelectOpen(!isSelectOpen)}
              className="p-1 px-2 appearance-none outline-none w-full text-gray-800 cursor-pointer"
            >
              {currentChannel.name}
            </div>
            <div className="text-gray-300 w-8 py-1 pl-2 pr-1 border-l flex items-center border-gray-200">
              <button
                className="cursor-pointer w-6 h-6 text-gray-600 outline-none focus:outline-none"
                onClick={() => setSelectOpen(!isSelectOpen)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  // stroke-width="2"
                  // stroke-linecap="round"
                  // stroke-linejoin="round"
                  className={clsx(
                    "feather feather-chevron-up w-4 h-4",
                    !isSelectOpen && "rotate-180"
                  )}
                >
                  <polyline points="18 15 12 9 6 15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div
          className={clsx(
            "absolute shadow top-full z-40 w-full lef-0 rounded max-h-select overflow-y-auto",
            !isSelectOpen && "max-h-0"
          )}
        >
          <div className="flex flex-col w-full">
            {channels.map(({ slug, name }) => (
              <div
                key={slug}
                onClick={handleSelectChannel(slug)}
                className="cursor-pointer w-full border-gray-100 rounded-t border-b bg-blue-100"
              >
                <div
                  className={clsx(
                    listItemStyle,
                    slug === currentChannel.slug && listItemStyleSelected
                  )}
                >
                  <div className="w-full items-center flex">
                    <div className="mx-2 leading-6">{name}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelSelect;
