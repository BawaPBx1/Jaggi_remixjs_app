import { authenticate } from "../shopify.server";
import db from "../db.server";
import { moveUserToUninstalled } from "../data_management/appUninstalledStores.js";

export const action = async ({ request }) => {
  const { shop, session, topic } = await authenticate.webhook(request);

  if (topic === "APP_UNINSTALLED") {
    // await db.users.deleteMany({
    //   where: { shop },
    // });
    moveUserToUninstalled(shop);

    console.log(`App uninstalled from ${shop}`);
  }
  
  console.log(`Received ${topic} webhook for ${shop}`);

  // Webhook requests can trigger multiple times and after an app has already been uninstalled.
  // If this webhook already ran, the session may have been deleted previously.
  if (session) {
    await db.session.deleteMany({ where: { shop } });
  }

  return new Response();
};
