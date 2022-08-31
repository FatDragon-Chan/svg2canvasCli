import React, {FC, useState, useMemo, useEffect} from 'react'
import {parse} from "svg-parser";
import { nanoid } from 'nanoid'
import { Button, Row, Col, Card, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';


import Canvas from "../../components/canvas";
import {flat, parseSvgPath} from "../../utils/createSvgConfig";


import './index.scss'

const Index:FC = () => {

  const [interactionFileList, setInteractionFileList] = useState<UploadFile[]>([])
  const [canvasBgConfig,setCanvasBgConfig] = useState<Array<any>>([])
  const [canvasInteractionConfig, setCanvasInteractionConfig] = useState<Array<any>>([])
  const [selectedList, setSelectedList] = useState<any[]>([])

  const canvasConfig = useMemo(() => {
    return [
      ...canvasBgConfig,
      ...canvasInteractionConfig
    ]
  }, [canvasBgConfig, canvasInteractionConfig, selectedList]);


  const parseFile = (file: string) => {
    const parseSvg = flat(parseSvgPath(parse(file))).filter((fil: any) => fil)
    return {type: 'group', children: [...parseSvg]}
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
    if (!canvasConfig.length) {
      alert('请先上传svg')
      return
    }
    download('config.json', JSON.stringify(canvasConfig))
  }

  const onNanoIdsChange = (nanoids: Set<string>[]) => {
    console.log('nanoids: ', nanoids.values())
    // const selectIndex = selectedList.indexOf(nanoid)
    // if (selectIndex !== -1) {
    //   setSelectedList((list => [...list, nanoid]))
    // }else {
    //   const newSelectedList = selectedList.slice();
    //   newSelectedList.splice(selectIndex, 1);
    //   setSelectedList(newSelectedList)
    // }
  }

  const uploadBgProps: UploadProps = {
    beforeUpload: file => {
      const isSvg = file.type === 'image/svg+xml';
      if (!isSvg) {
        message.error(`${file.name} is not a svg file`);
        return
      }
      const reader = new FileReader()
      // @ts-ignore
      reader.readAsText(file)
      reader.onload = (e) => {
        const fileString = e?.target?.result as string || ''
        const parseBgCanvasConfig = {
          ...parseFile(fileString),
          nature: 'background'
        }
        setCanvasBgConfig([parseBgCanvasConfig])
      }
      return false
    },
  };


  const uploadActionProps: UploadProps = {
    beforeUpload: file => {
      const isSvg = file.type === 'image/svg+xml';
      if (!isSvg) {
        message.error(`${file.name} is not a svg file`);
        return
      }
      setInteractionFileList((fileList) =>[...fileList, file])
      return false
    },
    onRemove: file => {
      const index = interactionFileList.indexOf(file);
      const newFileList = interactionFileList.slice();
      newFileList.splice(index, 1);
      setInteractionFileList(newFileList);
    },
  };

  useEffect(() => {
    setCanvasInteractionConfig([])
    interactionFileList.forEach(async (file, index) => {
      const reader = new FileReader()
      // @ts-ignore
      await reader.readAsText(file)
      reader.onload = (e) => {
        const fileString = e?.target?.result as string || ''
        // const nanoId = nanoid()
        const nanoId = `${index}`
        const parseBgCanvasConfig = {
          ...parseFile(fileString),
          nature: 'interaction',
          nanoid: nanoId,
          cb: onNanoIdsChange
        }
        setCanvasInteractionConfig((configs => [...configs, parseBgCanvasConfig]))
      }
    })
  }, [interactionFileList])

  return (
    <div className='index'>
      <Row gutter={16}>
        <Col span={12}>
          <Card bordered={false} className='index-card'>
            {/*<div>*/}
            {/*  <button onClick={downloadFile}>点击下载配置文件</button>*/}
            {/*</div>*/}
            <div style={{marginBottom: '20px'}}>
              <Upload {...uploadBgProps} showUploadList={false}>
                <Button icon={<UploadOutlined />}>设置背景图</Button>
              </Upload>
            </div>
            <div>
              <Upload {...uploadActionProps} multiple>
                <Button icon={<UploadOutlined />}>设置互动背景</Button>
              </Upload>
            </div>
          </Card>
        </Col>
        {/*<Col span={12}>*/}
        {/*  <Card bordered={false} className='index-card'>*/}
        {/*    <div className='index-card__title'>背景区域</div>*/}
        {/*    <div className='index-card__content'>*/}
        {/*      <Canvas config={canvasBgConfig} />*/}
        {/*    </div>*/}
        {/*  </Card>*/}
        {/*</Col>*/}
        {/*<Col span={12}>*/}
        {/*  <Card bordered={false} className='index-card'>*/}
        {/*    <div className='index-card__title'>互动背景</div>*/}
        {/*    <div className='index-card__content'>*/}
        {/*      <Canvas config={canvasInteractionConfig}/>*/}
        {/*    </div>*/}
        {/*  </Card>*/}
        {/*</Col>*/}
        <Col span={12}>
          <Card bordered={false} className='index-card'>
            <div className='index-card__title'>最终演示</div>
            <div className='index-card__content'>
              <Canvas config={canvasConfig}/>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Index
