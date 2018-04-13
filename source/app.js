var app = function () {
};


app.prototype.open = function (url) {
    if (native_config.wp < 2000) {
        Native.bridge_for_1('open', {url: url});
        return;
    }
    Native.post('sp://app/open', {url: url});
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
        type = 2
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
                Native.bridge_for_1('open', {url: url});
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
                Native.bridge_for_1('pay', {url: url});
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
};