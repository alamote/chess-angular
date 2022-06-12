import { ColorEnum } from '../interfaces';

export default class Player {

  color: ColorEnum;
  name: string;

  constructor(name: string, color: ColorEnum) {
    this.name = name;
    this.color = color;
  }
}
