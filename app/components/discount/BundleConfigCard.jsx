import { Card, TextField, BlockStack, Text } from "@shopify/polaris";

export function BundleConfigCard({ qty, onQtyChange, price, onPriceChange }) {
  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Bundle configuration
        </Text>
        <TextField
          label="Bundle quantity"
          value={qty}
          onChange={onQtyChange}
          autoComplete="off"
          type="number"
        />

        <TextField
          label="Bundle price"
          value={price}
          prefix="$"
          onChange={onPriceChange}
          autoComplete="off"
          type="number"
        />
      </BlockStack>
    </Card>
  );
}