'use strict';Object.defineProperty(exports,'__esModule',{value:true});var _slicedToArray=function(){function sliceIterator(arr,i){var _arr=[];var _n=true;var _d=false;var _e=undefined;try{for(var _i=arr[Symbol.iterator](),_s;!(_n=(_s=_i.next()).done);_n=true){_arr.push(_s.value);if(i&&_arr.length===i)break}}catch(err){_d=true;_e=err}finally{try{if(!_n&&_i['return'])_i['return']()}finally{if(_d)throw _e}}return _arr}return function(arr,i){if(Array.isArray(arr)){return arr}else if(Symbol.iterator in Object(arr)){return sliceIterator(arr,i)}else{throw new TypeError('Invalid attempt to destructure non-iterable instance')}}}();var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();var _events=require('events');var _events2=_interopRequireDefault(_events);var _mpg=require('mpg123');var _mpg2=_interopRequireDefault(_mpg);var _api=require('./api');var _api2=_interopRequireDefault(_api);var _util=require('./util');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError('this hasn\'t been initialised - super() hasn\'t been called')}return call&&(typeof call==='object'||typeof call==='function')?call:self}function _inherits(subClass,superClass){if(typeof superClass!=='function'&&superClass!==null){throw new TypeError('Super expression must either be null or a function, not '+typeof superClass)}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass}var Player=function(_EventEmitter){_inherits(Player,_EventEmitter);function Player(){_classCallCheck(this,Player);var _this=_possibleConstructorReturn(this,(Player.__proto__||Object.getPrototypeOf(Player)).call(this));_this.player=new _mpg2.default;_this._list=[];_this._ll=_this._list.length;_this._index=0;return _this}_createClass(Player,[{key:'setPlayList',value:function setPlayList(song_id_list){this._list=song_id_list instanceof Array?song_id_list:[];this._ll=this._list.length}},{key:'play',value:function play(){var _this2=this;var index=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;if(this._ll<1||typeof index!=='number'||index<0){return this}this._index=index;this._next=(this._index+1)%this._ll;this.emit('playing',this._index);var url=_api2.default.getSongUrl(this._list[index]);if(!url)url=_api2.default.getMp3UrlById(this._list[index]);try{this.player.play(url)}catch(e){this.play(this._next)}this.player.removeAllListeners('end');this.player.once('end',function(){_this2.play(_this2._next)});this.player.removeAllListeners('frame');this.player.on('frame',function(d){var _d=_slicedToArray(d,4),c_num=_d[0],r_num=_d[1],c_time=_d[2],r_time=_d[3];c_time=Number.parseFloat(c_time);r_time=Number.parseFloat(r_time);var t_time=c_time+r_time;var percent=Math.round(c_time/t_time*10000)/100;var current_time=(0,_util.toMMSS)(c_time);var total_time=(0,_util.toMMSS)(t_time);_this2.emit('processing',percent,current_time,total_time)})}},{key:'pause',value:function pause(){this.player.pause()}}]);return Player}(_events2.default);exports.default=Player;