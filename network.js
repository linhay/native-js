const network = {

    post: function (params, cb) {
        if (native_config.wp < 2000) throw "不支持该版本";
        Native.post("sp://network/post", params, cb)
    }


};