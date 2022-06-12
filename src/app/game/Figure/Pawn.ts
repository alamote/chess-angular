import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';
import FigureMove from './FigureMove';

export default class Pawn extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.PAWN);

    this.moves = [
      new FigureMove(2, 0, ['isNotMoved', 'isVerticalPathEmpty', 'isEmpty', 'isWhite']),
      new FigureMove(1, 0, ['isEmpty', 'isWhite']),
      new FigureMove(1, -1, ['isEnemy', 'isWhite']),
      new FigureMove(1, 1, ['isEnemy', 'isWhite']),
      new FigureMove(-2, 0, ['isNotMoved', 'isVerticalPathEmpty', 'isEmpty', 'isBlack']),
      new FigureMove(-1, 0, ['isEmpty', 'isBlack']),
      new FigureMove(-1, -1, ['isEnemy', 'isBlack']),
      new FigureMove(-1, 1, ['isEnemy', 'isBlack']),
    ];
  }
}
