import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';

export default class Knight extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.KNIGHT);
  }
}
