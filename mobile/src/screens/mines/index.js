import React from "react";
import MinesweeperService from "../gameboard/minesweeper.service";
import { Mine, MineRow } from "../gameboard/minesweeper.style";
function Mines({ minesweeper, setMinesweeper, toast }) {
  const onField = (i, j) => {
    if (minesweeper.service.gameOverOrWon) return;
    const service = new MinesweeperService(toast).setMineProbability(
      minesweeper.service.mineProbability.from,
      minesweeper.service.mineProbability.outOf
    );
    service.mines = minesweeper.service.mines;
    service.totalMines = minesweeper.service.totalMines;
    service.onFieldClick(i, j);
    setMinesweeper({ service });
  };
  return minesweeper.service.mines.map((mineRow, i) => {
    const row = mineRow.map((m, j) => {
      const exposedData = m.hasMine
        ? " "
        : m.surroudedMines
        ? m.surroudedMines
        : " ";
      return (
        <Mine
          onLongPress={() => {
            setMinesweeper({ service: minesweeper.service.flag(i, j) });
          }}
          onPress={() => onField(i, j)}
          key={j}
          onClick={() => onField(i, j)}
          exposed={m.exposed}
          hasMine={m.hasMine}
          flagged={m.flagged}
          borderTop={i === 0}
          borderLeft={j === 0}
          hasData={m.surroudedMines}>
          {m.exposed ? exposedData : " "}
        </Mine>
      );
    });
    return <MineRow key={i}>{row}</MineRow>;
  });
}
export default React.memo(Mines);
