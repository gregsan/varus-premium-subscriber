# Varus Premium — Subscriber Cabinet

Mobile-first demo of a paid loyalty program subscription app. Three pages cover the full subscriber cycle: presentation/paywall (`/subscribe`), dashboard/usage (`/dashboard`), account/billing (`/account`).

## How to Adapt for a New Partner

### Step 1 — Theme (CSS variables)
Edit the `:root` block in `app/globals.css`. Change only the variable values — no component edits needed:
- `--primary` / `--primary-foreground` — brand accent color
- `--accent` / `--accent-foreground` — light tint for badges and highlights
- `--radius` — corner rounding

### Step 2 — Content (`lib/*-data.ts`)
- `lib/paywall-data.ts` — retail benefits, partner offers, insurance offers, digital services
- `lib/dashboard-data.ts` — insurance claim types, FAQ items
All arrays are typed — add, remove, or reorder rows without touching components.

### Step 3 — Block order (`lib/tenant-config.ts`)
Change the `dashboardBlocks` array to control which blocks appear on the dashboard and in what order:
```ts
dashboardBlocks: ['usage-stats', 'redeem-coupon', 'partner-services', 'insurance', 'retail-benefits']
```
The dashboard maps this array to a component registry — no JSX reordering needed.
