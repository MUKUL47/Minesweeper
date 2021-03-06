export default class MinesweeperService {
  mines = [];
  mineProbability = { from: 0.2, outOf: 1.5 };
  config = 8;
  flaggedField = Math.random();
  cb;
  totalMines = 0;
  exposedGrids = 0;
  gameOverOrWon = false;
  availableGrids = [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  constructor(cb) {
    this.cb = cb;
  }
  setConfig(config) {
    this.config = config;
    return this;
  }
  setMineProbability(from, outOf) {
    this.mineProbability = { from: from || 0.2, outOf: outOf || 1.5 };
    return this;
  }
  intializeMines(config) {
    for (let i = 0; i < this.config; i++) {
      const row = [];
      for (let j = 0; j < this.config; j++) {
        const hasMine = this.getRandomMine();
        row.push({ i, j, hasMine, exposed: false });
        if (hasMine) this.totalMines++;
      }
      this.mines.push(row);
    }
    this.assignAdjacentMineData();
    return this;
  }

  assignAdjacentMineData() {
    for (let i = 0; i < this.config; i++) {
      for (let j = 0; j < this.config; j++) {
        this.mines[i][j]["surroudedMines"] = this.hasMine(i, j);
      }
    }
    return this;
  }

  hasMine(i, j) {
    return (
      (this.mines[i]?.[j + 1]?.hasMine || 0) +
      (this.mines[i]?.[j - 1]?.hasMine || 0) +
      (this.mines[i + 1]?.[j]?.hasMine || 0) +
      (this.mines[i - 1]?.[j]?.hasMine || 0) +
      (this.mines[i - 1]?.[j - 1]?.hasMine || 0) +
      (this.mines[i - 1]?.[j + 1]?.hasMine || 0) +
      (this.mines[i + 1]?.[j + 1]?.hasMine || 0) +
      (this.mines[i + 1]?.[j - 1]?.hasMine || 0)
    );
  }

  getRandomMine() {
    return (
      ((Math.random() * (this.mineProbability.outOf - 0)).toFixed(1) ===
        `${this.mineProbability.from}` &&
        1) ||
      0
    );
  }

  flag(i, j) {
    if (this.gameOverOrWon) return this;
    this.mines[i][j]["flagged"] =
      (this.mines[i][j]["flagged"] && false) || true;
    this.flaggedField = Math.random();
    this.cb?.((!this.mines[i][j]["flagged"] && "Unflagged") || "Flagged");
    return this;
  }

  onFieldClick(i, j) {
    if (this.gameOverOrWon) return this;
    if (this.mines?.[i]?.[j]?.flagged) {
      this.mines[i][j]["flagged"] = false;
      this.cb?.("Unflagged");
      return this;
    }
    if (this.mines?.[i]?.[j]?.hasMine) {
      this.mines[i][j].exposed = true;
      this.exposedGrids = 0;
      this.gameOverOrWon = "Gameover!";
      this.cb?.("Gameover!");
      return this;
    }
    if (
      !this.mines[i] ||
      !this.mines[i][j] ||
      this.mines[i]?.[j].exposed ||
      this.mines[i]?.[j].hasMine ||
      this.mines[i]?.[j]?.["surroudedMines"] > 0
    ) {
      if (this.mines?.[i]?.[j]) {
        this.exposedGrids++;
        this.mines[i][j].exposed = true;
      }
      return this;
    }
    this.exposedGrids++;
    this.mines[i][j].exposed = true;
    this.onFieldClick(i, j + 1);
    this.onFieldClick(i, j - 1);
    this.onFieldClick(i + 1, j);
    this.onFieldClick(i - 1, j);
  }
}
