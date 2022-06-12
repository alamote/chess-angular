import { ColorEnum } from '../interfaces';
import { GameConfig } from '../config';
import Figure from '../Figure/Figure';

export default class Cell {

  context!: CanvasRenderingContext2D;

  size: number;
  color!: ColorEnum;
  image!: string;
  isRendering: boolean = false;
  isHighlighted: boolean = false;

  row: number;
  column: number;

  figure!: Figure | null;

  constructor(row: number, column: number, size: number) {
    this.color = this.getColorByRowAndColumn(row, column);
    this.row = row;
    this.column = column;
    this.size = size;
  }

  get isOwn(): boolean {
    return this.figure?.color === ColorEnum.WHITE;
  }

  get x(): number {
    return this.size * this.column + GameConfig.lineWidth * 2 * this.column + GameConfig.lineWidth + GameConfig.board.padding * 2;
  }

  get y(): number {
    return this.size * Math.abs(this.row - 7) + GameConfig.lineWidth * 2 * Math.abs(this.row - 7) + GameConfig.lineWidth + GameConfig.board.padding * 2;
  }

  get x2(): number {
    return this.x + this.size;
  }

  get y2(): number {
    return this.y + this.size;
  }

  get cellColor(): string {
    return this.color === ColorEnum.BLACK ? GameConfig.colors.black : GameConfig.colors.white;
  }

  getColorByRowAndColumn(row: number, column: number): ColorEnum {
    return ((row + 1) % 2 && (column + 1) % 2) || (!((row + 1) % 2) && !((column + 1) % 2)) ? ColorEnum.BLACK : ColorEnum.WHITE;
  }

  render() {
    if (this.isRendering) {
      return;
    }
    this.isRendering = true;
    if (!this.context) {
      throw new Error('Cell: this.context is missing');
    }
    if (!this.image) {
      this.image = `assets/images/cell_bg_${Math.floor(Math.random() * 8) + 1}.png`;
    }
    // draw border
    this.context.strokeStyle = GameConfig.colors.line;
    this.context.lineWidth = GameConfig.lineWidth;
    this.context.fillStyle = this.cellColor;
    this.context.beginPath();
    this.context.moveTo(this.x + GameConfig.lineWidth, this.y);
    this.context.lineTo(this.x + this.size - 4, this.y);
    this.context.quadraticCurveTo(this.x + this.size, this.y, this.x + this.size, this.y + GameConfig.lineWidth);
    this.context.lineTo(this.x + this.size, this.y + this.size - 4);
    this.context.quadraticCurveTo(this.x + this.size, this.y + this.size, this.x + this.size - GameConfig.lineWidth, this.y + this.size);
    this.context.lineTo(this.x + GameConfig.lineWidth, this.y + this.size);
    this.context.quadraticCurveTo(this.x, this.y + this.size, this.x, this.y + this.size - GameConfig.lineWidth);
    this.context.lineTo(this.x, this.y + GameConfig.lineWidth);
    this.context.quadraticCurveTo(this.x, this.y, this.x + GameConfig.lineWidth, this.y);
    this.context.closePath();
    this.context.stroke();
    this.context.fill();

    // draw background texture
    const bg = new Image(this.size, this.size);
    bg.onload = () => {
      this.context.drawImage(bg, this.x, this.y, this.size, this.size);
      // draw figure
      if (this.figure) {
        this.context.shadowColor = 'white';
        this.context.shadowBlur = 20;
        const figure = new Image(this.size, this.size);
        figure.onload = () => this.context.drawImage(figure, this.x, this.y, this.size, this.size)
        figure.src = this.figure.getImagePath();
      }
      this.isRendering = false;
    }
    bg.src = this.image;

    // this.context.lineWidth = 1;
    // this.context.fillStyle = 'yellow';
    // this.context.fillRect(this.x, this.y, 5, 5);
    // this.context.fillStyle = 'red';
    // this.context.fillRect(this.x2 - 5, this.y2 - 5, 5, 5);
    // this.context.fillStyle = 'green';
    // this.context.fillRect(this.x2 - 5, this.y, 5, 5);
    // this.context.fillStyle = 'blue';
    // this.context.fillRect(this.x, this.y2 - 5, 5, 5);

    // this.context.textAlign = 'left';
    // this.context.textBaseline = 'top';
    // this.context.strokeText(`${this.x} ${this.y}`, this.x, this.y);
    // this.context.textAlign = 'right';
    // this.context.strokeText(`${this.x2} ${this.y}`, this.x2, this.y);
    // this.context.textBaseline = 'bottom';
    // this.context.textAlign = 'left';
    // this.context.strokeText(`${this.x} ${this.y2}`, this.x, this.y2);
    // this.context.textAlign = 'right';
    // this.context.strokeText(`${this.x2} ${this.y2}`, this.x2, this.y2);
  }

  highlight() {
    if (this.isHighlighted) {
      return;
    }
    if (this.figure) {
      this.context.shadowColor = this.figure.color === ColorEnum.WHITE ? 'green' : 'red';
      this.context.shadowBlur = 20;
      this.isHighlighted = true;
      const figure = new Image(this.size, this.size);
      figure.onload = () => this.context.drawImage(figure, this.x, this.y, this.size, this.size)
      figure.src = this.figure.getImagePath();
    }
  }

  showMoves() {
    if (!this.isOwn) {
      return;
    }

  }
}
