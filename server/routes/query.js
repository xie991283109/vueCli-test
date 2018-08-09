'use strict'
var express = require('express');
var redis = require('redis');
var promise = require('bluebird');
promise.promisifyAll(redis);
var requests = require('../libs/requests.js');
var request = require('request');
var router = express.Router();
var utils = require('../libs/utils');
var config = require(utils.configDir + '/config.json');
var xml2js = require('xml2js');
var crypto = require('crypto');
var redisConfig = config.redis;
var redisClient = redis.createClient(redisConfig.port, redisConfig.host);
var Promise = require('bluebird');
var superagent = Promise.promisifyAll(require('superagent'));

var check = {
    token         : '087d769104c6b123fdc9c3d288234e5d',
    appid         : config.wxConfig.appId,
    encodingAESKey: 'aD83qJTrBQG9viUiTADgbpZ0dDvtY7XnByCQlmbYnH1'
};
var wechat = require('node-wechat')(check.token);

function md5(text) {
    return crypto.createHash('md5').update(text).digest('hex');
}

// 应答
function Response(res, code, data, error) {
    res.setHeader('Server', 'power by cdhrss');
    var json = JSON.stringify({
        code : code,
        data : data,
        error: error
    });
    console.log("*** << response >> ***");
    console.log(json);
    res.send(json);
}

// 取得open id
function OpenId(res, qs, func) {
    if (qs.code == undefined) {
        Response(res, -1, {}, '参数不完整');
        return
    }
    request({
        headers: {
            'cache-control': 'no-cache',
        },
        method : 'GET',
        url    : 'https://api.weixin.qq.com/sns/oauth2/access_token',
        qs     : qs
    }, function (error, response, json) {
        if (!error && response.statusCode === 200) {
            var body = JSON.parse(json);
            if (body.openid == undefined) {
                console.log("---< open id error >---");
                console.log("open is undefined");
            } else {
                console.log("---< open id body >---");
                console.log(body);
            }
            func(res, body);
        } else {
            console.log("---< open id error >---");
            console.log(error);
            Response(res, {}, '获取open_id失败');
        }
    });
}

/**
 * @ronWang 取得access token
 **/
function AccessToken(res, qs, func) {
    var token_key = md5(qs.appid + qs.secret);
    var nowTimem = new Date().getTime();
    var accessToken = '';
    console.log("-------------accessToken--------------------");
    return redisClient.getAsync(token_key).then((returnData) => {
        console.log("redis accesstoken:" + returnData);
        if (typeof(returnData) != "undefined" && returnData != null) {
            accessToken = returnData;
        }
    })
    .then(() => {
        if (accessToken != '') {
            return superagent.get('https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=' + accessToken)
            .set('Content-Type', 'application/json')
            .endAsync();
        }
    })
    .then((returnData) => {
        if (accessToken != '') {
            if (returnData.body.errcode != undefined) {
                accessToken = '';
            }
        }
    })
    .then(() => {
        // 北京团队获取access_token
        // if (accessToken != '') {
        //     return superagent.get('http://csi.cdhrss.gov.cn/ebao123/wechat/common/getToken.htm')
        //     .set('Content-Type', 'application/json')
        //     .timeout(3000)
        //     .endAsync();
        // }
    })
    .then((res) => {
        // if (res && res.ok) {
        //     var resData = JSON.parse(res.text);
        //     if (resData.code == '000000') {
        //         accessToken = resData.access_token;
        //         var expire = parseFloat(resData.expires_time) - nowTimem;
        //         expire = parseInt(expire/1000);
        //         return redisClient.setAsync(token_key, accessToken)
        //             .then(() => {
        //                 return redisClient.expireAsync(token_key, expire);
        //             });
        //     }
        // }
    })
    .then(() => {
        if (accessToken != '') {
            return accessToken;
        } else {
            // 请求access_token
            return superagent.get('https://api.weixin.qq.com/cgi-bin/token')
                .set('Content-Type', 'application/json')
                .query({appid: qs.appid, secret: qs.secret, grant_type: 'client_credential'})
                .endAsync()
                .then((resultData) => {
                    console.log("access_token_get:" + resultData.text);
                    if (resultData.ok) {
                        accessToken = resultData.body.access_token;
                        return redisClient.setAsync(token_key, accessToken)
                            .then(() => {
                                return redisClient.expireAsync(token_key, 7000)
                                    .then(() => {
                                        return accessToken;
                                    });
                            });
                    } else {
                        return false; // 没有获取到access_token
                    }
                });
        }
    })
    .then((returnData) => {
        console.log("-------------accessToken========================");
        console.log(accessToken);
        if (returnData) {
            var body = {access_token: accessToken};
            func(res, body);
        } else {
            Response(res, -1, {}, '获取access_token失败');
        }
    });


    // var cache_key = md5(qs.appid + qs.secret);
    // // redisClient.get(cache_key, (err, result)=> {
    // //     if (err || !result) {
    // request({
    //     headers: {
    //         'cache-control': 'no-cache'
    //     },
    //     method : 'GET',
    //     url    : 'https://api.weixin.qq.com/cgi-bin/token',
    //     qs     : qs
    // }, function (error, response, json) {
    //     if (!error && response.statusCode === 200) {
    //         var body = JSON.parse(json);
    //         console.log("---< access token body >---");
    //         console.log(body);

    //         // 1/2 access_token失效时间
    //         redisClient.set(cache_key, json, ()=> {
    //             redisClient.expire(cache_key, parseInt(parseInt(body.expires_in) / 2));
    //         });

    //         func(res, body);
    //     } else {
    //         console.log("---< access token error >---");
    //         console.log(error);
    //         Response(res, -1, {}, '获取access_token失败');
    //     }
    // });
    // //     } else {
    // //         var body = JSON.parse(result);
    // //         console.log("---< access token cache body >---");
    // //         console.log(body);
    // //         func(res, body);
    // //     }
    // // });
}

// 取得社保卡号
function SocialNumber(res, access_token, params, func) {
    request({
        headers: {
            'cache-control': 'no-cache',
            'content-type' : 'application/xml'
        },
        method : 'POST',
        url    : 'https://api.weixin.qq.com/payinsurance/getmedinfo',
        qs     : {
            access_token: access_token
        },
        body   : (new xml2js.Builder({
            headless: true
        })).buildObject({xml: params}),
    }, function (error, response, xml) {
        if (!error && response.statusCode === 200) {
            xml2js.parseString(xml, {
                ignoreAttrs  : true,
                explicitArray: false,
            }, function (err, body) {
                if (!err) {
                    console.log("---< social number body >---");
                    console.log(body);
                    if (body.xml.return_code == 'FAIL') {
                        Response(res, body.xml.err_code, {
                            openID: params.openid
                        }, body.xml.return_msg);
                    } else if (body.xml.result_code == 'FAIL') {
                        Response(res, body.xml.err_code, {
                            openID: params.openid
                        }, body.xml.err_code_des);
                    } else {
                        func(res, body.xml);
                    }
                } else {
                    console.log("---< social number xml to json error >---");
                    console.log(xml);
                    console.log('to->');
                    console.log(err);
                    Response(res, -1, {
                        openID: params.openid
                    }, 'xml转json失败');
                }
            });
        } else {
            console.log("---< social number error >---");
            console.log(error);
            Response(res, -1, {
                openID: params.openid
            }, '获取social number失败');
        }
    });
}

// 取得绑卡连接
function BindUrl(res, access_token, params, func) {
    request({
        headers: {
            'cache-control': 'no-cache',
            'content-type' : 'application/xml'
        },
        method : 'POST',
        url    : 'https://api.weixin.qq.com/payinsurance/getbindurl',
        qs     : {
            access_token: access_token
        },
        body   : (new xml2js.Builder({
            headless: true
        })).buildObject({xml: params}),
    }, function (error, response, xml) {
        if (!error && response.statusCode === 200) {
            xml2js.parseString(xml, {
                ignoreAttrs  : true,
                explicitArray: false,
            }, function (err, body) {
                if (!err) {
                    console.log("---< bind url body >---");
                    console.log(body);
                    if (body.xml.return_code == 'FAIL') {
                        Response(res, -1, {}, body.return_msg);
                    } else if (body.xml.result_code == 'FAIL') {
                        Response(res, -1, {}, body.err_code_des);
                    } else {
                        func(res, body.xml);
                    }
                } else {
                    console.log("---< bind url xml to json error >---");
                    console.log(xml);
                    console.log('to->');
                    console.log(err);
                    Response(res, -1, {
                        openID: params.openid
                    }, 'xml转json失败');
                }
            });
        } else {
            console.log("---< social number error >---");
            console.log(error);
            Response(res, -1, {
                openID: params.openid
            }, '获取social number失败');
        }
    });
}

router.post('/12333', function (req, res) {
    res.setHeader('Server', 'cdhrss');
    var body = req.body;

    if ('undefined' === typeof body.svrname || 'undefined' === typeof body.fnname) {
        res.send(JSON.stringify({code: -1, error: '参数不完整'}));
        return;
    }

    requests.api12333(body.svrname, body.fnname, body.data, function (res_data, err123, res123, body123) {
        if (res_data === false) {
            console.log('res_data: ' + res_data);
            console.log('err123: ' + JSON.stringify(err123));
            console.log('res123: ' + JSON.stringify(res123));
            console.log('body123: ' + JSON.stringify(body123));
            res.send(JSON.stringify({code: -1, error: 'ServerError'}));
        } else {
            switch (body.fnname) {
                case 'bindWX':
                    req.session.user = res_data.data;
                    break;
                case 'unbindWX':
                    req.session.destroy();
                    break;
            }
            res.send(res_data);
        }
    });
});

router.post('/insurance', function (req, res) {
    res.setHeader('Server', 'cdhrss');
    var body = req.body;

    if ('undefined' === typeof body.svrname || 'undefined' === typeof body.fnname) {
        res.send(JSON.stringify({code: -1, error: '参数不完整'}));
        return;
    }

    requests.apiInsurance(body.svrname, body.fnname, body.data, function (res_data, err123, res123, body123) {
        if (res_data === false) {
            console.log('res_data: ' + res_data);
            console.log('err123: ' + JSON.stringify(err123));
            console.log('res123: ' + JSON.stringify(res123));
            console.log('body123: ' + JSON.stringify(body123));
            res.send(JSON.stringify({code: -1, error: 'ServerError'}));
        } else {
            switch (body.fnname) {
                case 'bindWX':
                    req.session.user = res_data.data;
                    break;
                case 'unbindWX':
                    req.session.destroy();
                    break;
            }
            res.send(res_data);
        }
    });
});

router.post('/socialNumber', function (req, res) {
    var params = req.body;

    let wxConfig = params.business ? params.business+'wxConfig' : 'wxConfig';

    // step1. 取得open id
    OpenId(res, {
        appid     : config[wxConfig].appId,
        secret    : config[wxConfig].secret,
        code      : params.code,
        grant_type: 'authorization_code'
    }, function (res, body) {
        if (!body.openid && !params.openID) {
            Response(res, -1, {}, body.errmsg);
            return
        }

        console.log('######################',config[wxConfig]);
        var data = {
            openid   : body.openid || params.openID,
            nonce_str: String(Math.random() * 10000)
        };

        data.sign = utils.getSign(data, config.key);

        // step2. 取得access token
        AccessToken(res, {
            grant_type: 'client_credential',
            appid     : config[wxConfig].appId,
            secret    : config[wxConfig].secret,
        }, function (res, body) {
            if (body.access_token === undefined) {
                Response(res, -1, {}, 'access token为空');
            } else {
                // step3. 取得社保卡号
                SocialNumber(res, body.access_token, data, function (res, body) {
                    if (body.return_code == 'SUCCESS' && body.result_code == 'SUCCESS') {
                        Response(res, 0, {
                            openID         : data.openid,
                            medical_card_no: body.medical_card_no,
                        }, '');
                    } else {
                        Response(res, -2, {
                            openID: data.openid
                        }, '未知错误');
                    }
                });
            }
        });
    });
});

router.post('/openId', function (req, res) {
    var params = req.body;

    console.log(params)
    OpenId(res, {
        appid: params.appId ? params.appId : config.wxConfig.appId,
        secret: params.secret ? params.secret : config.wxConfig.secret,
        code: params.code,
        grant_type: 'authorization_code'
    }, function (res, body) {
        if (!body.openid && !params.openID) {
            Response(res, -1, {}, body.errmsg);
        }else{
            Response(res, 0, {
                openID: body.openid
            }, '');
        }
    });
});

router.post('/bindLink', function (req, res) {
    var params = req.body;
    // OpenId(res, {
    //     appid     : config.wxConfig.appId,
    //     secret    : config.wxConfig.secret,
    //     code      : params.code,
    //     grant_type: 'authorization_code'
    // }, function (res, body) {
    if (params.openid == undefined) {
        Response(res, -1, '获取openid失败');
        return
    }
    var data = {
        "openid"   : params.openid,
        "url"      : config.bindUrl,
        "nonce_str": String(Math.random() * 10000)
    };
    data.sign = utils.getSign(data, config.key);

    AccessToken(res, {
        grant_type: 'client_credential',
        appid     : config.wxConfig.appId,
        secret    : config.wxConfig.secret,
    }, function (res, body) {
        if (body.access_token === undefined) {
            Response(res, -1, {}, 'access token为空');
        } else {
            BindUrl(res, body.access_token, data, function (res, body) {
                if (body.return_code == 'SUCCESS' && body.result_code == 'SUCCESS') {
                    Response(res, 0, {
                        bind_url: body.bind_url,
                    }, '');
                } else {
                    Response(res, -2, {}, '未知错误');
                }
            });
        }
    });
    // });
});

router.post('/toActivate', function (req, res) {
    var params = req.body;
    if (params.code == undefined) {
        Response(-1, {}, '无效请求');
        return
    }
    // step1. 取得open id
    OpenId(res, {
        appid     : config.wxConfig.appId,
        secret    : config.wxConfig.secret,
        code      : params.code,
        grant_type: 'authorization_code'
    }, function (res, body) {
        if (!body.openid && !params.openID) {
            Response(res, -1, {}, body.errmsg);
            return
        }

        var data = {
            openid   : body.openid || params.openID,
            nonce_str: String(Math.random() * 10000)
        };

        data.sign = utils.getSign(data, config.key);

        // step2. 取得access token
        AccessToken(res, {
            grant_type: 'client_credential',
            appid     : config.wxConfig.appId,
            secret    : config.wxConfig.secret,
        }, function (res, body) {
            if (body.access_token === undefined) {
                Response(res, -1, {}, 'access token为空');
            } else {
                var access_token = body.access_token;
                // step3. 取得社保卡号
                SocialNumber(res, access_token, data, function (res, body) {
                    if (body.return_code == 'SUCCESS' && body.result_code == 'SUCCESS') {

                        var cache_key = 'active#' + data.openid;
                        redisClient.get(cache_key, (err, result) => {
                            if (err || !result) {
                                Response(res, -1, {}, '激活失败');
                            } else {
                                var cache = result.split('|');
                                if (cache.length >= 2) {
                                    request({
                                        headers: {'content-type': 'application/json'},
                                        uri    : 'https://api.weixin.qq.com/card/generalcard/activate?access_token=' + access_token,
                                        method : 'POST',
                                        body   : {
                                            card_number: body.medical_card_no,
                                            code       : cache[0],
                                            card_id    : cache[1]
                                        },
                                        timeout: 10000,
                                        json   : true,
                                    }, function (error, response, body) {
                                        if (!error && response.statusCode === 200) {
                                            if (body.errcode == 0) {
                                                Response(res, 0, {}, '激活成功');
                                            } else {
                                                Response(res, -2, {}, '激活失败');
                                            }
                                        } else {
                                            Response(res, -3, {}, '激活失败');
                                        }
                                    });
                                } else {
                                    Response(res, -1, '尚未取得code');
                                }
                            }
                        });
                    } else {
                        Response(res, -2, {}, '未知错误');
                    }
                });
            }
        });
    });
});

router.post('/headImageUrl', function (req, res) {
    var openId = req.body.openid;
    AccessToken(res, {
        grant_type: 'client_credential',
        appid     : config.wxConfig.appId,
        secret    : config.wxConfig.secret,
    }, function (res, body) {
        //step2. 取用户信息
        request({
            headers: {
                'cache-control': 'no-cache'
            },
            method : 'GET',
            url    : 'https://api.weixin.qq.com/cgi-bin/user/info',
            qs     : {
                lang        : 'zh_CN',
                access_token: body.access_token,
                openid      : openId
            }
        }, function (error, response, json) {
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(json);
                console.log("---< user info body >---");
                console.log(body);
                if (body.errcode == undefined) {
                    if (body.subscribe == undefined || body.subscribe < 1) {
                        Response(res, -100, {}, '请关注该公众号后重试');
                    } else {
                        Response(res, 0, {
                            headimgurl: body.headimgurl
                        }, '');
                    }
                } else {
                    Response(res, -1, {}, body.errmsg);
                }
            } else {
                console.log("---< user info error >---");
                console.log(error);
                Response(res, -1, {}, '获取用户信息失败');
            }
        });
    });
});

router.post('/getUserInfo', function (req, res) {
    var openId = req.body.openid;
    console.log(1)
    AccessToken(res, {
        grant_type: 'client_credential',
        appid     : config.wxConfig.appId,
        secret    : config.wxConfig.secret,
    }, function (res, body) {
        //step2. 取用户信息
        request({
            headers: {
                'cache-control': 'no-cache'
            },
            method : 'GET',
            url    : 'https://api.weixin.qq.com/cgi-bin/user/info',
            qs     : {
                lang        : 'zh_CN',
                access_token: body.access_token,
                openid      : openId
            }
        }, function (error, response, json) {
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(json);
                console.log("---< user info body >---");
                console.log(body);
                if (body.errcode == undefined) {
                    if (body.subscribe == undefined || body.subscribe < 1) {
                        Response(res, -100, {}, '请关注该公众号后重试');
                    } else {
                        Response(res, 0, {
                            info: body
                        }, '');
                    }
                } else {
                    Response(res, -1, {}, body.errmsg);
                }
            } else {
                console.log("---< user info error >---");
                console.log(error);
                Response(res, -1, {}, '获取用户信息失败');
            }
        });
    });
});

router.get("/push_callback", function (req, res) {
    wechat.checkSignature(req, res);
});

router.post("/push_callback", function (req, res) {
    var params = req.body.xml;
    console.log(params);
    if (params.event == 'user_get_card' && params.msgtype == 'event') {
        var cache_key = 'active#' + params.fromusername;
        console.log('--- cache key ---');
        console.log(cache_key + ':' + params.usercardcode + '|' + params.cardid);
        redisClient.set(cache_key, params.usercardcode + '|' + params.cardid, ()=> {});
    }

    // 返回信息
    res.send('success');
});

router.post('/account', function (req, res) {
    var params = req.body;

    if (params.social_no != undefined && params.time != undefined && params.sign != undefined) {
        if (md5('social_no=' + params.social_no + '&secret=4a3969ec' + '&time=' + params.time) != params.sign) {
            Response(res, -1, {}, 'signature error');
        } else {
            request({
                headers: {
                    'cache-control': 'no-cache',
                    'content-type' : 'application/x-www-form-urlencoded'
                },
                method : 'POST',
                url    : config.serviceUrl + '/shebao/qrChengDu',
                form   : {
                    serviceType: 'shebao',
                    jyztyzm    : '3fda6b7f97a6aa82c9fbb068812d7178',
                    jyztbm     : '012233630',
                    jybh       : 'cdsi0003005',
                    aac001     : params.social_no || 0
                }
            }, function (error, response, body) {
                if (!error && response.statusCode === 200) {
                    body = JSON.parse(body);
                    var detail = {};
                    if (body.data != undefined && body.data.resultset != undefined && body.data.resultset.row != undefined) {
                        detail = body.data.resultset.row
                    }
                    Response(res, 0, detail, 'success');
                } else {
                    Response(res, -1, {}, 'query failed');
                }
            });
        }
    } else {
        Response(res, -1, {}, 'params error');
    }
});

router.post('/getAccessToken', (req, res) => {
  //该接口只提供给银海内部调用，简单加密保护
  if (req.body.key && req.body.key === check.encodingAESKey) {
    AccessToken(res, {
      grant_type: 'client_credential',
      appid: config.wxConfig.appId,
      secret: config.wxConfig.secret,
    }, function(res, body) {
      if (body.access_token === undefined) {
        Response(res, -1, {}, 'access token为空');
      } else {
        Response(res, 0, body);
      }
    });
  } else {
    Response(res, -1, {}, '权限校验失败');
  }
});
router.post('/getOpenId', (req, res) => {
    var params = req.body;
    OpenId(res, {
        appid     : params.appId ? params.appId : config.wxConfig.appId,
        secret    : params.secret ? params.secret : config.wxConfig.secret,
        code      : params.code,
        grant_type: 'authorization_code'
    }, function(res, body) {
        Response(res, 0, body);
    })
});

router.post('/getTicket', function(req, res){
    var uri = 'https://api.weixin.qq.com/cgi-bin/token?appid='+config.wxConfig.appId+'&secret='+ config.wxConfig.secret+'&grant_type=client_credential';
    AccessToken(res, {
        grant_type: 'client_credential',
        appid     : config.wxConfig.appId,
        secret    : config.wxConfig.secret,
    }, function(res, body) {
        if (body.access_token) {
            // body = JSON.parse(body);
            var tick = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
            request({
                headers: {
                    'cache-control': 'no-cache'
                },
                method : 'GET',
                url    : encodeURI(tick),
                qs: {
                    access_token: body.access_token,
                    type: 'wx_card',
                }

            },  function(error, response, body){
                if (!error && response.statusCode === 200) {
                    body = JSON.parse(body);
                    Response(res, 0, body, 'success');
                }else {
                    Response(res, -1, {}, 'query failed');
                }
            })
        } else {
            Response(res, -1, {}, 'query failed');
        }
    })
    // request({
    //     headers: {
    //         'cache-control': 'no-cache'
    //     },
    //     method : 'GET',
    //     uri    : encodeURI(uri),

    // }, function (error, response, body) {
    //     if (!error && response.statusCode === 200) {
    //         body = JSON.parse(body);
    //         var tick = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket'
    //         request({
    //             headers: {
    //                 'cache-control': 'no-cache'
    //             },
    //             method : 'GET',
    //             url    : encodeURI(tick),
    //             qs: {
    //                 access_token: body.access_token,
    //                 type: 'wx_card',
    //             }

    //         },  function(error, response, body){
    //             if (!error && response.statusCode === 200) {
    //                 body = JSON.parse(body);
    //                 Response(res, 0, body, 'success');
    //             }else {
    //                 Response(res, -1, {}, 'query failed');
    //             }
    //         })
    //     } else {
    //         Response(res, -1, {}, 'query failed');
    //     }
    // })
})
router.post('/recognize', function(req, res){
    var params = req.body;
    request({
        headers: {
            'cache-control': 'no-cache',
            'content-type' : 'application/x-www-form-urlencoded'
        },
        method : 'POST',
        url    : 'https://iauth-sandbox.wecity.qq.com/new/cgi-bin/getdetectinfo.php',
        form   : {
            appid      : params.appId,
            signature  : params.signature,
            redirect   : params.redirect,
            uid        : params.uid,
            type       : params.type || 0
        }
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var detail = JSON.parse(body);

            Response(res, 0, detail, 'success');
        } else {
            Response(res, -1, {}, 'query failed');
        }
    });
})

module.exports = router;
