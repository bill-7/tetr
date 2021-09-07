import { Component, OnInit } from '@angular/core';
import { interval, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  host: { '(document:keypress)': 'key($event)' }
})
export class AppComponent implements OnInit {
  readonly colours = ['#181818', '#a68bf0', '#f0dc78', '#a3e3e6', '#a6de6a', '#eb6e6a', '#637ce0', '#e88f58']
  readonly shapes = [
    [[0, 0, 0, 0], [0, 1, 1, 1], [0, 0, 1, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 2, 2, 0], [0, 2, 2, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [3, 3, 3, 3], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 4, 4], [0, 4, 4, 0], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 5, 5, 0], [0, 0, 5, 5], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 6, 0, 0], [0, 6, 6, 6], [0, 0, 0, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 7], [0, 7, 7, 7], [0, 0, 0, 0]]
  ]

  grid = Array.from(Array(20), () => new Array(10).fill(0))
  play!: { shape: number[][], x: number, y: number }
  run$!: Subscription

  ngOnInit() {
    this.reset()
    this.draw(true)
    this.run$ = interval(750).subscribe(_ => {
      this.move(this.down)
    })
  }

  key(event: any) {
    if (!this.run$.closed) {
      switch (event.key) {
        case 'a': this.move(this.left); break
        case 'd': this.move(this.right); break
        case 'w': this.move(this.spin); break
        case 's': this.move(this.down); break
        case ' ': this.move(this.slam); break
      }
    }
  }

  newShape() { return this.shapes[Math.floor(Math.random() * 7)] }

  draw(b: boolean) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.play.shape[i][j] != 0) {
          if (i + this.play.y > -1 && j + this.play.x > -1)
            this.grid[i + this.play.y][j + this.play.x] = b ? this.play.shape[i][j] : 0
        }
      }
    }
  }

  move(f: () => void) {
    this.draw(false)
    f()
    this.draw(true)
  }

  reset() {
    if (this.play) this.draw(true)

    this.eraseFullRows()

    this.play = { shape: this.newShape(), x: 3, y: -1 }
    return false
  }

  eraseFullRows() {
    for (let i = 0; i < this.grid.length; i++) {
      if (!this.grid[i].some(cell => cell == 0)) {
        this.grid.splice(i, 1)
        this.grid.unshift(new Array(10).fill(0))
        console.log(i)
      }
    }
  }

  canMoveDown() {
    for (let i = 3; !!i; i--) {
      for (let j = 0; j <= 3; j++) {
        if (this.play.shape[i][j] != 0) {
          if (this.play.y + i == 19)
            return this.reset()
          if (this.grid[this.play.y + i + 1][this.play.x + j] != 0) {
            if (this.play.y == -1)
              this.gameOver()
            return this.reset()
          }
        }
      }
    }
    return true
  }

  gameOver() {
    console.log("game over")
    this.run$.unsubscribe()
  }

  canMoveRight() {
    for (let j = 3; !!j; j--) {
      for (let i = 3; !!i; i--) {
        if (this.play.shape[i][j] != 0) {
          if (this.play.x + j == 9)
            return false
          if (this.grid[this.play.y + i][this.play.x + j + 1] != 0)
            return false
        }
      }
    }
    return true
  }

  canMoveLeft() {
    for (let i = 0; i <= 3; i++) {
      for (let j = 0; j <= 3; j++) {
        if (this.play.shape[i][j] != 0) {
          if (this.play.x + j == 0)
            return false
          if (this.grid[this.play.y + i][this.play.x + j - 1] != 0)
            return false
        }
      }
    }
    return true
  }

  down = () => { if (this.canMoveDown()) this.play.y++ }
  left = () => { if (this.canMoveLeft()) this.play.x-- }
  right = () => { if (this.canMoveRight()) this.play.x++ }
  spin = () => {
    if (true) {
      let result = []
      for (let i = 0; i < this.play.shape[0].length; i++) {
        let row = this.play.shape.map(e => e[i]).reverse()
        result.push(row)
      }
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (result[i][j] != 0) {
            if (this.grid[i + this.play.y][j + this.play.x] != 0)
              return
          }
        }
      }
      this.play.shape = result
    }
  }
  slam = () => { }
}
