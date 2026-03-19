import { Card, TextField, InlineStack, Button, BlockStack, Text } from "@shopify/polaris";

export function TieredConfigCard({ tiers, onTiersChange }) {
  const updateTier = (index, field, val) => {
    const updated = [...tiers];
    updated[index][field] = val;
    onTiersChange(updated);
  };

  const removeTier = (index) => {
    const updated = tiers.filter((_, i) => i !== index);
    onTiersChange(updated);
  };

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Tier configuration
        </Text>
        <BlockStack gap="200">
          {tiers.map((tier, index) => (
            <InlineStack gap="400" key={index} align="start">
              <div style={{ flex: 1 }}>
                <TextField
                  label="Minimum quantity"
                  labelHidden
                  placeholder="Quantity"
                  value={tier.qty}
                  onChange={(val) => updateTier(index, "qty", val)}
                  autoComplete="off"
                  type="number"
                />
              </div>
              <div style={{ flex: 1 }}>
                <TextField
                  label="Discount (%)"
                  labelHidden
                  placeholder="Discount %"
                  value={tier.discount}
                  onChange={(val) => updateTier(index, "discount", val)}
                  suffix="%"
                  autoComplete="off"
                  type="number"
                />
              </div>
              {tiers.length > 1 && (
                <Button 
                  onClick={() => removeTier(index)} 
                  variant="plain" 
                  tone="critical"
                  ariaLabel="Remove tier"
                >
                  Remove
                </Button>
              )}
            </InlineStack>
          ))}
        </BlockStack>
        <InlineStack align="start">
          <Button onClick={() => onTiersChange([...tiers, { qty: "", discount: "" }])}>
            Add tier
          </Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}