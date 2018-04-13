var Native = {
    id: 0,

    source: -1,

    isHas: function (name) {
        try {
            return "function" === typeof eval(name);
        } catch (e) {
            return false;
        }
    },

    parserURL: function (urlObj) {
        const url = urlObj.toString();
        const a = document.createElement('a');
        a.href = url;
        return {
            protocol: a.protocol.replace(':', ''),
            host: a.hostname,
            query: a.search,
            path: a.pathname.replace(/^([^\/])/, '/$1'),
            params: (function () {
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
            })()
        };
    },

    isEnterNative: false,

    bridge_for_1: function (name, body) {
        alert(this.source);
        alert(name);
        alert(JSON.stringify(body));
        if (name == 'push') this.isEnterNative = true;
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
                    throw '无法识别的动作'
            }
            return;
        }

        if (1 == this.source) {
            myWeb.postMessage(name, JSON.stringify(body));
            return;
        }

        throw "无法识别的来源"
    },

    bridge: function (message) {
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

        throw "无法识别的来源"

    },

    post: function (url, params, callBack) {
        Native.id += 1;
        var id = Native.id;

        // params默认值
        if ("function" === typeof params && !(callBack)) {
            callBack = params;
            params = {}
        }

        // url解析
        var urlObject = this.parserURL(url);
        // 参数合并
        var dataObject = urlObject.params;
        for (var attr in params) dataObject[attr] = params[attr];
        var data = JSON.stringify(dataObject);
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
            throw "无法识别的来源"
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

    callBack: function (callBackID, data) {
        if ('object' === typeof data) {
            NativeEvent.fireEvent(callBackID, data);
        } else {
            NativeEvent.fireEvent(callBackID, JSON.parse(data));
        }
    },

    removeAllCallBacks: function (data) {
        NativeEvent._listeners = {};
    }

};
