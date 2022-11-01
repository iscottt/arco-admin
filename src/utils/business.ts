/**
 * 过滤需要的字段
 * @param paramsList
 * @param curParams
 * @param replaceFields
 * @returns
 */
export function filterParams<T>(paramsList, curParams, replaceFields?) {
  const result: T = {} as T;
  paramsList.map((key) => {
    if (Object.prototype.hasOwnProperty.call(curParams, key)) {
      result[key] = curParams[key];
    }
  });
  replaceFields &&
    replaceFields.map((object) => {
      for (const key in object) {
        result[object[key]] = result[key];
        delete result[key];
      }
    });
  return result;
}

/**
 * 将数据转换成下拉框数据
 * @param curData
 * @param valueField
 * @param labelField
 * @returns
 */
export function filterToSelectOpt(curData, valueField, labelField) {
  const result: any[] = [];
  curData.map((res) => {
    const obj = {
      value: res[valueField] || '',
      label: res[labelField] || '',
    };
    result.push(obj);
  });
  return result;
}

/**
 * 下划线字符串转驼峰
 * @param name
 * @returns
 */
export function toHump(name) {
  // @ts-ignore
  return name.replace(/\_(\w)/g, function (all, letter) {
    return letter.toUpperCase();
  });
}
/**
 * 驼峰字符串转下划线
 * @param name
 * @returns
 */
export function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}
