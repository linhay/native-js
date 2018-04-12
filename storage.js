var storage = function () {
};

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
    Native.post('sp://cache/get', {list: JSON.stringify(list)}, cb)
};


storage.prototype.set = function (key, value, cb) {
    // 1.x 代码
    if (native_config.wp < 2000) {
        var body = {
            type: 'set',
            name: key,
            newValue: value
        };
        Native.bridge_for_1('storage',body);
        setTimeout(function () {
            cb({ans: 'ok'});
        },0.2);
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