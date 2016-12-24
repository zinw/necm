/**
 * Created by Zinway on 2016/12/9.
 */
import crypto from 'crypto'
import querystring from 'querystring'
import {origin, globalOption} from './config'
import {deepCopy, requestGet, requestGetRaw, requestPost} from './util'


// 歌曲榜单地址
const top_list = [
    ['云音乐飙升榜', 19723756],
    ['云音乐新歌榜', 3779629],
    ['网易原创歌曲榜', 2884035],
    ['云音乐热歌榜', 3778678],
    ['云音乐电音榜', 10520166],
    ['UK排行榜周榜', 180106],
    ['美国Billboard周榜', 60198],
    ['KTV嗨榜', 21845217],
    ['iTunes榜', 11641012],
    ['Hit FM Top榜', 120001],
    ['日本Oricon周榜', 60131],
    ['韩国Melon排行榜周榜', 3733003],
    ['韩国Mnet排行榜周榜', 60255],
    ['韩国Melon原声周榜', 46772709],
    ['中国TOP排行榜(港台榜)', 112504],
    ['中国TOP排行榜(内地榜)', 64016],
    ['香港电台中文歌曲龙虎榜', 10169002],
    ['华语金曲榜', 4395559],
    ['中国嘻哈榜', 1899724],
    ['法国 NRJ EuroHot 30周榜', 27135204],
    ['台湾Hito排行榜', 112463],
    ['Beatport全球电子舞曲榜', 3812895]
];

const getTopListNames = () => {
    return top_list.map((l, i) => ` ${i}. ${l[0]}`)
};

const getTopSongList = (index = 0) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/discover/toplist?id=${top_list[index][1]}`;
    let body = requestGetRaw(url, option);
    let re = new RegExp(/>\[.*\]</);
    return JSON.parse(body.match(re)[0].slice(1, -1));
};

/**
 * 根据id获取歌曲
 * @param {number} id 歌曲id
 */
const song = (id) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/song/detail?ids=%5B${id}%5d`;
    return requestGet(url, option).songs[0]
};

/**
 * 字符串转为TypedArray对象
 * @param {string} str
 * @returns {Uint8Array}
 */
function str2ta(str) {
    let buf = new ArrayBuffer(str.length);
    let bufView = new Uint8Array(buf);
    str.split('').map((s, i) => {
        bufView[i] = s.charCodeAt()
    });
    return bufView;
}

/**
 * 根据dfsId获取mp3Url加密字段
 * @param {string} dfsId 歌曲id
 */
const encodeId = (dfsId) => {
    let a1 = str2ta('3go8&$8*3*3h0k(2)2'),
        a2 = str2ta(dfsId),
        a1l = a1.length;
    a2.map((c, i) => {
        a2[i] = c ^ a1[i % a1l]
    });
    let m = crypto.createHash('md5');
    m.update(a2);
    return m.digest().toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
};

/**
 * 获取高音质mp3Url
 * @param {object} song
 */
const getMp3Url = (song) => {
    let music = {};
    if (song.hasOwnProperty('hMusic')) {
        music = song.hMusic
    } else if (song.hasOwnProperty('mMusic')) {
        music = song.mMusic
    } else {
        return song.mp3Url
    }
    let song_id = music.dfsId.toString();
    let enc_id = encodeId(song_id);
    return `http://m2.music.126.net/${enc_id}/${song_id}.mp3`
};

/**
 * 根据歌曲id获取高品质mp3Url
 * @param {number} song_id 歌曲id
 * @returns {string} mp3Url
 */
const getMp3UrlById = (song_id) => getMp3Url(song(song_id));

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
    const body = querystring.stringify({
        s: name,
        type,
        limit,
        offset
    });
    Object.assign(option, {body});
    let info = requestPost(url, option);
    let data;
    if (onlySong) {
        data = info.result.songs
    } else {
        data = {songs: info.result.songs, mvs: info.result.mvs}
    }
    return data
};

/**
 * 根据id获取歌词
 * @param {number} id 歌曲id
 * @param {number} lv
 */
const lrc = (id, lv = -1) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/song/lyric?lv=${lv}&id=${id}`;
    let l = requestGet(url, option);
    return l.hasOwnProperty('lrc') ? l.lrc.lyric : 'no lyric'
};

/**
 * 根据id获取歌单
 * @param {number} id 歌单id
 */
const playLists = (id) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/playlist/detail?id=${id}`;
    return requestGet(url, option).result;
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
    return requestGet(url, option);
};

/**
 * 根据id获取专辑
 * @param {number} id 专辑id
 */
const albums = (id) => {
    const option = deepCopy(globalOption);
    const url = `${origin}/api/album/${id}`;
    return requestGet(url, option).album;
};


export default {
    getTopListNames,
    getTopSongList,
    song,
    getMp3Url,
    getMp3UrlById,
    search,
    lrc,
    playLists,
    artistAlbums,
    albums
}
