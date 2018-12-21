import grid, { Cell } from './grid'
import { Point, sample } from './util'

export default function mazeGen (ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const cellSize = 6
  const halfCellSize = cellSize / 2
  const pathWidth = cellSize - 2
  const maze = grid(width, height, cellSize)
  const stack = [] as Cell[]
  const visited = new Set<Cell>()

  init()

  function next () {
    const current = stack[stack.length - 1]
    if (!current) return

    const nextCell = sample(current.neighbors().filter(n => !visited.has(n)))
    if (nextCell) {
      drawPath(current, nextCell, 'green')
      stack.push(nextCell)
      visited.add(nextCell)
    } else {
      stack.pop()
      let previous
      if ((previous = stack[stack.length - 1])) {
        drawPath(current, previous, 'lightgray')
      }
    }
  }

  function drawPath (a: Cell, b: Cell, color: string) {
    ctx.lineWidth = pathWidth
    ctx.strokeStyle = color
    ctx.lineCap = 'square'
    ctx.beginPath()
    ctx.moveTo(a.x + halfCellSize, a.y + halfCellSize)
    ctx.lineTo(b.x + halfCellSize, b.y + halfCellSize)
    ctx.stroke()
  }

  function init (startPoint?: Point) {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
    stack.length = 0
    visited.clear()
    const start = (startPoint && maze.cellAtPoint(startPoint)) || maze.randomCell()
    stack.push(start)
    visited.add(start)
  }

  return {
    next,
    mouseClick (p: Point) {
      init(p)
    },
    mouseMove (_p: Point) {}
  }
}
