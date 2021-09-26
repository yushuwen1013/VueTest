/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}


//不能输入  

export function validVariable(str) {
  var reg=/[^\{\}]/;   /*定义验证表达式*/
  return reg.test(str);     /*进行验证*/
}

//校验特殊字符
export function checkSymbol(val){ 
  var regEn = /[`~!@#$%^&*()+<>?:"{},.\/;'[\]]/im,
    regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
 
  if(regEn.test(val) || regCn.test(val)) {
      return false;
  }else{
    return true;
  }
}