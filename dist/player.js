'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _events=require('events');var _events2=_interopRequireDefault(_events);var _mpg=require('mpg123');var _mpg2=_interopRequireDefault(_mpg);var _api=require('./api');var _api2=_interopRequireDefault(_api);function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var Player=function(_EventEmitter){_inherits(Player,_EventEmitter);function Player(song_id_list){_classCallCheck(this,Player);var _this=_possibleConstructorReturn(this,(Player.__proto__||Object.getPrototypeOf(Player)).call(this));_this.player=new _mpg2.default;_this._list=song_id_list instanceof Array?song_id_list:[];return _this}_createClass(Player,[{key:'play',value:function play(){var _this2=this;var index=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;if(typeof index!=='number'||index<0){return this}else if(index>=this._list.length){this.emit('finish','Playlist is over.');return this}this.emit('playing',index);var url=_api2.default.getMp3UrlById(this._list[index]);this.player.play(url);this.player.once('end',function(){_this2.play(index+1)})}}]);return Player}(_events2.default);exports.default=Player;