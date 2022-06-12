import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';
import FigureMove from './FigureMove';

export default class Bishop extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.BISHOP);

    for(let i = 1; i < 8; i++) {
      this.moves.push(new FigureMove(i, i, ['isDiagonalPathEmpty']));
      this.moves.push(new FigureMove(i, -i, ['isDiagonalPathEmpty']));
      this.moves.push(new FigureMove(-i, i, ['isDiagonalPathEmpty']));
      this.moves.push(new FigureMove(-i, -i, ['isDiagonalPathEmpty']));
    }
  }
}
