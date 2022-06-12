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
    const bSize = GameUtility.boardSize();

    return bSize / 8 - GameConfig.line_width * 1.1;
  }

}
