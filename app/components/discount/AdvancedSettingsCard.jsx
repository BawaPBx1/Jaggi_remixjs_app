import { Card, Checkbox, Collapsible, Button, InlineStack, BlockStack, Text } from "@shopify/polaris";
import { useState } from "react";

export function AdvancedSettingsCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <BlockStack gap="400">
        <InlineStack align="space-between">
          <Text variant="headingMd" as="h2">
            Advanced settings
          </Text>
          <Button
            variant="plain"
            onClick={() => setOpen(!open)}
          >
            {open ? "Hide" : "Show"}
          </Button>
        </InlineStack>
        <Collapsible open={open}>
          <BlockStack gap="200">
            <Checkbox label="Combine with other discounts" />
            <Checkbox label="Limit uses per customer" />
            <Checkbox label="Schedule start and end date" />
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}