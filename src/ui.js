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
        let width = percent / 100 * (this.canvasSize.width - 3);
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
        this.initLoginForm();

        this.renderFocus();

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

    renderFocus() {
        this.screen.on('element focus', (cur, old) => {
            if (old.border) old.style.border.fg = 'default';
            if (cur.border) cur.style.border.fg = 'green';
            this.screen.render();
        });
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

    initLoginForm() {
        this.loginForm = blessed.form({
            label: ' 请登陆 => ',
            mouse: true,
            keys: true,
            width: '50%',
            height: '50%',
            top: 'center',
            left: 'center',
            border: 'line',
            hidden: true,
            style: {
                fg: 'blue',
                border: {
                    fg: 'green'
                }
            }
        });

        this.loginForm.on('show', () => {
            this.screen.removeAllListeners('element focus');
            this.screen.append(this.loginForm);
            this.loginForm.focus();
            this.screen.render();
        });

        this.loginForm.on('hide', () => {
            this.renderFocus();
            this.screen.remove(this.loginForm);
            this.list.focus();
            this.screen.render();
        });

        this.loginForm.on('cancel', () => {
            this.loginForm.hide();
        });

        const usernameLabel = blessed.text({
            parent: this.loginForm,
            style: {
                fg: 'white',
            },
            height: 1,
            width: 8,
            left: '50%-16',
            top: 3,
            content: '用户名：'
        });

        const username = blessed.textbox({
            parent: this.loginForm,
            mouse: true,
            keys: true,
            padding: {
                left: 1,
                right: 1,
            },
            style: {
                fg: 'white',
                bg: 'blue'
            },
            height: 1,
            width: 22,
            left: '50%-8',
            top: 3,
            name: 'username'
        });

        username.on('focus', () => username.readInput());

        const passwordLabel = blessed.text({
            parent: this.loginForm,
            style: {
                fg: 'white',
            },
            height: 1,
            width: 8,
            left: '50%-16',
            top: 6,
            content: '密  码：'
        });

        const password = blessed.textbox({
            parent: this.loginForm,
            mouse: true,
            keys: true,
            censor: true,
            padding: {
                left: 1,
                right: 1,
            },
            style: {
                fg: 'white',
                bg: 'blue'
            },
            height: 1,
            width: 22,
            left: '50%-8',
            top: 6,
            name: 'password'
        });

        password.on('focus', () => password.readInput());

        this.loginTipsLabel = blessed.text({
            parent: this.loginForm,
            align: 'center',
            style: {
                fg: 'red',
            },
            height: 1,
            left: '50%-16',
            top: 9,
            content: ''
        });

        const submit = blessed.button({
            parent: this.loginForm,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            left: '50%-10',
            bottom: 3,
            name: 'submit',
            content: '登陆',
            style: {
                fg: 'white',
                bg: 'blue',
                hover: {
                    bg: 'red'
                },
                focus: {
                    bg: 'red'
                }
            }
        });

        submit.on('press', () => this.loginForm.submit());

        const cancel = blessed.button({
            parent: this.loginForm,
            mouse: true,
            keys: true,
            shrink: true,
            padding: {
                left: 1,
                right: 1
            },
            left: '50%+4',
            bottom: 3,
            name: 'submit',
            content: '取消',
            style: {
                fg: 'white',
                bg: 'blue',
                hover: {
                    bg: 'red'
                },
                focus: {
                    bg: 'red'
                }
            }
        });

        cancel.on('press', () => this.loginForm.cancel());
    }
}

export default Ui
