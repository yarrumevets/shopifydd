import express from "express";
import { getProductData, getOrderData, addOrder } from "./db.js";
import { getS3ProductUrl } from "./s3.js";
import path from "path";
import { fileURLToPath } from "url";

const SERVER_PORT = 4199;
const app = express();
app.use(express.static("public"));

// Customer paid webhook.
app.post(
  "/webhook/orders-paid",
  express.raw({ type: "application/json" }),
  (req, res) => {
    const rawBody = req.body;
    let body;
    if (!verifyShopifyWebhook(rawBody, req.headers)) {
      console.error("Webhook not verified!");
      return res.sendStatus(200);
    }
    body = JSON.parse(rawBody.toString("utf-8"));
    const orderInfo = {
      orderId: String(body.id),
      orderNumber: String(body.order_number),
      customerId: String(body.customer.id),
      variantIds: body.line_items.map((item) => String(item.variant_id)),
    };
    addOrder(orderInfo);
    res.sendStatus(200);
  }
);

// Customer order file URLs lookup
app.get("/api/getsignedorderurls/:orderId", async (req, res) => {
  // @TODO add more than just the order id. too easy to guess.
  const urls = [];
  const orderId = req.params.orderId;
  const orderVerified = verifyShopifyOrder(orderId);
  if (!orderVerified) {
    return res.status(404).send(`Order ${orderId} not found.`);
  }
  console.log("Looking up order id: ", orderId, " ...");
  const orderData = getOrderData();
  console.log("order data..", orderData);
  const order = orderData[orderId];
  if (!order) {
    return res.status(404).send("Order not found!");
  }
  // Iterate through order products to get s3 urls:
  for (const vId in order.variantIds) {
    const variantId = order.variantIds[vId];
    const productData = getProductData();
    const filePath = productData[variantId].filePath;
    if (!filePath) {
      return res.status(500).send("System error: Cannot find file path.");
    }
    const digitalAssetUrl = await getS3ProductUrl(filePath);
    if (!filePath) {
      return res.status(500).send("System error: Cannot generate signed URL.");
    }
    urls.push(digitalAssetUrl);
  }
  res.status(200).json({ urls: urls });
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.get("/order/:orderId", (req, res) =>
  res.sendFile(path.join(__dirname, "public", "digitalorder.html"))
);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
