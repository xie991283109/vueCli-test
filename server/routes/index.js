var express = require('express');
var encrypt = require('../libs/encrypt');
var router = express.Router();
var Promise = require('bluebird');
var superagent = Promise.promisifyAll(require('superagent'));
/* GET home page. */
router.get('/shebao', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('index', {});
});

router.get('/bind', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('bind', {});
});


router.post('/test_ordermedicine', function(req, res) {
     console.log("###############2333\n")
     return superagent.post("http://127.0.0.1:12333/medicine_store/orderForTencentTesta")
            .set('Content-Type', 'application/json')
      .send(JSON.stringify(req.body))
            .then((result) => {
              if (result.statusCode == 200) {
                    var retData = result.text;
                    var retObj = JSON.parse(retData.trim());
                    var returnString = {sign:retObj.data.sign,nonce:retObj.data.noce_str, code:retObj.data.code, msg:retObj.data.msg, rsp:{}}
                    res.send(returnString);
                }
            })
            .catch(function(e){
              console.log(e);
            });
});
router.post('/ordermedicine', function(req, res) {
  console.log("###############正式 ordermddicine2333\n")
  return superagent.post("http://127.0.0.1:12333/medicine_store/orderForTencentTesta")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        var retObj = JSON.parse(retData.trim());
        var returnString = {sign:retObj.data.sign,nonce:retObj.data.noce_str, code:retObj.data.code, msg:retObj.data.msg, rsp:{}}
        res.send(returnString);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

// 获取支付结果 测试使用
router.post('/test_getpayresult', function(req, res) {
  console.log("####come in pay result#2333\n");
  console.log("pay data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);

  return superagent.post("http://127.0.0.1:12333/medicine_store/getPayResult")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("pay result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
})

// 正式 getpayresult
router.post('/getpayresult', function(req, res) {
  console.log("####come in pay result#2344\n");
  console.log("pay data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);

  return superagent.post("http://127.0.0.1:12333/medicine_store/getPayResultByService")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("pay result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
})


// 关闭订单 测试使用
router.post('/test_closeorder', function(req, res) {
  console.log("###############2333\n")
  console.log("####come in test_closeorder result#2333\n");
  console.log("test_closeorder data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);
  return superagent.post("http://127.0.0.1:12333/medicine_store/closeOrder")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("pay result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

// 退费refundByServiceWay
router.post('/refund', function(req, res) {
  console.log("正式###############2333\n")
  console.log("####come in 退费refundByServiceWay result#2333\n");
  console.log("test_closeorder data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);
  return superagent.post("http://127.0.0.1:12333/medicine_store/refund")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("pay refund result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

// getRefundResult 获取退费结果
router.post('/getRefundResult', function(req, res) {
  console.log("正式###############2333\n")
  console.log("####come in 退费refundByServiceWay result#2333\n");
  console.log("test_closeorder data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);
  return superagent.post("http://127.0.0.1:12333/medicine_store/getRefundResult")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("pay get refund result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

router.post('/closeorder', function(req, res) {
  console.log("正式###############2333\n")
  console.log("####come in test_closeorder result#2333\n");
  console.log("test_closeorder data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);
  return superagent.post("http://127.0.0.1:12333/medicine_store/closeOrder")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("pay result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});


// 提供给银海进行自助机统一下单
router.post('/onlinepay/unifiedorder', function(req, res) {
  console.log("###############2333\n")
  return superagent.post("http://127.0.0.1:12333/onlinepay/unifiedorder")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        var retObj = JSON.parse(retData.trim());
        var returnString = {data:retObj.data, result:retObj.result, msg: retObj.msg}
        res.send(returnString);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

// 提供给银海进行自助机统一下单
router.post('/onlinepay/test', function(req, res) {
  console.log("###############2333\n")
  return superagent.post("http://127.0.0.1:12333/onlinepay/test")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        var retObj = JSON.parse(retData.trim());
        //var returnString = {}
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});


// 回调通知
router.post('/onlinepay/result_notify', function(req, res) {
  console.log("###############2333\n")
  return superagent.post("http://127.0.0.1:12333/onlinepay/result_notify")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        var retObj = JSON.parse(retData.trim());
        var returnString = {data:data.data, result:data.result, msg: data.msg}
        res.send(returnString);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

// test_createOrder
router.post('/onlinepay/createOrder', function(req, res) {
  console.log("###############2333\n")
  return superagent.post("http://127.0.0.1:12333/onlinepay/createOrder")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        var retObj = JSON.parse(retData.trim());
        var returnString = {data:data.data, result:data.result, msg: data.msg}
        res.send(returnString);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});


// 回调通知
router.post('/medicine_store/result_notify', function(req, res) {
  console.log("###############2333\n")
  return superagent.post("http://127.0.0.1:12333/medicine_store/result_notify")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        var retObj = JSON.parse(retData.trim());
        var returnString = {data:data.data, result:data.result, msg: data.msg}
        res.send(returnString);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});

router.post('/person_pay/getpersoninfo', function(req, res) {
  console.log("正式###############2333\n")
  console.log("####come in  getpersoninfo result#2333\n");
  console.log("test_closeorder data is:\n");
  console.log(Date()+ "\n");
  console.log(req.body);
  if (req.body.req == undefined) {
    console.log("special deal")
    var mybody = {};
    for (var i in req.body) {
      mybody = i;
    }
    mybody = JSON.parse(mybody);

    req.body = mybody;
  }
  console.log(Date()+ "\n");
  console.log(req.body);
  console.log("typeof :\n")
  console.log(typeof req.body);
  return superagent.post("http://127.0.0.1:12333/person_pay/getPersonInfo")
    .set('Content-Type', 'application/json')
    .send(JSON.stringify(req.body))
    .then((result) => {
      if (result.statusCode == 200) {
        var retData = result.text;
        console.log("to getPersonInfo result")
        console.log(retData);
        var retObj = JSON.parse(retData.trim());
        res.send(retObj);
      }
    })
    .catch(function(e){
      console.log(e);
    });
});


router.get('/log', function(req, res) {
    res.setHeader('Server', 'power by cdhrss');
    res.render('log', {});
});

router.get('/help', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('help', {});
});

router.get('/activate', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('activate', {});
});

router.get('/pharmacy', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('pharmacy', {});
});
// 内部使用获取/展示 openid accessToken
router.get('/getAccessToken', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('openAccess', {type: ''});
})
router.get('/getAccessToken/:type', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('openAccess', {type: req.params.type});
})
router.get('/', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.send('{"code":0,"message":"cdhrss","data":{}}');
});
// 获取二维码
//
router.get('/getQRCode', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('pharmacys/code.ejs', {type: ''});
});
router.get('/code', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('pharmacys/code.ejs', {type: ''});
});

router.get('/getQRCode/:type', function(req, res) {
  console.log("")
  res.setHeader('Server', 'power by cdhrss');
  res.render('pharmacys/code.ejs', {type: req.params.type});
});

// 获取详情界面
router.get('/pay/:type?/:param1?/:param2?/:param3?', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');

  function getIPAdress(){
      var interfaces = require('os').networkInterfaces();
      console.log(interfaces)
      for(var devName in interfaces){
            var iface = interfaces[devName];
            for(var i=0;i<iface.length;i++){
                 var alias = iface[i];
                 if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                       return alias.address;
                 }
            }
      }
  }

  if (req.params.type == 'detail') {
    if (!req.params.param2) {
        req.params.param2 = getIPAdress();
    }
    if (!req.params.param3) {
        req.params.param3 = getIPAdress();
    }
  }
  if (req.params.type == 'business') {
    if (!req.params.param2) {
        req.params.param2 = getIPAdress();
    }
    if (!req.params.param3) {
        req.params.param3 = getIPAdress();
    }
  }
  res.render('pharmacys/pay.ejs', {type: req.params.type, param1: req.params.param1, param2: req.params.param2, param3: req.params.param3});
});

// for test
// router.get('/inquiry/:type?/:param1?/:param2?', function(req, res){
//   res.render('test/test.ejs', {type: req.params.type, param1: req.params.param1, param2: req.params.param2});
// })

router.get('/insurance/:type?/:param1?/:param2?/:param3?', function(req, res) {
    res.setHeader('Server', 'power by cdhrss');

    function getIPAdress(){
        var interfaces = require('os').networkInterfaces();
        console.log(interfaces)
        for(var devName in interfaces){
            var iface = interfaces[devName];
            for(var i=0;i<iface.length;i++){
                var alias = iface[i];
                if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                    return alias.address;
                }
            }
        }
    }

    if (req.params.type == 'paytopay') {
        if (!req.params.param2) {
            req.params.param2 = getIPAdress();
        }
        if (!req.params.param3) {
            req.params.param3 = getIPAdress();
        }
    }

    res.render('insurance/index.ejs', {
        type: req.params.type,
        param1: req.params.param1,
        param2: req.params.param2,
        param3: req.params.param3
    });
});


router.get('/permission/:type?/:param1?/:param2?/:param3?', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('permission/index.ejs', {
    type: req.params.type,
    param1: req.params.param1,
    param2: req.params.param2,
    param3: req.params.param3
  });
});


router.get('/get-weixin-code.html?', function(req, res) {
  res.setHeader('Server', 'power by cdhrss');
  res.render('insurance/get-weixin-code.ejs', {});

});
module.exports = router;
