import {useRef, useEffect} from 'react'
// @ts-ignore
import { Stage, Circle, Polygon } from '../flsh-svg2canvas/src/index'

import selectDPath from '../config/carSelectAreaConfig';
import baseDPath from '../config/carBackgroundConfig';
let stage:any = undefined
export default function Canvas () {
  const canvasRef = useRef(null)

  const initCanvas = () => {
    console.log('canvasRef.current : ', canvasRef )
    // @ts-ignore
    const {current: canvas ,offsetWidth, offsetHeight} = canvasRef
    const dpr = window.devicePixelRatio
    stage = new Stage({node: canvas, width: offsetWidth, height: offsetHeight}, {node: canvas, width: offsetWidth, height: offsetHeight},dpr);
    console.log(Stage)
    stageAddBackground();
    stageAddGroup();

    const circle = new Circle({
      fillColor: '#000000', x: 100, y: 100, radius: 50,translate: [10, 10]
    });
    // @ts-ignore
    stage.add(circle);
    // @ts-ignore
    stage.render();
  }

  const guideRender = (needRenderList: any[]) => {
    needRenderList.forEach(step => {
      step.renderProps.forEach((render: { type?: any; d?: any; translate?: any; place?: any; fill?: any; id?: "" | undefined; cx?: any; cy?: any; radius?: any; points?: any; }) => {
        switch (render.type) {
          case 'path':
            // eslint-disable-next-line no-use-before-define
            renderPath({ ...render, place: step.place });
            break;
          case 'circle':
            // eslint-disable-next-line no-use-before-define
            renderCircle({ ...render, place: step.place });
            break;
          case 'polygon':
            // eslint-disable-next-line no-use-before-define
            renderPolygon({ ...render, place: step.place });
            break;
          default:
            break;
        }
      });
    });
  };

  const renderPath = (renderProp: { d?: any; cx?: any; cy?: any; place: any; id?: "" | undefined; type?: any; fill?: any; radius?: any; translate?: any; points?: any }) => {
    // const {
    //   d, translate, place = 0, fill, id = '',
    // } = renderProp;
    // let fillColor: string;
    // const isPlaceInDamage = checkPlaceInDamage(place);
    // // @ts-ignore
    // if (place && id === 'clickArea') {
    //   fillColor = isPlaceInDamage || popupDamagePlace === place ? fill : '#F4F5F6';
    // } else {
    //   fillColor = fill;
    // }
    // const path = new Path({ fillColor, d, translate });
    //
    // // 添加事件，此时隐藏的canvas会生成一个同等大小的区域
    // if (place && id === 'clickArea') {
    //   path.on(EventNames.click, () => { handleShowDamagePopup(place); });
    // }
    // // 判断是否是点击区域
    // if (id !== 'clickArea' && id !== 'show' && !isPlaceInDamage && place && place !== popupDamagePlace) {
    //   return;
    // }
    // stage.add(path);
  };

  const renderCircle = (step: { d?: any; cx?: any; cy?: any; place: any; id?: "" | undefined; type?: any; fill?: any; radius?: any; translate?: any; points?: any }) => {
    const {
      fill, translate, cx, cy, radius, place,
    } = step;
    const circle = new Circle({
      fillColor: fill, x: cx, y: cy, radius, translate,
    });

    // @ts-ignore
    stage.add(circle);
  };

  const renderPolygon = (step: { d?: any; cx?: any; cy?: any; place: any; id?: "" | undefined; type?: any; fill?: any; radius?: any; translate?: any; points?: any }) => {
    const {
      fill, translate, points, place,
    } = step;
    const polygon = new Polygon({
      fillColor: fill, points, translate,
    });
    // @ts-ignore
    stage.add(polygon);
  };

  const stageAddGroup = () => {
    guideRender(selectDPath);
  };

  const stageAddBackground = () => {
    guideRender(baseDPath);
  };

  useEffect(() => {
    initCanvas()
  }, []);

  return (
      <canvas id="canvas" ref={canvasRef} ></canvas>
  )
}
