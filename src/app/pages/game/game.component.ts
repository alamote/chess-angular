import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import Board from '../../game/Board/Board';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, AfterViewInit {


  board: Board;

  constructor() {
    this.board = new Board();
  }

  @HostListener('window:resize', ['$event']) onResize() {
    this.board.render();
  }

  onMouseMove(event: MouseEvent) {
    this.board.onMouseMove(event);
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.board.reset();
  }


}
