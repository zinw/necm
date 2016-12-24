/**
 * Created by Zinway on 2016/12/20.
 */

import EventEmitter from 'events'
import http from 'http'
import lame from 'lame'
import Speaker from 'audio-speaker/stream'
import MemoryStream from 'memorystream'
import api from './api'

/**
 * [Class Player]
 * @param {Array} song_id_list 歌曲ID列表
 */
class Player extends EventEmitter {
    constructor(song_id_list) {
        super();
        this._list = song_id_list instanceof Array ? song_id_list : [];
    }

    play(index = 0) {
        if (index >= this._list.length) {
            this.emit('finish', 'Playlist is over.');
            return this
        }
        let song_id = this._list[index];
        let ms = new MemoryStream();
        http.get(api.getMp3UrlById(song_id), res => {
            res.pipe(ms)
        });
        ms.once('data', () => {
            ms
                .pipe(new lame.Decoder())
                .pipe(new Speaker())
        });
        ms.once('end', () => {
            console.log(`played ${index}`);
            //this.play(index + 1)
        });
    }
}

export default Player
