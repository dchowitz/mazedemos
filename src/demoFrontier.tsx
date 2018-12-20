import { Point, Demo, randomPop } from './util'
import grid, { Cell } from './grid'

export default function mazeFrontier(ctx: CanvasRenderingContext2D): Demo {
  const { width, height } = ctx.canvas
  const cellSize = 4
  const maze = grid(width, height, cellSize)
  const frontier: Cell[] = [maze.randomCell()]

  ctx.clearRect(0, 0, width, height)

  function next() {
    ctx.clearRect(0, 0, width, height)

    const current = randomPop(frontier)
    if (current) {
      current.visited = true
      current
        .neighbors()
        .filter(n => !n.visited)
        .forEach(n => frontier.push(n))
    }

    frontier.forEach(c => {
      ;(c.visited = true), drawCell(c)
    })
  }

  function drawCell(cell: Cell) {
    const { x, y, r, g, b } = cell
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`
    ctx.fillRect(x, y, cellSize, cellSize)
  }

  return {
    next,
    mouseClick(p: Point) {
      // reset grid, start with cell at position p
      maze.cells().forEach(c => (c.visited = false))
      frontier.length = 0
      frontier.push(maze.cellAtPoint(p))
    },
    mouseMove(_p: Point) {}
  }
}