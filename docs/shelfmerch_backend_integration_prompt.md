# ShelfMerch — Full Backend, System Architecture & Integration Build Prompt

> **Context**: The frontend (Lovable React/TypeScript SPA) is fully built — every
> screen, wizard, modal, drawer, and interaction described in the prior prompts is
> live with mock data. This prompt covers everything needed to design, build, and
> wire up a production-grade backend, then connect it to that existing frontend.
>
> Use this with Claude Code, Cursor, or any AI coding agent that has terminal
> access — NOT Lovable. Lovable is frontend-only and cannot run a real backend.

---

## 0. HOW TO USE THIS PROMPT

This is a sequenced build plan. Work through sections in order:

1. Section 1–3: Lock the system design and tech stack decisions
2. Section 4: Scaffold the backend project
3. Section 5: Build the data layer (MongoDB schemas)
4. Section 6: Build auth + tenancy + RBAC/ABAC middleware
5. Section 7: Build each module (wallets → entities → shops → catalog →
   campaigns → redemptions → orders → fulfillment → notifications)
6. Section 8: Build the frontend integration layer (replace mocks with real API calls)
7. Section 9: Background jobs, webhooks, file storage
8. Section 10: Deployment, environment, observability
9. Section 11: Testing strategy
10. Section 12: Phased delivery plan

Do not skip ahead. Each section assumes the previous one is complete.

---

## 1. SYSTEM OVERVIEW — WHAT WE ARE BUILDING

ShelfMerch is a multi-tenant B2B SaaS platform for corporate swag, gifting,
budget wallets, and employee redemption — India-first (INR, GST, Razorpay).

It combines five systems in one:

1. **B2B SaaS multi-tenant workspace** — each company (tenant) gets an isolated
   workspace with its own users, branding, wallet, and catalog access.
2. **Branded merch store builder** — tenants create "shops" with their logo,
   curated product collections, and branded swag designs.
3. **Ledger-based budget wallet system** — tenants fund a master wallet, allocate
   budget across departments/entities, and every movement is an immutable
   transaction record.
4. **Campaign & credit allocation engine** — entity managers create campaigns,
   upload recipients, allocate credits, and launch redemption invites.
5. **Public employee redemption portal + order fulfillment** — recipients redeem
   gifts via a tokenized link (no login), choose products, enter address, and
   ShelfMerch (platform team) handles production → shipping → delivery tracking.

### Core Domain Hierarchy

```text
Platform (ShelfMerch — Super Admin)
  └── Tenant (Company workspace, e.g. "Rubix")
        └── Wallet (Master merchandise budget, e.g. ₹10,00,000)
              └── Entities / Departments (Marketing, Sales, HR...)
                    └── Campaigns (e.g. "Diwali Gift 2026")
                          └── Recipients (employees, with credit allocation)
                                └── Redemptions (token-based claim)
                                      └── Orders → Fulfillment → Shipment
```

---

## 2. ARCHITECTURE DECISIONS (LOCKED FOR MVP)

These decisions are final for MVP. Do not introduce alternatives.

| Decision | Choice | Why |
|---|---|---|
| Architecture style | **Modular monolith** | Microservices add ops overhead before there are paying tenants. One deployable, clean module boundaries. |
| Backend framework | **Node.js + Express** (or NestJS if the agent strongly prefers — pick ONE and stay consistent) | Matches the frontend's TypeScript ecosystem, fast to build |
| Database | **MongoDB (Mongoose ODM)**, single shared database, every tenant-owned document carries `tenantId` | Matches the data models already designed (wallets, entities, campaigns are document-shaped, not relational) |
| Cache / Queue | **Redis + BullMQ** | Job queues for CSV imports, notification sending, mockup generation |
| File storage | **Cloudflare R2 (S3-compatible)** | Cheaper than S3, same SDK |
| Auth | **JWT (access + refresh tokens)**, OTP-based login for redemption portal | Stateless, scales horizontally |
| Payments | **Razorpay** (placeholder/sandbox in MVP, real integration post-MVP) | India-first requirement |
| Frontend framework | **React + TypeScript (already built in Lovable)** | Already exists — do not rebuild |
| Frontend state | **Zustand (wizard/local) + TanStack Query (server state)** | Matches what the frontend prompt specified |
| API style | **REST**, versioned under `/api/v1` | Simple, well-understood, matches the route map already drafted |
| Hosting (MVP) | **Single VPS or Render/Railway** for backend, static hosting for frontend, MongoDB Atlas for DB | Cheapest path to a working production environment |

> **Note on the multi-tenant database choice**: We use the **shared database,
> shared collections** model (not database-per-tenant). Every tenant-owned
> document includes a `tenantId: ObjectId` field. This is cheaper to operate,
> easier to run cross-tenant analytics for the platform team, and is sufficient
> isolation for MVP scale (tens to low hundreds of tenants). Database-per-tenant
> can be revisited only if a specific enterprise customer contractually requires
> physical data isolation.

---

## 3. NON-NEGOTIABLE ARCHITECTURE RULES

These rules apply to every module, every endpoint, every query. An AI coding
agent must treat these as hard constraints, not suggestions.

### 3.1 Tenant Isolation

```javascript
// NEVER do this — leaks cross-tenant data
Order.findById(orderId)

// ALWAYS do this — every query scoped by tenantId
Order.findOne({ _id: orderId, tenantId: req.user.tenantId })
```

Every Mongoose model that belongs to a tenant MUST have `tenantId: { type: ObjectId, required: true, index: true }`. Add a Mongoose plugin or query middleware
that throws an error if a tenant-scoped model is queried without `tenantId` in
the filter, except for platform/super-admin routes which explicitly opt out.

### 3.2 RBAC + ABAC Authorization

- **RBAC** (Role-Based Access Control) answers: *what can this role do?*
- **ABAC** (Attribute-Based Access Control) answers: *where can this user do it?*

Every authenticated request carries a `roleAssignment`:

```javascript
{
  tenantId: ObjectId,
  userId: ObjectId,
  role: "company_admin" | "entity_manager" | "platform_super_admin" | ...,
  scopeType: "platform" | "tenant" | "entity" | "self",
  scopeId: ObjectId | null,        // e.g. the specific entityId for entity_manager
  assignedEntityIds: [ObjectId]    // for entity managers with multiple entities
}
```

Middleware order for every protected route:
```text
authenticate (JWT) → resolveTenant → checkRole (RBAC) → checkScope (ABAC) → controller
```

### 3.3 Wallet Ledger — Never Store Balance Only

Every wallet movement (allocation, transfer, spend, refund, top-up) creates a
`WalletTransaction` document. The wallet's `balance` field is a derived/cached
value, recomputed or validated against the transaction log. Never allow direct
balance mutation outside the transaction-creation service function.

### 3.4 State Machines — Validate Every Transition

Campaigns, Orders, and Redemptions are state machines. A central
`stateMachine.service.js` defines allowed transitions per entity type. Every
status update goes through `transitionState(entity, fromStatus, toStatus, actor)`,
which throws if the transition is not in the allowed map. Direct `.status = x`
assignment is forbidden — code review / linting should catch this.

**Order state machine:**
```text
created → approved → mockup_pending → mockup_approved → in_production →
qc_pending → packed → shipped → delivered
Any state → issue_raised
issue_raised → replacement_processing
```

**Campaign state machine:**
```text
draft → recipients_uploaded → credits_allocated → approved →
launched → redemption_open → redemption_closed → fulfilled
```

**Wallet setup state machine:**
```text
draft → wallet_created → entities_added → budget_allocated →
managers_assigned → review_pending → active
```

**Redemption state machine:**
```text
invited → opened → verified → redeemed → order_created
```

### 3.5 Idempotency

All mutating endpoints that could be retried (campaign launch, credit
allocation, payment confirmation, order creation) must accept an
`Idempotency-Key` header. Store keys in an `idempotencyKeys` collection with a
TTL index (24h). If a key is replayed, return the cached response instead of
re-executing.

### 3.6 Audit Logging

Every state-changing action writes an `AuditLog` document:
```javascript
{
  tenantId, actorUserId, actorRole, action, entityType, entityId,
  before: {...}, after: {...}, ip, userAgent, timestamp,
  impersonation: { isImpersonating: bool, originalUserId: ObjectId|null }
}
```

### 3.7 Soft Deletes

Never hard-delete tenant data. Every schema includes `deletedAt: Date | null`.
Default queries exclude soft-deleted documents via a Mongoose query plugin.

---

## 4. PROJECT SCAFFOLDING

### 4.1 Repository Structure

```text
shelfmerch/
├── apps/
│   ├── api/                      ← Backend (Express/NestJS)
│   │   ├── src/
│   │   │   ├── app.js / app.module.ts
│   │   │   ├── server.js
│   │   │   ├── config/
│   │   │   │   ├── env.js        ← validated env vars (zod schema)
│   │   │   │   ├── db.js         ← MongoDB connection
│   │   │   │   └── redis.js      ← Redis connection
│   │   │   ├── middleware/
│   │   │   │   ├── auth.middleware.js
│   │   │   │   ├── tenant.middleware.js
│   │   │   │   ├── rbac.middleware.js
│   │   │   │   ├── abac.middleware.js
│   │   │   │   ├── idempotency.middleware.js
│   │   │   │   ├── audit.middleware.js
│   │   │   │   ├── error.middleware.js
│   │   │   │   └── validate.middleware.js   ← Zod request validation
│   │   │   ├── modules/
│   │   │   │   ├── auth/
│   │   │   │   ├── tenants/
│   │   │   │   ├── users/
│   │   │   │   ├── roles/
│   │   │   │   ├── wallets/
│   │   │   │   ├── entities/
│   │   │   │   ├── shops/
│   │   │   │   ├── catalog/
│   │   │   │   ├── collections/
│   │   │   │   ├── kits/
│   │   │   │   ├── campaigns/
│   │   │   │   ├── contacts/
│   │   │   │   ├── imports/
│   │   │   │   ├── redemptions/
│   │   │   │   ├── orders/
│   │   │   │   ├── fulfillment/
│   │   │   │   ├── shipments/
│   │   │   │   ├── payments/
│   │   │   │   ├── invoices/
│   │   │   │   ├── notifications/
│   │   │   │   ├── auditLogs/
│   │   │   │   └── integrationHub/    ← placeholder only
│   │   │   ├── jobs/                  ← BullMQ workers
│   │   │   │   ├── csvImport.worker.js
│   │   │   │   ├── notification.worker.js
│   │   │   │   └── mockupGeneration.worker.js
│   │   │   ├── services/
│   │   │   │   ├── stateMachine.service.js
│   │   │   │   ├── ledger.service.js
│   │   │   │   ├── storage.service.js   ← R2/S3 wrapper
│   │   │   │   └── pricing.service.js   ← service fee + GST calc
│   │   │   └── utils/
│   │   ├── tests/
│   │   ├── package.json
│   │   └── Dockerfile
│   └── web/                      ← Existing Lovable frontend (move/import here)
│       └── src/
│           ├── services/api.ts   ← single API client (replaces mocks)
│           ├── mocks/             ← keep for local/demo mode toggle
│           └── ...
├── docker-compose.yml             ← mongo + redis + api + web for local dev
├── .env.example
└── README.md
```

### 4.2 Each Module Follows This Internal Structure

```text
modules/<name>/
  <name>.routes.js        ← Express router, wires middleware + controller
  <name>.controller.js    ← thin: parse req, call service, send res
  <name>.service.js        ← business logic, calls model
  <name>.model.js          ← Mongoose schema
  <name>.validation.js     ← Zod schemas for request bodies
  <name>.test.js
```

Controllers must NOT contain business logic. Services must NOT touch `req`/`res`.

---

## 5. DATA LAYER — MONGOOSE SCHEMAS

Implement every schema below. Field names must match exactly — the frontend's
mock data shapes (in `src/mocks/db.ts`) were designed to mirror these, so
matching field names minimizes frontend rewrite.

### 5.1 Core / Identity

```javascript
// Tenant
{
  _id, name: String,                 // "Rubix"
  slug: String,                      // "rubix" — used in app.shelfmerch.io/rubix
  logoUrl: String,
  currency: { type: String, default: "INR" },
  gstin: String,
  billingAddress: { line1, line2, city, state, pincode, country },
  status: { type: String, enum: ["active","suspended","trial"], default: "trial" },
  createdAt, updatedAt, deletedAt
}

// User
{
  _id, tenantId: ObjectId,           // null for platform_super_admin
  name, email: { type: String, unique: true },
  passwordHash, phone,
  status: { type: String, enum: ["invited","active","suspended"], default: "invited" },
  lastLoginAt,
  createdAt, updatedAt, deletedAt
}

// RoleAssignment
{
  _id, tenantId, userId,
  role: { type: String, enum: [
    "platform_super_admin","platform_production_manager","platform_finance_admin",
    "platform_support_agent","platform_catalog_admin","platform_readonly_auditor",
    "company_admin","entity_manager"
  ]},
  scopeType: { type: String, enum: ["platform","tenant","entity","self"] },
  scopeId: ObjectId,                 // entityId for entity_manager
  assignedEntityIds: [ObjectId],
  createdAt, updatedAt
}

// AuthIdentity (for future SSO/SCIM — placeholder)
{
  _id, userId, provider: String,     // "password" | "okta" | "google"
  externalId: String, metadata: Object
}
```

### 5.2 Wallet & Budget

```javascript
// Wallet
{
  _id, tenantId,
  name: String,                      // "FY2026 Merchandise Budget"
  currency: { type: String, enum: ["INR","USD"], default: "INR" },
  totalAmount: Number,               // total funded amount
  allocatedAmount: Number,           // sum of entity allocations (cached, derived)
  balance: Number,                   // cached, validated against ledger
  status: { type: String, enum: [
    "draft","wallet_created","entities_added","budget_allocated",
    "managers_assigned","review_pending","active"
  ], default: "draft" },
  validFrom: Date, validTo: Date,
  fundingMethod: { type: String, enum: ["po_upload","online"] },
  fundingDocument: { docType, docNumber, fileUrl, approvalStatus },
  ownerUserId: ObjectId,
  createdAt, updatedAt, deletedAt
}

// WalletTransaction (the ledger — append-only)
{
  _id, tenantId, walletId,
  type: { type: String, enum: [
    "fund_in","allocation_to_entity","transfer_between_wallets",
    "campaign_spend","order_payment","refund","adjustment"
  ]},
  amount: Number,                    // positive = credit, negative = debit
  balanceAfter: Number,              // running balance snapshot
  relatedEntityId: ObjectId,         // entity, campaign, or order this relates to
  description: String,
  performedBy: ObjectId,
  createdAt
}

// Entity (Department / cost center)
{
  _id, tenantId, walletId,
  name: String,                      // "Marketing"
  description: String,
  colorHex: String,                  // for UI swatch
  expectedUsers: Number,
  allocatedAmount: Number,
  spentAmount: Number,               // cached, derived from wallet transactions
  managerUserId: ObjectId,
  managerInvitePending: Boolean,
  createdAt, updatedAt, deletedAt
}
```

### 5.3 Store / Catalog

```javascript
// Shop (branded storefront)
{
  _id, tenantId,
  name: String,                      // "Rubix Dubai"
  currencyMode: { type: String, enum: ["points","inr","priceless"], default: "points" },
  logoUrl: String,
  bannerConfig: Object,              // theme/colors
  categories: [String],              // ["Food & Beverages","Work Essentials","Merch"]
  status: { type: String, enum: ["draft","live"], default: "draft" },
  createdAt, updatedAt, deletedAt
}

// CatalogProduct (platform-wide master catalog, not tenant-scoped)
{
  _id, sku: String,
  brand: String, name: String,
  category: String,                  // "Apparel","Drinkware",...
  group: String,                     // icon group e.g. "tee","mug","hoodie"
  basePriceInr: Number,
  variants: [{ color, size, sku, stock }],
  imageUrls: [String],
  vendorId: ObjectId,
  status: { type: String, enum: ["active","discontinued"], default: "active" },
  createdAt, updatedAt
}

// Collection (a shop's branded swag set)
{
  _id, tenantId, shopId,
  code: String,                      // "C343955972"
  name: String,                      // "New employee Swag"
  status: { type: String, enum: ["draft","ready","archived"], default: "draft" },
  artworkUrl: String,
  productRefs: [{ catalogProductId, brand, name, group }],
  createdBy: ObjectId,
  createdAt, updatedAt, deletedAt
}

// Kit (reusable bundle)
{
  _id, tenantId,
  name: String,                      // "Welcome Kit"
  description: String,
  productRefs: [{ catalogProductId, brand, name, group }],
  artworkUrl: String,
  designNotes: String,
  packaging: { type: String, enum: ["none","box"], default: "none" },
  status: { type: String, enum: ["draft","live"], default: "draft" },
  lastSentAt: Date,
  createdAt, updatedAt, deletedAt
}
```

### 5.4 Contacts / People

```javascript
// Contact
{
  _id, tenantId,
  name, email, phone,
  role: { type: String, enum: ["Owner","Admin","Sender","Member","Non-Member"], default: "Member" },
  department: String,
  employeeCode: String,
  source: { type: String, enum: ["manual","csv","hris"], default: "manual" },
  address: { line1, line2, city, state, pincode, country },
  createdAt, updatedAt, deletedAt
}

// ImportMapping (for CSV / future HRIS sync)
{
  _id, tenantId,
  source: { type: String, enum: ["csv","bamboohr","keka","zoho_people"], default: "csv" },
  mapping: {
    name: String, email: String, phone: String,
    department: String, employeeCode: String
  },
  lastImportAt: Date,
  createdAt, updatedAt
}
```

### 5.5 Campaigns / Redemptions

```javascript
// Campaign
{
  _id, tenantId, entityId,
  name: String,                      // "Diwali Gift 2026"
  type: { type: String, enum: ["points","items","kit"] },
  catalogMode: { type: String, enum: ["full_store","selected_products"] },
  selectedProductIds: [ObjectId],
  kitId: ObjectId,                   // if type = kit
  shopId: ObjectId,                  // for points-type campaigns
  creditsPerRecipient: Number,       // INR
  recipientCount: Number,            // cached
  totalBudget: Number,               // creditsPerRecipient * recipientCount
  message: { from: String, body: String },
  schedule: { mode: "now"|"scheduled"|"self", sendAt: Date, timezone: String },
  status: { type: String, enum: [
    "draft","recipients_uploaded","credits_allocated","approved",
    "launched","redemption_open","redemption_closed","fulfilled"
  ], default: "draft" },
  createdBy: ObjectId,
  createdAt, updatedAt, deletedAt
}

// Recipient (a person within a campaign)
{
  _id, tenantId, campaignId,
  contactId: ObjectId,
  name, email, phone,
  creditAmount: Number,
  redemptionToken: { type: String, unique: true, index: true },
  redemptionStatus: { type: String, enum: [
    "invited","opened","verified","redeemed","order_created","expired"
  ], default: "invited" },
  invitedAt, openedAt, verifiedAt, redeemedAt: Date,
  createdAt, updatedAt
}
```

### 5.6 Orders / Fulfillment

```javascript
// Order
{
  _id, tenantId, campaignId, recipientId,
  orderNumber: String,               // human-readable, e.g. "SM-2026-000123"
  items: [{ catalogProductId, name, variant: { size, color }, qty, unitPriceInr }],
  shippingAddress: { name, phone, line1, line2, city, state, pincode, country },
  amountBreakdown: { subtotal, serviceFee, gst, total },
  status: { type: String, enum: [
    "created","approved","mockup_pending","mockup_approved","in_production",
    "qc_pending","packed","shipped","delivered","issue_raised","replacement_processing"
  ], default: "created" },
  statusHistory: [{ status, at: Date, actorUserId, note }],
  vendorId: ObjectId,                // assigned production partner
  createdAt, updatedAt, deletedAt
}

// Shipment
{
  _id, tenantId, orderId,
  courier: String, awb: String,
  trackingUrl: String,
  eta: Date,
  status: { type: String, enum: ["label_created","picked_up","in_transit","delivered","exception"] },
  events: [{ status, location, at: Date }],
  createdAt, updatedAt
}

// Vendor (production partner — platform-scoped, not tenant-scoped)
{
  _id, name, type: { type: String, enum: ["printing","packaging","logistics"] },
  contactEmail, contactPhone,
  capabilities: [String],
  status: { type: String, enum: ["active","inactive"], default: "active" },
  createdAt, updatedAt
}
```

### 5.7 Finance

```javascript
// Payment
{
  _id, tenantId,
  relatedType: { type: String, enum: ["wallet_funding","campaign_checkout"] },
  relatedId: ObjectId,
  provider: { type: String, enum: ["razorpay","manual_po"], default: "manual_po" },
  providerRefId: String,
  amount: Number,
  status: { type: String, enum: ["pending","succeeded","failed","refunded"], default: "pending" },
  rawWebhookPayload: Object,
  createdAt, updatedAt
}

// Invoice
{
  _id, tenantId,
  invoiceNumber: String,             // GST-compliant numbering
  paymentId: ObjectId,
  lineItems: [{ description, hsnCode, quantity, unitPrice, gstRate, amount }],
  totalAmount: Number, gstAmount: Number,
  senderGstin: String, receiverGstin: String,
  status: { type: String, enum: ["draft","issued","paid"], default: "draft" },
  pdfUrl: String,
  createdAt, updatedAt
}
```

### 5.8 Platform / Operational

```javascript
// SupportTicket
{
  _id, tenantId, raisedByUserId,
  subject, description,
  relatedOrderId: ObjectId,
  status: { type: String, enum: ["open","in_progress","resolved","closed"], default: "open" },
  assignedToUserId: ObjectId,
  messages: [{ authorUserId, body, at: Date }],
  createdAt, updatedAt
}

// AuditLog
{
  _id, tenantId, actorUserId, actorRole, action: String,
  entityType: String, entityId: ObjectId,
  before: Object, after: Object,
  ip: String, userAgent: String,
  impersonation: { isImpersonating: Boolean, originalUserId: ObjectId },
  createdAt
}

// Notification
{
  _id, tenantId, userId,
  type: String,                       // "campaign_launched" | "order_status_changed" | ...
  title: String, body: String,
  link: String,
  read: { type: Boolean, default: false },
  createdAt
}

// IdempotencyKey
{
  _id: String,                        // the idempotency key itself
  tenantId, response: Object,
  createdAt: { type: Date, expires: 86400 }  // TTL index, 24h
}
```

---

## 6. AUTH, TENANCY & MIDDLEWARE

### 6.1 Auth Flows

**Tenant user login (Company Admin / Entity Manager):**
```text
POST /api/v1/auth/login        { email, password }
  → returns { accessToken, refreshToken, user }
POST /api/v1/auth/refresh       { refreshToken }
POST /api/v1/auth/logout
POST /api/v1/auth/forgot-password   { email }
POST /api/v1/auth/reset-password    { token, newPassword }
```

**Recipient (employee) — OTP-based, no password:**
```text
GET  /api/v1/redemptions/:token              → loads campaign + recipient info
POST /api/v1/redemptions/:token/send-otp     { email|phone }
POST /api/v1/redemptions/:token/verify-otp   { code }
  → returns short-lived redemption session token
```

**Platform Super Admin login:** same as tenant login but `tenantId: null`,
`role: "platform_super_admin"`.

### 6.2 JWT Payload Shape

```javascript
{
  sub: userId,
  tenantId: ObjectId | null,
  role: String,
  scopeType: "platform" | "tenant" | "entity" | "self",
  scopeId: ObjectId | null,
  assignedEntityIds: [ObjectId],
  iat, exp
}
```

### 6.3 Middleware Stack (apply in this order)

```javascript
// 1. authenticate — verifies JWT, attaches req.user
function authenticate(req, res, next) { ... }

// 2. resolveTenant — for platform routes, allows tenantId override via
//    impersonation header; for tenant routes, sets req.tenantId = req.user.tenantId
function resolveTenant(req, res, next) { ... }

// 3. requireRole(...roles) — RBAC check
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}

// 4. requireScope(scopeResolver) — ABAC check
//    scopeResolver(req) returns the entityId/resourceId being accessed;
//    middleware checks req.user.assignedEntityIds includes it (for entity_manager)
function requireScope(scopeResolver) { ... }

// 5. idempotency — for POST/PATCH on critical routes
function idempotency(req, res, next) { ... }

// 6. audit — wraps controller, writes AuditLog after response
function audit(action, entityType) { ... }
```

### 6.4 Impersonation (Platform Super Admin → Tenant)

```text
POST /api/v1/platform/tenants/:tenantId/impersonate   { reason, reasonCategory }
  → returns a short-lived impersonation token (15 min)
  → all subsequent requests with this token:
      - req.tenantId = :tenantId
      - req.impersonation = { isImpersonating: true, originalUserId }
      - AuditLog entries tagged with impersonation block
      - The following actions are BLOCKED during impersonation:
          wallet adjustments, invoice creation/update, role changes,
          user deletion, billing changes
        → middleware `blockDuringImpersonation` on those routes returns 403
          with message "Disabled during impersonation"

POST /api/v1/platform/impersonate/end
  → invalidates impersonation token
```

---

## 7. MODULE-BY-MODULE BUILD SPEC

For each module: build the model (already specified in §5), the service layer
with business rules below, the controller, routes, and Zod validation schemas.
Then wire the route into `/api/v1`.

### 7.1 `auth` module
- Implement login/refresh/logout/forgot/reset as specified in §6.1
- Password hashing: bcrypt, 12 rounds
- Refresh tokens stored hashed in a `refreshTokens` collection with device info
  for "log out everywhere" support

### 7.2 `tenants` module
- `POST /api/v1/tenants` — platform-only, creates a new tenant + first
  company_admin user (sends invite email)
- `GET /api/v1/tenants/me` — current tenant's profile
- `PATCH /api/v1/tenants/me` — update branding, GSTIN, billing address
- Platform routes: `GET /api/v1/platform/tenants`, `GET /api/v1/platform/tenants/:id`,
  `PATCH /api/v1/platform/tenants/:id/status` (suspend/activate)

### 7.3 `users` + `roles` module
- `POST /api/v1/users/invite` — creates user with status=invited, sends email
  with set-password link
- `POST /api/v1/users/accept-invite` — sets password, activates user
- `GET /api/v1/users` — list tenant users with their role assignments
- `PATCH /api/v1/users/:id/role` — company_admin only, changes role/scope

### 7.4 `wallets` module — THE CORE LEDGER

Service functions (all go through `ledger.service.js`):

```javascript
// ledger.service.js
async function createTransaction({ tenantId, walletId, type, amount, relatedEntityId, description, performedBy }) {
  // 1. Load wallet, verify tenantId match
  // 2. Compute new balance = wallet.balance + amount
  // 3. If new balance < 0 and type is a debit type → throw InsufficientFundsError
  // 4. Write WalletTransaction document with balanceAfter = new balance
  // 5. Update wallet.balance (and allocatedAmount if type=allocation_to_entity)
  // 6. Return transaction
  // ALL OF THIS in a MongoDB session/transaction (multi-document ACID)
}
```

Endpoints:
```text
GET    /api/v1/wallets                       → list tenant's wallets
POST   /api/v1/wallets                       → create wallet (state=draft)
GET    /api/v1/wallets/:id
PATCH  /api/v1/wallets/:id                   → update name/dates/funding info
POST   /api/v1/wallets/:id/fund              → creates fund_in transaction
                                                (manual PO: sets approvalStatus=pending;
                                                 online: creates Razorpay order, see §9.3)
POST   /api/v1/wallets/:id/allocate          → body: [{entityId, amount}]
                                                creates allocation_to_entity transactions,
                                                validates sum <= wallet.balance
POST   /api/v1/wallets/:id/transfer          → body: {toWalletId, amount}
GET    /api/v1/wallets/:id/transactions      → paginated ledger
POST   /api/v1/wallets/:id/activate          → transitions wallet state to "active"
                                                (only allowed if all setup steps complete)
```

### 7.5 `entities` module
```text
GET    /api/v1/entities                      → ABAC: entity_manager sees only assigned
POST   /api/v1/entities                      → company_admin only
PATCH  /api/v1/entities/:id
DELETE /api/v1/entities/:id                  → soft delete, only if no active campaigns
POST   /api/v1/entities/:id/assign-manager   → body: {email, role, mobile}
                                                creates user invite + roleAssignment
```

### 7.6 `shops`, `catalog`, `collections`, `kits` modules
```text
GET    /api/v1/shops
POST   /api/v1/shops                         → state=draft
PATCH  /api/v1/shops/:id
POST   /api/v1/shops/:id/publish             → state=live, validates categories non-empty

GET    /api/v1/catalog/products              → platform-wide, filterable by category
GET    /api/v1/catalog/products/:id

GET    /api/v1/collections?shopId=
POST   /api/v1/collections                   → body: {shopId, name, productRefs[]}
POST   /api/v1/collections/:id/artwork       → uploads artwork, sets status=ready

GET    /api/v1/kits
POST   /api/v1/kits                          → body: {name, productRefs[], packaging}
PATCH  /api/v1/kits/:id
POST   /api/v1/kits/:id/artwork
```

### 7.7 `contacts` + `imports` module

```text
GET    /api/v1/contacts
POST   /api/v1/contacts                      → manual add
PATCH  /api/v1/contacts/:id
POST   /api/v1/contacts/import               → multipart CSV upload
                                                → enqueues csvImport.worker job
                                                → returns importJobId
GET    /api/v1/contacts/import/:jobId/status → { status, validCount, errorCount, errors[] }
```

CSV import worker (`csvImport.worker.js`):
1. Parse CSV using the tenant's `ImportMapping` (default mapping if none configured)
2. Validate each row: email format required, name required
3. Upsert into `contacts` (match by email within tenant)
4. Track duplicates within the same file — skip with warning
5. Update job status in Redis/Mongo for polling

### 7.8 `campaigns` module — STATE MACHINE CRITICAL

```text
GET    /api/v1/campaigns                     → ABAC scoped
POST   /api/v1/campaigns                     → state=draft
PATCH  /api/v1/campaigns/:id
POST   /api/v1/campaigns/:id/recipients/import   → CSV or manual list
                                                → creates Recipient docs with
                                                  generated redemptionToken (nanoid, 32 chars)
                                                → state → recipients_uploaded
POST   /api/v1/campaigns/:id/allocate-credits    → sets creditsPerRecipient,
                                                → validates entity.allocatedAmount - entity.spentAmount
                                                  >= totalBudget
                                                → state → credits_allocated
POST   /api/v1/campaigns/:id/launch              → MUST be idempotent
                                                → creates campaign_spend WalletTransaction
                                                  (debits entity's portion of wallet)
                                                → enqueues notification.worker jobs
                                                  to send redemption invites
                                                → state → launched → redemption_open
POST   /api/v1/campaigns/:id/close               → state → redemption_closed
GET    /api/v1/campaigns/:id/report              → recipient-level redemption status
```

### 7.9 `redemptions` module — PUBLIC, NO AUTH

```text
GET    /api/v1/redemptions/:token
  → 404 if token invalid
  → 410 if campaign not active or token expired
  → 409 if already redeemed (returns order tracking link instead)
  → else returns { campaign: {name, message, shop}, recipient: {name, creditAmount} }
  → side effect: if recipientStatus=invited → set to "opened", set openedAt

POST   /api/v1/redemptions/:token/send-otp
  → body: { contact: email|phone }
  → sends 6-digit OTP via email/SMS, stored hashed with 10-min TTL

POST   /api/v1/redemptions/:token/verify-otp
  → body: { code }
  → on success: recipientStatus → "verified", verifiedAt set
  → returns short-lived session token (separate from main JWT)

GET    /api/v1/redemptions/:token/catalog
  → returns products available (full shop catalog or selectedProductIds)

POST   /api/v1/redemptions/:token/submit
  → body: { items: [{productId, variant, qty}], shippingAddress }
  → MUST be idempotent (Idempotency-Key header)
  → validates total <= recipient.creditAmount
  → creates Order document (status=created)
  → recipientStatus → "redeemed" → "order_created"
  → returns { orderNumber, estimatedDelivery }

GET    /api/v1/redemptions/:token/track
  → returns order status + shipment tracking info
```

### 7.10 `orders` + `fulfillment` + `shipments` modules

```text
GET    /api/v1/orders                        → tenant-scoped (ABAC for entity_manager)
GET    /api/v1/orders/:id
PATCH  /api/v1/orders/:id/status             → body: {newStatus, note}
                                                → MUST go through stateMachine.service
                                                → only valid next-states accepted
                                                → writes to statusHistory[]

-- Platform-only routes --
GET    /api/v1/platform/orders               → all tenants, filterable
PATCH  /api/v1/platform/orders/:id/assign-vendor   → body: {vendorId}
GET    /api/v1/platform/production            → orders grouped by production status
GET    /api/v1/platform/shipments
POST   /api/v1/platform/shipments/:id/events  → manual tracking event entry
                                                  (Shiprocket webhook in post-MVP)
```

### 7.11 `payments` + `invoices` module

MVP: **manual PO upload is the primary funding method** (already in wallet
module). Razorpay integration is built but can run in sandbox mode:

```text
POST   /api/v1/payments/razorpay/order        → creates Razorpay order, returns order_id
POST   /api/v1/payments/razorpay/webhook      → verifies signature, on success:
                                                  creates Payment(status=succeeded)
                                                  → triggers wallet fund_in transaction
                                                  → generates Invoice
GET    /api/v1/invoices
GET    /api/v1/invoices/:id/pdf               → generated via pdf skill / pdfkit,
                                                  includes GSTIN, HSN codes, GST breakdown
```

**Always trust the webhook, never the frontend's "payment success" callback.**

### 7.12 `notifications` module

```text
GET    /api/v1/notifications                 → current user's notifications, paginated
PATCH  /api/v1/notifications/:id/read
PATCH  /api/v1/notifications/mark-all-read
```

`notification.worker.js` consumes jobs for:
- `campaign_launched` → notify entity manager
- `redemption_invite` → email to recipient with redemption link
- `order_status_changed` → notify recipient (via redemption portal context)
  and tenant admin
- `support_ticket_raised` → notify platform support queue

Email provider: use a transactional email API (Resend, SendGrid, or AWS SES —
pick one, configure via env var). WhatsApp: placeholder, log to console in MVP.

### 7.13 `auditLogs`, `idempotencyKeys`, `support` (platform)

```text
GET    /api/v1/platform/audit-logs           → filterable by tenant, actor, action, date range
GET    /api/v1/platform/support-tickets
POST   /api/v1/platform/support-tickets/:id/messages
PATCH  /api/v1/platform/support-tickets/:id/status
```

### 7.14 `integrationHub` (placeholder only)

```text
GET    /api/v1/integrations                  → returns static list with status="coming_soon"
                                                  for HRIS (Darwinbox, Keka), SSO (Okta, Azure),
                                                  Slack, Teams, Zapier
POST   /api/v1/integrations/:id/request-access  → logs interest, sends internal notification
```
Do not build real OAuth flows for these in MVP.

---

## 8. FRONTEND INTEGRATION — REPLACING MOCKS WITH REAL API

The frontend already has the full UI built against `src/mocks/db.ts` and a
service layer at `src/services/apiClient.js` (per the original Lovable prompt).
This section describes how to flip it to real data without rewriting components.

### 8.1 API Client Pattern

```typescript
// src/services/api.ts
const BASE_URL = import.meta.env.VITE_API_URL; // e.g. https://api.shelfmerch.io/api/v1

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().token;
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (res.status === 401) {
    // attempt refresh, else logout
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new ApiError(res.status, err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Wallets
  getWallets: () => apiFetch<Wallet[]>('/wallets'),
  createWallet: (data: WalletInput) => apiFetch<Wallet>('/wallets', { method: 'POST', body: JSON.stringify(data) }),
  allocateBudget: (walletId: string, allocations: Allocation[]) =>
    apiFetch(`/wallets/${walletId}/allocate`, { method: 'POST', body: JSON.stringify({ allocations }) }),
  // ... one function per endpoint, matching the route map in §7
};
```

### 8.2 TanStack Query Wiring

Every screen that currently reads from `S.wallets`, `S.shops`, etc. (mock store)
should be migrated to:

```typescript
const { data: wallets, isLoading, error } = useQuery({
  queryKey: ['wallets'],
  queryFn: api.getWallets,
});
```

Mutations (allocate budget, launch campaign, etc.) use `useMutation` and call
`queryClient.invalidateQueries(['wallets'])` on success to refresh.

### 8.3 Migration Order (do not do all at once)

1. **Auth first**: replace the mock `auth()` function with real
   `/api/v1/auth/login`, store JWT in Zustand (memory only, not localStorage),
   wire `/api/v1/auth/refresh` on 401.
2. **Wallets module**: this is the highest-value, most complex module — get the
   ledger working end-to-end first (create wallet → allocate → view transactions).
3. **Entities**: wire department CRUD + manager invites.
4. **Shops/Catalog/Kits**: wire shop creation, publish, catalog browsing.
5. **Contacts + CSV import**: wire the import job + polling UI.
6. **Campaigns**: wire the full create → allocate → launch flow, including the
   wallet debit.
7. **Redemption portal**: wire the public token-based flow — this has NO auth,
   test it in an incognito window.
8. **Orders + fulfillment**: wire order list, status updates, state machine
   enforcement on the status dropdown (only show valid next states returned by
   `GET /api/v1/orders/:id` → include `validNextStatuses` in the response).
9. **Platform control plane**: wire tenant list, impersonation, production,
   shipments, support.
10. **Payments/Invoices**: wire Razorpay sandbox + invoice PDF generation last.

### 8.4 Environment Toggle for Demo Mode

Keep `src/mocks/db.ts` in the repo. Add an env flag:

```typescript
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export const api = USE_MOCKS ? mockApi : realApi;
```

This lets the team demo the frontend without a backend running, and lets QA
test against a seeded staging backend.

---

## 9. BACKGROUND JOBS, WEBHOOKS, FILE STORAGE

### 9.1 BullMQ Queues

```javascript
// queues/index.js
export const csvImportQueue = new Queue('csv-import', { connection: redis });
export const notificationQueue = new Queue('notifications', { connection: redis });
export const mockupQueue = new Queue('mockup-generation', { connection: redis });
```

Each queue has a corresponding worker file in `apps/api/src/jobs/`. Workers run
in a separate process (`node src/jobs/index.js`) so they don't block the API.

### 9.2 File Storage (Cloudflare R2)

```javascript
// services/storage.service.js
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: { accessKeyId: process.env.R2_ACCESS_KEY, secretAccessKey: process.env.R2_SECRET_KEY },
});

export async function uploadFile(key, buffer, contentType) { ... }
export async function getSignedDownloadUrl(key) { ... }
```

Used for: tenant logos, collection/kit artwork, PO/agreement uploads, generated
invoice PDFs, mockup images.

Upload endpoints use `multer` with memory storage, max 25MB, validate
content-type (PDF/DOCX for agreements; SVG/PNG/JPG for artwork).

### 9.3 Razorpay Webhook

```text
POST /api/v1/payments/razorpay/webhook
```
- Verify `X-Razorpay-Signature` header against raw body using webhook secret
- On `payment.captured`: idempotently create Payment + WalletTransaction
- On `payment.failed`: mark Payment failed, notify tenant admin
- Respond 200 quickly (within 5s) — do heavy work in a queued job

### 9.4 Mockup Generation (placeholder for MVP)

`mockupQueue` jobs simply mark `collection.status = 'ready'` after a short
delay (simulating design team turnaround). Real image-compositing
(logo-on-product overlay) is post-MVP — log a TODO, do not build the image
pipeline now.

---

## 10. DEPLOYMENT, ENVIRONMENT, OBSERVABILITY

### 10.1 Environment Variables (`.env.example`)

```bash
NODE_ENV=development
PORT=4000

MONGODB_URI=mongodb+srv://...
REDIS_URL=redis://...

JWT_ACCESS_SECRET=...
JWT_REFRESH_SECRET=...
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=30d

R2_ENDPOINT=...
R2_ACCESS_KEY=...
R2_SECRET_KEY=...
R2_BUCKET=shelfmerch-assets

RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...

EMAIL_PROVIDER_API_KEY=...
EMAIL_FROM=noreply@shelfmerch.io

VITE_API_URL=http://localhost:4000/api/v1
VITE_USE_MOCKS=false
```

Validate all of these at boot using a Zod schema in `config/env.js` — fail fast
with a clear error if any required var is missing.

### 10.2 Local Development

```yaml
# docker-compose.yml
services:
  mongo:
    image: mongo:7
    ports: ["27017:27017"]
  redis:
    image: redis:7
    ports: ["6379:6379"]
  api:
    build: ./apps/api
    ports: ["4000:4000"]
    depends_on: [mongo, redis]
    env_file: .env
  worker:
    build: ./apps/api
    command: node src/jobs/index.js
    depends_on: [mongo, redis]
    env_file: .env
```

### 10.3 Production Hosting (MVP-appropriate, cheapest correct path)

- **Database**: MongoDB Atlas (free/shared tier to start, M10 when real tenants onboard)
- **Redis**: Upstash or Redis Cloud free tier
- **API + Workers**: Render or Railway — two services from the same repo
  (web service for API, background worker for `src/jobs/index.js`)
- **Frontend**: Vercel, Netlify, or Cloudflare Pages (static build of the
  Lovable-exported React app)
- **File storage**: Cloudflare R2
- **Domain**: `app.shelfmerch.io` (frontend), `api.shelfmerch.io` (backend)

### 10.4 Observability (minimum viable)

- Structured logging with `pino`, JSON logs to stdout (captured by the host platform)
- Error tracking: Sentry (free tier) for both frontend and backend
- Health check endpoint: `GET /api/v1/health` → checks Mongo + Redis connectivity
- Basic uptime monitoring: UptimeRobot or BetterStack on `/health`

---

## 11. TESTING STRATEGY

### 11.1 Backend

- **Unit tests** (Jest/Vitest): `ledger.service.js`, `stateMachine.service.js`,
  `pricing.service.js` — these contain the critical business logic and must
  have 100% branch coverage on the allowed/disallowed transition maps.
- **Integration tests**: spin up an in-memory MongoDB (`mongodb-memory-server`),
  test each module's routes end-to-end including RBAC/ABAC middleware (assert
  403s for cross-tenant and cross-entity access attempts).
- **Critical test cases that MUST exist**:
  - Entity manager A cannot read/write entity B's campaigns (cross-entity ABAC)
  - Tenant A's data never appears in Tenant B's API responses (cross-tenant)
  - Wallet allocation cannot exceed wallet balance
  - Order status cannot transition `created → shipped` directly
  - Campaign launch is idempotent (same Idempotency-Key → same result, no double-debit)
  - Redemption submit cannot exceed recipient's creditAmount
  - Impersonation blocks wallet/billing/role-change endpoints

### 11.2 Frontend

- Component tests for wizard steps (forward/back navigation preserves state)
- E2E (Playwright): the full happy path —
  signup → create wallet → allocate budget → create campaign → launch →
  open redemption link in new context → redeem → verify order appears in
  tenant's Orders page and platform's Orders page

---

## 12. PHASED DELIVERY PLAN

Do not attempt everything in one pass. Suggested phases for an AI coding agent
working with terminal access:

**Phase 1 — Foundation**
- Scaffold repo structure (§4)
- DB connection, Redis connection, env validation
- Auth module (login/refresh/logout) + User/RoleAssignment models
- Tenant + RBAC/ABAC middleware
- Health check endpoint
- Seed script with the demo data (Rubix, Chandra Sekhar, Priya Sharma, etc. —
  matching the frontend's mock data exactly)

**Phase 2 — Wallet Ledger**
- Wallet, WalletTransaction, Entity models
- ledger.service.js with MongoDB transactions
- Full wallet setup wizard endpoints (create → allocate → activate)
- Wire frontend Wallets module to real API (highest-risk integration first)

**Phase 3 — Catalog & Store**
- Shop, CatalogProduct (seed ~50 products from DEMO_PRODUCTS), Collection, Kit models
- Shop creation/publish, kit creation endpoints
- Wire frontend Shops/Swag/Kits

**Phase 4 — Contacts & Campaigns**
- Contact, ImportMapping models + CSV import worker
- Campaign, Recipient models + stateMachine.service.js
- Campaign create → allocate → launch (with wallet debit)
- Wire frontend Contacts + Campaigns

**Phase 5 — Redemption Portal**
- Public redemption endpoints (no auth)
- OTP service (email-based for MVP)
- Order creation from redemption submit
- Test in incognito against a real launched campaign from Phase 4

**Phase 6 — Orders, Fulfillment, Platform Control Plane**
- Order, Shipment, Vendor models
- Order status state machine + validNextStatuses in API responses
- Platform routes: tenants list, impersonation, production, shipments, support
- Wire frontend Orders + Platform pages

**Phase 7 — Payments, Invoices, Notifications**
- Razorpay sandbox integration + webhook
- Invoice generation (PDF)
- Notification queue + email sending
- Wire frontend Billing + notification bell

**Phase 8 — Hardening**
- Audit logging across all mutating endpoints
- Idempotency keys on critical routes
- Full test suite (§11)
- Deploy to staging, run E2E suite
- Production deployment

---

## 13. EXPLICIT CONSTRAINTS FOR THE AI CODING AGENT

DO NOT:
1. Build microservices — this is a modular monolith.
2. Build database-per-tenant — shared DB with `tenantId` on every document.
3. Store wallet balance as the source of truth — it's derived from the ledger.
4. Allow direct `.status =` assignment on Order/Campaign/Wallet — use
   `stateMachine.service.js`.
5. Build real SSO, HRIS sync, Slack/Teams, or Zapier integrations — placeholder
   endpoints only.
6. Trust frontend "payment success" — only Razorpay webhooks confirm payments.
7. Hard-delete any tenant data — soft delete via `deletedAt`.
8. Skip RBAC/ABAC middleware on any tenant-scoped route, including ones that
   "feel" safe (e.g., GET endpoints still need tenant scoping).
9. Build the real mockup/image-compositing pipeline — placeholder job that
   flips status after a delay.
10. Rewrite the existing frontend UI — only replace the data layer
    (`src/mocks/db.ts` → `src/services/api.ts`), preserving every component,
    layout, and interaction already built.

ALWAYS:
1. Write Zod validation for every request body.
2. Wrap multi-document financial operations (ledger writes) in MongoDB
   transactions/sessions.
3. Return `validNextStatuses` alongside any entity that has a state machine,
   so the frontend status dropdown only shows legal transitions.
4. Index `tenantId` (and `tenantId + status`, `tenantId + createdAt` where
   queried) on every tenant-scoped collection.
5. Log every state-changing action to AuditLog.
6. Use the exact field names from §5 schemas so the frontend mock-to-real
   migration is a near drop-in replacement.
7. Seed demo data matching the frontend's existing mocks (Rubix, same wallet
   amounts, same department names/colors) so the transition from mock to real
   data is visually seamless during demos.
