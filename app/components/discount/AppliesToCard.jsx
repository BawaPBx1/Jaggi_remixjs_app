import { Card, ChoiceList, BlockStack, Text, Button, InlineStack, Badge } from "@shopify/polaris";

export function AppliesToCard({ selected, onSelect, selectedItems = [], onBrowse }) {
  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Applies to
        </Text>
        <ChoiceList
          choices={[
            { label: "All products", value: "all" },
            { label: "Specific products", value: "products" },
            { label: "Specific collections", value: "collections" },
          ]}
          selected={[selected]}
          onChange={(val) => onSelect(val[0])}
        />
        {(selected === "products" || selected === "collections") && (
          <BlockStack gap="200">
             <InlineStack align="start">
                <Button onClick={onBrowse}>
                    Select {selected === "products" ? "products" : "collections"}
                </Button>
             </InlineStack>
             
             {selectedItems.length > 0 && (
               <InlineStack gap="200">
                  {selectedItems.slice(0, 5).map((item, index) => {
                    const label = typeof item === 'string' ? item.split('/').pop() : (item.title || item.id);
                    return <Badge key={item.id || index}>{label}</Badge>
                  })}
                  {selectedItems.length > 5 && (
                    <Text variant="bodySm" tone="subdued">+{selectedItems.length - 5} more</Text>
                  )}
               </InlineStack>
             )}
          </BlockStack>
        )}
      </BlockStack>
    </Card>
  );
}