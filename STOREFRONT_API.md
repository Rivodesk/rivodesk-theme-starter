# Rivodesk Storefront API

Alle data in dit thema loopt via de Rivodesk Storefront Edge Functions.  
Geen directe databasetoegang nodig — alleen 3 env vars:

```env
SUPABASE_URL=https://jouw-project.supabase.co
SUPABASE_ANON_KEY=jouw-anon-key
SHOP_ID=jouw-shop-uuid
```

De Next.js API routes in `src/app/api/` zijn dunne proxies die de edge functions aanroepen.  
Je kunt ze direct vanuit je componenten fetchen via `/api/...`.

---

## Producten

### Alle producten ophalen
```
GET /api/products
```
Geeft een array van actieve producten terug.

**Response:**
```json
[
  {
    "id": "uuid",
    "title": "Productnaam",
    "handle": "productnaam",
    "description": "<p>HTML beschrijving</p>",
    "vendor": "Merknaam",
    "product_type": "normal",
    "tags": ["tag1", "tag2"],
    "status": "ACTIVE",
    "seo_title": "SEO titel",
    "seo_description": "SEO beschrijving",
    "compare_at_price": 29.99,
    "images": [
      { "id": "uuid", "url": "https://...", "alt_text": "Alt tekst", "position": 0 }
    ],
    "variants": [
      {
        "id": "uuid",
        "title": "Default",
        "price": 24.99,
        "compare_at_price": 29.99,
        "inventory_qty": 10,
        "available": true,
        "sku": "SKU-001",
        "options": { "Kleur": "Rood", "Maat": "M" }
      }
    ],
    "options": [
      { "id": "uuid", "name": "Kleur", "values": ["Rood", "Blauw"], "position": 0 }
    ]
  }
]
```

---

### Één product ophalen
```
GET /api/products/:handle
```

**Voorbeeld:** `GET /api/products/blauwe-sneaker`

**Response:** Zelfde structuur als hierboven, maar dan één object.

---

## Collecties

### Alle collecties
```
GET /api/collections
```

**Response:**
```json
{
  "collections": [
    {
      "id": "uuid",
      "title": "Kleding",
      "handle": "kleding",
      "description": "Beschrijving",
      "image_url": "https://...",
      "image_alt": "Alt tekst"
    }
  ]
}
```

---

### Één collectie met producten
```
GET /api/collections?handle=kleding
```

**Response:**
```json
{
  "collection": {
    "id": "uuid",
    "title": "Kleding",
    "handle": "kleding",
    "collection_products": [
      {
        "position": 0,
        "products": { ...product object... }
      }
    ]
  }
}
```

---

## Zoeken

```
GET /api/search?q=sneaker
GET /api/search?q=sneaker&limit=24&offset=0
```

**Response:**
```json
{
  "products": [ ...product objecten... ],
  "total": 42,
  "query": "sneaker",
  "limit": 24,
  "offset": 0
}
```

---

## Navigatie

### Één menu ophalen (aanbevolen)
```
GET /api/navigation?handle=main-menu
GET /api/navigation?handle=footer
```

**Response:**
```json
{
  "menu": {
    "id": "uuid",
    "handle": "main-menu",
    "title": "Hoofdmenu",
    "items": [
      {
        "id": "uuid",
        "title": "Kleding",
        "url": "/collections/kleding",
        "resource_type": "collection",
        "resource_id": "uuid",
        "position": 0,
        "children": [
          { "id": "uuid", "title": "T-shirts", "url": "/collections/t-shirts", "position": 0, "children": [] }
        ]
      }
    ]
  }
}
```

### Alle menu's
```
GET /api/navigation
```

---

## Winkelwagen

De cart wordt automatisch opgeslagen op de server via een `session_id` in `localStorage`.  
Bij een nieuw bezoek wordt de cart hersteld.

De `CartContext` (`src/theme/components/CartContext.tsx`) beheert dit automatisch.  
Je hoeft de cart API niet direct aan te roepen — gebruik de context:

```tsx
import { useCart } from '@/theme/components/CartContext';

const { items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice, openDrawer } = useCart();

// Product toevoegen
addItem({
  variantId:    variant.id,
  productId:    product.id,
  title:        product.title,
  variantTitle: variant.title,
  price:        variant.price,
  imageUrl:     product.images[0]?.url ?? null,
  sku:          variant.sku ?? undefined,
});
```

**Handmatig de cart API aanroepen:**
```
POST /api/cart
Content-Type: application/json

// Ophalen
{ "action": "get", "session_id": "xxx" }

// Toevoegen
{ "action": "add", "session_id": "xxx", "item": { "product_id": "uuid", "variant_id": "uuid", "title": "Naam", "price": 24.99, "quantity": 1, "image_url": "https://...", "sku": "SKU-001" } }

// Bijwerken (quantity 0 = verwijderen)
{ "action": "update", "session_id": "xxx", "item": { "variant_id": "uuid", "quantity": 2 } }

// Leegmaken
{ "action": "clear", "session_id": "xxx" }
```

**Response:**
```json
{ "cart": { "id": "uuid", "session_id": "xxx", "line_items": [...], "total_cents": 4998 } }
```

---

## Checkout

```
POST /api/checkout
Content-Type: application/json

{
  "session_id": "xxx",
  "customer": {
    "email": "klant@email.com",
    "firstName": "Jan",
    "lastName": "Janssen",
    "phone": "+32 ...",
    "address": {
      "address1": "Kerkstraat 1",
      "city": "Brussel",
      "zip": "1000",
      "country": "BE"
    }
  },
  "items": [
    {
      "product_id": "uuid",
      "variantId": "uuid",
      "title": "Productnaam",
      "variantTitle": "Rood / M",
      "price": 24.99,
      "quantity": 2,
      "imageUrl": "https://..."
    }
  ],
  "total": 49.98,
  "currency": "EUR"
}
```

**Response:**
```json
{
  "clientSecret": "pi_...",
  "checkout_id": "uuid"
}
```

- `clientSecret` gebruik je om de Stripe/Mollie betaling te starten via Rivo Pay.
- De checkout wordt automatisch opgeslagen als *abandoned checkout* zodat je recovery emails kunt sturen.

---

## Bestellingen opzoeken

```
GET /api/orders?email=klant@email.com&order_number=ORD-0001
```

**Response:**
```json
{
  "id": "uuid",
  "order_number": "ORD-0001",
  "email": "klant@email.com",
  "financial_status": "paid",
  "fulfillment_status": "fulfilled",
  "total_price": 49.98,
  "currency": "EUR",
  "line_items": [...],
  "shipping_address": { "first_name": "Jan", "last_name": "Janssen", "address1": "...", "city": "Brussel", "zip": "1000", "country": "BE" },
  "tracking_number": "1Z...",
  "tracking_url": "https://...",
  "created_at": "2026-04-14T12:00:00Z"
}
```

---

## Shop info

```
GET /api/shop
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Mijn Shop",
  "store_domain": "mijn-shop.rivo.nl",
  "brand_color": "#C4956A",
  "widget_title": "Chat",
  "website_url": "https://mijn-shop.nl"
}
```

---

## Prijzen formatteren

Gebruik de meegeleverde helper:

```tsx
import { formatPrice } from '@/lib/rivodesk';

formatPrice(24.99)        // "€ 24,99"
formatPrice(24.99, 'USD') // "US$ 24,99"
```

---

## Een eigen thema bouwen

Dit is het **theme-starter** thema — de minimale basis voor een Rivodesk storefront.  
Alle thema-specifieke componenten staan in `src/theme/`:

```
src/theme/
├── components/
│   ├── CartContext.tsx   — cart state + server sync
│   ├── CartDrawer.tsx    — slide-in cart
│   ├── CheckoutForm.tsx  — checkout formulier
│   ├── Footer.tsx
│   ├── Header.tsx
│   ├── ProductCard.tsx
│   └── ProductGrid.tsx
├── templates/
│   ├── HomePage.tsx
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   ├── CheckoutPage.tsx
│   └── OrderLookupPage.tsx
├── styles/
│   └── theme.css         — CSS variabelen voor kleuren/fonts
└── index.ts              — exports
```

Pas `src/theme/styles/theme.css` aan voor je eigen huisstijl.

---

## Foutafhandeling

Alle endpoints geven bij een fout:
```json
{ "error": "Beschrijving van de fout" }
```
met een bijpassende HTTP status code (400, 404, 500).
