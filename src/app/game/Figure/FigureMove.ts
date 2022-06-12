import { Game } from '../Game/Game';
import Cell from '../Board/Cell';
import Figure from './Figure';
import { ColorEnum } from '../interfaces';
import King from './King';

export default class FigureMove {

  multiplier: number = 1;
  row: number;
  column: number;
  conditions: string[] = []
  conditionCallbacks: { [name: string]: (game: Game, cell: Cell) => boolean } = {
    isBlack: (game: Game, cell: Cell) => cell?.figure?.color === ColorEnum.BLACK,
    isWhite: (game: Game, cell: Cell) => cell?.figure?.color === ColorEnum.WHITE,
    isNotOwn: (game: Game, cell: Cell) => !this.getTarget(game, cell)?.figure || !game.isOwn(game.activePlayer, this.getTarget(game, cell)?.figure as Figure),
    isEnemy: (game: Game, cell: Cell) => !!this.getTarget(game, cell)?.figure && !game.isOwn(game.activePlayer, this.getTarget(game, cell)?.figure as Figure),
    isEmpty: (game: Game, cell: Cell) => !this.getTarget(game, cell)?.figure,
    isNotEmpty: (game: Game, cell: Cell) => !!this.getTarget(game, cell)?.figure,
    isMoved: (game: Game, cell: Cell) => !!cell?.figure?.isMoved,
    isNotMoved: (game: Game, cell: Cell) => !cell?.figure?.isMoved,
    isCellExists: (game: Game, cell: Cell) => !!this.getTarget(game, cell),
    isVerticalPathEmpty: (game: Game, cell: Cell) => Array(Math.abs(this.row) - 1).fill(0).every((_, i) => !game.board.getCell(cell.row + (i + 1) * (this.row > 0 ? 1 : -1), cell.column)?.figure),
    isHorizontalPathEmpty: (game: Game, cell: Cell) => Array(Math.abs(this.column) - 1).fill(0).every((_, i) => !game.board.getCell(cell.row, cell.column + (i + 1) * (this.column > 0 ? 1 : -1))?.figure),
    isDiagonalPathEmpty: (game: Game, cell: Cell) => Array(Math.abs(this.row) - 1).fill(0).every((_, i) => !game.board.getCell(cell.row + (i + 1) * (this.row > 0 ? 1 : -1), cell.column + (i + 1) * (this.column > 0 ? 1 : -1))?.figure),
    isNotKing: (game: Game, cell: Cell) => !(this.getTarget(game, cell)?.figure instanceof King),
  }

  constructor(row: number, column: number, conditions: string[] = [], defaults: boolean = true) {
    this.row = row;
    this.column = column;
    this.conditions = conditions;
    if (defaults) {
      if (!this.conditions.includes('isCellExists')) {
        this.conditions.push('isCellExists');
      }
      if (!this.conditions.includes('isNotOwn')) {
        this.conditions.push('isNotOwn');
      }
      if (!this.conditions.includes('isNotKing')) {
        this.conditions.push('isNotKing');
      }
    }
  }

  getTarget(game: Game, cell: Cell): Cell | null {
    return game.board.getCell(cell.row + this.row, cell.column + this.column);
  }

  isValid(game: Game, cell: Cell): boolean {
    return this.conditions.every(condition => this.conditionCallbacks[condition](game, cell));
  }

}
