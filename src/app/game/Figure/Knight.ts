import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';
import FigureMove from './FigureMove';

export default class Knight extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.KNIGHT);

    this.moves = [
      new FigureMove(2, 1, ['isNotOwn']),
      new FigureMove(2, -1, ['isNotOwn']),
      new FigureMove(-2, 1, ['isNotOwn']),
      new FigureMove(-2, -1, ['isNotOwn']),
      new FigureMove(1, 2, ['isNotOwn']),
      new FigureMove(1, -2, ['isNotOwn']),
      new FigureMove(-1, 2, ['isNotOwn']),
      new FigureMove(-1, -2, ['isNotOwn']),
    ];
  }
}
