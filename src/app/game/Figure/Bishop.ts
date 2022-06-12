import Figure from './Figure';
import { ColorEnum, FigureEnum } from '../interfaces';

export default class Bishop extends Figure {

  constructor(color: ColorEnum) {
    super(color);
    this.setFigure(FigureEnum.BISHOP);
  }
}
