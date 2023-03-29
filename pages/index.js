import React from "react";
import { StyleSheet, Text, View } from "react-native";
import App from "./instantSearch";

export default function MyApp() {
  return (
    <App />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});