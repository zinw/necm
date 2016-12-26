/**
 * Created by Zinway on 2016/12/20.
 */

import EventEmitter from 'events'
import MpgPlayer from 'mpg123'
import api from './api'

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
        let url = api.getMp3UrlById(this._list[index]);
        this.player.play(url);
        this.player.once('end', () => {
            this.play(index + 1)
        });
    }
}

export default Player
