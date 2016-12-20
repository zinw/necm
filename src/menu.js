/**
 * Created by Zinway on 2016/12/19.
 */
import Ui from './ui'
import api from './api'

class Menu extends Ui {
    constructor() {
        super();
        this._bind('initTopList');
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

    // 主菜单
    initMainMenu() {
        this.list.setItems(this.getMainMenuListNames());
        this.screen.render();
        this.list.once('select', (item, index) => {
            this.list.setLabel(` ${item.getText().split('.').slice(-1)[0].trim()} `);
            this.mainMenuListDo(index);
            this.screen.render();
        });
    }

    // 排行榜
    initTopList() {
        this.list.setItems(api.getTopListNames());
        this.screen.render();
        this.list.once('select', (item, index) => {
            this.list.setLabel(` ${item.getText().split('.').slice(-1)[0].trim()} `);
            this.screen.render();
        });
    }
}

// test
const menu = new Menu();

export default Menu
