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

export default class Board {

  canvas!: HTMLCanvasElement;
  context!: CanvasRenderingContext2D;

  size!: number;
  cells: Cell[] = [];
  figures: Figure[] = [];

  isRendering: boolean = false

  constructor() {
    this.setBoardSize();
    this.cells = Array(64).fill(null).map((_, i) => new Cell(Math.floor(i / 8), i % 8, this.size / 8));
  }

  setBoardSize() {
    this.size = Math.max(GameConfig.board.minSize, Math.min(window.innerWidth, window.innerHeight)) - GameConfig.board.margin * 4;
    if (this.size % 8 !== 0) {
      this.size = Math.floor(this.size / 8) * 8;
    }
    this.cells.forEach(cell => cell.size = (this.size - GameConfig.board.padding * 2) / 8 - GameConfig.lineWidth * 4);
    if (this.canvas) {
      this.canvas.width = this.size;
      this.canvas.height = this.size;
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
    this.render();
  }

  render() {
    if (this.isRendering) {
      return;
    }
    this.isRendering = true;
    if (!this.canvas) {
      this.canvas = document.querySelector('canvas.board') as HTMLCanvasElement;
      this.context = this.canvas.getContext('2d') as CanvasRenderingContext2D;
      this.cells.forEach(cell => cell.context = this.context);
    }
    if (!this.context) {
      throw new Error('Board: Canvas context is missing');
    }
    this.setBoardSize();
    this.context.strokeStyle = GameConfig.colors.line;
    this.context.fillStyle = GameConfig.colors.white;
    this.context.lineWidth = GameConfig.lineWidth;
    this.context.strokeRect(0, 0, this.size, this.size);
    this.context.fillRect(0, 0, this.size, this.size);
    this.cells.forEach(cell => cell.render());
    const cellSize = (this.size - GameConfig.board.padding * 2) / 8 - GameConfig.lineWidth * 4;
    for (let row = 1; row <= 8; row++) {
      this.context.lineWidth = 2;
      this.context.textAlign = 'center';
      this.context.textBaseline = 'middle';
      this.context.font = 'bold 24px Roboto';
      this.context.strokeText(row.toString(), (row - 1) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + (row - 1) * GameConfig.lineWidth * 2 + GameConfig.lineWidth, GameConfig.board.padding);
      this.context.strokeText(row.toString(), (row - 1) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + (row - 1) * GameConfig.lineWidth * 2 + GameConfig.lineWidth, this.size - GameConfig.board.padding);
      this.context.strokeText(String.fromCharCode(64 + row), GameConfig.board.padding, Math.abs(row - 8) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + Math.abs(row - 8) * GameConfig.lineWidth * 2 + GameConfig.lineWidth);
      this.context.strokeText(String.fromCharCode(64 + row), this.size - GameConfig.board.padding, Math.abs(row - 8) * cellSize + GameConfig.board.padding * 2 + cellSize / 2 + Math.abs(row - 8) * GameConfig.lineWidth * 2 + GameConfig.lineWidth);
    }
    setTimeout(() => this.isRendering = false, 100);
  }

  onMouseMove(event: MouseEvent) {
    if (this.isRendering) {
      return;
    }
    // this.cells.forEach(cell => cell.isHighlighted = false);
    this.getCellByXAndY(event.offsetX, event.offsetY)?.highlight();
  }

  onClick(event: MouseEvent) {
    this.getCellByXAndY(event.offsetX, event.offsetY)?.showMoves();
  }
}
