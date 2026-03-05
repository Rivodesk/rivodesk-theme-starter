import { shopifyClient, ShopifyProduct, ShopifyCollection } from './shopify';
import { gql } from 'graphql-request';

// ── Fragments ──────────────────────────────────────────────────────────────────

const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    title
    handle
    description
    featuredImage {
      url
      altText
      width
      height
    }
    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
      maxVariantPrice {
        amount
        currencyCode
      }
    }
    variants(first: 10) {
      edges {
        node {
          id
          title
          price {
            amount
            currencyCode
          }
          availableForSale
        }
      }
    }
  }
`;

// ── Products ───────────────────────────────────────────────────────────────────

const GET_PRODUCTS = gql`
  ${PRODUCT_FRAGMENT}
  query GetProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          ...ProductFields
        }
      }
    }
  }
`;

const GET_PRODUCT_BY_HANDLE = gql`
  ${PRODUCT_FRAGMENT}
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      ...ProductFields
    }
  }
`;

// ── Collections ────────────────────────────────────────────────────────────────

const GET_COLLECTIONS = gql`
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

const GET_COLLECTION_BY_HANDLE = gql`
  ${PRODUCT_FRAGMENT}
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      handle
      description
      image {
        url
        altText
        width
        height
      }
      products(first: $first) {
        edges {
          node {
            ...ProductFields
          }
        }
      }
    }
  }
`;

// ── Query functions ────────────────────────────────────────────────────────────

export async function getProducts(first = 24): Promise<ShopifyProduct[]> {
  const data = await shopifyClient.request<{
    products: { edges: Array<{ node: ShopifyProduct }> };
  }>(GET_PRODUCTS, { first });
  return data.products.edges.map((e) => e.node);
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyClient.request<{
    productByHandle: ShopifyProduct | null;
  }>(GET_PRODUCT_BY_HANDLE, { handle });
  return data.productByHandle;
}

export async function getCollections(first = 12): Promise<ShopifyCollection[]> {
  const data = await shopifyClient.request<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>(GET_COLLECTIONS, { first });
  return data.collections.edges.map((e) => e.node);
}

export async function getCollectionByHandle(
  handle: string,
  first = 24
): Promise<ShopifyCollection | null> {
  const data = await shopifyClient.request<{
    collectionByHandle: ShopifyCollection | null;
  }>(GET_COLLECTION_BY_HANDLE, { handle, first });
  return data.collectionByHandle;
}
