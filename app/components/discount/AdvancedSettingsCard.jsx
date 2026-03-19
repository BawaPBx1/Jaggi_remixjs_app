import { Card, Checkbox, Collapsible, Button, InlineStack, BlockStack, Text, TextField, FormLayout } from "@shopify/polaris";
import { useState } from "react";

export function AdvancedSettingsCard({ 
  combineWithOthers, 
  onCombineChange,
  limitUsesPerCustomer,
  onLimitUsesChange,
  usageLimit,
  onUsageLimitChange,
  scheduleEnabled,
  onScheduleEnabledChange,
  startsAt,
  onStartsAtChange,
  endsAt,
  onEndsAtChange
}) {
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
            <Checkbox 
              label="Combine with other discounts" 
              checked={combineWithOthers} 
              onChange={onCombineChange}
            />
            <BlockStack gap="200">
              <Checkbox 
                label="Limit uses per customer" 
                checked={limitUsesPerCustomer}
                onChange={onLimitUsesChange}
              />
              {limitUsesPerCustomer && (
                <div style={{ marginLeft: "2.4rem" }}>
                  <TextField
                    label="How many times can a customer use this discount?"
                    type="number"
                    value={usageLimit}
                    onChange={onUsageLimitChange}
                    autoComplete="off"
                  />
                </div>
              )}
            </BlockStack>
            <BlockStack gap="200">
              <Checkbox 
                label="Schedule start and end date" 
                checked={scheduleEnabled}
                onChange={onScheduleEnabledChange}
              />
              {scheduleEnabled && (
                <div style={{ marginLeft: "2.4rem" }}>
                  <FormLayout>
                    <FormLayout.Group>
                      <TextField
                        label="Start date"
                        type="datetime-local"
                        value={startsAt}
                        onChange={onStartsAtChange}
                        autoComplete="off"
                      />
                      <TextField
                        label="End date"
                        type="datetime-local"
                        value={endsAt}
                        onChange={onEndsAtChange}
                        autoComplete="off"
                      />
                    </FormLayout.Group>
                  </FormLayout>
                </div>
              )}
            </BlockStack>
          </BlockStack>
        </Collapsible>
      </BlockStack>
    </Card>
  );
}