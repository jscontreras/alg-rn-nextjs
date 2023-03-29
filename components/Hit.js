import { Text } from "react-native";

export function Hit({ hit }) {
  return (
    <Text>{hit.skuProperties.displayName}</Text>
  );
}