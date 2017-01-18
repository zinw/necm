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
    constructor(song_id_list) {
        super();
        this.player = new MpgPlayer();
        this._list = song_id_list instanceof Array ? song_id_list : [];
    }

    play(index = 0) {
        if (typeof index !== 'number' || index < 0) {
            return this
        } else if (index >= this._list.length) {
            this.emit('finish', 'Playlist is over.');
            return this
        }
        this.emit('playing', index);
        let url = api.getSongUrl(this._list[index]);
        if (!url) url = api.getMp3UrlById(this._list[index]);
        this.player.play(url);
        this.player.removeAllListeners('end');
        this.player.once('end', () => {
            this.play(index + 1)
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
