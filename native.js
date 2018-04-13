"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var NativeEvent = {

    _listeners: {},

    addEvent: function addEvent(type, fn) {
        if (typeof this._listeners[type] === "undefined") {
            this._listeners[type] = [];
        }
        if (typeof fn === "function") {
            this._listeners[type].push(fn);
        }
        return this;
    },

    fireEvent: function fireEvent(type, param) {
        var arrayEvent = this._listeners[type];
        if (arrayEvent instanceof Array) {
            for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
                if (typeof arrayEvent[i] === "function") {
                    arrayEvent[i](param);
                }
            }
        }
        return this;
    },

    removeEvent: function removeEvent(type, fn) {
        var arrayEvent = this._listeners[type];
        if (typeof type === "string" && arrayEvent instanceof Array) {
            if (typeof fn === "function") {
                for (var i = 0, length = arrayEvent.length; i < length; i += 1) {
                    if (arrayEvent[i] === fn) {
                        this._listeners[type].splice(i, 1);
                        break;
                    }
                }
            } else {
                delete this._listeners[type];
            }
        }
        return this;
    }
};
var Native = {
    id: 0,

    source: -1,

    isHas: function isHas(name) {
        try {
            return "function" === typeof eval(name);
        } catch (e) {
            return false;
        }
    },

    parserURL: function parserURL(urlObj) {
        var url = urlObj.toString();
        var a = document.createElement('a');
        a.href = url;
        return {
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            query: a.search,
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            params: function () {
                var ret = {};
                var seg = a.search.replace(/^\?/, '').split('&').filter(function (v, i) {
                    if (v !== '' && v.indexOf('=')) {
                        return true;
                    }
                });
                seg.forEach(function (element, index) {
                    var idx = element.indexOf('=');
                    var key = element.substring(0, idx);
                    var val = element.substring(idx + 1);
                    ret[key] = val;
                });
                return ret;
            }()
        };
    },

    bridge_for_1: function bridge_for_1(name, body) {
        if (0 == this.source) {
            switch (name) {
                case 'push':
                    window.webkit.messageHandlers.push.postMessage(body);
                    break;
                case 'ui':
                    window.webkit.messageHandlers.ui.postMessage(body);
                    break;
                case 'open':
                    window.webkit.messageHandlers.open.postMessage(body);
                    break;
                case 'pop':
                    window.webkit.messageHandlers.pop.postMessage(body);
                    break;
                case 'pay':
                    window.webkit.messageHandlers.pay.postMessage(body);
                    break;
                case 'storage':
                    window.webkit.messageHandlers.storage.postMessage(body);
                    break;
                case 'share':
                    window.webkit.messageHandlers.share.postMessage(body);
                    break;
                case 'debug':
                    window.webkit.messageHandlers.debug.postMessage(body);
                    break;
                case 'execute':
                    window.webkit.messageHandlers.execute.postMessage(body);
                    break;
                default:
                    throw '无法识别的动作';
            }
            return;
        }

        if (1 == this.source) {
            myWeb.postMessage(name, JSON.stringify(body));
            return;
        }

        throw "无法识别的来源";
    },

    bridge: function bridge(message) {
        if (0 == this.source) {
            // iOS 合并url
            window.webkit.messageHandlers.ios.postMessage(message);
            return;
        }

        if (1 == this.source) {
            // Android合并url
            myWeb.postMessage('android', JSON.stringify(message));
            return;
        }

        throw "无法识别的来源";
    },

    post: function post(url, params, callBack) {
        Native.id += 1;
        var id = Native.id;

        // params默认值
        if ("function" === typeof params && !callBack) {
            callBack = params;
            params = {};
        }

        // url解析
        var urlObject = this.parserURL(url);
        // 参数合并
        var dataObject = urlObject.params;
        for (var attr in params) {
            dataObject[attr] = params[attr];
        }var data = JSON.stringify(dataObject);
        // 参数base64化
        var value1 = Base64.encode(data);
        value1 = value1.replace(/=/g, "*");
        var new_url;
        if (0 == this.source) {
            // iOS 合并url
            new_url = "sp://" + urlObject.host + urlObject.path + "?data=" + value1;
        } else if (1 == this.source) {
            // Android合并url
            new_url = "sp:" + urlObject.path + "?data=" + value1;
        } else {
            throw "无法识别的来源";
        }

        var message = {
            "url": new_url,
            "id": id
        };

        if (!callBack) {
            this.bridge(message);
        } else {
            if (!NativeEvent._listeners[id]) {
                NativeEvent.addEvent(id, function (data) {
                    NativeEvent.removeEvent(id);
                    callBack(data);
                });
            }
            this.bridge(message);
        }
    },

    callBack: function callBack(callBackID, data) {
        if ('object' === (typeof data === "undefined" ? "undefined" : _typeof(data))) {
            NativeEvent.fireEvent(callBackID, data);
        } else {
            NativeEvent.fireEvent(callBackID, JSON.parse(data));
        }
    },

    removeAllCallBacks: function removeAllCallBacks(data) {
        NativeEvent._listeners = {};
    }

};
var app = function app() {};

app.prototype.open = function (url) {
    if (native_config.wp < 2000) {
        Native.bridge_for_1('open', { url: url });
        return;
    }
    Native.post('sp://app/open', { url: url });
};

/*  获取定位信息
  value:
        {
        "longitude": 100.0000,
        "latitude": 100.0000,
        "country": '国家',
        "province": '省份',
        "city": '城市',
        "cityCode": '城市编码',
        "adCode": '',
        "address": '地址',
        "poiName": 'poi',
        "street": '街道编码',
        "streetNum": '门牌号',
        "aoiName": 'aoi'
        }
* */
app.prototype.location = function (cb) {
    if (native_config.wp < 2000) {
        var list = ['location'];
        _cache_result_req_queue = list;
        var name = JSON.stringify(list);

        var body = {
            type: 'get',
            name: 'location'
        };
        Native.bridge_for_1('storage', body);

        NativeEvent.addEvent(name, function (value) {
            NativeEvent.removeEvent(name);
            _cache_result_req_queue = [];
            _cache_result_back_queue = {};
            cb(value.location);
        });
        return;
    }
    Native.post('sp://app/location', cb);
};

/* 分享
*  params: 配置参数 有以下值可选
        title: String     // 标题
        text: String      // 描述
        image: String     // 图片链接         1.8.0+
        wx_app_id: String // 微信小程序原始id  1.8.0+
        wx_path: String   // 微信小程序页面路径 1.8.0+
        url: String       // 链接
* */
app.prototype.share = function (params, cb) {
    if (native_config.wp < 2000) {
        Native.bridge_for_1('share', params);
        return;
    }
    Native.post('sp://app/share', params, cb);
};

app.prototype.pay = function (type, data) {

    if (type === 'wechat') {
        type = 1;
    }

    if (type === 'alipay') {
        type = 2;
    }

    if (native_config.wp < 2000) {
        if (type === 1) {

            if (native_config.source == 0) {
                var url = 'weixin://app/' + data.appid + '/pay/?';
                url += 'nonceStr=' + data.noncestr;
                url += '&package=' + encodeURIComponent(data.package);
                url += '&partnerId=' + data.partnerid;
                url += '&prepayId=' + data.prepayid;
                url += '&timeStamp=' + data.timestamp;
                url += '&sign=' + data.sign;
                url += '&signType=SHA1';
                Native.bridge_for_1('open', { url: url });
                return;
            }

            if (native_config.source == 1) {
                var wechat = {};
                wechat.appid = data.appid;
                wechat.partnerid = data.partnerid;
                wechat.prepayid = data.prepayid;
                wechat.noncestr = data.noncestr;
                wechat.timestamp = data.timestamp + '';
                wechat.package = data.package;
                wechat.sign = data.sign;
                Native.bridge_for_1('pay', { wechat: wechat });
                return;
            }

            throw '无法识别的来源';
        }
        if (type === 2) {
            var json = {};
            json.type = 2;
            json.aliPay = data.bill_sid;
            Native.bridge_for_1('pay', json);
            return;
        }
    }

    data.type = type;
    Native.post('sp://app/pay', data);
}; /*
   *  base64.js
   *
   *  Licensed under the BSD 3-Clause License.
   *    http://opensource.org/licenses/BSD-3-Clause
   *
   *  References:
   *    http://en.wikipedia.org/wiki/Base64
   */
;(function (global, factory) {
    (typeof exports === "undefined" ? "undefined" : _typeof(exports)) === 'object' && typeof module !== 'undefined' ? module.exports = factory(global) : typeof define === 'function' && define.amd ? define(factory) : factory(global);
})(typeof self !== 'undefined' ? self : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : undefined, function (global, Base64) {
    'use strict';
    // existing version for noConflict()

    var _Base64 = global.Base64;
    var version = "2.4.3";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {}
    }
    // constants
    var b64chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function (bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) {
            t[bin.charAt(i)] = i;
        }return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function cb_utob(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c : cc < 0x800 ? fromCharCode(0xc0 | cc >>> 6) + fromCharCode(0x80 | cc & 0x3f) : fromCharCode(0xe0 | cc >>> 12 & 0x0f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
        } else {
            var cc = 0x10000 + (c.charCodeAt(0) - 0xD800) * 0x400 + (c.charCodeAt(1) - 0xDC00);
            return fromCharCode(0xf0 | cc >>> 18 & 0x07) + fromCharCode(0x80 | cc >>> 12 & 0x3f) + fromCharCode(0x80 | cc >>> 6 & 0x3f) + fromCharCode(0x80 | cc & 0x3f);
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function utob(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function cb_encode(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16 | (ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8 | (ccc.length > 2 ? ccc.charCodeAt(2) : 0),
            chars = [b64chars.charAt(ord >>> 18), b64chars.charAt(ord >>> 12 & 63), padlen >= 2 ? '=' : b64chars.charAt(ord >>> 6 & 63), padlen >= 1 ? '=' : b64chars.charAt(ord & 63)];
        return chars.join('');
    };
    var btoa = global.btoa ? function (b) {
        return global.btoa(b);
    } : function (b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ? buffer.from && buffer.from !== Uint8Array.from ? function (u) {
        return (u.constructor === buffer.constructor ? u : buffer.from(u)).toString('base64');
    } : function (u) {
        return (u.constructor === buffer.constructor ? u : new buffer(u)).toString('base64');
    } : function (u) {
        return btoa(utob(u));
    };
    var encode = function encode(u, urisafe) {
        return !urisafe ? _encode(String(u)) : _encode(String(u)).replace(/[+\/]/g, function (m0) {
            return m0 == '+' ? '-' : '_';
        }).replace(/=/g, '');
    };
    var encodeURI = function encodeURI(u) {
        return encode(u, true);
    };
    // decoder stuff
    var re_btou = new RegExp(['[\xC0-\xDF][\x80-\xBF]', '[\xE0-\xEF][\x80-\xBF]{2}', '[\xF0-\xF7][\x80-\xBF]{3}'].join('|'), 'g');
    var cb_btou = function cb_btou(cccc) {
        switch (cccc.length) {
            case 4:
                var cp = (0x07 & cccc.charCodeAt(0)) << 18 | (0x3f & cccc.charCodeAt(1)) << 12 | (0x3f & cccc.charCodeAt(2)) << 6 | 0x3f & cccc.charCodeAt(3),
                    offset = cp - 0x10000;
                return fromCharCode((offset >>> 10) + 0xD800) + fromCharCode((offset & 0x3FF) + 0xDC00);
            case 3:
                return fromCharCode((0x0f & cccc.charCodeAt(0)) << 12 | (0x3f & cccc.charCodeAt(1)) << 6 | 0x3f & cccc.charCodeAt(2));
            default:
                return fromCharCode((0x1f & cccc.charCodeAt(0)) << 6 | 0x3f & cccc.charCodeAt(1));
        }
    };
    var btou = function btou(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function cb_decode(cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0) | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0) | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0) | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [fromCharCode(n >>> 16), fromCharCode(n >>> 8 & 0xff), fromCharCode(n & 0xff)];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function (a) {
        return global.atob(a);
    } : function (a) {
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ? buffer.from && buffer.from !== Uint8Array.from ? function (a) {
        return (a.constructor === buffer.constructor ? a : buffer.from(a, 'base64')).toString();
    } : function (a) {
        return (a.constructor === buffer.constructor ? a : new buffer(a, 'base64')).toString();
    } : function (a) {
        return btou(atob(a));
    };
    var decode = function decode(a) {
        return _decode(String(a).replace(/[-_]/g, function (m0) {
            return m0 == '-' ? '+' : '/';
        }).replace(/[^A-Za-z0-9\+\/]/g, ''));
    };
    var noConflict = function noConflict() {
        var Base64 = global.Base64;
        global.Base64 = _Base64;
        return Base64;
    };
    // export Base64
    global.Base64 = {
        VERSION: version,
        atob: atob,
        btoa: btoa,
        fromBase64: decode,
        toBase64: encode,
        utob: utob,
        encode: encode,
        encodeURI: encodeURI,
        btou: btou,
        decode: decode,
        noConflict: noConflict
    };
    // if ES5 is available, make Base64.extendString() available
    if (typeof Object.defineProperty === 'function') {
        var noEnum = function noEnum(v) {
            return { value: v, enumerable: false, writable: true, configurable: true };
        };
        global.Base64.extendString = function () {
            Object.defineProperty(String.prototype, 'fromBase64', noEnum(function () {
                return decode(this);
            }));
            Object.defineProperty(String.prototype, 'toBase64', noEnum(function (urisafe) {
                return encode(this, urisafe);
            }));
            Object.defineProperty(String.prototype, 'toBase64URI', noEnum(function () {
                return encode(this, true);
            }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) {
        // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function () {
            return global.Base64;
        });
    }
    // that's it!
    return { Base64: global.Base64 };
});

var life = function life() {
    this.enterBackground();
};

life.prototype.enterForeground = function (cb) {
    var name = 'enterForeground';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

life.prototype.enterBackground = function (cb) {
    var name = 'enterBackground';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

life.prototype.backFromNative = function (cb) {
    var name = 'backFromNative';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

life.prototype.backFromWeb = function (cb) {
    var name = 'backFromWeb';
    NativeEvent.removeEvent(name);
    NativeEvent.addEvent(name, cb);
};

function enterForeground() {
    NativeEvent.fireEvent('enterForeground');
};

function enterBackground() {
    NativeEvent.fireEvent('enterBackground');
};

function backFromNative() {
    NativeEvent.fireEvent('backFromNative');
};

function backFromWeb() {
    NativeEvent.fireEvent('backFromWeb');
};var native_config = {
    source: -1,
    wp: -1,
    version: -1
};

var native = function native(source, version, wp) {
    native_config = {
        source: source,
        wp: wp,
        version: version
    };
    Native.source = source;
    this.navigatior = new nav();
    this.cache = new storage();
    this.app = new app();
    this.web = new web();
    this.network = new network();

    // if ((wp) && wp < 2000){
    //     Native.bridge_for_1('ui', {
    //         isHiddenNavbar: 1,
    //         isHiddenLoadAnimation: 1
    //     });
    // }
};

native.prototype.navigatior = null;
native.prototype.network = null;
native.prototype.cache = null;
native.prototype.web = null;
native.prototype.app = null;var nav = function nav() {};

/* 回退至指定app页面
*  value: 可缺省 | 指定页面名称 | 回退层数
*
*   exp:
*       pop()
*       pop('home')
*       pop(-2)
*  */
nav.prototype.pop = function (value) {

    // 1.x 会推至第一层兼容函数
    function special(index) {
        if (0 == native_config.source) {
            var data = {};
            data.url = 'sp://tabbar/selectIndex?index=' + index;
            Native.bridge_for_1('execute', data);
            data.vcName = 'tabbar';
            Native.bridge_for_1('pop', data);
            return;
        }

        if (1 == native_config.source) {
            data = {};
            data.url = "http://" + value + "/" + value;
            Native.bridge_for_1('push', data);
        }
    }

    // 1.x 兼容代码
    if (native_config.wp < 2000) {
        switch (value) {
            case 'home':
                special(0);
                break;
            case 'cateory':
                special(1);
                break;
            case 'message':
                special(2);
                break;
            case 'shopcart':
                special(3);
                break;
            case 'myProfile':
                special(4);
                break;
            default:
                Native.bridge_for_1('pop', { vcName: value });
                break;
        }
        return;
    }

    // 2.x 代码
    var params = {};
    if (value) {
        if (/^(-)?\d+(\.\d+)?$/.exec(value)) {
            params.index = value;
        } else {
            params.name = value;
        }
    }
    Native.post('sp://navigatior/pop', params);
};

/* 获取可回退app页面列表
*   exp:
*       backList(function(value){
*           value = ['tabbar','message'];
*       })
* */
nav.prototype.backList = function (cb) {
    if (native_config.wp < 2000) throw "该版本不支持 backList";
    Native.post('sp://navigatior/backList', cb);
};

/* 跳转至app页面列表
* url: 对应路由表 http://39.108.111.114:3000/B7-Protocol/Web-Native
* params: 相应设置(可缺省)
*    isRemoveSelf: 0 | 1, 跳转后移除当前webView页面
*
*    exp:
*       show('sp://home/home',{isRemoveSelf: 0})
*       show('sp://home/home')
* */
nav.prototype.show = function (url, params) {

    var data = {};
    url = url.replace('sp://', 'http://');
    if (params) {
        params.url = url;
        data = params;
    } else {
        data.url = url;
    }

    if (native_config.wp < 2000) {
        // 1.x 代码
        Native.bridge_for_1('push', data);
    } else {
        // 2.x 代码
        Native.post('sp://navigatior/show', data);
    }
};var network = function network() {};

network.prototype.post = function (params, cb) {
    Native.post("sp://network/post", params, cb);
};

var storage = function storage() {};

storage.prototype.get = function (list, cb) {
    // 1.x 代码
    if (native_config.wp < 2000) {
        _cache_result_req_queue = list;
        var name = JSON.stringify(list);

        for (var item in list) {
            var body = {
                type: 'get',
                name: list[item]
            };
            Native.bridge_for_1('storage', body);
        }

        NativeEvent.addEvent(name, function (value) {
            NativeEvent.removeEvent(name);
            _cache_result_req_queue = [];
            _cache_result_back_queue = {};
            cb(value);
        });
        return;
    }
    //2.x 代码
    Native.post('sp://cache/get', { list: JSON.stringify(list) }, cb);
};

storage.prototype.set = function (key, value, cb) {
    // 1.x 代码
    if (native_config.wp < 2000) {
        var body = {
            type: 'set',
            name: key,
            newValue: value
        };
        Native.bridge_for_1('storage', body);
        setTimeout(function () {
            cb({ ans: 'ok' });
        }, 0.2);
        return;
    }

    //2.x 代码
    var data = {};
    data[key] = value;
    Native.post('sp://cache/set', data, cb);
};

// 以下皆为1.x适配代码
var _cache_result_req_queue = [];
var _cache_result_back_queue = {};

function cacheResult(name, value) {
    _cache_result_back_queue[name] = JSON.parse(value);
    for (var name in _cache_result_req_queue) {
        if (_cache_result_back_queue[_cache_result_req_queue[name]] === undefined) return;
    }
    var name = JSON.stringify(_cache_result_req_queue);
    NativeEvent.fireEvent(name, _cache_result_back_queue);
}
var web = function web() {};

// 发送当前使用版本号
web.prototype.sendVersion = function (version, cb) {
    Native.post('sp://web/config', { version: version }, cb);
};

// 与原生返回按键效果一致
web.prototype.goback = function (jsStr, cb) {
    if (native_config.wp < 2000) {
        window.history.back();
        return;
    }
    Native.post('sp://web/goback', { js: jsStr }, cb);
};

// 获取可回退web页面列表
web.prototype.backList = function (cb) {
    Native.post('sp://web/backList', cb);
};

// 获取可前进web页面列表
web.prototype.forwardList = function (cb) {
    Native.post('sp://web/forwardList', cb);
};

// 跳转至指定web页面[依旧触发生命周期函数]
web.prototype.go = function (index, cb) {
    Native.post('sp://web/go', { index: index }, cb);
};
