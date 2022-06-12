import { Move } from './Move';

export class Log {

  moves: Move[] = [];

  add(move: Move) {
    this.moves.push(move);
  }

  getMoves(): string[] {
    return this.moves.map(move => {
      return `${move.player.name}: ${move.figure.figure} ${move.from.coordinates} - ${move.to.coordinates}`;
    });
  }
}
