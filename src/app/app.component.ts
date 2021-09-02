import { Component, OnInit } from '@angular/core';
import { resetFakeAsyncZone } from '@angular/core/testing';
import { interval } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { '(document:keypress)': 'key($event)' }
})
export class AppComponent implements OnInit {


  readonly colours = ['#181818', '#a68bf0', '#ffffba']
  readonly shapes = [
    [[0, 0, 0, 0], [0, 1, 1, 1], [0, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 2, 2, 0], [0, 2, 2, 0], [0, 0, 0, 0]]
  ]

  grid = Array.from(Array(20), () => new Array(10).fill(0))
  play!: { shape: number[][], x: number, y: number }

  ngOnInit() {
    this.reset()
    this.display(true)
    interval(750).subscribe(_ => {
      this.move(this.down)
    })
  }

  key(event: any) {
    switch (event.key) {
      case 'a': this.move(this.left); break
      case 'd': this.move(this.right); break
      case 'w': this.move(this.spin); break
      case 's': this.move(this.down); break
      case ' ': this.move(this.slam); break
    }
  }

  newShape() { return this.shapes[Math.floor(Math.random() * 2)] }


  display(b: boolean) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.play.shape[i][j] != 0)
          this.grid[i + this.play.x][j + this.play.y] = b ? this.play.shape[i][j] : 0
      }
    }
  }

  move(f: () => void) {
    this.display(false)
    f()
    this.display(true)
  }

  reset() {
    if (this.play) this.display(true)
    this.play = { shape: this.newShape(), x: -1, y: 3 }
    return false
  }

  canMoveDown() {
    for (let i = 3; !!i; i--) {
      for (let j = 0; j <= 3; j++) {
        if (this.play.shape[i][j] != 0) {
          if (this.play.x + i == 19)
            return this.reset()
          if (this.grid[this.play.x + i + 1][this.play.y + j] != 0)
            return this.reset()
        }
      }
    }
    return true
  }

  down = () => { if (this.canMoveDown()) this.play.x++ }
  left = () => { if (true) this.play.y-- }
  right = () => { if (true) this.play.y++ }
  spin = () => { }
  slam = () => { }
}
