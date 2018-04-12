var storage = function () {};

storage.prototype.get = function (list, cb) {
    // 1.x 代码
    if (native_config.wp < 2000) {
        _cache_result_req_queue = list;
        var name = JSON.stringify(list);

        for (var item in list) {
            this.app_cache('get', list[item]);
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
    Native.post('sp://cache/get', {list: JSON.stringify(list)}, cb)
};


storage.prototype.set = function (key, value, cb) {
    // 1.x 代码
    if (native_config.wp < 2000) {
        this.app_cache('set', key, value);
        cb({ans: 'ok'});
        return;
    }

    //2.x 代码
    var data = {};
    data[key] = value;
    Native.post('sp://cache/set', data, cb)
};


// 以下皆为1.x适配代码
var _cache_result_req_queue = [];
var _cache_result_back_queue = {};

function cacheResult(name, value) {
    _cache_result_back_queue[name] = value;
    for (var name in _cache_result_req_queue) {
        if (_cache_result_back_queue[_cache_result_req_queue[name]] === undefined) return;
    }
    var name = JSON.stringify(_cache_result_req_queue);
    NativeEvent.fireEvent(name, _cache_result_back_queue);
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
        window.webkit.messageHandlers.storage.postMessage(body);
    } else {
        myWeb.postMessage('storage', JSON.stringify(body));
    }
};
