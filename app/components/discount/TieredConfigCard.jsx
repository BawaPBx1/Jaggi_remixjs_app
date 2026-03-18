import { Card, TextField, InlineStack, Button, BlockStack, Text } from "@shopify/polaris";
import { useState } from "react";

export function TieredConfigCard() {
  const [tiers, setTiers] = useState([
    { qty: "1", discount: "10" },
    { qty: "2", discount: "15" },
    { qty: "3", discount: "20" },
  ]);

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Tier configuration
        </Text>
        <BlockStack gap="200">
          {tiers.map((tier, index) => (
            <InlineStack gap="400" key={index} align="start">
              <TextField
                label="Minimum quantity"
                labelHidden
                placeholder="Quantity"
                value={tier.qty}
                autoComplete="off"
                type="number"
              />
              <TextField
                label="Discount (%)"
                labelHidden
                placeholder="Discount %"
                value={tier.discount}
                suffix="%"
                autoComplete="off"
                type="number"
              />
            </InlineStack>
          ))}
        </BlockStack>
        <InlineStack align="start">
          <Button onClick={() => setTiers([...tiers, { qty: "", discount: "" }])}>
            Add tier
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}