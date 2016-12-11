/**
 * Created by Zinway on 2016/12/9.
 */
import request from 'request'
import {origin, globalOption} from './config'
import {deepCopy} from './util'

const song = (id, callback = null) => {
    const option = deepCopy(globalOption)
    const url = `${origin}/api/song/detail?ids=%5B${id}%5d`
    const method = 'GET'
    Object.assign(option, {url, method})
    request(option, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let info = JSON.parse(body);
            callback && callback(JSON.stringify(info, '', 2))
        } else {
            console.error(err)
        }
    })
};

const search = (name = null, callback = null, onlySong = true, limit = 3, offset = 0) => {
    const option = deepCopy(globalOption)
    const url = `${origin}/api/search/suggest/web`
    const form = {
        s: name,
        limit,
        type: 1,
        offset
    }
    const method = 'POST'
    Object.assign(option, {url, form, method})
    request(option, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let info = JSON.parse(body)
            let data
            if (onlySong) {
                data = info.result.songs
            } else {
                data = {songs: info.result.songs, mvs: info.result.mvs}
            }
            callback && callback(JSON.stringify(data, '', 2))
        } else {
            console.error(err)
        }
    })
};

const lrc = (id, callback = null, lv = -1) => {
    const option = deepCopy(globalOption)
    const url = `${origin}/api/song/lyric?lv=${lv}&id=${id}`
    const method = 'GET'
    Object.assign(option, {url, method})
    request(option, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let info = JSON.parse(body)
            callback && callback(JSON.stringify(info, '', 2))
        } else {
            console.error(err)
        }
    })
};

const getPlayLists = (id, callback) => {
    const option = deepCopy(globalOption)
    const url = `${origin}/api/playlist/detail?id=${id}`
    const method = 'get'
    Object.assign(option, {url, method})
    request(option, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let info = JSON.parse(body)
            callback && callback(JSON.stringify(info, '', 2))
        } else {
            console.error(err)
        }
    })
};

const getArtistAlbums = (id, callback, limit = 3, offset = 0) => {
    const option = deepCopy(globalOption)
    const url = `${origin}/api/artist/albums/${id}?offset=${offset}&limit=${limit}`
    const method = 'GET'
    Object.assign(option, {url, method})
    request(option, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let info = JSON.parse(body)
            callback && callback(JSON.stringify(info, '', 2))
        } else {
            console.error(err)
        }
    })
};

const getAlbums = (id, callback) => {
    const option = deepCopy(globalOption)
    const url = `${origin}/api/album/${id}`
    const method = 'get'
    Object.assign(option, {url, method})
    request(option, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let info = JSON.parse(body)
            callback && callback(JSON.stringify(info, '', 2))
        } else {
            console.error(err)
        }
    })
};


export default {
    search,
    song,
    lrc,
    getPlayLists,
    getArtistAlbums,
    getAlbums
}