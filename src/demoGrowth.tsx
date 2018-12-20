import { Point, Demo, randomPop } from './util'
import grid, { Cell } from './grid'

export default function mazeGrowth(ctx: CanvasRenderingContext2D): Demo {
  const { width, height } = ctx.canvas
  const cellSize = 8
  const maze = grid(width, height, cellSize)

  const frontier: Cell[] = [maze.randomCell()]
  ctx.clearRect(0, 0, width, height)

  function next() {
    const current = randomPop(frontier)

    if (current) {
      drawCell(current, 1)
      current.visited = true
      current
        .neighbors()
        .filter(i => !i.visited)
        .forEach(i => frontier.push(i))
    }

    frontier.forEach(c => {
      ;(c.visited = true), drawCell(c, 0.2)
    })
  }

  function drawCell(cell: any, alpha: number) {
    const { x, y, r, g, b } = cell
    ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`
    ctx.fillRect(x, y, cellSize, cellSize)
  }

  return {
    next,
    mouseClick(p: Point) {
      // reset grid, start with cell at position p
      maze.cells().forEach(c => (c.visited = false))
      frontier.length = 0
      frontier.push(maze.cellAtPoint(p))
      ctx.clearRect(0, 0, width, height)
    },
    mouseMove(_p: Point) {}
  }
}