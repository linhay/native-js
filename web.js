const web = {
    // 发送当前使用版本号
    sendVersion: function(version,cb){
        Native.post('sp://web/config',{version: version},cb)
    },

    // 与原生返回按键效果一致
    goback: function(jsStr,cb){
        Native.post('sp://web/goback',{js: jsStr},cb)
    },

    // 获取可回退web页面列表
    backList: function(cb){
        Native.post('sp://web/backList',cb)
    },

    // 获取可前进web页面列表
    forwardList: function(cb){
        Native.post('sp://web/forwardList',cb)
    },

    // 跳转至指定web页面[依旧触发生命周期函数]
    go: function (index,cb) {
        Native.post('sp://web/go',{index: index},cb)
    }
}