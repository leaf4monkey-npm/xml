/**
 * Created on 2016/10/20.
 * @fileoverview 请填写简要的文件说明.
 * @author joc (Chen Wen)
 */
const xml2js = require('xml2js')
const _ = require('lodash');

let builders = {};

/**
 * 获取一个 xml 构造器，该构造器按照预设配置对 js 对象进行格式化，并返回 xml 文本
 * 本质是对 `new xml2js.Builder().buildObject()` 的封装
 * @see https://www.npmjs.com/package/xml2js#xml-builder-usage
 * @param {?Object=} configs
 * @param {boolean} configs.headless - 是否包含头部，默认为 `true`
 * @param {Object} configs.xmldec - 默认值为 `{lang: 'zh-CN'}`
 * @returns {Function}
 */
let getBuilder = (configs = {}) => {
    configs = _.assignIn({
        headless: true,
        xmldec: {lang: 'zh-CN'}
    }, configs);
    let _configs = {};
    _.keys(configs).sort().forEach(key => _configs[key] = configs[key]);
    let key = JSON.stringify(_configs);
    let builder = builders[key] = builders[key] || new xml2js.Builder(configs);
    return (obj, ...args) => builder.buildObject(obj, ...args);
};

/**
 * 获取一个 xml 解析器，该解析器按照预设配置对 xml 文本进行解析，并返回对应的 js 对象
 * 本质是对 `new xml2js.Parser().parseString()` 的封装
 * @see https://www.npmjs.com/package/xml2js#user-content-shoot-and-forget-usage
 * @param {?Object=} configs
 * @returns {Function}
 */
let getParser = (configs) => {
    let parser = new xml2js.Parser(configs);
    return (xml, ...args) => parser.parseString(xml, ...args);
};

/**
 * 使用 xml2js 默认的解析器对 xml 文本进行解析，并返回对应的 js 对象
 * @see https://www.npmjs.com/package/xml2js#user-content-shoot-and-forget-usage
 * @param {String} xml - 需要解析的 xml 文本
 * @param {Object[]} args - `xml2js.parseString()` 序号大于等于 2 的剩余参数列表
 */
let fromXML = (xml, ...args) => xml2js.parseString(xml, ...args);

module.exports = {getBuilder, getParser, fromXML};