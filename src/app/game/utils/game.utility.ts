import { GameConfig } from '../config';

export class GameUtility {

  public static boardSize(): number {
    let size = Math.max(GameConfig.board.min_size, Math.min(window.innerWidth, window.innerHeight));
    size -= size / 10
    if (size % 8 !== 0) {
      size = Math.floor(size / 8) * 8;
    }

    return size;
  }

  public static cellSize() {
    const bSize = GameUtility.boardSize() - GameConfig.board.padding * 2;

    return bSize / 8 - GameConfig.border_width * 1.15;
  }

  public static rowToLetter(row: number): string {
    return String.fromCharCode(64 + row);
  }

}
