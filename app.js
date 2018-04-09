/**
 * Created by Administrator on 2017/9/16 0016.
 */

/**
 * 实例化
 * @param version: app版本号
 * @param wp: 协议版本
 * @param source: 来源 0: IOS 1: 安卓
 * @constructor
 */
var App = function(version, wp, source) {
    if (wp < 2000) {
        this.version = version;
        this.wp = wp;
        this.source = source;
        this.init();
    } else {
        return new App2(version, wp, source);
    }
};

App.prototype.init = function() {

    this.isApp = this.verification();
    if (!this.isApp) return;

    var route = {};
    route.shoplist = 'http://shoplist/shoplist';
    route.search = 'http://search/search';
    route.activity = 'http://activity/activity';
    route.category = 'http://category/category';
    route.goodDetail = 'http://goodDetail/goodDetail';
    route.chat = 'http://chat/chat';
    route.myIntegral = 'http://myIntegral/myIntegral';
    route.home = 'http://home/home';
    route.login = 'http://login/login';
    route.help = 'http://help/help';
    route.message = 'http://message/message';
    route.myAdress = 'http://myAdress/myAdress';
    route.myCash = 'http://myCash/myCash';
    route.myLike = 'http://myLike/myLike';
    route.myOrder = 'http://myOrder/myOrder';
    route.myProfile = 'http://myProfile/myProfile';
    route.myTicket = 'http://myTicket/myTicket';
    route.newFeatures = 'http://newFeatures/newFeatures';
    route.orderDetail = 'http://orderDetail/orderDetail';
    route.payBefore = 'http://payBefore/payBefore';
    route.shopCart = 'http://shopCart/shopCart';
    route.shopDetail = 'http://shopDetail/shopDetail';
    route.summon = 'http://summon/summon';
    route.map = 'http://map/map';
    route.videoPlayer = 'http://videoPlayer/videoPlayer';

    this.route = route;
};

/**
 * app校验
 * @returns {boolean}
 */
App.prototype.verification = function() {
    if (this.source == 0 || this.source == 1) {
        return true;
    }
    return false;
};

/**
 * ui
 * @param data
 */
App.prototype.ui = function(data) {
    if (this.source == 0) {
        window.webkit.messageHandlers.ui.postMessage(data);
    } else {
        myWeb.postMessage("ui", JSON.stringify(data));
    }
};

/**
 * 获取APP内存信息
 * @param name: 内存名称
 * 回调 cacheResult
 */
App.prototype.getStorage = function(name) {
    var data = {};
    data.type = 'get';
    data.name = name;
    if (this.source == 0) {
        window.webkit.messageHandlers.storage.postMessage(data);
    } else {
        myWeb.postMessage("storage", JSON.stringify(data));
    }

};

/**
 * webView跳转webView
 * @param webUrl
 * @param isRemoveSelf
 */
App.prototype.toWebView = function(webUrl, isRemoveSelf) {
    var data = {};
    var url = 'http://activity/activity?urlStr=' + webUrl;
    data.url = url;
    if (isRemoveSelf) {
        data.isRemoveSelf = isRemoveSelf;
    }

    if (this.source == 0) {
        window.webkit.messageHandlers.push.postMessage(data);
    } else {
        myWeb.postMessage("push", JSON.stringify(data));
    }
};

/**
 * 函数执行
 * @param page: 路由名称
 * @param funcName: 方法名
 * @param urlParams: 参数
 */
App.prototype.execute = function(page, funcName, urlParams, beforeJS, finishJS) {
    var data = {};
    data.url = 'http://' + page + '/' + funcName + '?' + urlParams;
    data.beforeJS = beforeJS;
    data.finishJS = finishJS;
    if (this.source == 0) {
        window.webkit.messageHandlers.execute.postMessage(data);
    } else {
        myWeb.postMessage("execute", JSON.stringify(data));
    }
}

/**
 * push
 * @param uriName
 * @param urlParams
 */
App.prototype.push = function(uriName, urlParams) {
    var data = {};
    var url = this.route[uriName];
    if (!url) return;

    if (urlParams) {
        url += '?' + urlParams;
    }
    data.url = url;

    if (this.source == 0) {
        window.webkit.messageHandlers.push.postMessage(data);
    } else {
        myWeb.postMessage("push", JSON.stringify(data));
    }
};

/**
 * pop
 * @param uriName
 * @param urlParams
 */
App.prototype.pop = function(uriName, urlParams) {
    var data = {};

    if (!epm.isEmpty(uriName)) {
        var url = this.route[uriName];
        if (!url) return;
        url += '?' + urlParams;
        data.url = url;
    }

    if (this.source == 0) {
        window.webkit.messageHandlers.pop.postMessage(data);
    } else {
        myWeb.postMessage("pop", JSON.stringify(data));
    }
};

/**
 * open
 * @param uriName
 * @param urlParams
 */
App.prototype.open = function(uriName, urlParams) {
    var data = {};
    var url = this.route[uriName];
    if (!url) return;

    url += '?' + urlParams;
    data.url = url;

    if (this.source == 0) {
        window.webkit.messageHandlers.open.postMessage(data);
    } else {
        myWeb.postMessage("open", JSON.stringify(data));
    }
};

/**
 * present
 * @param uriName
 * @param urlParams
 */
App.prototype.present = function(uriName, urlParams) {
    var data = {};
    var url = this.route[uriName];
    if (!url) return;

    url += '?' + urlParams;
    data.url = url;

    if (this.source == 0) {
        window.webkit.messageHandlers.present.postMessage(data);
    } else {
        myWeb.postMessage("present", JSON.stringify(data));
    }
};

/**
 * 移除web缓存
 * @param removeStr
 *   all
 diskCache
 offlineWebApplicationCache
 memoryCache
 localStorage
 cookies
 sessionStorage
 indexedDBDatabases
 webSQLDatabases
 */
App.prototype.debug = function(storageName, beforeJS, finishJS) {

    var data = {};
    data.remove = storageName;
    data.beforeJS = beforeJS;
    data.finishJS = finishJS;

    if (this.source == 0) {
        window.webkit.messageHandlers.debug.postMessage(data);
    }
};

/**
 * 分享
 * @param title
 * @param text
 * @param url
 * @param beforeJS
 * @param finishJS
 */
App.prototype.share = function(title, text, url, beforeJS, finishJS) {
    var data = {};
    data.title = title;
    data.text = text;
    data.url = url;
    data.beforeJS = beforeJS;
    data.finishJS = finishJS;

    if (this.source == 0) {
        window.webkit.messageHandlers.share.postMessage(data);
    } else {
        myWeb.postMessage("share", JSON.stringify(data));
    }
};

/**
 * 支付
 * @param type: 微信 = 1, 支付宝 = 2
 * @param aliPay: 调起支付宝所需链接
 * @param wechat: 调起微信所需参数
 * @param beforeJS
 * @param finishJS
 */
App.prototype.pay = function(type, aliPay, wechat, beforeJS, finishJS) {

    var data = {};
    data.type = type;
    data.aliPay = aliPay;
    data.wechat = wechat;
    data.beforeJS = beforeJS;
    data.finishJS = finishJS;

    if (this.source == 0) {
        window.webkit.messageHandlers.pay.postMessage(data);
    } else {
        myWeb.postMessage("pay", JSON.stringify(data));
    }
};

/**
 * 获取定位地址
 * @param type
 */
App.prototype.location = function(type) {

    var data = {};
    data.type = type;
    // data.name = name;

    if (this.source == 0) {
        window.webkit.messageHandlers.storage.postMessage(data);
    } else {
        myWeb.postMessage("storage", JSON.stringify(data));
    }
}