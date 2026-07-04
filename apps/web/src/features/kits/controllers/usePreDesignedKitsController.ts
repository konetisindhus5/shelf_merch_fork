import { usePlatformKits } from "../model";
import type { PlatformKitTemplate } from "../model";

export type PreDesignedKitsVm = {
  isLoading: boolean;
  kits: PlatformKitTemplate[] | undefined;
};

/** Controller for the pre-designed kits widget: platform kit templates query. */
export function usePreDesignedKitsController(): PreDesignedKitsVm {
  const { data: kits, isLoading } = usePlatformKits();
  return { isLoading, kits };
}
