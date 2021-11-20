import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import Minesweeper from "./screens/gameboard";

export default function App() {
  return (
    <React.Fragment>
      <StatusBar />
      <Minesweeper />
    </React.Fragment>
  );
}
