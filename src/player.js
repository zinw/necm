/**
 * Created by Zinway on 2016/12/20.
 */

import EventEmitter from 'events'
import http from 'http'
import lame from 'lame'
import Speaker from 'audio-speaker/stream'
import api from './api'

/**
 * [Class Player]
 * @param {Array} songs 歌曲对象列表
 */
class Player extends EventEmitter {
    constructor(songs) {
        super();
        this._list = songs instanceof Array ? songs : [];
    }

    play(index = 0) {
        if (index >= this._list.length) {
            this.emit('finish', 'Playlist is over.');
            return this
        }
        let song = this._list[index];
        let mp3_url = api.getMp3Url(song);
        console.log(`MP3 URL: ${mp3_url}`);
        http.get(api.getMp3Url(song), res => {
            console.log(res.statusCode);
            console.log(res.headers);
            let size = parseInt(res.headers['content-length']);

            res.on('data', function(chunk) {
                let downloaded = 0;
                downloaded += chunk.length;
                let percents = parseInt((downloaded / size) * 100);
                console.log(percents +'%', downloaded +'/'+size);
            });

            res.on('error', function(error) {
                console.error(error);
            });

            res
                .pipe(new lame.Decoder())
                .pipe(new Speaker())
                .on('end', () => {
                    console.log(`played ${index}`);
                    this.play(index + 1)
                });
        });
    }
}

export default Player
