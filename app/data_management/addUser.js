import prisma from "../db.server";

export async function upsertUser(data) {
  return prisma.users.upsert({
    where: { shop: data.shop },
    update: {
      email: data.email,
      store_name: data.store_name,
      store_owner: data.store_owner,
      domain: data.domain,
      currency: data.currency,
      country_name: data.country_name,
      last_login: new Date(),
      user_status: "active",
    },
    create: {
      shop: data.shop,
      email: data.email,
      store_name: data.store_name,
      store_owner: data.store_owner,
      domain: data.domain,
      currency: data.currency,
      country_name: data.country_name,
      user_status: "active",
      store_created_at: data.store_created_at,
    },
  });
}