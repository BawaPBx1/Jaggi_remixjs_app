import { Card, TextField, InlineStack, Button } from "@shopify/polaris";
import { useState } from "react";

export function TieredConfigCard() {
  const [tiers, setTiers] = useState([
    { qty: "1", discount: "10" },
    { qty: "2", discount: "15" },
    { qty: "3", discount: "20" },
  ]);

  return (
    <Card title="Tier configuration" sectioned>
      {tiers.map((tier, index) => (
        <InlineStack gap="400" key={index}>
          <TextField
            label="Minimum quantity"
            value={tier.qty}
            autoComplete="off"
          />
          <TextField
            label="Discount (%)"
            value={tier.discount}
            suffix="%"
            autoComplete="off"
          />
        </InlineStack>
      ))}

      <div style={{ marginTop: "1rem" }}>
        <Button>Add tier</Button>
      </div>
    </Card>
  );
}