var app = function () {
};


app.prototype.open = function (url) {
    if (native_config.wp < 2000) {
        Native.bridge_for_1('open', {url: url});
        return;
    }
    Native.post('sp://app/open', {url: url});
};


app.prototype.location = function (cb) {
    if (native_config.wp < 2000) {
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
            cb(value);
        });
        return;
    }
    Native.post('sp://app/location', cb);
};

app.prototype.share = function (params, cb) {
    if (native_config.wp < 2000) {
        Native.bridge_for_1('share', params);
        return;
    }
    Native.post('sp://app/share', params, cb);
};

app.prototype.pay = function (type, data) {
    if (native_config.wp < 2000) {
        var json = {};
        if (type === 1 || type === 'wechat') {
            var url = 'weixin://app/' + data.appid + '/pay/?';
            url += 'nonceStr=' + data.noncestr;
            url += '&package=' + encodeURIComponent(data.package);
            url += '&partnerId=' + data.partnerid;
            url += '&prepayId=' + data.prepayid;
            url += '&timeStamp=' + data.timestamp;
            url += '&sign=' + data.sign;
            url += '&signType=SHA1';
        Native.bridge_for_1('open',{url: url});
        }
        if (type === 2 || type === 'alipay') {
            json.type = 2;
            json.aliPay = dat.bill_sid;
        }
        Native.bridge_for_1('pay', json);
        return;
    }
    Native.post('sp://app/pay', data);
};