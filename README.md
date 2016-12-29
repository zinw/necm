# N.E.C.M. [![Build Status][travis-image]][travis-url]

[![NPM version][npm-image]][npm-url] [![Downloads][downloads-image]][npm-url] [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/zinw/necm/master/LICENSE)

[npm-url]: https://npmjs.org/package/necm
[downloads-image]: http://img.shields.io/npm/dm/necm.svg
[npm-image]: http://img.shields.io/npm/v/necm.svg
[travis-url]: https://travis-ci.org/zinw/necm
[travis-image]: http://img.shields.io/travis/zinw/necm.svg


NetEase Cloud Music

[WIP]网易云音乐命令行版本，基于`ES6`编写。

## 依赖

由于写改模块时，试用node.js版的mpg123（[node-speaker](https://github.com/TooTallNate/node-speaker/#audio-backend-selection)）遇到些许瑕疵问题，最终选用了原生编译安装的mpg123，基于`mpg123 -R`，所以使用该模块需要系统中预先装有`mpg123`。安装方法如下：

#### Ubuntu/Debian
```
sudo apt-get install mpg123
```
#### Arch Linux
```
sudo pacman -Sy mpg123
```
#### OSX
```
brew install mpg123
```

## 安装

```shell
npm install -g necm
```

## 使用

```shell
necm
```

## License
[The MIT License (MIT)](LICENSE)