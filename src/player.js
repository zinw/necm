/**
 * Created by Zinway on 2016/12/20.
 */

import EventEmitter from 'events'
import MpgPlayer from 'mpg123'
import api from './api'
import {toMMSS} from './util'

/**
 * [Class Player]
 * @param {Array} song_id_list 歌曲ID列表
 */
class Player extends EventEmitter {
    constructor() {
        super();
        this.player = new MpgPlayer();
        this._list = [];
        this._ll = this._list.length;
        this._index = 0;
    }

    setPlayList(song_id_list) {
        this._list = song_id_list instanceof Array ? song_id_list : [];
        this._ll = this._list.length;
    }

    play(index = 0) {
        if (this._ll < 1 || typeof index !== 'number' || index < 0) {
            return this
        }
        this._index = index;
        this._next = (this._index + 1) % this._ll;
        this.emit('playing', this._index);
        let url = api.getSongUrl(this._list[index]);
        if (!url) url = api.getMp3UrlById(this._list[index]);
        try {
            this.player.play(url);
        }
        catch (e) {
            this.play(this._next)
        }
        this.player.removeAllListeners('end');
        this.player.once('end', () => {
            this.play(this._next)
        });
        this.player.removeAllListeners('frame');
        this.player.on('frame', d => {
            let [c_num, r_num, c_time, r_time] = d;
            c_time = Number.parseFloat(c_time);
            r_time = Number.parseFloat(r_time);
            let t_time = c_time + r_time;
            let percent = Math.round((c_time / t_time) * 10000) / 100;
            let current_time = toMMSS(c_time);
            let total_time = toMMSS(t_time);
            this.emit('processing', percent, current_time, total_time);
        })
    }

    pause() {
        this.player.pause()
    }
}

export default Player
