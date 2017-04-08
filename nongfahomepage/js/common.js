(function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else {
        root.E = factory(root.jQuery);
    }
}(this, function ($, undefined) {
    'use strict';

    /**
     * ajax获取xml信息
     * @param url   访问地址
     * @param fn    成功后的回调函数
     * @returns {*} XHR
     */
    function ajaxGetResult() {
        var url, fn, async, dataType;

        function error() {
            alert("系统错误，请联系系统管理员");
        }

        url = arguments[0];
        if ($.isFunction(arguments[1])) {
            fn = arguments[1];
            async = arguments[2] == undefined ? true : arguments[2];
            dataType = arguments[3] == undefined ? 'xml' : arguments[3];
        } else {
            async = arguments[1] == undefined ? true : arguments[1];
            dataType = arguments[2] == undefined ? 'xml' : arguments[2];
        }

        if (async) {
            return $.ajax({
                url: url,
                dataType: dataType,
                async: true,
                cache: false,
                error: error,
                success: fn
            });
        } else {
            var result,
                xhr =
                    $.ajax({
                        url: url,
                        dataType: dataType,
                        async: false,
                        cache: false,
                        error: error,
                        success: fn
                    });
            switch (dataType.toLocaleLowerCase()) {
                case 'xml':
                    result = $.parseXML(xhr.responseText);
                    break;
                case 'json':
                    result = $.parseJSON(xhr.responseText);
                    break;
                case 'text':
                    result = xhr.responseText;
                    break;
                default:
                    result = xhr;
                    break;
            }
            return result;
        }
    }

    /**
     * 比较两个时间的大小，如果后面日期大，则返回1，否则返回0
     * @param yr1   日期1的年
     * @param mh1         月
     * @param dy1         日
     * @param hr1         时
     * @param mt1         分
     * @param sd1         秒
     * @param yr2   日期2的年
     * @param mh2         月
     * @param dy2         日
     * @param hr2         时
     * @param mt2         分
     * @param sd2         秒
     * @returns {number}
     */
    function newCompareTime1AndTime2(yr1, mh1, dy1, hr1, mt1, sd1, yr2, mh2, dy2, hr2, mt2, sd2) {
        var t1, t2; // 声明变量。

        t1 = Date.UTC(yr1, mh1 - 1, dy1, hr1, mt1, sd1); // 获取从 1/1/1970 开始的毫秒数。
        t2 = Date.UTC(yr2, mh2 - 1, dy2, hr2, mt2, sd2); // 获取从 1/1/1970 开始的毫秒数。

        // 返回差。
        if (t2 >= t1)
            return (1);
        else

            return (0);

    }

    /**
     * 对Date的扩展，将 Date 转化为指定格式的String
     * @param fmt   月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
     *              年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
     * @returns {*}
     * @constructor Date
     * @example
     * (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
     * (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.Format = function (fmt) { // author: meizz
        var o = {
            "M+": this.getMonth() + 1, // 月份
            "d+": this.getDate(), // 日
            "h+": this.getHours(), // 小时
            "m+": this.getMinutes(), // 分
            "s+": this.getSeconds(), // 秒
            "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
            "S": this.getMilliseconds()
            // 毫秒
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };

    /**
     * 得到日期年月日等加数字后的日期
     * @param interval  年(y)、季度(q)、月(m)、周(w)、日(d)、小时(h)、分(n)、秒(s)、毫秒(ms) 可以用 1-2 个占位符
     * @param number    增加的数值
     * @returns {Date}
     */
    Date.prototype.dateAdd = function (interval, number) {
        var t = parseInt(number, 10);
        var d = this;
        var k = {
            'y': 'FullYear',
            'q': 'Month',
            'm': 'Month',
            'w': 'Date',
            'd': 'Date',
            'h': 'Hours',
            'n': 'Minutes',
            's': 'Seconds',
            'ms': 'MilliSeconds'
        };
        var n = {
            'q': 3,
            'w': 7
        };
        eval('d.set' + k[interval] + '(d.get' + k[interval] + '()+' + ((n[interval] || 1) * t) + ')');
        return d;
    };

    /**
     * 计算两日期相差的日期年月日等
     * @param interval  年(y)、季度(q)、月(m)、周(w)、日(d)、小时(h)、分(n)、秒(s)、毫秒(ms) 可以用 1-2 个占位符
     * @param objDate2  比较的日期
     * @returns {Number}
     */
    Date.prototype.dateDiff = function (interval, objDate2) {
        var d = this,
            i = {},
            t = d.getTime(),
            t2 = objDate2.getTime();
        i['y'] = objDate2.getFullYear() - d.getFullYear();
        i['q'] = i['y'] * 4 + Math.floor(objDate2.getMonth() / 4) - Math.floor(d.getMonth() / 4);
        i['m'] = i['y'] * 12 + objDate2.getMonth() - d.getMonth();
        i['ms'] = objDate2.getTime() - d.getTime();
        i['w'] = Math.floor((t2 + 345600000) / (604800000)) - Math.floor((t + 345600000) / (604800000));
        i['d'] = Math.floor(t2 / 86400000) - Math.floor(t / 86400000);
        i['h'] = Math.floor(t2 / 3600000) - Math.floor(t / 3600000);
        i['n'] = Math.floor(t2 / 60000) - Math.floor(t / 60000);
        i['s'] = Math.floor(t2 / 1000) - Math.floor(t / 1000);
        return i[interval];
    };

    if (typeof String.prototype.startsWith != 'function') {
        /**
         * 判断字符串是否以摸个字符串开头
         * @param prefix    字符串
         * @returns {boolean}
         */
        String.prototype.startsWith = function (prefix) {
            return this.slice(0, prefix.length) === prefix;
        };
    }

    if (typeof String.prototype.endsWith != 'function') {
        /**
         * 判断字符串是否以摸个字符串结尾
         * @param suffix    字符串
         * @returns {boolean}
         */
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    if (typeof Number.prototype.toFixed != 'function') {
        /**
         * 指定保留的小数位数
         * @param n 位数
         * @returns {number}
         */
        Number.prototype.toFixed = function (n) {
            var f = Math.pow(10, n);
            return Math.round(this * f) / f;
        };
    }

    /**
     * url查询条件对象
     * @param url   连接地址
     * @constructor Object
     */
    var QueryString = function (url) {
        this.urlParams = {};
        this.load(url);
    };

    QueryString.prototype = {
        /**
         * 初始化参数对象，默认对当前URL进行处理
         * @param param RUL
         * @returns {QueryString}
         */
        load: function (param) {
            this.urlParams = {};
            var e, k, v, i,
                a = /\+/g, // Regex for replacing addition symbol with a space
                r = /([^&=]+)=?([^&]*)/g,
                d = function (s) {
                    return decodeURIComponent(s.replace(a, " "));
                };
            if (!param) {
                param = window.location.search;
            }
            if (param.charAt(0) == '?') {
                param = param.substring(1);
            } else {
                i = param.indexOf('?');
                if (i > -1) {
                    param = param.substring(i + 1);
                }
            }
            while (e = r.exec(param)) {
                k = d(e[1]);
                v = d(e[2]);
                this.set(k, v, false);
            }
            return this;
        },
        /**
         * 将参数对象转换成字符串
         * @param options
         * {
		 *  hash    是否带有当前浏览器的锚点参数
		 *  traditional 是否为传统转换
		 * }
         * @returns {string}
         */
        toString: function (options) {
            var settings = {
                'hash': false,
                'traditional': true
            };
            if (options) {
                $.extend(settings, options);
            }
            var old = jQuery.ajaxSettings.traditional;
            jQuery.ajaxSettings.traditional = settings.traditional;
            var result = '?' + $.param(this.urlParams);
            jQuery.ajaxSettings.traditional = old;
            if (settings.hash)
                result = result + window.location.hash;
            return result;
        },
        /**
         * 设置参数
         * @param k 参数名
         * @param v 参数值
         * @param replace   是否替换
         * @returns {QueryString}
         */
        set: function (k, v, replace) {
            replace = replace || false;
            if (replace)
                this.urlParams[k] = v;
            else {
                if (k in this.urlParams) {
                    if ($.type(this.urlParams[k]) === 'array') {
                        this.urlParams[k].push(v);
                    } else {
                        if (this.urlParams[k] == '')
                            this.urlParams[k] = v;
                        else
                            this.urlParams[k] = [this.urlParams[k], v];
                    }
                } else
                    this.urlParams[k] = v;
            }
            return this;
        },
        /**
         * 获取参数值
         * @param k 参数名称
         * @returns {*}
         */
        get: function (k) {
            return this.urlParams[k];
        },
        /**
         * 删除参数
         * @param k 参数名称
         * @returns {QueryString}
         */
        remove: function (k) {
            if (k in this.urlParams) {
                delete this.urlParams[k];
            }
            return this;
        }
    };

    var curUserGW;

    /**
     * 判断当前用户是否包含某个岗位
     * @param name  岗位名称
     * @returns {boolean}
     */
    function includGW(name) {
        var re = new RegExp('(^|,)\\s*' + name + '\\s*(,|$)');
        return re.test(curUserGW);
    }

    var userRoles;

    /**
     * 判断当前用户是否包含某个权限
     * @param name  权限名称(ACL名称)
     * @returns {boolean}
     */
    function includRole(name) {
        var re = new RegExp('(^|;)\\s*\\[' + name + '\\]\\s*(;|$)');
        return re.test(userRoles);
    }

    /**
     * 获取XML节点列表
     * @param node  操作文档
     * @param str   选择器
     * @returns {*|jQuery}
     */
    //  function selectNodes(node, str) {
    //      var el = $.trim(str.replace(/\/+/g, ' ').replace('@', ''));
    //      return $(node).find(el);
    //  }

    /**
     * 获取XML单个
     * @param node    操作文档
     * @param str   选择器
     * @returns {*|jQuery}
     */
    //  function selectSingleNode(node, str) {
    //      var list = selectNodes(node, str);
    //      return list && list[0];
    //  };

    /**
     * 将strB从strA中删除
     * @param strA
     * @param strB
     * @returns {String}
     */
    function RemoveStr(strA, strB) {
        return strA.replace(strB, "").replace(/^,+|,+$/, "").replace(",,", ",");
    }

    /**
     * 去掉数组中的重复元素
     * @param arr    待处理数组
     * @returns {Array}
     */
    function FilterArray(arr) {
        var res = [];
        var json = {};
        for (var i = 0; i < arr.length; i++) {
            if (!json[arr[i]]) {
                res.push(arr[i]);
                json[arr[i]] = 1;
            }
        }
        return res;
    }

    /**
     * 将字符串转换为unicode编码
     * @param sstr  字符串
     * @returns {String}
     */
    function getUnicodeString(sstr) {
        var unicodestr = "";
        for (var i = 0; i < sstr.length; i++) {
            unicodestr = unicodestr + sstr.charCodeAt(i) + ";";
        }
        return unicodestr;
    }

    /**
     * 将Unicode转换成字符串
     * @param codeStr  Unicode编码
     * @returns {String}
     */
    function UnicodeToStr(codeStr) {
        var returnStr = "";
        var codeList = codeStr.split(",");
        for (var i = 0; i < codeList.length; i++) {
            returnStr = returnStr + String.fromCharCode(codeList[i]);
        }
        return returnStr;
    }

    /**
     * 判断IE支持的XML对象
     * @returns {string}
     * @constructor
     */
    function E_getControlPrefix() {
        var prefixes = ['MSXML2', 'Microsoft', '@Microsoft', 'MSXML', 'MSXML3'];
        var o, o2;
        for (var i = 0; i < prefixes.length; i++) {
            try {
                // try to create the objects
                o = new ActiveXObject(prefixes[i] + '.XmlHttp');
                o2 = new ActiveXObject(prefixes[i] + '.XmlDom');
                return prefixes[i];
            } catch (ex) {
            }
        }
    }

    /**
     * XML加载
     * @param  {[type]} url [description]
     * @return {[type]}       [description]
     */
    function loadXMLDoc(xmlFile) {
        var xmlDom = null;
        if (typeof(xmlFile) === 'string') {
            if (xmlFile.substr(0, 1) === '<') {
                if (!!window.ActiveXObject || 'ActiveXObject' in window) { //支持IE浏览器，可跨域
                    xmlDom = new ActiveXObject('Microsoft.XMLDOM');
                    xmlDom.async = false;
                    xmlDom.loadXML(xmlFile); //如果用的是xml文件。
                    return xmlDom;
                } else {
                    var parseXml = new DOMParser();
                    xmlDom = parseXml.parseFromString(xmlFile, 'text/xml');
                }
            } else {
                try {
                    if (!!window.ActiveXObject || 'ActiveXObject' in window) { //支持IE浏览器，可跨域
                        xmlDom = new ActiveXObject('Microsoft.XMLDOM');
                        xmlDom.async = false;
                        xmlDom.load(xmlFile); //如果用的是xml文件。
                        return xmlDom;
                    } else if (document.implementation && document.implementation.createDocument) { //支持火狐浏览器，可跨域
                        xmlDom = document.implementation.createDocument('', '', null);
                        xmlDom.async = false;
                        xmlDom.load(xmlFile);
                        return xmlDom;
                    }
                } catch (ex) {
                    var xmlhttp = new window.XMLHttpRequest();
                    var parseXml = new DOMParser();
                    xmlhttp.open('GET', xmlFile, false);
                    xmlhttp.send(null);
                    xmlDom = xmlhttp.responseXML || parseXml.parseFromString(xmlhttp.responseText, "text/xml");
                }
            }
        }

        return xmlDom;
    }

    /**
     * 以XSL转换XML
     * @param  {[type]} xmlpath     [description]
     * @param  {[type]} xslpath     [description]
     * @param  {[type]} orderColumn [排序字段]
     * @param  {[type]} type        [排序方式]
     * @return {[type]}             [description]
     */
    function transformNode(xmlpath, xslpath, orderColumn, type) {
        var xml = loadXMLDoc(xmlpath),
            xsl = loadXMLDoc(xslpath),
            resultDocument;
        var newDtd = /http:\/\/www\.w3\.org\/1999\/xsl\/transform/gi;

        if (orderColumn) {
            var dtd = $(xsl).find('stylesheet,xsl\\:stylesheet').attr('xmlns:xsl');
            if (newDtd.test(dtd)) {
                if (type === "-") {
                    type = "ascending";
                } else {
                    type = "descending";
                }
                $(xsl).find('sort,xsl\\:sort').attr('select', 'item[@name="' + orderColumn + '"]').attr('order', type);
            } else {
                type = type || '+';
                $(xsl).find('[order-by]').attr('order-by', type + 'number(item[@name="' + orderColumn + '"])');
            }
        }

        // code for IE
        if (!!window.ActiveXObject || 'ActiveXObject' in window) {
            resultDocument = xml.transformNode(xsl);
            return resultDocument;
        }
        // code for Mozilla, Firefox, Opera, etc.
        else if (document.implementation && document.implementation.createDocument) {
            var xsltProcessor = new XSLTProcessor();
            xsltProcessor.importStylesheet(xsl);
            var result = xsltProcessor.transformToDocument(xml);
            var xmls = new XMLSerializer();
            resultDocument = result && xmls.serializeToString(result) || '';
            return resultDocument;
        }
    }

    /**
     * 选取选中复选框
     * @param checkname  checkbox的name值
     * @param selectstr  checkbox的value值 ,例如:"name;age;sex;"
     */
    function SelectCheck(checkname, selectstr) {
        var chks = document.getElementsByName(checkname),
            rpt = ',;',
            reg;
        for (var j = chks.length; j--;) {
            if (chks[j].value) {
                reg = new RegExp('(^|[' + rpt + '])' + chks[j].value.replace(/ /gi, '') + '([' + rpt + ']|$)');
                if (reg.test(selectstr)) {
                    chks[j].checked = true;
                }
            }
        }
    }

    /**
     * 选择页面dom元素
     * @param str  name/id
     * @returns {*}
     * @constructor
     */
    function getElement(str, document) {
        var node;
        if (typeof(str) === 'string' && document && document.nodeName === '#document') {
            node = document.getElementById(str);
            if (node) {
                return node;
            }
            var list = document.getElementsByName(str);
            if (list.length > 1) {
                return list;
            }
            if (!list[0] && window.console && console.warn) {
                console.warn('未选中页面元素：' + str);
            }
            return list[0];
        }
    }

    /**
     * 循环获取子页面中的元素
     * @param list
     * @param document
     * @returns {*}
     */
    function getElementLoop(list, document) {
        if ($.isArray(list)) {
            var node = getElement(list.shift(1), document);
            if (list.length && node.nodeName === 'IFRAME') {
                return getElementLoop(list, node.contentWindow && node.contentWindow.document);
            } else {
                return node;
            }
        }
    }

    /**
     * 元素选择
     * @param str
     * @returns {*}
     * @constructor
     */
    function E(str) {
        if (typeof(str) === 'string') {
            var list = str.split('.');
            return getElementLoop(list, window.document);
        }
    }

    /**
     * 获取opener中的元素
     * @param str
     * @returns {*}
     */
    function getOpenerElement(str) {
        if (window.opener) {
            return getElement(str, window.opener.document);
        }
    }

    /**
     * 获取父节点的opener中的元素
     * @param str
     * @returns {*}
     */
    function getParantOpenerElement(str) {
        if (window.parent.opener) {
            return getElement(str, window.parent.opener.document);
        }
    }

    /**
     * 关闭当前窗口
     */
    function close() {
        var target;
        if (this instanceof Window) {
            target = this;
        } else {
            target = window;
        }

        target.opener = null;
        target.open('', '_top');
        target.top.close();
    }

    /**
     * 保存正文&附件 pengte 20170113
     */
    function saveWordAndAtteach() {
        //保存正文
        $("#tabZW").contents().find("#btn_saveWordDoc").click();
        //保存附件
        $("#tabATT").contents().find("#btn_SaveAttachDoc").click();
    }

    /**
     * 打印流程信息
     * @param id 打印元素ID
     * @returns {*}
     * @constructor
     */
    function printToWord(id) {
        var oWD = new ActiveXObject("Word.Application");
        var oDC = oWD.Documents.Add("", 0, 1);
        var oRange = oDC.Range(0, 1);
        var sel = document.body.createTextRange();
        sel.moveToElementText(id);
        sel.select();
        sel.execCommand("Copy");
        oRange.Paste();
        oWD.Application.Visible = true;
    }

    /**
     * 从绝对地址中得到应用文档的唯一ID
     * @returns {*}
     */
    function getunid() {
        if (location.href.toLowerCase().indexOf("?openform") != -1) {
            return false;
        }
        var regValue = /[^\/]+$/.exec(location.pathname);
        return regValue && regValue[0]
    }

    /**
     * 禁止回车换行
     * @returns {*}
     */
    function keyenter(event) {
        event = event || window.event;
        if (event.keyCode == 13) {
            event.returnValue = false;
            alert("禁止回车换行")
            $(this).val('').focus();
        }
    }


    $.extend(E, {
        log: window.console && window.console.log,
        error: window.console && window.console.error,
        warn: window.console && window.console.warn,
        ajaxGetResult: ajaxGetResult,
        newCompareTime1AndTime2: newCompareTime1AndTime2,
        includGW: includGW,
        includRole: includRole,
        //      query: new QueryString(),
        RemoveStr: RemoveStr,
        FilterArray: FilterArray,
        getUnicodeString: getUnicodeString,
        UnicodeToStr: UnicodeToStr,
        SelectCheck: SelectCheck,
        loadXMLDoc: loadXMLDoc,
        transformNode: transformNode,
        P: getOpenerElement,
        PP: getParantOpenerElement,
        close: close,
        saveWordAndAtteach: saveWordAndAtteach,
        printToWord: printToWord,
        getunid: getunid,
        keyenter: keyenter
    });

    $(function () {
        /**
         * 公共域信息获取
         */
            //当前用户岗位
        curUserGW = $('[name=CurUserGW]').val();
        //当前用户权限
        userRoles = $('[name=userRoles]').val();
        //当前日期
        var today = $('[name=today]').val();
        $.extend(E, {
            DataBase: $('[name=DataBase]').val(),
            DataDbpath: $('[name=DataDbName]').val(),
            ViewName: $('[name=ViewName]').val(),
            curuser: $.trim($('[name=curuser]').val()),
            CurBankID: $('[name=CurBankID]').val(),
            regusername: $.trim($('[name=regusername]').val()),
            filepath: $('[name=filepath]').val(),
            CurUserGW: curUserGW,
            userRoles: userRoles,
            strdate: today ? new Date(today.replace(/-/g, '/')) : new Date()
        });

        $('.dropdown').click(function (e) {
            var node = $(this).siblings('.dropdown-menu').toggle();
            $('.dropdown-menu').not(node).hide();
            e.stopPropagation();
        });
        $(document).click(function () {
            $('.dropdown-menu').hide();
        });
    });
    return E;
}));