/**
 * Author: Mean
 * Date: 2022-07-27 16:00:15
 * LastEditTime: Fri Aug 26 2022 17:14:39
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
 * @param {Boolean} immediate 是否直接执行
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

/** 
 * @description: 判断元素是否进入可视区域
 * @updateTime 2022-08-10 17:19:29
 * @param {Object HTMLElement} el
 * @param {Number} diff
 * @return {Boolean}
 */
export function isInViewport(el, diff = 0) {
    const viewportHeight =
        window.innerHeight ||
        document.documentElement.scrollHeight ||
        document.body.scrollHeight;
    const { top, height } = el.getBoundingClientRect();
    return top >= -height && top <= viewportHeight - diff;
}

/** 
 * @description: 滚动结束回调函数
 * @updateTime 2022-08-19 11:18:30
 * @param {Object HTMLElement} el
 * @param {Object Function} func
 * @param {Number} timerWait
 */
export function scrollOver(el, func, timerWait = 1000) {
    let scrollTimer = null, scrollTop = null
    el.addEventListener('scroll', () => {
        if (scrollTimer == null) {
            scrollTimer = setInterval(() => {
                const { top } = el.getBoundingClientRect()
                if (scrollTop != null && scrollTop === top) {
                    func()
                    clearInterval(scrollTimer)
                    scrollTimer = null
                } else {
                    scrollTop = top
                }
            }, timerWait)
        }
    })
}

/** 
 * @description: 复制文本
 * @updateTime 2022-08-19 17:00:41
 * @param {String} text
 * @param {Object Function} func
 */
export function copyText(text, func) {
    try {
        navigator.clipboard.writeText(text).then(func)
    } catch (error) {
        const input = document.createElement('input');
        input.setAttribute('readonly', 'readonly');
        input.setAttribute('value', text);
        document.body.appendChild(input);
        input.setSelectionRange(0, 9999);
        input.select()
        if (document.execCommand('copy')) {
            document.execCommand('copy');
            func()
        }
        document.body.removeChild(input);
    }
}

/** 
 * @description: 播放简单的图片帧动画（需要同一个文件夹里的以对应数字0命名的开始的图片序列）
 * @updateTime 2022-08-26 17:09:24
 * @param {object HTMLCanvasElement} canvas
 * @param {String} path
 * @param {String} imageName
 * @param {Number} count
 * @param {Number} speed
 * @param {Object Function} callback
 */
export const canvasAnima = (canvas, path, imageName, count, speed = 20, callback) => {
    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height
    const imgObject = {}
    // 适配不同浏览器
    const raf = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60)
            }
    })()
    // 执行drawImage
    const startAnima = (img) => {
        ctx.clearRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)
    }
    const startStep = () => {
        let lastTime = null
        let index = 0
        const step = (ts) => {
            let progress
            if (lastTime == null) {
                lastTime = ts
                raf(step)
            } else {
                progress = ts - lastTime
                if (progress >= speed) {
                    lastTime = ts
                    startAnima(imgObject[index])
                    index++
                    if (index < count) {
                        raf(step)
                    } else {
                        callback && callback()
                    }
                } else {
                    raf(step)
                }
            }
        }
        raf(step)
    }
    // 图片加载
    let onloadImageNum = 0
    for (let i = 0; i < count; i++) {
        const imageUrl = require(`${path + i + imageName}`)
        const image = new Image()
        image.src = imageUrl
        // 导入到对象中
        imgObject[i] = image
        image.onload = () => {
            onloadImageNum++
            // 加载完成图片等于图片数组长度，代表完成加载
            if (onloadImageNum === count) {
                startStep()
            }
        }
    }

}