import { useMemo, useState } from "react";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useCatalog } from "../model";
import { ALL_PRODUCTS, CATALOG_CATEGORIES } from "../types";
import type { UiProduct } from "../model";

export type CatalogVm = {
  category: string;
  categories: readonly string[];
  items: UiProduct[];
  count: number;
  isSkeleton: boolean;
  errorMessage: string | null;
  onCategory: (category: string) => void;
};

/** Controller for the catalog grid: category tabs + per-category product query. */
export function useCatalogController(): CatalogVm {
  const { data: workspace } = useWorkspace();
  const [category, setCategory] = useState<string>(ALL_PRODUCTS);

  const seed = useMemo(
    () =>
      workspace ? { items: workspace.catalogProducts, total: workspace.catalogTotal } : undefined,
    [workspace],
  );

  const { data, isLoading, isError, error, isFetching } = useCatalog(category, seed);
  const items = data?.items ?? [];

  return {
    category,
    categories: CATALOG_CATEGORIES,
    items,
    count: data?.total ?? items.length,
    isSkeleton: (isLoading || isFetching) && items.length === 0,
    errorMessage: isError
      ? error instanceof Error
        ? error.message
        : "Could not load catalog products"
      : null,
    onCategory: setCategory,
  };
}
