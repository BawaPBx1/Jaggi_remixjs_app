import { Card, ChoiceList } from "@shopify/polaris";
import { useState } from "react";

export function AppliesToCard() {
  const [value, setValue] = useState("all");

  return (
    <Card title="Applies to" sectioned>
      <ChoiceList
        choices={[
          { label: "All products", value: "all" },
          { label: "Specific products", value: "products" },
          { label: "Specific collections", value: "collections" },
        ]}
        selected={[value]}
        onChange={(val) => setValue(val[0])}
      />
    </Card>
  );
}