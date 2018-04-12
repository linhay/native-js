var nav = function () {
};

/* 回退至指定app页面
*  value: 可缺省 | 指定页面名称 | 回退层数
*
*   exp:
*       pop()
*       pop('home')
*       pop(-2)
*  */
nav.prototype.pop = function (value) {

    // 1.x 会推至第一层兼容函数
    function special(index) {
        if (0 == native_config.source) {
            var data = {};
            data.url = 'sp://tabbar/selectIndex?index=' + index;
            Native.bridge_for_1('execute', data);
            data.vcName = 'tabbar';
            Native.bridge_for_1('pop', data);
            return;
        }

        if (0 == native_config.source) {
            data = {};
            data.url = "sp://" + value + "/" + value;
            Native.bridge_for_1('push', data);
        }
    }

    // 1.x 兼容代码
    if (native_config.wp < 2000) {
        switch (value) {
            case 'home':
                special(0);
                break;
            case 'cateory':
                special(1);
                break;
            case 'message':
                special(2);
                break;
            case 'shopcart':
                special(3);
                break;
            case 'myProfile':
                special(4);
                break;
            default:
                Native.bridge_for_1('pop', {vcName: value});
                break;
        }
        return
    }

    // 2.x 代码
    const params = {};
    if (value) {
        if (/^(-)?\d+(\.\d+)?$/.exec(value)) {
            params.index = value;
        } else {
            params.name = value;
        }
    }
    Native.post('sp://navigatior/pop', params)
};


/* 获取可回退app页面列表
*   exp:
*       backList(function(value){
*           value = ['tabbar','message'];
*       })
* */
nav.prototype.backList = function (cb) {
    if (native_config.wp < 2000) throw "该版本不支持 backList";
    Native.post('sp://navigatior/backList', cb)
};

/* 跳转至app页面列表
* url: 对应路由表 http://39.108.111.114:3000/B7-Protocol/Web-Native
* params: 相应设置(可缺省)
*    isRemoveSelf: 0 | 1, 跳转后移除当前webView页面
*
*    exp:
*       show('sp://home/home',{isRemoveSelf: 0})
*       show('sp://home/home')
* */
nav.prototype.show = function (url, params) {

    var data = {};
    if (params) {
        params.url = url;
        data = params;
    } else {
        data.url = url;
    }

    if (native_config.wp < 2000) {
        // 1.x 代码
        Native.bridge_for_1('push', data)
    } else {
        // 2.x 代码
        Native.post('sp://navigatior/show', data)
    }
};