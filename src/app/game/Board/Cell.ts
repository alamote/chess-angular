import { ColorEnum } from '../interfaces';
import { GameConfig } from '../config';
import Figure from '../Figure/Figure';
import { CanvasUtility } from '../utils/canvas.utility';
import { GameUtility } from '../utils/game.utility';

interface CellState {
  has_figure: boolean;
  is_highlighted: boolean;
}

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

  state!: CellState;
  prevState!: CellState;

  constructor(row: number, column: number) {
    this.color = this.getColorByRowAndColumn(row, column);
    this.row = row;
    this.column = column;
    this.size = GameUtility.cellSize();
  }

  get isOwn(): boolean {
    return this.figure?.color === ColorEnum.WHITE;
  }

  get x(): number {
    return this.size * this.column + GameConfig.line_width * this.column + GameConfig.line_width;
  }

  get y(): number {
    return this.size * Math.abs(this.row - 7) + GameConfig.line_width * Math.abs(this.row - 7) + GameConfig.line_width;
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

  render(force: boolean = false) {
    this.state = this.getState();
    if (!this.isRendering && !force && this.prevState && JSON.stringify(this.state) === JSON.stringify(this.prevState)) {
      return;
    }
    this.isRendering = true;
    this.prevState = {...this.state};
    if (!this.context) {
      throw new Error('Cell: this.context is missing');
    }
    if (!this.image) {
      this.image = `assets/images/cell_bg_${Math.floor(Math.random() * 8) + 1}.png`;
    }

    CanvasUtility.rect(this.context, this.x, this.y, this.size, this.size, {
      fill: true,
      fill_color: this.cellColor,
      stroke: true,
      line_color: GameConfig.colors.line,
      line_width: GameConfig.line_width
    });
    // CanvasUtility.image(this.context, this.x, this.y, this.size, this.size, this.image, {}, () => {
      // if (this.figure?.image) {
      //   const options = this.isHighlighted ? {
      //     shadow_blur: 20,
      //     shadow_color: this.figure.color === ColorEnum.WHITE ? 'green' : 'red',
      //   } : {};
      //   CanvasUtility.image(this.context, this.x, this.y, this.size, this.size, this.figure.image, options, () => this.isRendering = false);
      // } else {
      //   this.isRendering = false;
      // }
    // });
  }

  highlight() {
    this.isHighlighted = true;
  }

  showMoves() {
    if (!this.isOwn) {
      return;
    }
  }

  getState(): CellState {
    return {
      has_figure: !!this.figure,
      is_highlighted: this.isHighlighted
    }
  }
}
