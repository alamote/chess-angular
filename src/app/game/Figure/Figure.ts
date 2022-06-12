import { ColorEnum, FigureEnum } from '../interfaces';

export default class Figure {

  color: ColorEnum;
  figure!: FigureEnum;

  constructor(color: ColorEnum) {
    this.color = color;
  }

  getImagePath(): string {
    if (!this.figure) {
      throw new Error('Figure is not set');
    }
    return `assets/icons/figures/${this.color}/${this.figure.toLowerCase()}.svg`
  }
}
