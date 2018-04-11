var nav = function () {};

nav.prototype.app_execute = function(body) {
    if (!(native_config.source === 0 || native_config.source === -1)) { return }
    if (native_config.source === 0) {
        window.webkit.messageHandlers.execute.postMessage(body);
    } else {
        myWeb.postMessage(name, JSON.stringify(body));
    }
};

nav.prototype.app_pop = function(name) {
    if (!(native_config.source === 0 || native_config.source === -1)) { return }
    var data = {'vcName': name};
    if (native_config.source === 0) {
        window.webkit.messageHandlers.pop.postMessage(data);
    } else {
        myWeb.postMessage(name, JSON.stringify(data));
    }
};

nav.prototype.app_push = function(body) {
    if (!(native_config.source === 0 || native_config.source === -1)) { return }
    if (native_config.source === 0) {
        window.webkit.messageHandlers.push.postMessage(body);
    } else {
        myWeb.postMessage(name, JSON.stringify(body));
    }
};


/* 回退至指定app页面
*  value: 可缺省 | 指定页面名称 | 回退层数
*  exp: value = home | value = -2
*  */
nav.prototype.pop = function (value) {

    // 1.x 会推至第一层兼容函数
    function special(index) {
        if (native_config.source === 0) {
            var data = {};
            data.url = 'sp://tabbar/selectIndex?index=' + index;
            this.app_execute(data)
            data.vcName = 'tabbar';
            this.app_pop(data)
        } else {
            data = {};
            data.url = "sp://" + value + "/" + value
            this.app_push(data)
        }
    }

    // 1.x 兼容代码
    if (!(native_config.wp)) { return }
    if (!(native_config.wp > 2000)){
        switch (value) {
            case 'home': special(0);
            case 'cateory': special(1);
            case 'message': special(2);
            case 'shopcart': special(3);
            case 'myProfile': special(4);
            default: this.app_pop(value);
        }
        return
    }

    // 2.x 代码
    const params = {};
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
    if (!(native_config.wp > 2000)) throw "该版本不支持 backList";
    Native.post('sp://navigatior/backList', cb)
};

//跳转至app页面列表
nav.prototype.show = function (url,params) {

    var data = {};
    if (params) {
        params.url = url;
        data = params;
    }else{
        data.url = url;
    }

    if (!(native_config.wp > 2000)) {
        // 1.x 代码
        this.app_push(data);
    }else{
        // 2.x 代码
        Native.post('sp://navigatior/show', data)
    }
};
