import { Card, TextField, BlockStack, Text } from "@shopify/polaris";
import { useState } from "react";

export function BundleConfigCard() {
  const [qty, setQty] = useState("4");
  const [price, setPrice] = useState("999");

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Bundle configuration
        </Text>
        <TextField
          label="Bundle quantity"
          value={qty}
          onChange={setQty}
          autoComplete="off"
          type="number"
        />

        <TextField
          label="Bundle price"
          value={price}
          prefix="$"
          onChange={setPrice}
          autoComplete="off"
          type="number"
        />
      </BlockStack>
    </Card>
  );
}