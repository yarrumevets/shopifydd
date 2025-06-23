import { GraphQLClient, gql } from "graphql-request";
import shopifyConfig from "./shopify.secret.js";

const gqlClient = new GraphQLClient(
  `${shopifyConfig.shopUrl}/admin/api/2025-04/graphql.json`,
  {
    headers: { "X-Shopify-Access-Token": shopifyConfig.adminApiAccessToken },
  }
);

const gqlOrderQuery = gql`
  query ($orderId: ID!) {
    order: node(id: $orderId) {
      ... on Order {
        id
        name
        displayFinancialStatus
        # customer {
        #   id
        #   email
        # }
        lineItems(first: 10) {
          nodes {
            title
            quantity
            variant {
              id
              sku
            }
            product {
              id
              title
            }
          }
        }
      }
    }
  }
`;

export { gqlClient, gqlOrderQuery };
