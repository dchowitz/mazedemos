import { Point, Demo, randomPop } from './util'
import grid, { Cell } from './grid'

export default function mazeGen(ctx: CanvasRenderingContext2D): Demo {
  const { width, height } = ctx.canvas
  const cellSize = 8
  const pathWidth = cellSize / 2
  const stepsPerTick = 10
  const maze = grid(width, height, cellSize)
  let lastHoverCell: Cell
  let rootCell: Cell = maze.cellAtPoint({ x: 0, y: 0 })

  const frontier: { cell: Cell; next: Cell }[] = []
  init()

  function next() {
    let step = 0
    let current
    while (step < stepsPerTick && !!(current = randomPop(frontier))) {
      const { cell, next } = current
      if (next.visited) continue

      drawPath(cell, next)
      next.visited = true
      next.distance = cell.distance + 1
      next.parent = cell
      addNextFrontiers(next)

      step++
    }
  }

  function addNextFrontiers(cell: Cell) {
    cell
      .neighbors()
      .filter(n => !n.visited)
      .forEach(n => frontier.push({ cell, next: n }))
  }

  function drawPath(a: Cell, b: Cell, color: string = 'white') {
    ctx.lineWidth = pathWidth
    ctx.strokeStyle = color
    ctx.lineCap = 'square'
    ctx.beginPath()
    ctx.moveTo(a.x + pathWidth, a.y + pathWidth)
    ctx.lineTo(b.x + pathWidth, b.y + pathWidth)
    ctx.stroke()
  }

  function drawPathToRoot(cell: Cell, color: string) {
    let start = cell
    let next: Cell
    while ((next = start.parent)) {
      drawPath(start, next, color)
      start = next
    }
  }

  function init() {
    maze.cells().forEach(c => {
      c.visited = false
      c.distance = undefined
      c.parent = undefined
    })
    frontier.length = 0

    rootCell.visited = true
    rootCell.distance = 0
    addNextFrontiers(rootCell)

    ctx.fillStyle = 'lightgray'
    ctx.fillRect(0, 0, width, height)
  }

  return {
    next,
    mouseClick(_p: Point) {
      init()
    },
    mouseMove(p: Point) {
      const cell = maze.cellAtPoint(p)
      if (!cell) return
      if (cell != lastHoverCell && !!lastHoverCell) {
        drawPathToRoot(lastHoverCell, 'white')
      }
      drawPathToRoot(cell, 'green')
      lastHoverCell = cell
    }
  }
}