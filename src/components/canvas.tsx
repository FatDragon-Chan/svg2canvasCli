import {useRef, useEffect} from 'react'
// @ts-ignore
import { Stage, Circle, Polygon, Path, EventNames } from '../svg2canvas/svg2canvas.esm'

export default function Canvas (props: { config: any; }) {
  let stage = useRef<Stage | null>(null)
  const {config} = props
  const canvasRef = useRef(null)

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

  const guideRender = (needRenderList: any[]) => {
    console.log('renderConfig： ',needRenderList)
    needRenderList.forEach(render => {
        let shape
        switch (render.type) {
          case 'path':
            shape = renderPath({ ...render});
            break;
          case 'circle':
            shape = renderCircle({ ...render});
            break;
          case 'polygon':
            shape = renderPolygon({ ...render});
            break;
          default:
            break;
        }
        if (!shape) return
        stage.current?.add(shape)
      });

  };

  const renderPath = (renderProp: { d?: any; cx?: any; cy?: any; place?: any; id?: "" | undefined; type?: any; fill?: any; radius?: any; translate?: any; points?: any }) => {
    const {
      d, translate, place = 0, fill = '#F4F5F6', id = '',
    } = renderProp;
    return new Path({ fillColor: fill, d, translate });
  };

  const renderCircle = (step: { d?: any; cx?: any; cy?: any; place?: any; id?: "" | undefined; type?: any; fill?: any; radius?: any; translate?: any; points?: any }) => {
    const {
      fill, translate, cx, cy, radius, place,
    } = step;
    return new Circle({
      fillColor: fill, x: cx, y: cy, radius, translate,
    });
  };

  const renderPolygon = (step: { d?: any; cx?: any; cy?: any; place?: any; id?: "" | undefined; type?: any; fill?: any; radius?: any; translate?: any; points?: any }) => {
    const {
      fill, translate, points, place,
    } = step;
    return new Polygon({
      fillColor: fill, points, translate,
    });
  };

  const updateCanvas = () => {
    stage.current?.clear();
    guideRender(config);
    stage.current?.render()
  }

  useEffect(() => {
   initCanvas();
  }, []);

  useEffect(updateCanvas, [config]);


  return (
      <canvas className="canvas" ref={canvasRef} ></canvas>
  )
}
