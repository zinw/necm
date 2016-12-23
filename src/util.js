/**
 * Created by Zinway on 2016/12/7.
 */
import request from 'sync-request'

const deepCopy = obj => JSON.parse(JSON.stringify(obj));

/**
 * [function] 同步执行request get
 * @param {string} url
 * @param {object} options
 * @return {object} body
 */
const requestGet = (url, options = {}) => {
    return JSON.parse(request('GET', url, options).getBody('utf8'))
};

const requestGetRaw = (url, options = {}) => {
    return request('GET', url, options).getBody('utf8')
};

/**
 * [function] 同步执行request post
 * @param {string} url
 * @param {object} options
 * @return {object} body
 */
const requestPost = (url, options) => {
    return JSON.parse(request('POST', url, options).getBody('utf8'))
};

export {
    deepCopy,
    requestGet,
    requestGetRaw,
    requestPost
}