import { Card, TextField } from "@shopify/polaris";
import { useState } from "react";

export function BundleConfigCard() {
  const [qty, setQty] = useState("4");
  const [price, setPrice] = useState("999");

  return (
    <Card title="Bundle configuration" sectioned>
      <TextField
        label="Bundle quantity"
        value={qty}
        onChange={setQty}
        autoComplete="off"
      />

      <TextField
        label="Bundle price"
        value={price}
        prefix="$"
        onChange={setPrice}
        autoComplete="off"
      />
    </Card>
  );
}