import db from "../db.server.js";

export async function moveUserToUninstalled(shop) {
  const user = await db.users.findUnique({ where: { shop }, });
  if (!user) {return;}
  
  await db.app_uninstalled_stores.upsert({
    where: { shop },
    update: { uninstalled_at: new Date(), },
    create: {
      shop: user.shop,
      domain: user.domain,
      store_id: user.store_id,
      email: user.email,
      store_name: user.store_name,
      store_owner: user.store_owner,
      currency: user.currency,
      country_name: user.country_name,
      user_status: "uninstalled",
      dev_preview: user.dev_preview,
      store_created_at: user.store_created_at,
      created_at: user.created_at,
      last_login: user.last_login,
    },
  });
  
  console.log("Moving user to uninstalled stores for :", shop);

  await db.users.delete({
    where: { shop },
  });
}