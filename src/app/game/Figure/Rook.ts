import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';
import FigureMove from './FigureMove';

export default class Rook extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.ROOK);

    for(let i = 1; i < 8; i++) {
      this.moves.push(new FigureMove(i, 0, ['isVerticalPathEmpty']));
      this.moves.push(new FigureMove(-i, 0, ['isVerticalPathEmpty']));
      this.moves.push(new FigureMove(0, i, ['isHorizontalPathEmpty']));
      this.moves.push(new FigureMove(0, -i, ['isHorizontalPathEmpty']));
    }
  }
}
