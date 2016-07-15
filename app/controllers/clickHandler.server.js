'use strict';

var path = process.cwd();
var User = require('../models/users');
var fs = require('fs');


function ClickHandler() {


    this.updateMyPins = function (req, res) {

User.findOne({
    '_id': "577f9853a894345c094da47e",
    'twitter.myPins[0].code': '369258147'
}, function (err, result) {
    if (err) throw err;
    console.log(JSON.stringify(result));
    console.log(JSON.stringify(result.twitter.myPins[0]));
    res.end();
})
    };

    this.getActiveStatus = function (req, res) {
      var code = req.url.match(/\/activate\/(.*)/)[1];
        User.findOne({
            '_id': "577f9853a894345c094da47e"
        }, function (err, result) {
            if (err) throw err;
            console.log(JSON.stringify(result));
            console.log(JSON.stringify(result.twitter.myPins[0]));
            var obj = {};

            if (code == 369258147) {
               var a = result.twitter.myPins[0][1];
                 obj = {
                    激活状态: '未激活',
                    代理商: a.agent,
                    零售商: a.retailer
                };
                res.json(obj);
            } else if (code == 123456789) {
                var a = result.twitter.myPins[0][0];
                obj = {
                    激活状态: '已激活',
                    代理商: a.agent,
                    零售商: a.retailer
                };
                res.json(obj);
            }

            res.end();
        })
    };




    this.renderIndex = function (req, res) {

        var allPinsHTML = '<div class="grid-sizer"></div>',
            count = 0;

        User.find({}, function (err, result) {
            if (err) throw err;
            result.forEach(function (item) {
                if (item.twitter.myPins !== undefined) {
                    item.twitter.myPins.forEach(function (i) {
                        var sourceLink = i.sourceLink,
                            prefix = '<div class="grid-item"><img onerror="imgError(this)" src="',
                            suffix = '" /></div>';
                        allPinsHTML += prefix + sourceLink + suffix;
                    })
                }
                count++;
                if (count == result.length) {
                    if (req.isAuthenticated()) {
                        var data = {
                            'allPinsHTML': allPinsHTML,
                            'isAuthenticated': true
                        };
                        data = JSON.stringify(data);
                        res.end(data);
                    } else {
                         data = {
                            'allPinsHTML': allPinsHTML,
                            'isAuthenticated': false
                        };
                        data = JSON.stringify(data);
                        res.end(data);
                    }
                }
            });
        })
    };


    this.displayMyPins = function (req, res) {
        if (req.isAuthenticated()) {
            User.find({
                'twitter.id': req.user.twitter.id
            }, function (err, result) {
                var myPinsArr = result[0].twitter.myPins,
                    myPinsHTML = '',
                    myPinDivPrefix1 = "<div",
                    myPinDivPrefix2 = " class='col-lg-3'><div class='myPinDiv'><img onerror='imgError(this)' class='myPinImg' src='",
                    myPinDivSuffix1 = "' /><p>",
                    myPinDivSuffix2 = "</p><div class='shadowLayer'><span class='delMyPinButton'>X</span></div></div></div>",
                    count = 0;
                for (var i = 0; i < myPinsArr.length; i++) {
                    var sourceLink = myPinsArr[i].sourceLink,
                        title = '<h4><b>' + myPinsArr[i].title + '</b></h4>',
                        imgID = " id=" + myPinsArr[i].imgID,
                        myPinDiv = myPinDivPrefix1 + imgID + myPinDivPrefix2 + sourceLink + myPinDivSuffix1 + title + myPinDivSuffix2;
                    myPinsHTML += myPinDiv;
                    count++;
                    if (count == myPinsArr.length) {
                        res.end(myPinsHTML);
                    }
                }
            })
        }
    };


    this.removeMyPin = function (req, res) {
        var myPinID = Number(req.url.match(/\/removeMyPin\/(.*)/)[1]);

        User.findOneAndUpdate({
            'twitter.id': req.user.twitter.id
        }, {
            $pull: {
                'twitter.myPins': {
                    "imgID": myPinID
                }
            }
        }, {
            new: true
        }, function (err, result) {
            if (err) throw err;
            console.log(result.twitter.myPins[0].imgID + "  " + typeof result.twitter.myPins[0].imgID);
        })

    };

    this.addPin = function (req, res) {

        var sourceLink = req.url.match(/&(.*)/)[1],
            title = req.url.match(/\/addPin\/(.*)&.*/)[1],
            imgID = req.user.twitter.usedImgID + 1,
            myPin = {
                sourceLink: sourceLink,
                title: title,
                imgID: imgID
            };

        if (req.isAuthenticated()) {
            User.update({
                'twitter.id': req.user.twitter.id
            }, {
                $push: {
                    'twitter.myPins': myPin
                }
            }, {
                new: true
            }, function (err, result) {
                if (err) throw err;
                User.update({
                    'twitter.id': req.user.twitter.id
                }, {
                    $inc: {
                        'twitter.usedImgID': 1
                    }
                }, {
                    new: true
                }, function (err, result) {
                    if (err) throw err;
                    console.log(result);
                })
            })
        }
    }
}

module.exports = ClickHandler;
