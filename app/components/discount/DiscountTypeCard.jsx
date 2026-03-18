import { Card, ChoiceList } from "@shopify/polaris";

export function DiscountTypeCard({ discountType, setDiscountType }) {
  return (
    <Card title="Discount type" sectioned>
      <ChoiceList
        title="Select discount type"
        choices={[
          { label: "Tiered percentage discount", value: "tiered" },
          { label: "Fixed bundle price", value: "bundle" },
        ]}
        selected={[discountType]}
        onChange={(value) => setDiscountType(value[0])}
      />
    </Card>
  );
}