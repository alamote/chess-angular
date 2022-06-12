import { AfterViewInit, Component, HostListener } from '@angular/core';
import { Game } from '../../game/Game/Game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
})
export class GameComponent implements AfterViewInit {

  game!: Game;

  resizeTimer!: any;
  showPointer: boolean = false;

  constructor() {
  }

  @HostListener('window:resize', ['$event']) onResize() {
    if (this.resizeTimer) {
      clearTimeout(this.resizeTimer);
    }
    this.resizeTimer = setTimeout(() => {
      if (this.game?.board) {
        this.game.board.setBoardSize();
        this.game.board.render(true);
      }
    }, 100);
  }

  onClick(event: MouseEvent) {
    if (this.game) {
      this.game.onClick(event);
    }
  }

  onMouseLeave() {
    if (this.game?.board) {
      this.game.onMouseLeave();
    }
  }

  onMouseMove(event: MouseEvent) {
    if (this.game?.board) {
      this.showPointer = this.game.onMouseMove(event);
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.game = new Game());
    document.addEventListener('click', this.onClick.bind(this));
  }


}
