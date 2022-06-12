import { ColorEnum } from '../interfaces';
import { GameConfig } from '../config';
import Figure from '../Figure/Figure';
import { CanvasUtility } from '../utils/canvas.utility';
import { GameUtility } from '../utils/game.utility';
import { Game } from '../Game/Game';

interface CellState {
  has_figure: boolean;
  is_highlighted: boolean;
  is_active: boolean;
  is_movable: boolean;
  has_moves: boolean;
  move_figure: string | null;
}

export default class Cell {

  game: Game;
  context: CanvasRenderingContext2D;

  size: number;
  color!: ColorEnum;
  image!: string;

  row: number;
  column: number;
  state: CellState = {
    has_figure: true,
    is_highlighted: false,
    is_active: false,
    is_movable: false,
    has_moves: false,
    move_figure: null,
  };
  prevState!: CellState;

  constructor(row: number, column: number, context: CanvasRenderingContext2D, game: Game) {
    this.color = this.getColorByRowAndColumn(row, column);
    this.row = row;
    this.column = column;
    this.size = GameUtility.cellSize();
    this.context = context;
    this.game = game;
    this.image = `assets/images/cell_bg_${Math.floor(Math.random() * 8) + 1}.png`
  }

  _figure!: Figure | null;

  get figure(): Figure | null {
    return this._figure;
  }

  set figure(figure: Figure | null) {
    this._figure = figure;
    this.state.has_figure = !!figure;
  }

  get x(): number {
    return this.size * this.column + GameConfig.border_width * this.column + GameConfig.border_width + GameConfig.board.padding;
  }

  get y(): number {
    return this.size * Math.abs(this.row - 7) + GameConfig.border_width * Math.abs(this.row - 7) + GameConfig.border_width + GameConfig.board.padding;
  }

  get cellColor(): string {
    if (this.state.is_active) {
      return GameConfig.colors.move;
    }
    if (this.state.is_highlighted) {
      return this.color === ColorEnum.BLACK ? GameConfig.colors.black_hover : GameConfig.colors.white_hover;
    }
    return this.color === ColorEnum.BLACK ? GameConfig.colors.black : GameConfig.colors.white;
  }

  get coordinates(): string {
    return `${this.rowToLetter}${this.column + 1}`;
  }

  get rowToLetter(): string {
    return String.fromCharCode(65 + this.row);
  }

  getColorByRowAndColumn(row: number, column: number): ColorEnum {
    return ((row + 1) % 2 && (column + 1) % 2) || (!((row + 1) % 2) && !((column + 1) % 2)) ? ColorEnum.BLACK : ColorEnum.WHITE;
  }

  render(force: boolean = false) {
    if (force || !this.prevState || JSON.stringify(this.state) !== JSON.stringify(this.prevState)) {
      this.prevState = {...this.state};
      CanvasUtility.rect(this.context, this.x, this.y, this.size, this.size, {
        fill: true,
        fill_color: this.cellColor,
        stroke: true,
        line_color: GameConfig.colors.border,
        line_width: GameConfig.border_width,
      });
      CanvasUtility.image(this.context, this.x, this.y, this.size, this.size, this.image, {}, () => {
        if (this.figure?.image) {
          CanvasUtility.image(this.context, this.x, this.y, this.size, this.size, this.figure.image, {}, () => {
            if (this.state.is_movable) {
              CanvasUtility.circle(this.context, this.x + this.size / 2, this.y + this.size / 2, this.size / 4, {
                fill: true,
                fill_color: GameConfig.colors.move_attack,
              });
              if (this.state.move_figure) {
                CanvasUtility.image(this.context, this.x + this.size / 3, this.y + this.size / 3, this.size / 3, this.size / 3, this.state.move_figure);
              }
            }
          });
        }
      });
      if (this.state.is_movable && !this.figure) {
        CanvasUtility.circle(this.context, this.x + this.size / 2, this.y + this.size / 2, this.size / 4, {
          fill: true,
          fill_color: GameConfig.colors.move,
        });
        if (this.state.move_figure) {
          CanvasUtility.image(this.context, this.x + this.size / 3, this.y + this.size / 3, this.size / 3, this.size / 3, this.state.move_figure);
        }
      }
      if (this.state.has_moves) {
        CanvasUtility.rect(this.context, this.x, this.y + this.size - this.size / 20, this.size, this.size / 20, {
          fill: true,
          fill_color: GameConfig.colors.move,
        });
      }
    }
  }

}
