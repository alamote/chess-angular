import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';

export default class King extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.KING);
  }
}
