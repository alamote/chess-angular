import { GameConfig } from '../config';
import { ColorEnum } from '../interfaces';
import Cell from './Cell';
import Figure from '../Figure/Figure';
import Pawn from '../Figure/Pawn';
import Rook from '../Figure/Rook';
import Knight from '../Figure/Knight';
import Bishop from '../Figure/Bishop';
import King from '../Figure/King';
import Queen from '../Figure/Queen';
import { CanvasUtility, DrawOptions } from '../utils/canvas.utility';
import { GameUtility } from '../utils/game.utility';
import { Game } from '../Game/Game';

interface BoardState {
  size: number;
}

export default class Board {

  game: Game;

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  initialized: boolean = false;

  size!: number;
  cells: Cell[] = [];
  figures: Figure[] = [];

  state!: BoardState;
  prevState!: BoardState;

  constructor(game: Game) {
    this.game = game;
    this.canvas = document.querySelector('canvas.board') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    for (let row = 0; row < 8; row++) {
      for (let column = 0; column < 8; column++) {
        this.cells.push(new Cell(row, column, this.context, game));
      }
    }
  }

  setBoardSize() {
    if (this.size !== GameUtility.boardSize()) {
      this.size = GameUtility.boardSize();
      this.cells.forEach(cell => cell.size = GameUtility.cellSize());
      if (this.canvas) {
        this.canvas.width = this.size;
        this.canvas.height = this.size;
      }
    }
  }

  getCell(row: number, column: number): Cell {
    return this.cells.find(cell => cell.row === row && cell.column === column) as Cell;
  }

  getCellByXAndY(x: number, y: number): Cell {
    return this.cells.find(cell => x >= cell.x && x <= (cell.x + cell.size) && y >= cell.y && y <= (cell.y + cell.size)) as Cell;
  }

  reset() {
    this.setBoardSize();
    this.cells.forEach(cell => cell.figure = null);
    [0, 7].forEach(row => {
      const color = !row ? ColorEnum.WHITE : ColorEnum.BLACK;
      this.getCell(row, 0).figure = new Rook(color);
      this.getCell(row, 1).figure = new Knight(color);
      this.getCell(row, 2).figure = new Bishop(color);
      this.getCell(row, 3).figure = new Queen(color);
      this.getCell(row, 4).figure = new King(color);
      this.getCell(row, 5).figure = new Bishop(color);
      this.getCell(row, 6).figure = new Knight(color);
      this.getCell(row, 7).figure = new Rook(color);
    });
    [1, 6].forEach(row => {
      for (let column = 0; column < 8; column++) {
        this.getCell(row, column).figure = new Pawn(row === 1 ? ColorEnum.WHITE : ColorEnum.BLACK);
      }
    });
    this.render();
  }

  render(force: boolean = false) {
    this.state = this.getState();
    if (force || !this.prevState || JSON.stringify(this.state) !== JSON.stringify(this.prevState)) {
      this.prevState = {...this.state};
      CanvasUtility.rect(this.context, GameConfig.border_width / 2, GameConfig.border_width / 2, this.size - GameConfig.border_width, this.size - GameConfig.border_width, {
        stroke: true,
        line_color: GameConfig.colors.border,
        line_width: GameConfig.border_width,
        fill: true,
        fill_color: GameConfig.colors.black
      });

      const cellSize = this.cells[0].size;
      const textOptions: DrawOptions = {
        line_width: 2,
        text_align: 'center',
        text_valign: 'middle',
        font: '18px Arial',
        line_color: GameConfig.colors.white,
      };
      for (let row = 1; row <= 8; row++) {
        CanvasUtility.text(this.context, row.toString(), (row - 1) * cellSize + cellSize / 2 + GameConfig.board.padding + GameConfig.border_width * 1.15 * (row - 1) + 3, GameConfig.board.padding / 2 + 2, textOptions);
        CanvasUtility.text(this.context, row.toString(), (row - 1) * cellSize + cellSize / 2 + GameConfig.board.padding + GameConfig.border_width * 1.15 * (row - 1) + 3, this.size - GameConfig.board.padding / 2 - 2, textOptions);
        CanvasUtility.text(this.context, String.fromCharCode(64 + row), GameConfig.board.padding / 2, Math.abs(row - 8) * cellSize + cellSize / 2 + GameConfig.board.padding + GameConfig.border_width * 1.3 * Math.abs(row - 8), textOptions);
        CanvasUtility.text(this.context, String.fromCharCode(64 + row), this.size - GameConfig.board.padding / 2, Math.abs(row - 8) * cellSize + cellSize / 2 + GameConfig.board.padding + GameConfig.border_width * 1.3 * Math.abs(row - 8), textOptions);
      }

      this.cells.forEach(cell => cell.render(true));
    }
    this.cells.forEach(cell => {
      cell.state.has_moves = this.game.activePlayer.color === cell.figure?.color && cell?.figure?.hasMoves(this.game, cell);
      cell.render()
    });

    requestAnimationFrame(() => this.render());
  }

  getState(): BoardState {
    return {
      size: GameUtility.boardSize()
    }
  }
}
