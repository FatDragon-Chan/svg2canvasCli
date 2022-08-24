import {useRef, useEffect} from 'react'
// @ts-ignore
import { Stage, Circle, Polygon, Path, EventNames } from '../svg2canvas/svg2canvas.umd'

type RenderType = 'path' | 'circle' | 'polygon'

type RenderPathProps = {
  d: string,
  translate: number[],
  fill:string
}
type RenderCircleProps = {
  translate: number[],
  fill: string,
  cx: number,
  cy: number,
  radius: number,
}
type RenderPolygonProps = {
  translate: number[],
  fill: string,
  points: string,
}

export default function Canvas (props: { config: any[]; }) {
  let stage = useRef<Stage | null>(null)
  const {config} = props
  const canvasRef = useRef(null)

  const canvasClick = (evt: any) => {
    // @ts-ignore
    const x = evt.clientX - canvasRef.current.getBoundingClientRect().left
    // @ts-ignore
    const y = evt.clientY - canvasRef.current.getBoundingClientRect().top
    console.log(x,y)
    stage.current?.clickHandle(evt,{x,y})
  }

  const initCanvas = () => {
    const canvas: HTMLCanvasElement  = canvasRef.current!
    const {offsetWidth, offsetHeight} = canvas

    /**
     * 生成一个离屏canvas
     */
    const offscreen = new OffscreenCanvas(offsetWidth, offsetHeight);
    const dpr = window.devicePixelRatio
    stage.current = new Stage(canvas,offscreen,offsetWidth,offsetHeight,dpr);
  }

  const classifyRenderShape = (renderList: any[], cb?: () => void) => {
    renderList.forEach(render => {
      const shape = guideRenderFunc(render.type)({...render})
      shape && shape.on('click', cb)
      shape && stage.current?.add(shape)
    })
  }

  /**
   * 通过type判定返回不同的渲染函数，便于处理
   * @param type
   */
  const guideRenderFunc: (type: RenderType) => any = (type)  =>  {
    switch (type) {
      case 'path':
        return renderPath
      case 'circle':
        return renderCircle
      case 'polygon':
        return renderPolygon
    }
  }

  const renderPath = (renderProp: RenderPathProps) => {
    const {
      d, translate,fill = '#F4F5F6'
    } = renderProp;
    return new Path({ fillColor: fill, d, translate });
  };

  const renderCircle = (renderProps: RenderCircleProps) => {
    const {
      fill, translate, cx, cy, radius,
    } = renderProps;
    return new Circle({
      fillColor: fill, x: cx, y: cy, radius, translate,
    });
  };

  const renderPolygon = (renderProps: RenderPolygonProps) => {
    const {
      fill, translate, points,
    } = renderProps;
    return new Polygon({
      fillColor: fill, points, translate,
    });
  };

  /**
   * 与初始化canvas分割开
   */
  const updateCanvas = () => {
    stage.current?.clear();
    config.forEach((step: { nature: string; children: any[] }) => {
      console.log(step)
      if (step.nature === 'area') {
        classifyRenderShape(step.children, clickArea )
      }else {
        classifyRenderShape(step.children)
      }
    })
    stage.current?.render()
  }

  const clickArea = () => {
    console.log('点击了:')
    alert(`点击了`)
  }

  useEffect(() => {
   initCanvas();
  }, []);

  useEffect(updateCanvas, [config]);


  return (
      <canvas onClick={canvasClick} className="canvas" ref={canvasRef} />
  )
}
