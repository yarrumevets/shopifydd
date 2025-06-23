import crypto from "crypto";
import { gqlClient, gqlOrderQuery } from "./graphql.js";
import shopifyConfig from "./shopify.secret.js";

const verifyShopifyOrder = async (orderId) => {
  const orderVerificationData = await gqlClient.request(gqlOrderQuery, {
    orderId: `gid://shopify/Order/${orderId}`,
  });
  return orderVerificationData.displayFinancialStatus === "PAID";
};

function verifyShopifyWebhook(rawBody, reqHeaders) {
  const hmac = reqHeaders["x-shopify-hmac-sha256"];
  const digest = crypto
    .createHmac("sha256", shopifyConfig.apiSecretKey)
    .update(rawBody)
    .digest("base64");
  return crypto.timingSafeEqual(
    Buffer.from(hmac, "base64"),
    Buffer.from(digest, "base64")
  );
}

export { verifyShopifyOrder, verifyShopifyWebhook };
