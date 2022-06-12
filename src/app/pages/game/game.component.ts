import { AfterViewInit, Component } from '@angular/core';

import Board from '../../game/Board/Board';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements AfterViewInit {

  board!: Board;

  constructor() {
  }

  onMouseLeave() {
    this.board.onMouseLeave();
  }

  onMouseMove(event: MouseEvent) {
    this.board.onMouseMove(event);
  }

  ngAfterViewInit(): void {
    this.board = new Board();
    this.board.reset();
  }


}
