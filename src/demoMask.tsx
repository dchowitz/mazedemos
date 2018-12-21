import { Point, sample } from './util'
import dom2img from 'dom-to-image'
import grid, { Cell } from './grid'

export default function demoMask (ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  const cellSize = 4
  const halfCellSize = cellSize / 2
  const pathWidth = 2
  const maze = grid(width, height, cellSize)

  const stack = [] as Cell[]
  const visited = new Set<Cell>()
  const drawn = new Set<Cell>()

  let mask: string[]
  let maskResolved: boolean = false

  dom2img.toPixelData(document.getElementById('logo'), { bgcolor: 'white' }).then((pixels: any) => {
    mask = maze.cells().map(c => {
      const idx = (c.y * width + c.x) * 4
      const [r, g, b] = pixels.slice(idx, idx + 3)

      const notWhite = r + g + b < 3 * 255
      return notWhite && `rgb(${r}, ${g}, ${b})`
    })
    maskResolved = true

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, width, height)
    init()
  })

  function next () {
    if (!maskResolved) return

    const current = stack[stack.length - 1]
    if (!current) {
      init()
      return
    }

    const nextCell = sample(current.neighbors().filter(n => !visited.has(n) && mask[n.idx]))
    if (nextCell) {
      // drawPath(current, nextCell, 'rgba(255, 255, 255, 0.5)')
      drawPath(current, nextCell, 'lightgray')
      stack.push(nextCell)
      visited.add(nextCell)
    } else {
      stack.pop()
      let previous: Cell
      if ((previous = stack[stack.length - 1])) {
        drawPath(current, previous, 'white')
      }
    }
  }

  function drawPath (a: Cell, b: Cell, color: string) {
    drawCell(a, mask[a.idx])
    drawCell(b, mask[b.idx])
    ctx.lineWidth = pathWidth
    ctx.strokeStyle = color
    ctx.lineCap = 'square'
    ctx.beginPath()
    ctx.moveTo(a.x + halfCellSize, a.y + halfCellSize)
    ctx.lineTo(b.x + halfCellSize, b.y + halfCellSize)
    ctx.stroke()
  }

  function drawCell (c: Cell, color: string) {
    if (drawn.has(c)) return
    ctx.fillStyle = color
    ctx.fillRect(c.x, c.y, cellSize, cellSize)
    drawn.add(c)
  }

  function init () {
    if (!maskResolved) return

    stack.length = 0
    visited.clear()

    const start = sample(maze.cells().filter(c => !drawn.has(c) && mask[c.idx]))

    stack.push(start)
    visited.add(start)
  }

  return {
    next,
    mouseClick (_p: Point) {
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, width, height)
      drawn.clear()
      init()
    },
    mouseMove (_p: Point) {}
  }
}
