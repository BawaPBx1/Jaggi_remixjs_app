import { Card, ChoiceList, BlockStack, Text } from "@shopify/polaris";

export function DiscountTypeCard({ discountType, setDiscountType }) {
  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Discount type
        </Text>
        <ChoiceList
          title="Select discount type"
          titleHidden
          choices={[
            { label: "Tiered percentage discount", value: "tiered" },
            { label: "Fixed bundle price", value: "bundle" },
          ]}
          selected={[discountType]}
          onChange={(value) => setDiscountType(value[0])}
        />
      </BlockStack>
    </Card>
  );
}