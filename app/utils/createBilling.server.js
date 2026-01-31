export const createBilling = async (admin, planName, returnUrl) => {
  const plans = {
    Pro: 19,
    Enterprise: 49,
  };

  const price = plans[planName];
  if (!price) {
    throw new Error("Invalid plan selected");
  }

  if (!returnUrl || !returnUrl.startsWith("https://")) {
    throw new Error(`Invalid returnUrl: ${returnUrl}`);
  }

  const mutation = `
    mutation AppSubscriptionCreate(
      $name: String!
      $returnUrl: URL!
      $price: MoneyInput!
    ) {
      appSubscriptionCreate(
        name: $name
        returnUrl: $returnUrl
        test: true
        lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                price: $price
                interval: EVERY_30_DAYS
              }
            }
          }
        ]
      ) {
        confirmationUrl
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    name: `${planName} Plan`,
    returnUrl,
    price: {
      amount: price,
      currencyCode: "USD",
    },
  };

  const response = await admin.graphql(mutation, { variables });
  const json = await response.json();

  const result = json?.data?.appSubscriptionCreate;

  // console.log("checking the pricing json?.data :- ", result?.confirmationUrl);

  if (!result) {
    throw new Error("No response from Shopify billing API");
  }

  if (result.userErrors?.length) {
    throw new Error(result.userErrors[0].message);
  }

  if (!result.confirmationUrl) {
    throw new Error("No confirmation URL returned by Shopify");
  }

  return result.confirmationUrl;
};
