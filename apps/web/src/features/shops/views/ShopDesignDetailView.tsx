import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";
import { LoadingState } from "@/components/LoadingState";
import { AddToShopDialog } from "@/features/swag/AddToShopDialog";
import { SwagProductDetail } from "@/features/swag/SwagProductDetail";
import type { ShopDesignDetailVm } from "../controllers/useShopDesignDetailController";

/** Shop design detail page — same product UI as the Swag product page. */
export function ShopDesignDetailView(vm: ShopDesignDetailVm) {
  const [addOpen, setAddOpen] = useState(false);
  const backHref = `/app/shops/${vm.shopId}?tab=branded-swag`;

  if (vm.isLoading) {
    return <LoadingState message="Loading design…" fullScreen={false} />;
  }

  if (vm.errorMessage) {
    return (
      <div className="card" style={{ padding: 16, color: "var(--danger)" }}>
        {vm.errorMessage}
      </div>
    );
  }

  if (!vm.shop || !vm.collection || !vm.product) {
    return (
      <div className="card empty" style={{ padding: 48 }}>
        <h3>Design not found</h3>
        <p>This design may have been removed or is not linked to this shop.</p>
        <Link to={backHref} className="btn btn-soft" style={{ marginTop: 14 }}>
          Back to shop
        </Link>
      </div>
    );
  }

  const { collection, product } = vm;

  return (
    <>
      <Link
        to={backHref}
        className="lnk"
        style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 14 }}
      >
        <ArrowLeft size={15} /> Back to shop
      </Link>

      <div className="card" style={{ padding: 24 }}>
        <SwagProductDetail
          target={{ collection, product, pIdx: vm.productIndex }}
          onAddToShop={() => setAddOpen(true)}
        />
      </div>

      <AddToShopDialog
        target={addOpen ? { collection, product } : null}
        onOpenChange={setAddOpen}
      />
    </>
  );
}
