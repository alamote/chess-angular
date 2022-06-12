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
import { CanvasUtility } from '../utils/canvas.utility';
import { GameUtility } from '../utils/game.utility';
import { interval } from 'rxjs';

export default class Board {

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  initialized: boolean = false;

  size!: number;
  cells: Cell[] = [];
  figures: Figure[] = [];

  constructor() {
    this.cells = Array(64).fill(null).map((_, i) => new Cell(Math.floor(i / 8), i % 8));
  }

  setBoardSize() {
    if (!this.initialized || this.size !== GameUtility.boardSize()) {
      this.size = GameUtility.boardSize();
      this.cells.forEach(cell => cell.size = GameUtility.cellSize());
      if (this.canvas) {
        this.canvas.width = this.size;
        this.canvas.height = this.size;
        this.initialized = true;
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

    interval(1000 / 60).subscribe(this.render.bind(this));
  }

  render() {
    if (!this.canvas) {
      this.canvas = document.querySelector('canvas.board') as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      this.cells.forEach(cell => cell.context = this.context);
    }
    if (!this.context) {
      throw new Error('Board: Canvas context is missing');
    }
    const prevSize = this.size;
    this.setBoardSize();

    if (prevSize !== this.size) {
      CanvasUtility.rect(this.context, GameConfig.line_width / 2, GameConfig.line_width / 2, this.size - GameConfig.line_width, this.size - GameConfig.line_width, {
        stroke: true,
        line_color: GameConfig.colors.line,
        line_width: GameConfig.line_width,
        fill: true,
        fill_color: GameConfig.colors.black
      });

      // const cellSize = (this.size - GameConfig.board.padding * 2) / 8 - GameConfig.line_width * 4;
      // for (let row = 1; row <= 8; row++) {
      //   this.context.lineWidth = 2;
      //   this.context.textAlign = 'center';
      //   this.context.textBaseline = 'middle';
      //   this.context.font = 'bold 24px Montserrat';
      //   this.context.strokeStyle = GameConfig.colors.white;
      //   this.context.strokeText(row.toString(), (row - 1) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + (row - 1) * GameConfig.line_width * 2 + GameConfig.line_width, GameConfig.board.padding);
      //   this.context.strokeText(row.toString(), (row - 1) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + (row - 1) * GameConfig.line_width * 2 + GameConfig.line_width, this.size - GameConfig.board.padding);
      //   this.context.strokeText(String.fromCharCode(64 + row), GameConfig.board.padding, Math.abs(row - 8) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + Math.abs(row - 8) * GameConfig.line_width * 2 + GameConfig.line_width);
      //   this.context.strokeText(String.fromCharCode(64 + row), this.size - GameConfig.board.padding, Math.abs(row - 8) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + Math.abs(row - 8) * GameConfig.line_width * 2 + GameConfig.line_width);
      // }
    }

    this.cells.forEach(cell => cell.render(prevSize !== this.size));
  }

  onMouseLeave() {
    this.cells.forEach(cell => cell.isHighlighted = false);
  }

  onMouseMove(event: MouseEvent) {
    this.cells.forEach(cell => cell.isHighlighted = false);
    this.getCellByXAndY(event.offsetX, event.offsetY)?.highlight();
  }

  onClick(event: MouseEvent) {
    this.getCellByXAndY(event.offsetX, event.offsetY)?.showMoves();
  }
}
