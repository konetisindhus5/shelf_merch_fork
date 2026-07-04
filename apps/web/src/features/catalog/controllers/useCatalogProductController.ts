import { useParams } from "react-router";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useCatalogProduct } from "../model";
import type { UiProduct } from "../model";

export type CatalogProductVm = {
  isLoading: boolean;
  errorMessage: string | null;
  product: UiProduct | undefined;
  index: number;
};

/** Controller for the catalog product detail page: route param + product query. */
export function useCatalogProductController(): CatalogProductVm {
  const { id } = useParams() as { id: string };
  const { data: workspace } = useWorkspace();
  const { data: product, isLoading, isError, error } = useCatalogProduct(id, workspace);

  const index = workspace?.catalogProducts.findIndex((p) => p.id === id) ?? 0;

  return {
    isLoading: isLoading && !product,
    errorMessage: isError
      ? error instanceof Error
        ? error.message
        : "Could not load product"
      : null,
    product,
    index: index >= 0 ? index : 0,
  };
}
