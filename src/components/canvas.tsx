import {FC, useRef, useEffect, useState} from 'react'
// @ts-ignore
import {Stage} from '@ahone/svg2canvas'

import './canvas.scss'


interface IProps {
  config: any[]
  onHit?: (e: any) => void
}

const Canvas:FC<IProps> = (props) => {
  let stage = useRef<Stage | null>(null)
  const {config, onHit} = props
  const canvasRef = useRef(null)
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
    const offscreen = new OffscreenCanvas(offsetWidth, offsetHeight);
    const dpr = window.devicePixelRatio
    stage.current = new Stage(canvas,offscreen,offsetWidth,offsetHeight,dpr);
  }


  /**
   * 与初始化canvas分割开
   */
  const updateCanvas = () => {
    stage.current?.clear();
    stage.current?.init(config.map(el => {
      if (onHit) {
        el.cb = ((el: any) => {
          console.log('el: ', el)
        })
      }
      return el
    }))
    stage.current?.render()
  }

  const clickArea = (e: any) => {
    console.log('点击了:')
    onHit && onHit(e)
  }

  useEffect(() => {
    initWrap();
  }, []);

  useEffect(() => {
    initCanvas();
  }, [wrapView]);

  useEffect(updateCanvas, [config]);


  return (
      <div className={'canvas-wrap'} ref={canvasWrapRef}>
        <canvas style={{width: `${wrapView.width}px`, height: `${wrapView.height}px`}} width={wrapView.width} height={wrapView.height} onClick={canvasClick} className="canvas" ref={canvasRef} />
      </div>
  )
}

export default Canvas
