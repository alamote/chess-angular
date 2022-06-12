import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';

export default class Pawn extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.PAWN);
  }
}
