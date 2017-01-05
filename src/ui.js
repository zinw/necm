/**
 * Created by Zinway on 2016/12/17.
 */
import blessed from 'blessed'
import {gauge} from 'blessed-contrib'

class PlayBox extends gauge {
    constructor(options) {
        super(options);
    }

    doProcessing(percent, current_time, total_time) {

        if (!this.ctx) {
            throw "error: canvas context does not exist. setData() for gauges must be called after the gauge has been added to the screen via screen.append()"
        }

        let c = this.ctx;

        c.strokeStyle = this.options.stroke; //default is 'magenta'
        c.fillStyle = this.options.fill; //default is 'white'

        c.clearRect(0, 0, this.canvasSize.width, this.canvasSize.height);
        if (percent < 1.001) {
            percent = percent * 100;
        }
        let width = percent / 100 * (this.canvasSize.width - 2);
        c.fillRect(1, 1, width, 0);

        let textX = this.canvasSize.width - 12;

        c.strokeStyle = 'normal';
        if (this.options.showLabel) c.fillText(`${current_time}/${total_time}`, textX, 0)
    }
}

class Ui {
    constructor() {
        this.screen = blessed.screen({
            debug: true,
            warnings: false,
            dockBorders: true,
            smartCSR: true,
            fullUnicode: true,
            title: 'NECM'
        });

        this.initListWidget();
        this.initSearchWidget();
        this.initPlayBox();

        this.screen.on('element focus', (cur, old) => {
            if (old.border) old.style.border.fg = 'default';
            if (cur.border) cur.style.border.fg = 'green';
            this.screen.render();
        });

        this.screen.key(['tab'], (ch, key) => {
            this.screen.focusNext();
        });
        this.screen.key(['S-tab'], (ch, key) => {
            this.screen.focusPrevious()
        });

        // Quit on Escape, q, or Control-C.
        this.screen.key(['escape', 'q', 'C-c'], (ch, key) => {
            process.exit();
        });

        // default focus
        this.list.focus();
        // Render the screen.
        this.screen.render();
    }

    _bind(...methods) {
        methods.forEach((method) => this[method] = this[method].bind(this));
    }

    initListWidget() {
        this.list = blessed.list({
            mouse: true,
            keys: true,
            vi: true,
            align: 'left',
            label: ' 网易云音乐 ',
            border: 'line',
            width: '50%',
            height: '50%',
            top: 'center',
            left: 'center',
            padding: 1,
            items: [
                ' 0. loading',
                ' 1. loading',
                ' 2. loading',
                ' 3. loading',
                ' 4. loading',
                ' 5. loading',
                ' 6. loading',
                ' 7. loading',
                ' 8. loading',
                ' 9. loading',
            ],
            style: {
                fg: 'blue',
                bg: 'default',
                border: {
                    fg: 'default',
                    bg: 'default'
                },
                selected: {
                    fg: '#f0f0f0',
                    bg: 'green'
                }
            },
        });

        this.screen.append(this.list);
    }

    initSearchWidget() {
        this.searchBox = blessed.textbox({
            label: ' 搜索 ',
            content: '',
            border: 'line',
            style: {
                fg: 'blue',
                bg: 'default',
                bar: {
                    bg: 'default',
                    fg: 'blue'
                },
                border: {
                    fg: 'default',
                    bg: 'default'
                }
            },
            padding: {
                left: 1
            },
            width: '30%',
            height: 3,
            right: 0,
            top: 2,
            keys: true,
            vi: true,
            mouse: true
            //inputOnFocus: true
        });

        this.searchBox.on('submit', (value) => {
            if (value) this.list.setLabel(` 搜索> ${value} `);
            this.list.focus();
            this.searchBox.clearInput();
            this.screen.render();
        });

        this.screen.append(this.searchBox);
    }

    initPlayBox() {
        this.playBox = new PlayBox({
            label: ' playing... ',
            border: 'line',
            width: '50%',
            height: 4,
            left: 'center',
            top: '75%',
            stroke: 'green'
        });
        this.screen.append(this.playBox);
    }
}

export default Ui
