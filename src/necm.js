/**
 * Created by Zinway on 2016/12/19.
 */
import Ui from './ui'
import api from './api'
import Player from './player'
import {cookieFile} from './config'
import fs from 'fs'

class NECM extends Ui {
    constructor() {
        super();
        this.loadCookie(cookieFile);
        this.player = new Player();
        this._bind(
            'initTopList',
            'renderPlayList',
            'topListDo',
            'initDailyRecommend',
        );
        this.mainMenuList = [
            ['排行榜', this.initTopList],
            ['每日推荐', this.initDailyRecommend]
        ];
        this.initMainMenu();
        this.list.key(['m'], () => this.initMainMenu());
        this.list.key(['space'], () => this.player.pause());
        this.list.key(['p'], () => this.renderPlayingList());
    }

    loadCookie(file) {
        if (!fs.existsSync(file)) {
            this.__csrf = '';
            this.MUSIC_U = '';
        } else {
            try {
                const cookie = JSON.parse(fs.readFileSync(file));
                if (!cookie.Expires) {
                    this.__csrf = '';
                    this.MUSIC_U = '';
                } else {
                    const expires = new Date(cookie.Expires);
                    if (expires - (new Date()) < 86400 * 1000) {
                        this.__csrf = '';
                        this.MUSIC_U = '';
                    } else {
                        this.__csrf = cookie.__csrf;
                        this.MUSIC_U = cookie.MUSIC_U;
                    }
                }
            } catch (e) {
                this.__csrf = '';
                this.MUSIC_U = '';
            }
        }
    }

    saveCookie(cookie, file) {
        if (!fs.existsSync(file)) fs.closeSync(fs.openSync(file, 'w'));
        fs.writeFile(file, JSON.stringify(cookie, ['__csrf', 'MUSIC_U', 'Expires'], 2), e => {
            if (e) this.screen.debugLog.log(e)
        });
    }

    getMainMenuListNames() {
        return this.mainMenuList.map((l, i) => ` ${i}. ${l[0]}`)
    };

    mainMenuListDo(index = 0) {
        try {
            this.mainMenuList[index][1]();
        } catch (e) {
            this.screen.debugLog.log(e)
        }
    }

    initMainMenu() {
        this.list.setLabel(' 网易云音乐 ');
        this.list.setItems(this.getMainMenuListNames());
        this.screen.render();
        this.list.removeAllListeners('select');
        this.list.once('select', (item, index) => {
            this.title = ` ${item.getText().split('.').slice(-1)[0].trim()} `;
            this.list.setLabel(this.title);
            this.mainMenuListDo(index);
            this.screen.render();
        });
    }

    renderPlayList(songItems) {
        if (!songItems || !songItems instanceof Array || songItems.length < 1)
            return this.screen.debugLog.log(`Error: renderPlayList(${songItems})`);
        this.playList = songItems;
        this.songNames = this.playList.map((s, i) => {
            const {name, artists, album} = s;
            let _artists = artists.map(a => a.name).join(' & '),
                _album = album.name;
            return ` ${i}. ${name} - ${_artists} <${_album}>`;
        });
        this.list.setItems(this.songNames);
        this.screen.render();
        this.songIdList = this.playList.map((s) => s.id);
        const onSelect = () => {
            this.list.removeAllListeners('select');
            this.list.on('select', (item, index) => {
                if (this.player._list != this.songIdList) {
                    this._title = this.title;
                    this._songNames = this.songNames;
                    this.player.setPlayList(this.songIdList);
                }
                this.rTitle = this.list._label.content;
                this.rItems = this.songNames;
                this.player.play(index)
            });
        };
        onSelect();
        this.player.removeAllListeners('playing');
        this.player.on('playing', index => {
            if (this.rTitle != this.list._label.content) {
                this.list.setLabel(this.rTitle);
                this.list.setItems(this.rItems);
                this.screen.render();
                onSelect();
            }
            this.list.select(index);
        });
        this.player.removeAllListeners('processing');
        this.player.on('processing', (p, c, t) => {
            this.playBox.doProcessing(p, c, t);
            this.screen.render();
        })
    }

    topListDo(index = 0) {
        this.renderPlayList(api.getTopSongList(index));
    }

    renderPlayingList() {
        if (this._title && this._songNames && this.player._index > -1) {
            this.list.setLabel(this._title);
            this.list.setItems(this._songNames);
            this.list.select(this.player._index);
            this.screen.render();
        } else {
            this.screen.debugLog.log(`this._title => ${this._title}`);
            this.screen.debugLog.log(`this.songNames.length => ${this.songNames.length}`);
            this.screen.debugLog.log(`this.player._index => ${this.player._index}`);
        }
    }

    initTopList() {
        this.list.setItems(api.getTopListNames());
        this.screen.render();
        this.list.removeAllListeners('select');
        this.list.once('select', (item, index) => {
            this.title = ` ${item.getText().split('.').slice(-1)[0].trim()} `;
            this.topListDo(index);
            this.list.setLabel(this.title);
            this.screen.render();
        });
    }

    handleLogin(event_name) {
        if (!event_name) return;
        this.loginForm.show();
        const tip = content => {
            this.loginTipsLabel.setContent(content);
            this.screen.render();
        };
        this.loginForm.removeAllListeners('cancel');
        this.loginForm.on('cancel', () => {
            this.loginForm.hide();
            this.list.focus();
            this.initMainMenu();
        });
        this.loginForm.removeAllListeners('submit');
        this.loginForm.on('submit', data => {
            const {username, password} = data;
            if (!username && !password) return tip('请输入用户名和密码。');
            if (!username) return tip('请输入用户名。');
            if (!password) return tip('请输入密码。');
            const r = api.login(username, password);
            if (typeof r === 'object' && r.__csrf) {
                this.__csrf = r.__csrf;
                this.MUSIC_U = r.MUSIC_U;
                this.saveCookie(r, cookieFile);
                this.loginForm.hide();
                this.screen.emit(event_name, r.__csrf, r.MUSIC_U);
            } else {
                this.screen.debugLog.log(r)
            }
        });
    }

    initDailyRecommend() {
        const event_name = 'csrf for dailyRecommend';
        this.screen.removeAllListeners(event_name);
        this.screen.once(event_name, (c, u) => {
            const songItems = api.dailyRecommend(c, u);
            this.renderPlayList(songItems);
        });
        if (this.__csrf && this.MUSIC_U) {
            this.screen.emit(event_name, this.__csrf, this.MUSIC_U)
        } else {
            this.handleLogin(event_name)
        }
    }
}

export default NECM
