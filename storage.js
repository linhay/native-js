var storage = function () {
};

var StorageEvent = {

    _listeners: {},

    addEvent: function (type, fn) {
        if (typeof this._listeners[type] === "undefined") {
            this._listeners[type] = [];
        }
        if (typeof fn === "function") {
            this._listeners[type].push(fn);
        }

        return this;
    },

    fireEvent: function (type, param) {
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

    removeEvent: function (type, fn) {
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

var _cache_result_req_queue = [];
var _cache_result_back_queue = {};

function cacheResult(name, value) {
    _cache_result_back_queue[name] = value;
    for (name in _cache_result_req_queue) {
        if (_cache_result_back_queue[_cache_result_req_queue[name]] === undefined) return;
    }
    var name = JSON.stringify(_cache_result_req_queue);
    StorageEvent.fireEvent(name, _cache_result_back_queue);
}

storage.prototype.app_cache = function (type, name, value) {
    if (!(native_config.source === 0 || native_config.source === -1)) {
        return
    }
    var body = {
        type: type,
        name: name,
        newValue: value
    };
    if (native_config.source === 0) {
        // cacheResult(name, {ans: 'ok'})
        window.webkit.messageHandlers.storage.postMessage(body);
    } else {
        myWeb.postMessage('storage', JSON.stringify(body));
    }
};


storage.prototype.get = function (list, cb) {
    if (native_config.wp < 2000) {
        _cache_result_req_queue = list;
        var name = JSON.stringify(list);

        for (item in list) {
            this.app_cache('get', list[item]);
        }

        StorageEvent.addEvent(name, function (value) {
            StorageEvent.removeEvent(name);
            _cache_result_req_queue = [];
            _cache_result_back_queue = {};
            cb(value);
        });
        return;
    }
    Native.post('sp://cache/get', {list: JSON.stringify(list)}, cb)
};


storage.prototype.set = function (key, value, cb) {
    if (native_config.wp < 2000) {
        this.app_cache('set', key, value);
        cb({ans: 'ok'});
        return;
    }

    var data[key] = value;
    Native.post('sp://cache/set', data, cb)
};

