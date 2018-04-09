var App2 = function(version, wp, source) {
    if (source == 2) {
        return new miniApp(version, wp);
    } else {
        this.version = version;
        this.wp = wp;
        this.source = source;
        Native.source = this.source;
        this.init();
    }
}

App2.prototype.init = function() {

    var route = {};
    route.shoplist = 'sp://shoplist/shoplist';
    route.search = 'sp://search/search';
    route.activity = 'sp://activity/activity';
    route.category = 'sp://category/category';
    route.goodDetail = 'sp://goodDetail/goodDetail';
    route.chat = 'sp://chat/chat';
    route.myIntegral = 'sp://myIntegral/myIntegral';
    route.home = 'sp://home/home';
    route.login = 'sp://login/login';
    route.help = 'sp://help/help';
    route.message = 'sp://message/message';
    route.myAdress = 'sp://myAdress/myAdress';
    route.myCash = 'sp://myCash/myCash';
    route.myLike = 'sp://myLike/myLike';
    route.myOrder = 'sp://myOrder/myOrder';
    route.myProfile = 'sp://myProfile/myProfile';
    route.myTicket = 'sp://myTicket/myTicket';
    route.newFeatures = 'sp://newFeatures/newFeatures';
    route.orderDetail = 'sp://orderDetail/orderDetail';
    route.payBefore = 'sp://payBefore/payBefore';
    route.shopCart = 'sp://shopCart/shopCart';
    route.shopDetail = 'sp://shopDetail/shopDetail';
    route.summon = 'sp://summon/summon';
    route.map = 'sp://map/map';
    route.videoPlayer = 'sp://videoPlayer/videoPlayer';

    this.route = route;

    this.web('config?version=' + this.version);
};

/**
 * 基础交互
 * @param url sp://
 * @param data JSON对象
 * @param cb 回调函数
 */
App2.prototype.post = function(url, data, cb) {
    Native.post(url, data, cb);
    // Native.post(url, data, function(result) {
    //     if ($.isFunction(cb)) {
    //         cb(result);
    //     }
    // })
}

/**
 * 获取app内存
 * @param cacheArr：内存数组 market, markets, user, userToken, address, addresses
 * @param cb：回调函数
 */
App2.prototype.getCache = function(cacheArr, cb) {
    var data = {
        'list': cacheArr
    }
    this.post('sp://cache/get', data, cb)
}

/**
 * 跳转至app页面
 * @param name：路由名称
 */
App2.prototype.push = function(name) {
    var url = 'sp://navigatior/show';
    var routeUrl = this.route[name];
    if (!routeUrl) return;
    routeUrl = encodeURIComponent(routeUrl);
    url += '?url=' + routeUrl;
    this.post(url);
}

/**
 * 回退到app指定洁面
 * @param name：路由名称（可不传）
 * @param index：回退层数（可不传）
 */
App2.prototype.pop = function(name, index) {
    var url = 'sp://navigatior/pop';
    if (name) {
        url += '?name=' + name;
    } else if (index) {
        url += '?index=' + index;
    }
    this.post(url);
}

/**
 * 获取app回退列表
 * @param cb：回调函数
 */
App2.prototype.getAppBackList = function(cb) {
    var url = 'sp://navigatior/backList';
    this.post(url, '', function(result) {
        cb(result);
    });
}

/**
 * app分享
 * @param title：标题
 * @param text：内容
 * @param imageUrl：图片
 * @param url：分享连接
 */
App2.prototype.share = function(title, text, url, imageUrl) {
    var data = {
        'title': title,
        'text': text,
        'image': imageUrl,
        'url': url
    };
    this.post('sp://app/share', data);
}

/**
 * 发起app定位
 * @param cb：回调函数
 */
App2.prototype.location = function(cb) {
    this.post('sp://app/location', null, function(result) {
        cb(result);
    });
}

/**
 * web
 * @param name：方法名
 * @param data：json参数
 * @param cb：回调函数
 *
 * name: config, data: {version: *} || name: config?version=*
 * name: goback, data: null, cb: 回调函数
 * name: backList, data: null, cb: 回调函数  - 获取可回退web页面列表
 * name: forwardList, data: null, cb: 回调函数  - 获取可前进web页面列表
 * name: go, data: {index: *} || name: go?index=*  - 跳转至指定web页面
 */
App2.prototype.web = function(name, data, cb) {
    var url = 'sp://web/' + name;
    this.post(url, data, function(result) {
        if ($.isFunction(cb)) {
            cb(result);
        }
    })
}

/**
 * 发起支付
 * @param data
 */
App2.prototype.pay = function(data) {
    this.post('sp://app/pay', data);
}

/**
 * 通过app调起后台接口
 * @param params
 */
App2.prototype.network = function(params, cb) {
    var url = 'sp://network/post';
    this.post(url, params, function(result) {
        if ($.isFunction(cb)) {
            cb(result);
        }
    })
}

/**
 * 兼容旧协议！！！
 * 过期时删除
 * @param name
 */
App2.prototype.getStorage = function(name) {
    var list = [];
    list.push(name);
    this.getCache(list, function(result) {
        cacheResult(name, JSON.stringify(result[name]));
    })
}

App2.prototype.ui = function(data) {
    if (data.isHiddenNavbar != 1) {
        $('header').show();
    }
}

App2.prototype.toWebView = function(webUrl) {
    this.post(webUrl);
}

App2.prototype.execute = function(page, funcName, urlParams) {
    var url = 'sp://' + page + '/' + funcName + '?' + urlParams;
    this.post(url);
}

/* ********* 小程序接口 ********* */

var miniApp = function(version, wp) {
    this.version = version;
    this.wp = wp;
    this.init();
}

miniApp.prototype.init = function() {
    var route = {};
    route.home = '/pages/index/index';
    route.category = '/pages/category/category';
    route.message = '/pages/message/message';
    route.shopCart = '/pages/cart/cart';
    route.myProfile = '/pages/mine/mine';

    route.shoplist = '/pages/shop_group/shop_group';
    route.myAdress = '/pages/address_list/address_list';

    this.route = route;
}

/**
 * 保留当前页面，跳转到应用内的某个页面
 * @param name: 路由名称
 * @param urlParams: url参数 前面需带?
 */
miniApp.prototype.forwardApp = function(name, urlParams) {
    var route = this.route[name];
    if (!route) return;
    urlParams = urlParams || '';
    var url = route + urlParams;

    if (name == 'home' || name == 'category' || name == 'message' || name == 'shopCart' || name == 'myProfile') {
        // 跳转导航栏
        wx.miniProgram.switchTab({
            'url': url
        });
    } else {
        // 跳转非导航栏
        wx.miniProgram.navigateTo({
            'url': url
        });
    }
}

/**
 * 关闭当前页面，返回上一页面或多级页面
 * @param name
 * @param index
 */
miniApp.prototype.backApp = function(name, index) {
    var data = {};
    if (name) {
        var route = this.route[name];
        if (!route) return;
        data.url = route;
    } else if (index) {
        data.delta = index;
    }
    if (!data.name && !data.delta) return;
    wx.miniProgram.navigateBack(data);
}

/**
 * 初始化小程序分享信息，该无直接发起分享
 * (具体url见项目具体连接)
 * @param title: 分享标题
 * @param imageUrl: 图片url 网络图片路径或小程序项目本地图片，支持PNG及JPG
 * @param url: 分享连接
 *              webview: pages/web_view/web_view?url=encodeURIComponent(webview页面url)
 *              小程序页面: pages/index/index
 */
miniApp.prototype.share = function(title, imageUrl, url) {
    var params = {};
    params.title = title;
    params.imageUrl = imageUrl;
    params.share_url = url;
    wx.miniProgram.postMessage({data: params});
}