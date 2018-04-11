var app = function () {
};


app.prototype.open = function (url) {
    if (native_config.wp < 2000) {
        this.app_open({url: url});
        return;
    }
    Native.post('sp://app/open', {url: url});
};


app.prototype.location = function (cb) {
    if (native_config.wp < 2000) {
        
        return;
    }
    Native.post('sp://app/location', cb);
};

app.prototype.share = function (params, cb) {
    Native.post('sp://app/share', params, cb);
};

app.prototype.pay = function (type, data) {
    Native.post('sp://app/pay', data);
}


app.prototype.app_open = function (url) {
    if (!(native_config.source === 0 || native_config.source === -1)) {
        return;
    }
    var body = {
        url: url
    };
    if (native_config.source === 0) {
        window.webkit.messageHandlers.open.postMessage(body);
    } else {
        myWeb.postMessage('open', JSON.stringify(body));
    }
};