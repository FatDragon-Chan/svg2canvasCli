export const parseTransform = (_transform: string) => {
  if (!_transform) {return []}
  _transform.split(' ').filter(_transformString => _transformString).map(step => {
    return {
    }
  })
}

export const parseSvgPath = (parseSvg: any, parentParseSvg?: any)  => {
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

export const getTranslate = (transform: string) => {
  if (!transform) return
  transform.match(/\((.+)\)/g)
  return RegExp.$1.split(', ').map(el => {
    return Math.round((Number(el) + Number.EPSILON) * 100) / 100
  })
}

export const flat = (arr: Array<any>): Array<any> => {
  if (Object.prototype.toString.call(arr) !== '[object Array]') { return [] }
  return arr.reduce((prev, cur) => {
    return prev.concat(Array.isArray(cur) ? flat(cur) : cur)
  }, [])
}
