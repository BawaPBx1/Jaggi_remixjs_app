import { Card, Checkbox, Collapsible, Button } from "@shopify/polaris";
import { useState } from "react";

export function AdvancedSettingsCard() {
  const [open, setOpen] = useState(false);

  return (
    <Card
      title="Advanced settings"
      actions={[
        {
          content: open ? "Hide" : "Show",
          onAction: () => setOpen(!open),
        },
      ]}
    >
      <Collapsible open={open}>
        <Card.Section>
          <Checkbox label="Combine with other discounts" />
          <Checkbox label="Limit uses per customer" />
          <Checkbox label="Schedule start and end date" />
        </Card.Section>
      </Collapsible>
    </Card>
  );
}