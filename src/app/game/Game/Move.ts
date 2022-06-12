import Cell from '../Board/Cell';
import Player from '../Player/Player';
import Figure from '../Figure/Figure';

export class Move {

  player: Player;
  figure: Figure;
  from: Cell;
  to: Cell;
  timestamp: number;

  constructor(player: Player, from: Cell, to: Cell) {
    this.player = player;
    this.figure = from.figure as Figure;
    this.from = from;
    this.to = to;
    this.timestamp = Date.now();

    this.figure.isMoved = true;

    to.figure = from.figure;
    from.figure = null;
  }
}
