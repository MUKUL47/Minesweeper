const { updateNodeSize, restart } = (() => {
  class MinesweeperService {
    mines = [];
    mineProbability = { from: 0.2, outOf: 1.5 };
    config = 8;
    flaggedField = Math.random();
    cb;
    totalMines = 0;
    exposedGrids = 0;
    gameOverOrWon = false;
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
      this.mines[i][j]["flagged"] = this.mines[i][j]["flagged"] ? false : true;
      return this;
    }

    onFieldClick(i, j) {
      if (this.gameOverOrWon) return this;
      if (this.mines?.[i]?.[j]?.flagged) {
        // this.mines[i][j]["flagged"] = false;
        return;
      }
      if (this.mines?.[i]?.[j]?.hasMine) {
        this.mines[i][j].exposed = true;
        this.exposedGrids = 0;
        this.gameOverOrWon = "Gameover!";
        this.cb?.("Gameover!");
        return;
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
      this.onFieldClick(i, Number(j) + 1);
      this.onFieldClick(i, Number(j) - 1);
      this.onFieldClick(Number(i) + 1, j);
      this.onFieldClick(Number(i) - 1, j);
    }
  }
  const minesweeperElement = document.getElementById("minesweeper");
  minesweeperElement.addEventListener("click", onFieldClick);
  minesweeperElement.addEventListener("contextmenu", onRightClick);
  let gridConfig = 10;
  let zoom = 24;
  let minesweeper = new MinesweeperService((message) => {
    setTimeout(() => {
      alert(message);
      document.querySelector("body").innerHTML = "<div id='minesweeper'></div>";
    });
  })
    .setConfig(20)
    .intializeMines();
  function initializeNodes() {
    for (let i = 0; i < minesweeper.config; i++) {
      const row = document.createElement("div");
      for (let j = 0; j < minesweeper.config; j++) {
        const e = document.createElement("p");
        e.id = `${i},${j}`;
        e.className = "node";
        e.style.width = `${zoom}px`;
        e.style.height = `${zoom}px`;
        row.appendChild(e);
      }
      minesweeperElement.appendChild(row);
    }
  }
  function updateMineData() {
    const mines = minesweeper.mines;
    for (let i = 0; i < minesweeper.config; i++) {
      for (let j = 0; j < minesweeper.config; j++) {
        const field = document.getElementById(`${i},${j}`);
        field.setAttribute("data-exposed", mines[i][j].exposed);
        field.setAttribute("data-flagged", (mines[i][j].flagged && "1") || "0");
        if (mines[i][j].exposed) {
          if (mines[i][j]?.hasMine) {
            field.setAttribute("data-mineexposed", "1");
          } else if (mines[i][j]?.surroudedMines >= 0) {
            field.setAttribute(
              "data-field",
              (mines[i][j]?.surroudedMines === 0 && "0") || "1"
            );
            field.innerHTML = mines[i][j]?.surroudedMines || "";
          }
        }
      }
    }
  }
  function main(restart) {
    minesweeper = new MinesweeperService((message) => {
      setTimeout(() => alert(message));
    })
      .setConfig(gridConfig)
      .intializeMines();
    setMines(minesweeper.totalMines);
    if (!restart) {
      addGridOptions();
    }
    initializeNodes();
    updateMineData();
  }

  function addGridOptions() {
    const select = document.querySelector("select");
    select.addEventListener("change", onGridChange);
    for (let i = 10; i < 51; i++) {
      const e = document.createElement("option");
      e.innerHTML = i;
      e.setAttribute("value", i);
      select.appendChild(e);
    }
  }

  function setMines(mines) {
    document.getElementById(
      "total_mines"
    ).innerHTML = `Mines : <strong>${mines}</strong>`;
  }

  function onRightClick(e) {
    const {
      target: { id },
    } = e;
    e.preventDefault();
    if (id === "minesweeper") return;
    const [i, j] = id.split(",");
    minesweeper.flag(i, j);
    updateMineData();
  }
  function onFieldClick({ target: { id } }) {
    if (id === "minesweeper") return;
    const [i, j] = id.split(",");
    minesweeper.onFieldClick(i, j);
    updateMineData();
  }

  function restart() {
    minesweeperElement.innerHTML = "";
    setTimeout(() => main(true), 100);
  }

  function updateNodeSize() {
    zoom = document.querySelector("input").value;
    Array.from(document.getElementsByClassName("node")).forEach((e) => {
      e.style.width = `${zoom}px`;
      e.style.height = `${zoom}px`;
    });
  }

  function onGridChange(e) {
    gridConfig = e.target.value;
    restart();
  }
  main();

  return { updateNodeSize, restart };
})();
