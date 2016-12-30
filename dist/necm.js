'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _ui=require('./ui');var _ui2=_interopRequireDefault(_ui);var _api=require('./api');var _api2=_interopRequireDefault(_api);var _player=require('./player');var _player2=_interopRequireDefault(_player);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var NECM=function(_Ui){_inherits(NECM,_Ui);function NECM(){_classCallCheck(this,NECM);var _this=_possibleConstructorReturn(this,(NECM.__proto__||Object.getPrototypeOf(NECM)).call(this));_this._bind('initTopList','topListDo');_this.mainMenuList=[['\u6392\u884C\u699C',_this.initTopList]];_this.initMainMenu();var percent=0;setInterval(function(){_this.playBox.setPercent(percent++);_this.screen.render();if(percent>=100)percent=0},200);return _this}_createClass(NECM,[{key:'getMainMenuListNames',value:function getMainMenuListNames(){return this.mainMenuList.map(function(l,i){return' '+i+'. '+l[0]})}},{key:'mainMenuListDo',value:function mainMenuListDo(){var index=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;this.mainMenuList[index][1]()}},{key:'initMainMenu',value:function initMainMenu(){var _this2=this;this.list.setItems(this.getMainMenuListNames());this.screen.render();this.list.once('select',function(item,index){_this2.list.setLabel(' '+item.getText().split('.').slice(-1)[0].trim()+' ');_this2.mainMenuListDo(index);_this2.screen.render()})}},{key:'topListDo',value:function topListDo(){var _this3=this;var index=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;this.playList=_api2.default.getTopSongList(index);this.songNames=this.playList.map(function(s,i){var name=s.name,artists=s.artists,album=s.album;var _artists=artists.map(function(a){return a.name}).join(' & '),_album=album.name;return' '+i+'. '+name+' - '+_artists+' <'+_album+'>'});this.list.setItems(this.songNames);this.screen.render();this.songIdList=this.playList.map(function(s){return s.id});var player=new _player2.default(this.songIdList);this.list.on('select',function(item,index){player.play(index)});player.on('playing',function(index){return _this3.list.select(index)})}},{key:'initTopList',value:function initTopList(){var _this4=this;this.list.setItems(_api2.default.getTopListNames());this.screen.render();this.list.once('select',function(item,index){var title=' '+item.getText().split('.').slice(-1)[0].trim()+' ';_this4.topListDo(index);_this4.list.setLabel(title);_this4.screen.render()})}}]);return NECM}(_ui2.default);exports.default=NECM;