/**
 * Created on 2016/10/20.
 * @fileoverview 请填写简要的文件说明.
 * @author joc (Chen Wen)
 */
require('babel-core/register');
const assert = require('chai').assert;
const Random = require('meteor-random');
const xml = require('../');

describe('xml', function () {
    let id = Random.id(18);
    let obj = {
        Request: {
            $: {
                service: "OrderReverseService",
                lang: "zh-CN"
            },
            Head: {_: '0285717018'},
            Body: [{
                Order: [{
                    $: {
                        orderid: id
                    },
                    Cargo: [{
                        $: {name: '衣服'}
                    }]
                }]
            }]
        }
    };
    let xmlTxt = '\<Request service="OrderReverseService" lang="zh-CN"\>' +
                 '\<Head\>0285717018\</Head\>' +
                 '\<Body\>' +
                 '\<Order orderid="' + id + '"\>' +
                 '\<Cargo name="衣服"/\>' +
                 '\</Order\>' +
                 '\</Body\>' +
                 '\</Request\>';

    describe('#getBuilder', function () {
        it('该方法返回一个函数', function () {
            assert.typeOf(xml.getBuilder(), 'function');
        });
        it('该方法返回的函数，可以将js对象转换为指定格式的xml文本', function () {
            let txt = xml.getBuilder()(obj);
            assert.equal(txt.replace(/(\r)?\n/g, '').replace(/ {2,}/g, ''), xmlTxt);
        });
    });
    describe('#getParser', function () {
        it('该方法返回一个函数', function () {
            assert.typeOf(xml.getParser(), 'function');
        });
        it('该方法返回的函数，可以将xml文本转换为js对象', function (done) {
            xml.getParser()(xmlTxt, function (err, res) {
                assert.deepEqual(res, {
                    Request: {
                        $: {
                            service: "OrderReverseService",
                            lang: "zh-CN"
                        },
                        Head: ['0285717018'],
                        Body: [{
                            Order: [{
                                $: {
                                    orderid: id
                                },
                                Cargo: [{
                                    $: {name: '衣服'}
                                }]
                            }]
                        }]
                    }
                });
                done();
            });
        });
    });
});