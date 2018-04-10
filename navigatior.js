var nav = function () {};

nav.prototype.post_for_1 = function (name,body) {
    if (!(native_config.source == 0 || native_config.source == -1)) { return }
    if (native_config.source == 0) {
        eval('window.webkit.messageHandlers.' + name + '.postMessage(' + body + ');')
    } else {
        myWeb.postMessage(name, JSON.stringify(body));
    }
};


//回退至指定app页面
nav.prototype.pop = function (value) {
    // 1.x 兼容代码
    if (!(native_config.wp)) { return }
    if (!(native_config.wp > 2000)){
       this.post_for_1("pop",value)
        return
    }

    // 2.x 代码
    const params = {}
    if (value === undefined || value === "" || value === null) {
    } else if (/^(-)?\d+(\.\d+)?$/.exec(value) == null) {
        params.name = value
    } else {
        params.index = value
    }
    Native.post('sp://navigatior/pop', params)
};

//获取可回退app页面列表
nav.prototype.backList = function (cb) {
    Native.post('sp://navigatior/backList', cb)
};

//跳转至app页面列表
nav.prototype.show = function (url,params) {
    // 2.x 代码
    var data = {};
    if (params) {
        params.url = url;
        data = params;
    }else{
        data.url = url;
    }
    Native.post('sp://navigatior/show', data)
};
