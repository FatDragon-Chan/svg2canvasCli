import React, {useState} from 'react';
import './App.css';
import {parse} from 'svg-parser'
// @ts-ignore
// import { Stage } from '@flsh/svg2canvas/lib/svg2canvas.umd.min'


function App() {

  const [file, setFile] = useState<string>('')

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
      const fileString = e?.target?.result
      setFile(fileString ? fileString as string : '')
    }
  }

  const parseFile = (file: string) => {
    const parseSvg = flat(parseSvgPath(parse(file))).filter(fil => fil)
    download('config.json', JSON.stringify(parseSvg))
  }

  const parseTransform = (_transform: string) => {
    if (!_transform) {return []}
    _transform.split(' ').filter(_transformString => _transformString).map(step => {
      return {
      }
    })
    console.log('')
  }

  const parseSvgPath = (parseSvg: any, parentParseSvg?: any)  => {
    const {tagName, children, properties = {}} = parseSvg
    let {transform = ''} = properties
    parseTransform(transform)
    let translate = transform ? getTranslate(transform) : [0, 0]
    if (parentParseSvg && parentParseSvg.translate) {
      translate = (translate as Array<number | string>).map((el, index) => {
        el = Number(el) + Number(parentParseSvg.translate[index])
        return el
      })
    }
    const parseData = {
      type: tagName,
      translate,
      ...properties
    }

    if (children && children.length > 0) {
      return children.map((child: any) => {
        return parseSvgPath(child, parseData)
      })
    }

    if (!tagName || tagName === 'svg' || tagName === 'g') {
      return parseData.children
    }

    return parseData
  }

  const getTranslate = (transform: string) => {
    if (!transform) return
    transform.match(/\((.+)\)/g)
    return RegExp.$1.split(', ').map(el => {
      return Math.round((Number(el) + Number.EPSILON) * 100) / 100
    })
  }

  const flat = (arr: Array<any>): Array<any> => {
    if (Object.prototype.toString.call(arr) !== '[object Array]') { return [] }
    return arr.reduce((prev, cur) => {
      return prev.concat(Array.isArray(cur) ? flat(cur) : cur)
    }, [])
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
    parseFile(file)
  }

  return (
    <div className="App">
      <div className="App-left">
        <div className="App-left-top">
          <input type="file" onChange={selectFile}/>
          <button onClick={downloadFile}>点击下载配置文件</button>
        </div>
        <div className="App-left-bottom"></div>
      </div>
      <div className="App-right"></div>
    </div>
  );
}

export default App;
