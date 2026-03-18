import { Card, ChoiceList, BlockStack, Text } from "@shopify/polaris";
import { useState } from "react";

export function AppliesToCard() {
  const [value, setValue] = useState("all");

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Applies to
        </Text>
        <ChoiceList
          choices={[
            { label: "All products", value: "all" },
            { label: "Specific products", value: "products" },
            { label: "Specific collections", value: "collections" },
          ]}
          selected={[value]}
          onChange={(val) => setValue(val[0])}
        />
      </BlockStack>
    </Card>
  );
}