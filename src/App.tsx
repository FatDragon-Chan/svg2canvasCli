import React, { useState } from 'react';
import './App.scss';
import { parse } from 'svg-parser'

import Canvas from "./components/canvas";

import { parseSvgPath, flat } from './utils/createSvgConfig'


function App() {

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
    const parseSvg = flat(parseSvgPath(parse(file))).filter(fil => fil)
    // @ts-ignore
    setCanvasConfig((currentState) => ([...currentState,...parseSvg]))
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
    <div className="App">
      <div className="App-view">
        <input type="file" accept="image/svg+xml" onChange={selectFile} title="设置" />
        <button onClick={downloadFile}>点击下载配置文件</button>
      </div>
      <div className="App-view canvas-bg">
        <Canvas config={canvasConfig}/>
      </div>
      {/*<div className="App-view canvas-area">*/}
      {/*  <div>区域背景</div>*/}
      {/*  <Canvas config={canvasConfig}/>*/}
      {/*</div>*/}
      {/*<div className="App-view final-canvas">*/}
      {/*  <div>最终演示</div>*/}
      {/*  <Canvas config={canvasConfig}/>*/}
      {/*</div>*/}
    </div>
  );
}

export default App;
