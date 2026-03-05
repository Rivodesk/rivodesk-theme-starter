# Rivodesk Theme Starter

A Next.js 14 headless Shopify storefront starter — the base for all themes built with [Rivodesk](https://rivodesk.com).

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Shopify**: Storefront API via GraphQL (`graphql-request`)
- **Animations**: Framer Motion
- **Deploy**: Vercel

## Getting started

1. Clone this repo
2. Copy `.env.example` to `.env.local` and fill in your Shopify credentials
3. Install dependencies: `npm install`
4. Run dev server: `npm run dev`

## Environment variables

```
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
```

You can find your Storefront API access token in your Shopify admin under **Apps → Develop apps → your app → API credentials**.

## Project structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage (product grid)
│   └── globals.css       # Global styles + CSS variables
├── components/
│   ├── Header.tsx        # Site header with cart icon
│   └── ProductCard.tsx   # Product card component
└── lib/
    ├── shopify.ts        # Storefront API client
    └── queries.ts        # GraphQL queries
```

## Managed by Rivodesk

This theme is managed via the Rivodesk Theme Builder. You can edit files directly here in GitHub, or use the Rivodesk editor for AI-assisted development.
