/**
 * Created by Zinway on 2016/12/7.
 */
import request from 'sync-request'
import crypto from 'crypto'
import bigInt from 'big-integer'

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

const requestPostRaw = (url, options) => {
    return request('POST', url, options)
};

const toMMSS = sec => {
    let m = ~~(sec / 60);
    m = m < 10 ? `0${m}` : m;
    let s = Number.parseInt(sec % 60);
    s = s < 10 ? `0${s}` : s;
    return `${m}:${s}`
};

/**
 * 字符串转为TypedArray对象
 * @param {string} str
 * @returns {Uint8Array}
 */
const str2ta = str => {
    let buf = new ArrayBuffer(str.length);
    let bufView = new Uint8Array(buf);
    str.split('').map((s, i) => {
        bufView[i] = s.charCodeAt()
    });
    return bufView;
};

/**
 * 根据dfsId获取mp3Url加密字段
 * @param {string} dfsId 歌曲id
 */
const encodeId = dfsId => {
    let a1 = str2ta('3go8&$8*3*3h0k(2)2'),
        a2 = str2ta(dfsId),
        a1l = a1.length;
    a2.map((c, i) => {
        a2[i] = c ^ a1[i % a1l]
    });
    return crypto.createHash('md5').update(a2).digest('base64').replace(/\//g, '_').replace(/\+/g, '-');
};

const addPadding = (encText, modulus) => {
    let ml = modulus.length;
    for (let i = 0; ml > 0 && modulus[i] == '0'; i++)ml--;
    let num = ml - encText.length, prefix = '';
    for (let i = 0; i < num; i++) {
        prefix += '0';
    }
    return prefix + encText;
};


const aesEncrypt = (text, secKey) => {
    let cipher = crypto.createCipheriv('AES-128-CBC', secKey, '0102030405060708');
    return cipher.update(text, 'utf-8', 'base64') + cipher.final('base64');
};

/**
 * RSA Encryption algorithm.
 * @param text {string} - raw data to encrypt
 * @param exponent {string} - public exponent
 * @param modulus {string} - modulus
 * @returns {string} - encrypted data: reverseText^pubKey%modulus
 */
const rsaEncrypt = (text, exponent, modulus) => {
    let rText = '', radix = 16;
    for (let i = text.length - 1; i >= 0; i--) rText += text[i]; //reverse text
    let biText = bigInt(new Buffer(rText).toString('hex'), radix),
        biEx = bigInt(exponent, radix),
        biMod = bigInt(modulus, radix),
        biRet = biText.modPow(biEx, biMod);
    return addPadding(biRet.toString(radix), modulus);
};

const createSecretKey = size => {
    let keys = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < size; i++) {
        let pos = Math.random() * keys.length;
        pos = Math.floor(pos);
        key = key + keys.charAt(pos)
    }
    return key;
};

const modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
const nonce = '0CoJUm6Qyw8W8jud';
const pubKey = '010001';

const MD5 = text => crypto.createHash('md5').update(text).digest('hex');

const aesRsaEncrypt = text => {
    let secKey = createSecretKey(16);
    return {
        params: aesEncrypt(aesEncrypt(text, nonce), secKey),
        encSecKey: rsaEncrypt(secKey, pubKey, modulus)
    }
};

export {
    deepCopy,
    requestGet,
    requestGetRaw,
    requestPost,
    requestPostRaw,
    toMMSS,
    encodeId,
    MD5,
    aesRsaEncrypt,
}