const network = {

    post: function (params, cb) {
        Native.post("sp://network/post", params, cb)
    }

}