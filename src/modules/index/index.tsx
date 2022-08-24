import React, {FC, useState} from 'react'
import Canvas from "../../components/canvas";
import {flat, parseSvgPath} from "../../utils/createSvgConfig";
import {parse} from "svg-parser";

import './index.less'

const Index:FC = () => {

  const [file, setFile] = useState<string>('')

  const [canvasConfig, setCanvasConfig] = useState<Array<any>>([])

  const selectFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    let fileList: FileList | null =  event.target.files;
    if(!fileList) return
    readerFile(fileList[0])
  }

  const readerFile = (fileData: File) => {
    if (!fileData) return
    const reader = new FileReader()
    reader.readAsText(fileData)
    reader.onload = (e) => {
      const fileString = e?.target?.result || ''
      setFile(fileString as string)
      parseFile(fileString as string)
    }
  }

  const parseFile = (file: string) => {
    const parseSvg = flat(parseSvgPath(parse(file))).filter((fil: any) => fil)
    setCanvasConfig((currentState) => ([...currentState,{type: 'group', nature: 'area', children: [...parseSvg]}]))
  }

  const download = (filename:string, text:string) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const downloadFile = () => {
    if (!file) {
      alert('请选择需要解析的svg文件')
      return
    }
    download('config.json', JSON.stringify(canvasConfig))
  }

  return (
    <div className="index">
      <div className="index-view">
        <input type="file" accept="image/svg+xml" onChange={selectFile} />
        <button onClick={downloadFile}>点击下载配置文件</button>
      </div>
      <div className="index-view">
        <Canvas config={canvasConfig}/>
      </div>
      <div className="index-view">
        <div>区域背景</div>
        <Canvas config={canvasConfig}/>
      </div>
      <div className="index-view">
        <div>最终演示</div>
        <Canvas config={canvasConfig}/>
      </div>
    </div>
  )
}


export default Index
