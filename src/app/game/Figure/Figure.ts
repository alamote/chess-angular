import { ColorEnum, FigureEnum } from '../interfaces';

export default class Figure {

  color: ColorEnum;
  figure!: FigureEnum;
  image!: string;

  constructor(color: ColorEnum) {
    this.color = color;
  }

  setFigure(figure: FigureEnum) {
    this.figure = figure;
    this.image = `assets/icons/figures/${this.color}/${this.figure.toLowerCase()}.svg`;
    // CanvasUtility.toDataURL(`assets/icons/figures/${this.color}/${this.figure.toLowerCase()}.svg`, base64 => this.image = base64)
  }

}
