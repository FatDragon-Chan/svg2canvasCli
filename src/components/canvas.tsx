import {FC, useRef, useEffect, useState} from 'react'
// @ts-ignore
import {Stage} from '@ahone/svg2canvas'
import { Button } from 'antd';

import './canvas.scss'


interface IProps {
  config: any[]
}

const Canvas:FC<IProps> = (props) => {
  let stage = useRef<Stage | null>(null)
  const {config} = props
  const canvasRef = useRef(null)
  const offCanvasRef = useRef(null)
  const canvasWrapRef = useRef(null)

  const [wrapView, setWrapView] = useState({
    width: 0,
    height: 0
  })


  const canvasClick = (evt: any) => {
    // @ts-ignore
    const x = evt.clientX - canvasRef.current.getBoundingClientRect().left
    // @ts-ignore
    const y = evt.clientY - canvasRef.current.getBoundingClientRect().top
    stage.current?.clickHandle(evt,{x,y})
  }

  const initWrap = () => {
    const canvasWrap: HTMLElement = canvasWrapRef.current!
    const {clientWidth, clientHeight} = canvasWrap
    setWrapView({
      width: clientWidth,
      height: clientHeight
    })
  }

  const initCanvas = () => {
    const canvas: HTMLCanvasElement  = canvasRef.current!
    const {offsetWidth, offsetHeight} = canvas
    // 生成一个离屏canvas

    const offscreen: HTMLCanvasElement  = offCanvasRef.current!
    // const offscreen = new OffscreenCanvas(offsetWidth, offsetHeight);
    const dpr = window.devicePixelRatio
    const config= {
      canvasRes: canvas,
      osCanvasRes: offscreen,
      width: offsetWidth,
      height: offsetHeight,
      dpr
    }
    stage.current = new Stage(config, change);
  }

  const change = (changeKey: string) => {
    console.log('newIds: ', changeKey)
  }


  /**
   * 与初始化canvas分割开
   */
  const updateCanvas = () => {
    stage.current?.clear();
    stage.current?.init(config)
    stage.current?.render()
  }

  useEffect(() => {
    initWrap();
  }, []);

  useEffect(() => {
    initCanvas();
  }, [wrapView]);

  const setDefault = () => {
    stage.current?.setActions([1, 2])
  }

  useEffect(updateCanvas, [config]);


  return (
    <div className={'canvas-wrap'} ref={canvasWrapRef}>
      <Button onClick={setDefault}>设置默认值</Button>
      <canvas style={{width: `${wrapView.width}px`, height: `${wrapView.height}px`}} width={wrapView.width} height={wrapView.height} onClick={canvasClick} className="canvas" ref={canvasRef} />
      <canvas style={{width: `${wrapView.width}px`, height: `${wrapView.height}px`}} width={wrapView.width} height={wrapView.height} onClick={canvasClick} className="canvas" ref={offCanvasRef} />
    </div>
  )
}

export default Canvas
