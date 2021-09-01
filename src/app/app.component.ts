import { Component, OnInit } from '@angular/core';
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
  play = { shape: this.new(), x: 0, y: 3 }

  ngOnInit() {
    this.add()
    interval(1000).subscribe(n => {
      this.move(this.down)
    })
  }

  key = (event: any) => {
    switch (event.key) {
      case 'a': this.move(this.left); break
      case 'd': this.move(this.right); break
      case 'w': this.move(this.spin); break
      case 's': this.move(this.down); break
      case ' ': this.move(this.slam); break
    }
  }

  new() { return this.shapes[Math.floor(Math.random() * 2)] }

  paint(b: boolean) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.play.shape[i][j] != 0)
          this.grid[i + this.play.x][j + this.play.y] = b ? this.play.shape[i][j] : 0
      }
    }
  }
  clear() { this.paint(false) }
  add() { this.paint(true) }

  move(f: () => any) {
    this.clear()
    f()
    this.add()
  }
  down = () => { if (true) this.play.x++ }
  left = () => { if (true) this.play.y-- }
  right = () => { if (true) this.play.y++ }
  spin = () => { }
  slam = () => { }
}
