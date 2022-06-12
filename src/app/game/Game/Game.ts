import Player from '../Player/Player';
import { ColorEnum } from '../interfaces';
import { Log } from './Log';
import Cell from '../Board/Cell';
import { Move } from './Move';
import Board from '../Board/Board';
import Figure from '../Figure/Figure';

export class Game {

  board: Board;

  log: Log = new Log();
  players: Player[] = [];

  activePlayer!: Player;

  constructor() {
    this.players.push(new Player('Sergey', ColorEnum.WHITE));
    this.players.push(new Player('Vet', ColorEnum.BLACK));

    this.changePlayer();

    this.board = new Board(this);
    this.board.reset();
  }

  get activeCell(): Cell | null {
    return this.board.cells.find(cell => cell.state.is_active) ?? null;
  }

  move(player: Player, from: Cell, to: Cell) {
    this.log.add(new Move(player, from, to));
  }

  changePlayer() {
    this.activePlayer = this.activePlayer === this.players[0] ? this.players[1] : this.players[0];
  }

  isOwn(player: Player, figure: Figure) {
    return figure.color === player.color;
  }

  onClick(event: MouseEvent) {
    const cell = this.board.getCellByXAndY(event.offsetX, event.offsetY);
    if (cell?.state.is_movable && this.activeCell) {
      this.move(this.activePlayer, this.activeCell, cell);
      this.changePlayer();
    }
    this.board.cells.forEach(cell => cell.state.is_movable = false);
    if (cell?.state.is_active) {
      cell.state.is_active = false;
      return;
    }
    this.board.cells.forEach(cell => cell.state.is_active = false);
    if (cell?.figure && cell?.state.has_moves) {
      cell.state.is_active = true;
      cell.figure.showMoves(this, cell);
    }
  }

  onMouseLeave() {
    this.board.cells.forEach(cell => cell.state.is_highlighted = false);
  }

  onMouseMove(event: MouseEvent): boolean {
    this.board.cells.forEach(cell => cell.state.is_highlighted = false);
    const cell = this.board.getCellByXAndY(event.offsetX, event.offsetY);
    if (cell?.state.has_moves || cell?.state.is_movable) {
      cell.state.is_highlighted = true;
    }
    return !!cell?.state.is_highlighted;
  }
}
