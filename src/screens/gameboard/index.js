import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ToastAndroid,
  Platform,
  AlertIOS,
  Picker,
} from "react-native";
import MinesweeperService from "./minesweeper.service";
import {
  MinesweeperView,
  MinesweeperGameBoard,
  MinesweeperHeader,
  MinesweeperHeaderText,
  MinesweeperHeaderText_,
} from "./minesweeper.style";
import Mines from "../mines";
function Minesweeper() {
  const [minesweeper, setMinesweeper] = useState({
    service: new MinesweeperService(toast)
      .setMineProbability(0.2, 0.8)
      .intializeMines(8),
  });
  function toast(message) {
    if (Platform?.OS === "android") {
      ToastAndroid?.show(message, ToastAndroid.SHORT);
    } else {
      AlertIOS?.alert(message);
    }
  }
  function restart(config) {
    setMinesweeper({
      service: new MinesweeperService(toast)
        .setConfig(config || 8)
        .setMineProbability(0.2, 0.8)
        .intializeMines(8),
    });
  }
  const mines = useMemo(
    () => (
      <Mines
        minesweeper={minesweeper}
        setMinesweeper={setMinesweeper}
        toast={toast}
      />
    ),
    [
      minesweeper.service,
      minesweeper.service.mines,
      minesweeper.service.flaggedField,
    ]
  );
  return (
    <MinesweeperView>
      <MinesweeperHeaderText
        size={30}
        color={"#fff"}
        bgColor={"#000"}
        padding={"5px"}>
        Minesweeper
      </MinesweeperHeaderText>
      <MinesweeperHeader>
        <MinesweeperHeaderText size={18}>
          {minesweeper.service.totalMines}
        </MinesweeperHeaderText>
        <MinesweeperHeaderText size={20}>
          {minesweeper.service.gameOverOrWon || "Started"}
        </MinesweeperHeaderText>
      </MinesweeperHeader>
      <MinesweeperGameBoard>{mines}</MinesweeperGameBoard>
      <View style={{ flexDirection: "row" }}>
        <Picker
          onValueChange={(v) => restart(v)}
          selectedValue={minesweeper.service.config}
          style={{ flex: 1 }}>
          {minesweeper.service.availableGrids.map((grid) => {
            return (
              <Picker.Item
                key={grid}
                value={grid}
                label={`${grid} X ${grid}`}></Picker.Item>
            );
          })}
        </Picker>
        <MinesweeperHeaderText_ onPress={() => restart()}>
          Restart
        </MinesweeperHeaderText_>
      </View>
    </MinesweeperView>
  );
}

export default Minesweeper;
