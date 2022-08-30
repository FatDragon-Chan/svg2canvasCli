export type RenderType = 'path' | 'circle' | 'polygon'

export type RenderPathProps = {
  d: string,
  translate: number[],
  fill:string
}

export type RenderCircleProps = {
  translate: number[],
  fill: string,
  cx: number,
  cy: number,
  radius: number,
}

export type RenderPolygonProps = {
  translate: number[],
  fill: string,
  points: string,
}
