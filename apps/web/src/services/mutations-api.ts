import { apiFetch } from "./api";
import { mapCampaign, mapCollection, mapKit, type UiProduct } from "./mappers";

function productRefFromUi(p: UiProduct) {
  if (!p.id) throw new Error(`Product "${p.nm}" has no catalog id — reload the catalog`);
  return {
    catalogProductId: p.id,
    brand: p.brand || "",
    name: p.nm,
    group: p.g || "tee",
  };
}

export async function createKitApi(payload: {
  name: string;
  pickedIndices: number[];
  catalog: UiProduct[];
  packaging: "none" | "box";
  designNotes?: string;
}) {
  const productRefs = payload.pickedIndices.map((i) => {
    const p = payload.catalog[i];
    if (!p) throw new Error("Invalid product selection");
    return productRefFromUi(p);
  });
  const kit = await apiFetch<Record<string, unknown>>("/kits", {
    method: "POST",
    body: JSON.stringify({
      name: payload.name,
      productRefs,
      packaging: payload.packaging === "box" ? "box" : "none",
      designNotes: payload.designNotes || "",
      status: "live",
    }),
  });
  return mapKit(kit);
}

export async function createCollectionApi(payload: {
  shopId: string;
  name: string;
  pickedIndices: number[];
  catalog: UiProduct[];
}) {
  const productRefs = payload.pickedIndices.map((i) => {
    const p = payload.catalog[i];
    if (!p) throw new Error("Invalid product selection");
    return productRefFromUi(p);
  });
  const col = await apiFetch<Record<string, unknown>>("/collections", {
    method: "POST",
    body: JSON.stringify({
      shopId: payload.shopId,
      name: payload.name,
      productRefs,
    }),
  });
  return mapCollection(col);
}

export async function launchPointsCampaignApi(payload: {
  entityId: string;
  shopId: string;
  name: string;
  creditsPerRecipient: number;
  message: { from: string; body: string };
  recipients: Array<{ name: string; email: string; phone?: string }>;
}) {
  const campaign = await apiFetch<Record<string, unknown>>("/campaigns", {
    method: "POST",
    body: JSON.stringify({
      entityId: payload.entityId,
      name: payload.name,
      type: "points",
      shopId: payload.shopId,
      message: payload.message,
      schedule: { mode: "now" },
    }),
  });
  const campaignId = String(campaign._id);

  await apiFetch(`/campaigns/${campaignId}/recipients/import`, {
    method: "POST",
    body: JSON.stringify({
      recipients: payload.recipients.map((r) => ({
        name: r.name,
        email: r.email,
        phone: r.phone || "",
      })),
    }),
  });

  await apiFetch(`/campaigns/${campaignId}/allocate-credits`, {
    method: "POST",
    body: JSON.stringify({ creditsPerRecipient: payload.creditsPerRecipient }),
  });

  const launched = await apiFetch<Record<string, unknown>>(`/campaigns/${campaignId}/launch`, {
    method: "POST",
    idempotencyKey: `launch-${campaignId}-${Date.now()}`,
  });
  return mapCampaign(launched);
}

type OrgWizardState = {
  wallet: {
    id?: string;
    name: string;
    amount: number;
    start: string;
    end: string;
    funding: string;
    docType: string;
    docNumber: string;
  };
  departments: Array<{
    id: string | number;
    name: string;
    desc: string;
    users: number;
    allocated: number;
    color: string;
    mgr: { name: string; email: string; mobile: string; role: string; invite: boolean };
  }>;
};

export async function syncOrgWizardApi(org: OrgWizardState): Promise<string> {
  let walletId = org.wallet.id;

  if (!walletId) {
    const wallet = await apiFetch<Record<string, unknown>>("/wallets", {
      method: "POST",
      body: JSON.stringify({
        name: org.wallet.name,
        currency: "INR",
        validFrom: org.wallet.start || null,
        validTo: org.wallet.end || null,
        fundingMethod: org.wallet.funding === "pay" ? "online" : "po_upload",
        fundingDocument: {
          docType: org.wallet.docType || "",
          docNumber: org.wallet.docNumber || "",
        },
      }),
    });
    walletId = String(wallet._id);

    if (org.wallet.amount > 0) {
      await apiFetch(`/wallets/${walletId}/fund`, {
        method: "POST",
        idempotencyKey: `fund-${walletId}-setup`,
        body: JSON.stringify({
          amount: org.wallet.amount,
          description: "Organization wallet setup funding",
        }),
      });
    }
  }

  const allocations: Array<{ entityId: string; amount: number }> = [];

  for (const dept of org.departments) {
    const existingId = String(dept.id);
    const isMongoId = /^[a-f0-9]{24}$/i.test(existingId);
    let entityId = isMongoId ? existingId : "";

    if (!entityId) {
      const entity = await apiFetch<Record<string, unknown>>("/entities", {
        method: "POST",
        body: JSON.stringify({
          walletId,
          name: dept.name,
          description: dept.desc || "",
          colorHex: dept.color || "#2563EB",
          expectedUsers: dept.users || 0,
        }),
      });
      entityId = String(entity._id);
    }

    if (dept.mgr?.email && dept.mgr.invite) {
      await apiFetch(`/entities/${entityId}/assign-manager`, {
        method: "POST",
        body: JSON.stringify({
          name: dept.mgr.name || dept.mgr.email.split("@")[0],
          email: dept.mgr.email,
          role: dept.mgr.role || "",
          mobile: dept.mgr.mobile || "",
        }),
      });
    }

    if (dept.allocated > 0) {
      allocations.push({ entityId, amount: dept.allocated });
    }
  }

  if (allocations.length) {
    await apiFetch(`/wallets/${walletId}/allocate`, {
      method: "POST",
      idempotencyKey: `alloc-${walletId}-setup`,
      body: JSON.stringify({ allocations }),
    });
  }

  await apiFetch(`/wallets/${walletId}/activate`, { method: "POST" });
  return walletId;
}
