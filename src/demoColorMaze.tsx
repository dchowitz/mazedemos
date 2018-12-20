import { interpolateHslLong } from 'd3-interpolate'
import { Point, Demo, randomPop } from './util'
import grid, { Cell } from './grid'

export default function mazeGen(ctx: CanvasRenderingContext2D): Demo {
  const colorInterpolator = interpolateHslLong('blue', 'red')
  const distinctColors = 75
  const { width, height } = ctx.canvas
  const cellSize = 8
  const halfCellSize = cellSize / 2
  const pathWidth = 6
  const stepsPerTick = 10
  const maze = grid(width, height, cellSize)
  let rootCell: Cell = maze.cellAtPoint({ x: 0, y: 0 })

  const frontier: { cell: Cell; next: Cell }[] = []
  init()

  function next() {
    let step = 0
    let current
    while (step < stepsPerTick && !!(current = randomPop(frontier))) {
      const { cell, next } = current
      if (next.visited) continue

      drawPath(cell, next, getColor(cell.distance))
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
    ctx.moveTo(a.x + halfCellSize, a.y + halfCellSize)
    ctx.lineTo(b.x + halfCellSize, b.y + halfCellSize)
    ctx.stroke()
  }

  function getColor(distance: number) {
    return colorInterpolator((distance % distinctColors) / distinctColors)
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

    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, width, height)
  }

  return {
    next,
    mouseClick(_p: Point) {
      init()
    },
    mouseMove(_p: Point) {}
  }
}