/**
 * Created by Zinway on 2016/12/19.
 */
import Ui from './ui'
import api from './api'
import Player from './player'

class NECM extends Ui {
    constructor() {
        super();
        this._bind('initTopList', 'topListDo');
        this.mainMenuList = [
            ['排行榜', this.initTopList]
        ];
        this.initMainMenu();
        this.list.key(['m'], () => this.initMainMenu());
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
        this.list.removeAllListeners('select');
        this.list.once('select', (item, index) => {
            this.list.setLabel(` ${item.getText().split('.').slice(-1)[0].trim()} `);
            this.mainMenuListDo(index);
            this.screen.render();
        });
    }

    topListDo(index = 0) {
        this.playList = api.getTopSongList(index);
        this.songNames = this.playList.map((s, i) => {
            const {name, artists, album} = s;
            let _artists = artists.map(a => a.name).join(' & '),
                _album = album.name;
            return ` ${i}. ${name} - ${_artists} <${_album}>`;
        });
        this.list.setItems(this.songNames);
        this.screen.render();
        this.songIdList = this.playList.map((s) => s.id);
        let player = new Player(this.songIdList);
        const onSelect = () => {
            this.list.removeAllListeners('select');
            this.list.on('select', (item, index) => {
                this.rTitle = this.list._label.content;
                this.rItems = this.songNames;
                player.play(index)
            });
        };
        onSelect();
        this.list.key(['space'], () => player.pause());
        player.on('playing', index => {
            if (this.rTitle != this.list._label.content) {
                this.list.setLabel(this.rTitle);
                this.list.setItems(this.rItems);
                this.screen.render();
                onSelect();
            }
            this.list.select(index);
        });
        player.on('processing', (p, c, t) => {
            this.playBox.doProcessing(p, c, t);
            this.screen.render();
        })
    }

    initTopList() {
        this.list.setItems(api.getTopListNames());
        this.screen.render();
        this.list.removeAllListeners('select');
        this.list.once('select', (item, index) => {
            let title = ` ${item.getText().split('.').slice(-1)[0].trim()} `;
            this.topListDo(index);
            this.list.setLabel(title);
            this.screen.render();
        });
    }
}

export default NECM
