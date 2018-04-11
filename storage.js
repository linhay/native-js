var storage = function () {
};
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
    ;
};


storage.prototype.get = function (list, cb) {
    if (!(native_config.wp > 2000)) {
        this.app_cache('get', list.firstChild, cb);
        return;
    }
    Native.post('sp://cache/get', {list: JSON.stringify(list)}, cb)
};


storage.prototype.set = function (key, value, cb) {
    if (!(native_config.wp > 2000)) {
        this.app_cache('set', key, value);
        cb({ans: 'ok'});
        return;
    }
    Native.post('sp://cache/set', {key: value}, cb)
};

