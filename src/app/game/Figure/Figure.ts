import { ColorEnum, FigureEnum } from '../interfaces';
import FigureMove from './FigureMove';
import { Game } from '../Game/Game';
import Cell from '../Board/Cell';

export default class Figure {

  color: ColorEnum;
  multiplier: number = 1;
  figure!: FigureEnum;
  image!: string;

  moves: FigureMove[] = [];
  isMoved: boolean = false;

  constructor(color: ColorEnum) {
    this.color = color;
    this.multiplier = color === ColorEnum.WHITE ? 1 : -1;
  }

  setFigure(figure: FigureEnum) {
    this.figure = figure;
    this.image = `assets/icons/figures/${this.color}/${this.figure.toLowerCase()}.svg`;
  }

  getMoves(game: Game, cell: Cell): FigureMove[] {
    return this.moves.filter(move => move.isValid(game, cell));
  }

  hasMoves(game: Game, cell: Cell) {
    return !!this.getMoves(game, cell).length;
  }

  showMoves(game: Game, cell: Cell) {
    this.getMoves(game, cell).forEach(move => {
      const target = game.board.getCell(cell.row + move.row, cell.column + move.column);
      if (target) {
        target.state.is_movable = true;
        target.state.move_figure = cell?.figure?.image ?? null;
      }
    })
  }

}
