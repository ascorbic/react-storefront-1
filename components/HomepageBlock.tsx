import Link from "next/link";
import React from "react";

import { MenuItemFragment, ProductFilterInput } from "@/saleor/api";

import { ProductCollection, RichText } from ".";
import { usePaths } from "@/components/utils/paths";

export interface HomepageBlockProps {
  menuItem: MenuItemFragment;
}

export const HomepageBlock = ({ menuItem }: HomepageBlockProps) => {
  const { paths } = usePaths();

  const filter: ProductFilterInput = {};
  if (!!menuItem.page?.id) {
    return (
      <div className="pb-10">
        {!!menuItem.page?.content && (
          <RichText jsonStringData={menuItem.page?.content} />
        )}
      </div>
    );
  }
  let link = "";
  if (!!menuItem.category?.id) {
    filter.categories = [menuItem.category?.id];
    // link = paths.categories(menuItem.category.slug);
    link = "";
  }
  if (!!menuItem.collection?.id) {
    filter.collections = [menuItem.collection?.id];
    link = paths.collections(menuItem.collection.slug);
  }
  // console.log(123, getLink(link));
  return (
    <div className="pb-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 pb-4">
        {menuItem.name}
      </h1>
      <ProductCollection filter={filter} allowMore={false} />
      <div className="flex flex-row-reverse p-4">
        <Link href={link}>
          <a>
            <p>More →</p>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default HomepageBlock;
