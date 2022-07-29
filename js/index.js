/**
 * Author: Mean
 * Date: 2022-07-27 16:00:15
 * LastEditTime: Fri Jul 29 2022 11:16:48
 * LastEditors: Mean
 * the best code is no code at all
*/

/** 
 * @description: 查看对象类型 转换成小写的字符串类型
 * @updateTime 2022-07-28 16:59:07
 * @param {*} param
 * @return {String}
 */
export function isTypeof(param) {
    return Object.prototype.toString.call(param).slice(8, -1).toLowerCase();
}

/** 
 * @description: 时间转成 YYYY:MM:DD HH:MM:SS 的格式
 * @updateTime 2022-07-28 17:02:00
 * @param {Object Date} now   时间
 * @param {String} str
 * @return {String}
 */
export function formatDate(now = new Date(), str = "0") {
    const splitStr = (num) => {
        return num < 10 ? str + num : num;
    }
    const year = now.getFullYear();
    const month = splitStr(now.getMonth() + 1);
    const date = splitStr(now.getDate());
    const hour = splitStr(now.getHours());
    const minute = splitStr(now.getMinutes());
    const second = splitStr(now.getSeconds());
    return `${year}:${month}:${date} ${hour}:${minute}:${second}`;
}

/** 
 * @description: 简易深拷贝 除某些特殊对象如WeakMap等
 * @updateTime 2022-07-28 17:04:53
 * @param {*} data
 * @return {*}
 */
export function deepClone(data) {
    if (typeof data === 'symbol') {           //Symbol
        return Symbol.for(data.description);
    } else if (typeof data != 'object' || (!data && typeof (data) != "undefined" && data != 0)) {      //基本类型
        return data;
    } else if (data instanceof Array) {      //Array
        return data.map(item => deepClone(item));
    } else if (data.constructor === Object) {   //Json
        const res = {};
        for (const key in data) {
            res[key] = deepClone(data[key]);
        }
        return res;
    } else {                                //系统对象、自定义对象
        return new data.constructor(data);
    }
}

/** 
 * @description: 获取url后的参数
 * @updateTime 2022-07-29 10:46:22
 * @param {String} name
 * @return {String}
 */
export const getUrlQuery = (name) => {
    const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    const url = window.location.href
    const search = url.slice(url.lastIndexOf('?') + 1)
    const r = search.match(reg)
    if (r != null) return decodeURIComponent(r[2])
    return null
}

/** 
 * @description: 函数节流
 * @updateTime 2022-07-29 10:50:07
 * @param {Object Function} func
 * @param {Number} delay
 * @return {Object Function}
 */
export function throttled(func, delay = 500) {
    let throttledTimeout = null
    return (...args) => {
        if (!throttledTimeout) {
            func.apply(this, args)
            throttledTimeout = setTimeout(() => {
                clearTimeout(throttledTimeout)
                throttledTimeout = null
            }, delay)
        }
    }
}

/** 
 * @description: 函数防抖
 * @updateTime 2022-07-29 11:16:13
 * @param {Object Function} func
 * @param {Number} wait
 * @param {Boolean} immediate
 * @return {Object Function}
 */
export function debounce(func, wait = 500, immediate = false) {
    let debounceTimeout = null
    return (...args) => {
        const init = immediate && !debounceTimeout
        clearTimeout(debounceTimeout)
        debounceTimeout = setTimeout(() => {
            debounceTimeout = null
            !immediate ? func.apply(this, args) : null
        }, wait)
        init ? func.apply(this, args) : null
    }
}