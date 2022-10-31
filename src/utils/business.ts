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
