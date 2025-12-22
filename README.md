This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:

### Paystack Configuration

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_public_key_here
```

Get your keys from [Paystack Dashboard](https://dashboard.paystack.com/#/settings/developer)
- Use `pk_test_...` for testing
- Use `pk_live_...` for production

### Shopkeeper POS API Configuration

```env
NEXT_PUBLIC_SHOPKEEPER_AUTH_TOKEN=your_bearer_token_here
NEXT_PUBLIC_SHOPKEEPER_BRANCH_ID=your_branch_id_here
NEXT_PUBLIC_SHOPKEEPER_BUSINESS_ID=your_business_id_here
NEXT_PUBLIC_SHOPKEEPER_MEMBER_ID=your_member_id_here
```

**How to get Shopkeeper credentials:**
1. Log in to [Shopkeeper POS](https://web.shopkeeperpos.com/)
2. Open browser DevTools (F12) → Network tab
3. Create an invoice manually
4. Find the API request to `https://api.bigmerchant.co/v1/shopkeeper/invoices`
5. Copy the following from the request headers:
   - `authorization: Bearer <token>` → `NEXT_PUBLIC_SHOPKEEPER_AUTH_TOKEN`
   - `x-branch-id` → `NEXT_PUBLIC_SHOPKEEPER_BRANCH_ID`
   - `x-member-id` → `NEXT_PUBLIC_SHOPKEEPER_MEMBER_ID`
6. Copy from the request body:
   - `businessId` → `NEXT_PUBLIC_SHOPKEEPER_BUSINESS_ID`

**Important:** After adding environment variables:
- Restart your development server (`npm run dev`)
- Environment variables are only loaded when the server starts
- If credentials are not configured, payments will still work but invoices won't be created automatically

**Note:** For production, you should initialize payments through your backend API for security. The current implementation uses the public key directly for demonstration purposes.

## Features

- ✅ Dark mode sleek design
- ✅ Add to cart functionality
- ✅ Shopping cart sidebar
- ✅ Checkout page with form validation
- ✅ Paystack payment integration
- ✅ Automatic invoice creation in Shopkeeper POS after payment
- ✅ Order confirmation page

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
