import { Point } from './util'

export interface Cell {
  northern: number
  southern: number
  western: number
  eastern: number
  x: number
  y: number
  r: number
  g: number
  b: number
  visited: boolean
  distance: number
  parent: Cell
  neighbors(): Cell[]
}

export default function grid (width: number, height: number, cellSize: number) {
  const cellsX = Math.floor(width / cellSize)
  const cellsY = Math.floor(height / cellSize)
  const cellCount = cellsX * cellsY
  const cells: Cell[] = Array.apply(null, Array(cellCount)).map((_: any, i: number) => ({
    northern: i + cellsX < cellCount ? i + cellsX : undefined,
    southern: i - cellsX >= 0 ? i - cellsX : undefined,
    western: (i % cellsX) - 1 >= 0 ? i - 1 : undefined,
    eastern: (i % cellsX) + 1 < cellsX ? i + 1 : undefined,
    x: Math.floor(i % cellsX) * cellSize,
    y: Math.floor(i / cellsX) * cellSize,
    r: Math.floor(((i % cellsX) / cellsX) * 255),
    b: Math.floor((i / cellsY / cellsY) * 255),
    g: 0,
    visited: false,
    neighbors
  }))

  function neighbors (this: Cell) {
    return [this.northern, this.southern, this.eastern, this.western].filter(i => !!i).map(i => cells[i])
  }

  function pixelToIndex (c: Point): number {
    return (Math.floor(c.x / cellSize) % cellsX) + Math.floor(c.y / cellSize) * cellsX
  }

  return {
    cells () {
      return cells
    },
    cellAtPoint (p: Point) {
      return cells[pixelToIndex(p)]
    },
    randomCell () {
      return cells[Math.floor(Math.random() * cellCount)]
    },
    maxDistance () {
      Math.max(...cells.map(c => c.distance))
    }
  }
}
