var app = function () {};

app.prototype.open = function (url) {
  Native.post('sp://app/open',{url: url});
};

app.prototype.location = function (cb) {
    Native.post('sp://app/location',cb)
};

app.prototype.share = function (params,cb) {
    Native.post('sp://app/share',params,cb)
};

app.prototype.pay = function (type,data) {
    Native.post('sp://app/pay',data)
}