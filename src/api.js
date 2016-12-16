/**
 * Created by Zinway on 2016/12/9.
 */
import request from 'request-promise-native'
import {origin, globalOption} from './config'
import {deepCopy} from './util'

/**
 * 根据id获取歌曲
 * @param {number} id 歌曲id
 */
const song = (id) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/song/detail?ids=%5B${id}%5d`;
    const method = 'GET';
    Object.assign(option, {url, method});
    return request(option)
        .then(body => {
            return JSON.parse(body).songs
        })
        .catch(e => e);
};

/**
 * 搜索
 * @param {string} name 搜索内容
 * @param {number} type 搜索类型：单曲(1)，歌手(100)，专辑(10)，歌单(1000)，用户(1002)
 * @param {boolean} onlySong 仅显示歌曲，不要MV
 * @param {number} limit 返回条数
 * @param {number} offset 分页偏移量
 */
const search = (name = null, type = 1, onlySong = true, limit = 3, offset = 0) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/search/suggest/web`;
    const form = {
        s: name,
        type,
        limit,
        offset
    };
    const method = 'POST';
    Object.assign(option, {url, form, method});
    return request(option)
        .then(body => {
            let info = JSON.parse(body);
            let data;
            if (onlySong) {
                data = info.result.songs
            } else {
                data = {songs: info.result.songs, mvs: info.result.mvs}
            }
            return data
        })
        .catch(e => e);
};

/**
 * 根据id获取歌单
 * @param {number} id 歌单id
 * @param {number} lv
 */
const lrc = (id, lv = -1) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/song/lyric?lv=${lv}&id=${id}`;
    const method = 'GET';
    Object.assign(option, {url, method});
    return request(option)
        .then(body => {
            return JSON.parse(body).lrc.lyric
        })
        .catch(e => e);
};

/**
 * 根据id获取歌单
 * @param {number} id 歌单id
 */
const playLists = (id) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/playlist/detail?id=${id}`;
    const method = 'GET';
    Object.assign(option, {url, method});
    return request(option)
        .then(body => {
            return JSON.parse(body).result
        })
        .catch(e => e);
};

/**
 * 根据歌手id获取专辑
 * @param {number} id 歌手id
 * @param {number} limit 返回条数
 * @param {number} offset 分页偏移量
 */
const artistAlbums = (id, limit = 3, offset = 0) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/artist/albums/${id}?offset=${offset}&limit=${limit}`;
    const method = 'GET';
    Object.assign(option, {url, method});
    return request(option)
        .then(body => {
            return JSON.parse(body)
        })
        .catch(e => e);
};

/**
 * 根据id获取专辑
 * @param {number} id 专辑id
 */
const albums = (id) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/album/${id}`;
    const method = 'GET';
    Object.assign(option, {url, method});
    return request(option)
        .then(body => {
            return JSON.parse(body).album
        })
        .catch(e => e);
};


export default {
    search,
    song,
    lrc,
    playLists,
    artistAlbums,
    albums
}