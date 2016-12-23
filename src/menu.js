/**
 * Created by Zinway on 2016/12/19.
 */
import Ui from './ui'
import api from './api'
import Player from './player'

class Menu extends Ui {
    constructor() {
        super();
        this._bind('initTopList', 'topListDo');
        this.mainMenuList = [
            ['排行榜', this.initTopList]
        ];
        this.initMainMenu()
    }

    getMainMenuListNames() {
        return this.mainMenuList.map((l, i) => ` ${i}. ${l[0]}`)
    };

    mainMenuListDo(index = 0) {
        this.mainMenuList[index][1]();
    }

    initMainMenu() {
        this.list.setItems(this.getMainMenuListNames());
        this.screen.render();
        this.list.once('select', (item, index) => {
            this.list.setLabel(` ${item.getText().split('.').slice(-1)[0].trim()} `);
            this.mainMenuListDo(index);
            this.screen.render();
        });
    }

    async topListDo(index = 0) {
        this.playList = await api.getTopSongList(index);
        this.songNames = this.playList.map((s, i) => {
            const {name, artists, album} = s;
            let _artists = artists.map(a => a.name).join(' & '),
                _album = album.name;
            return ` ${i}. ${name} - ${_artists} <${_album}>`;
        });
        this.list.setItems(this.songNames);
        this.screen.render();
        this.songsList = this.playList.map(async(s) => {
            let {id} = s;
            let song = await api.song(id);
            return song
        });
        let player = new Player(this.songsList);
        this.list.on('select', (item, index) => {
            player.play(index)
        });
    }

    initTopList() {
        this.list.setItems(api.getTopListNames());
        this.screen.render();
        this.list.once('select', (item, index) => {
            this.list.setLabel(` ${item.getText().split('.').slice(-1)[0].trim()} `);
            this.topListDo(index);
            this.screen.render();
        });
    }
}

// test
const menu = new Menu();

export default Menu
