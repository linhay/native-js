var Native = {
    id: 0,

    source: -1,

    isHas: function(name) {
        try {
            return "function" === typeof eval(name);
        } catch (e) {
            return false;
        }
    },

    parserURL: function(urlObj) {
        const url = urlObj.toString();
        const a = document.createElement('a');
        a.href = url;
        return {
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            query: a.search,
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            params: (function() {
                var ret = {};
                var seg = a.search.replace(/^\?/, '').split('&').filter(function(v, i) {
                    if (v !== '' && v.indexOf('=')) {
                        return true;
                    }
                });
                seg.forEach(function(element, index) {
                    var idx = element.indexOf('=');
                    var key = element.substring(0, idx);
                    var val = element.substring(idx + 1);
                    ret[key] = val;
                });
                return ret;
            })()
        };
    },

    bridge: function (message) {
        if (Native.source === 0) {
            // iOS 合并url
            window.webkit.messageHandlers.ios.postMessage(message);
        } else {
            // Android合并url
            myWeb.postMessage('android', JSON.stringify(message));
        }
    },

    post: function(url, params, callBack) {
        Native.id += 1;
        var id = Native.id;

        // params默认值
        if ("function" === typeof params  && !(callBack)) {
            callBack = params;
            params = {}
        }

        // url解析
        var urlObject = Native.parserURL(url);
        // 参数合并
        var dataObject = urlObject.params;
        for (var attr in params) dataObject[attr] = params[attr];
        var data = JSON.stringify(dataObject);
        // 参数base64化
        var value1 = Base64.encode(data);
        value1 = value1.replace(/=/g, "*");
        var new_url;
        if (Native.source === 0) {
            // iOS 合并url
            new_url = "sp://" + urlObject.host + urlObject.path + "?data=" + value1;
        } else {
            // Android合并url
            new_url = "sp:" + urlObject.path + "?data=" + value1;
        }

        var message = {
            "url": new_url,
            "id": id
        };

        if (!callBack) {
            this.bridge(message);
        } else {
            if (!NativeEvent._listeners[id]) {
                NativeEvent.addEvent(id, function(data) {
                    NativeEvent.removeEvent(id);
                    callBack(data);
                });
            }
        this.bridge(message);
        }

    },

    callBack: function(callBackID, data) {
        if ('object' === typeof data) {
            NativeEvent.fireEvent(callBackID, data);
        } else {
            NativeEvent.fireEvent(callBackID, JSON.parse(data));
        }
    },

    removeAllCallBacks: function(data) {
        NativeEvent._listeners = {};
    }

};

var NativeEvent = {

    _listeners: {},

    addEvent: function(type, fn) {
        if (typeof this._listeners[type] === "undefined") {
            this._listeners[type] = [];
        }
        if (typeof fn === "function") {
            this._listeners[type].push(fn);
        }
        return this;
    },

    fireEvent: function(type, param) {
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

    removeEvent: function(type, fn) {
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

/*
*  base64.js
*
*  Licensed under the BSD 3-Clause License.
*    http://opensource.org/licenses/BSD-3-Clause
*
*  References:
*    http://en.wikipedia.org/wiki/Base64
*/
;(function(global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined'
        ? module.exports = factory(global)
        : typeof define === 'function' && define.amd
        ? define(factory) : factory(global)
}((
    typeof self !== 'undefined' ? self
        : typeof window !== 'undefined' ? window
        : typeof global !== 'undefined' ? global
            : this
), function(global, Base64) {
    'use strict';
    // existing version for noConflict()
    var _Base64 = global.Base64;
    var version = "2.4.3";
    // if node.js, we use Buffer
    var buffer;
    if (typeof module !== 'undefined' && module.exports) {
        try {
            buffer = require('buffer').Buffer;
        } catch (err) {
        }
    }
    // constants
    var b64chars
        = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    var b64tab = function(bin) {
        var t = {};
        for (var i = 0, l = bin.length; i < l; i++) t[bin.charAt(i)] = i;
        return t;
    }(b64chars);
    var fromCharCode = String.fromCharCode;
    // encoder stuff
    var cb_utob = function(c) {
        if (c.length < 2) {
            var cc = c.charCodeAt(0);
            return cc < 0x80 ? c
                : cc < 0x800 ? (fromCharCode(0xc0 | (cc >>> 6))
                    + fromCharCode(0x80 | (cc & 0x3f)))
                    : (fromCharCode(0xe0 | ((cc >>> 12) & 0x0f))
                        + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                        + fromCharCode(0x80 | (cc & 0x3f)));
        } else {
            var cc = 0x10000
                + (c.charCodeAt(0) - 0xD800) * 0x400
                + (c.charCodeAt(1) - 0xDC00);
            return (fromCharCode(0xf0 | ((cc >>> 18) & 0x07))
                + fromCharCode(0x80 | ((cc >>> 12) & 0x3f))
                + fromCharCode(0x80 | ((cc >>> 6) & 0x3f))
                + fromCharCode(0x80 | (cc & 0x3f)));
        }
    };
    var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
    var utob = function(u) {
        return u.replace(re_utob, cb_utob);
    };
    var cb_encode = function(ccc) {
        var padlen = [0, 2, 1][ccc.length % 3],
            ord = ccc.charCodeAt(0) << 16
                | ((ccc.length > 1 ? ccc.charCodeAt(1) : 0) << 8)
                | ((ccc.length > 2 ? ccc.charCodeAt(2) : 0)),
            chars = [
                b64chars.charAt(ord >>> 18),
                b64chars.charAt((ord >>> 12) & 63),
                padlen >= 2 ? '=' : b64chars.charAt((ord >>> 6) & 63),
                padlen >= 1 ? '=' : b64chars.charAt(ord & 63)
            ];
        return chars.join('');
    };
    var btoa = global.btoa ? function(b) {
        return global.btoa(b);
    } : function(b) {
        return b.replace(/[\s\S]{1,3}/g, cb_encode);
    };
    var _encode = buffer ?
        buffer.from && buffer.from !== Uint8Array.from ? function(u) {
                return (u.constructor === buffer.constructor ? u : buffer.from(u))
                    .toString('base64')
            }
            : function(u) {
                return (u.constructor === buffer.constructor ? u : new buffer(u))
                    .toString('base64')
            }
        : function(u) {
            return btoa(utob(u))
        }
    ;
    var encode = function(u, urisafe) {
        return !urisafe
            ? _encode(String(u))
            : _encode(String(u)).replace(/[+\/]/g, function(m0) {
                return m0 == '+' ? '-' : '_';
            }).replace(/=/g, '');
    };
    var encodeURI = function(u) {
        return encode(u, true)
    };
    // decoder stuff
    var re_btou = new RegExp([
        '[\xC0-\xDF][\x80-\xBF]',
        '[\xE0-\xEF][\x80-\xBF]{2}',
        '[\xF0-\xF7][\x80-\xBF]{3}'
    ].join('|'), 'g');
    var cb_btou = function(cccc) {
        switch (cccc.length) {
            case 4:
                var cp = ((0x07 & cccc.charCodeAt(0)) << 18)
                    | ((0x3f & cccc.charCodeAt(1)) << 12)
                    | ((0x3f & cccc.charCodeAt(2)) << 6)
                    | (0x3f & cccc.charCodeAt(3)),
                    offset = cp - 0x10000;
                return (fromCharCode((offset >>> 10) + 0xD800)
                    + fromCharCode((offset & 0x3FF) + 0xDC00));
            case 3:
                return fromCharCode(
                    ((0x0f & cccc.charCodeAt(0)) << 12)
                    | ((0x3f & cccc.charCodeAt(1)) << 6)
                    | (0x3f & cccc.charCodeAt(2))
                );
            default:
                return fromCharCode(
                    ((0x1f & cccc.charCodeAt(0)) << 6)
                    | (0x3f & cccc.charCodeAt(1))
                );
        }
    };
    var btou = function(b) {
        return b.replace(re_btou, cb_btou);
    };
    var cb_decode = function(cccc) {
        var len = cccc.length,
            padlen = len % 4,
            n = (len > 0 ? b64tab[cccc.charAt(0)] << 18 : 0)
                | (len > 1 ? b64tab[cccc.charAt(1)] << 12 : 0)
                | (len > 2 ? b64tab[cccc.charAt(2)] << 6 : 0)
                | (len > 3 ? b64tab[cccc.charAt(3)] : 0),
            chars = [
                fromCharCode(n >>> 16),
                fromCharCode((n >>> 8) & 0xff),
                fromCharCode(n & 0xff)
            ];
        chars.length -= [0, 0, 2, 1][padlen];
        return chars.join('');
    };
    var atob = global.atob ? function(a) {
        return global.atob(a);
    } : function(a) {
        return a.replace(/[\s\S]{1,4}/g, cb_decode);
    };
    var _decode = buffer ?
        buffer.from && buffer.from !== Uint8Array.from ? function(a) {
                return (a.constructor === buffer.constructor
                    ? a : buffer.from(a, 'base64')).toString();
            }
            : function(a) {
                return (a.constructor === buffer.constructor
                    ? a : new buffer(a, 'base64')).toString();
            }
        : function(a) {
            return btou(atob(a))
        };
    var decode = function(a) {
        return _decode(
            String(a).replace(/[-_]/g, function(m0) {
                return m0 == '-' ? '+' : '/'
            })
                .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
    };
    var noConflict = function() {
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
        var noEnum = function(v) {
            return {value: v, enumerable: false, writable: true, configurable: true};
        };
        global.Base64.extendString = function() {
            Object.defineProperty(
                String.prototype, 'fromBase64', noEnum(function() {
                    return decode(this)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64', noEnum(function(urisafe) {
                    return encode(this, urisafe)
                }));
            Object.defineProperty(
                String.prototype, 'toBase64URI', noEnum(function() {
                    return encode(this, true)
                }));
        };
    }
    //
    // export Base64 to the namespace
    //
    if (global['Meteor']) { // Meteor.js
        Base64 = global.Base64;
    }
    // module.exports and AMD are mutually exclusive.
    // module.exports has precedence.
    if (typeof module !== 'undefined' && module.exports) {
        module.exports.Base64 = global.Base64;
    }
    else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], function() {
            return global.Base64
        });
    }
    // that's it!
    return {Base64: global.Base64}
}));

