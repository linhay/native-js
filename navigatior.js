var nav = function (config) {
    this.config = config
    Native.source = config.source
    // return this
}

function post_for_1(name,body) {
    if (!(this.config.source)) { return }
    if (this.config.source == 0) {
        window.webkit.messageHandlers.name.postMessage(body);
    } else {
        myWeb.postMessage(name, JSON.stringify(body));
    }
}

nav.prototype.config = {};
//回退至指定app页面
nav.prototype.pop = function (value) {
    // 1.x 兼容代码
    if (!(this.config.wp)) { return }
    if (!(this.config.wp > 2000)){
        post_for_1("pop",value)
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
}

//获取可回退app页面列表
nav.prototype.backList = function (cb) {
    Native.post('sp://navigatior/backList', cb)
}

//跳转至app页面列表
nav.prototype.show = function (params, cb) {
    Native.post('sp://navigatior/show', params, cb)
}
