(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var SmartView_1 = __webpack_require__(2);
	var Params_1 = __webpack_require__(9);
	var IframeClickTracker_1 = __webpack_require__(10);
	var AdInformation_1 = __webpack_require__(11);
	var Http_1 = __webpack_require__(13);
	var RequestObj_1 = __webpack_require__(15);
	var Moq = (function () {
	    function Moq() {
	        var _this = this;
	        this.trackStart = false;
	        this.viewDuration = 0;
	        this.updateDuration = 0;
	        this.hidden = 'hidden';
	        this.count = 1;
	        this.activeIntersection = false;
	        this.intersectionView = false;
	        this.testMethod = 0;
	        this.clicked = 0;
	        this.getAdElement = function () {
	            //console.log('getAdElement');
	            if (!_this.ad) {
	                _this.searchNodes(_this.myScript.parentNode);
	            }
	        };
	        this.searchNodes = function (node) {
	            var self = _this;
	            if (node.nodeType == 1) {
	                if (node.hasChildNodes) {
	                    var sonnodes = node.childNodes;
	                    for (var i = 0; i < sonnodes.length; i++) {
	                        var sonnode = sonnodes.item(i);
	                        if (sonnode.nodeName !== 'SCRIPT') {
	                            if (sonnode.scrollWidth && sonnode.scrollHeight) {
	                                if (_this.btw5(sonnode.scrollWidth, _this.params.reqw) && _this.btw5(sonnode.scrollHeight, _this.params.reqh)) {
	                                    _this.ad = sonnode;
	                                    if (_this.ad.tagName === 'IFRAME') {
	                                        new IframeClickTracker_1.IframeClickTracker().track(_this.ad, function () {
	                                            window.clicked = self.clicked += 1;
	                                            self.updateTrackObj(ApiAction.clicked);
	                                        });
	                                    }
	                                    else {
	                                        _this.ad.addEventListener('click', function () {
	                                            window.clicked = self.clicked += 1;
	                                            self.updateTrackObj(ApiAction.clicked);
	                                        });
	                                    }
	                                    _this.ad.style.msTouchAction = 'manipulation';
	                                    _this.ad.style.touchAction = 'manipulation';
	                                    // alert(this.ad);
	                                    break;
	                                }
	                            }
	                            _this.searchNodes(sonnode);
	                        }
	                    }
	                }
	            }
	        };
	        this.btw5 = function (val, limit) {
	            return val >= limit - 10 && val <= limit + 10;
	        };
	        this.onchange = function (evt) {
	            var v = 'visible', h = 'hidden';
	            var evtMap;
	            evtMap = {
	                focus: v, focusin: v, pageshow: v, blur: h, focusout: h, pagehide: h
	            };
	            evt = evt || window.event;
	            if (evt.type in evtMap)
	                _this.isHidden = evtMap[evt.type] == h;
	            else
	                _this.isHidden = document.hidden;
	            //console.log('is hidden :' + this.isHidden);
	        };
	        this.parseQuery = function (query) {
	            var Params = {};
	            if (!query)
	                return Params; // return empty object
	            var Pairs = query.split(/[;&]/);
	            for (var i = 0; i < Pairs.length; i++) {
	                var KeyVal = Pairs[i].split('=');
	                if (!KeyVal || KeyVal.length != 2)
	                    continue;
	                var key = KeyVal[0];
	                var val = KeyVal[1];
	                val = val.replace(/\+/g, ' ');
	                Params[key] = { prop: val };
	            }
	            return Params;
	        };
	        this.GetTrackObj = function () {
	            return _this.adInformation;
	        };
	        this.updateTrackObj = function (action) {
	            //create a request object
	            var requestObj = new RequestObj_1.RequestObj(action, _this.params.impid);
	            // set a update data
	            requestObj.data = _this.adInformation;
	            //call remote api
	            var http = new Http_1.Http().apiCall(requestObj);
	        };
	        this.startTracking = function () {
	            _this.tracker = setInterval(_this.tracking, 100);
	            setTimeout(_this.stopTracker, 1000 * 300);
	        };
	        this.tracking = function () {
	            var isView = false;
	            //update initial infor 
	            if (!_this.trackStart) {
	                _this.trackStart = true;
	                _this.updateTrackObj(ApiAction.init);
	            }
	            // if (typeof this.ad === 'undefined' || this.ad === null) {
	            if (!_this.ad) {
	                _this.getAdElement();
	            }
	            if (!_this.ad) {
	                // alert('no ad')
	                return;
	            }
	            // if (typeof this.viewAbility === 'undefined') {
	            if (!_this.viewAbility) {
	                var m = _this.testMethod;
	                var viewAbility = new SmartView_1.SmartView(_this.ad);
	                _this.viewAbility = viewAbility.getMethod(m);
	                _this.methodName = viewAbility.methodName;
	                //console.log(this.methodName);
	            }
	            if (!_this.viewAbility) {
	                // alert('no method')
	                return;
	            }
	            isView = typeof _this.viewAbility === 'undefined' ? false : (_this.viewAbility.isView() && !_this.isHidden);
	            window.isAdView = isView;
	            window.isActive = !_this.isHidden;
	            // alert('view:'+window.isAdView+'  Active:'+window.isActive)
	            //console.log('isAdView:' + window.isAdView + 'isActive:' + window.isActive)
	            //update tos and view duration
	            if (_this.adInformation.timeOnSite < 120 * 1000) {
	                // if in view add tos and view time 
	                if (isView) {
	                    _this.adInformation.timeOnSite += 100;
	                    _this.viewDuration += 100;
	                    //set longest v
	                    if (_this.adInformation.viewDuration < _this.viewDuration) {
	                        _this.adInformation.viewDuration = _this.viewDuration;
	                    }
	                    if (_this.adInformation.timeOnSite < 1000) {
	                        _this.updates();
	                    }
	                    else if (_this.adInformation.timeOnSite < 10 * 1000) {
	                        if (_this.checkUpdateTime(_this.adInformation.timeOnSite, 1000)) {
	                            _this.updates();
	                        }
	                    }
	                    else {
	                        if (_this.checkUpdateTime(_this.adInformation.timeOnSite, 5 * 1000)) {
	                            _this.updates();
	                        }
	                    }
	                }
	                else {
	                    _this.viewDuration = 0;
	                }
	            }
	        };
	        this.checkUpdateTime = function (tos, seed) {
	            return tos % seed ? false : true;
	        };
	        this.updates = function () {
	            var sec = Math.floor(_this.adInformation.viewDuration / 1000);
	            if (_this.updateDuration < sec) {
	                _this.updateDuration = sec;
	                _this.updateView();
	            }
	            _this.updateTOS();
	        };
	        this.updateTOS = function () {
	            //create a request object
	            var requestObj = new RequestObj_1.RequestObj(ApiAction.tos, _this.params.impid);
	            // set a update data
	            requestObj.data = { timeOnSite: _this.adInformation.timeOnSite };
	            //call remote api
	            var http = new Http_1.Http().apiCall(requestObj);
	        };
	        this.updateView = function () {
	            //create a request object
	            var requestObj = new RequestObj_1.RequestObj(ApiAction.view, _this.params.impid);
	            // set a update data
	            requestObj.data = { viewDuration: _this.adInformation.viewDuration };
	            //call remote api
	            var http = new Http_1.Http().apiCall(requestObj);
	        };
	        this.updateClick = function () {
	            //create a request object
	            var requestObj = new RequestObj_1.RequestObj(ApiAction.view, _this.params.impid);
	            // set a update data
	            requestObj.data = _this.adInformation;
	            //call remote api
	            var http = new Http_1.Http().apiCall(requestObj);
	        };
	        this.stopTracker = function () {
	            clearInterval(_this.tracker);
	        };
	        this.test = function () {
	            alert('work!');
	        };
	        this.iframeClickTest = function () {
	            var info = document.createElement('h1');
	            info.innerText = '0';
	            document.body.appendChild(info);
	            new IframeClickTracker_1.IframeClickTracker().track(_this.ad, function () {
	                info.innerText = (parseInt(info.innerText) + 1).toString();
	            });
	        };
	        if (this.hidden in document)
	            document.addEventListener('visibilitychange', this.onchange);
	        else if ((this.hidden = 'mozHidden') in document)
	            document.addEventListener('mozvisibilitychange', this.onchange);
	        else if ((this.hidden = 'webkitHidden') in document)
	            document.addEventListener('webkitvisibilitychange', this.onchange);
	        else if ((this.hidden = 'msHidden') in document)
	            document.addEventListener('msvisibilitychange', this.onchange);
	        else if ('onfocusin' in document)
	            document.onfocusin = document.onfocusout = this.onchange;
	        else
	            window.onpageshow = window.onpagehide
	                = window.onfocus = window.onblur = this.onchange;
	        if (document.hidden !== undefined)
	            this.onchange({ type: document.hidden ? 'blur' : 'focus' });
	        var scripts = document.getElementsByTagName('script');
	        var re = /moq.js/gi;
	        for (var i = 0; i < scripts.length; i++) {
	            if (scripts[i].outerHTML.search(re) != -1) {
	                this.myScript = scripts[i];
	                break;
	            }
	        }
	        var queryString = this.myScript.src.replace(/^[^\?]+\??/, '');
	        this.srcParm = this.parseQuery(queryString);
	        try {
	            var args = new Params_1.Params();
	            args.impid = this.srcParm['impid'].prop;
	            args.ep = this.srcParm['ep'].prop;
	            args.reqh = parseInt(this.srcParm['reqh'].prop);
	            args.reqw = parseInt(this.srcParm['reqw'].prop);
	            this.params = args;
	            this.testMethod = parseInt(this.srcParm['test'].prop);
	        }
	        catch (error) {
	            console.log(error);
	        }
	        this.adInformation = new AdInformation_1.AdInformation();
	        this.getAdElement();
	    }
	    return Moq;
	}());
	exports.Moq = Moq;
	new Moq().startTracking();
	var ApiAction = (function () {
	    function ApiAction() {
	    }
	    return ApiAction;
	}());
	ApiAction.clicked = 'clicked';
	ApiAction.tos = 'tos';
	ApiAction.init = 'init';
	ApiAction.view = 'view';


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MraidAPI_1 = __webpack_require__(3);
	var SafeFrame_1 = __webpack_require__(4);
	var RequestAnimationFrame_1 = __webpack_require__(6);
	var IntersectionObserverAPI_1 = __webpack_require__(7);
	var Geometry_1 = __webpack_require__(8);
	var SmartView = (function () {
	    function SmartView(el) {
	        var _this = this;
	        this.methodName = '';
	        this.getMethod = function (m) {
	            switch (m) {
	                case 0:
	                    var geometry = new Geometry_1.Geometry(_this.ad);
	                    if (geometry.isSupported()) {
	                        _this.methodName = 'geometry';
	                        return geometry;
	                    }
	                    var intersectionObserverAPI = new IntersectionObserverAPI_1.IntersectionObserverAPI(_this.ad);
	                    if (intersectionObserverAPI.isSupported()) {
	                        _this.methodName = 'intersectionObserver';
	                        return intersectionObserverAPI;
	                    }
	                    var safeFrame = new SafeFrame_1.SafeFrame(_this.ad);
	                    if (safeFrame.isSupported()) {
	                        _this.methodName = 'safeFrame';
	                        return safeFrame;
	                    }
	                    var requestAnimationFrame = new RequestAnimationFrame_1.RequestAnimationFrame(_this.ad);
	                    if (requestAnimationFrame.isSupported()) {
	                        _this.methodName = 'requestAnimationFrame';
	                        return requestAnimationFrame;
	                    }
	                    var mraidAPI = new MraidAPI_1.MraidAPI();
	                    if (mraidAPI.isSupported()) {
	                        _this.methodName = 'mraid';
	                        return mraidAPI;
	                    }
	                    break;
	                case 1:
	                    _this.methodName = 'geometry';
	                    return new Geometry_1.Geometry(_this.ad);
	                case 2:
	                    _this.methodName = 'intersectionObserver';
	                    return new IntersectionObserverAPI_1.IntersectionObserverAPI(_this.ad);
	                case 3:
	                    _this.methodName = 'safeFrame';
	                    return new SafeFrame_1.SafeFrame(_this.ad);
	                case 4:
	                    _this.methodName = 'requestAnimationFrame';
	                    return new RequestAnimationFrame_1.RequestAnimationFrame(_this.ad);
	                case 5:
	                    _this.methodName = 'mraid';
	                    return new MraidAPI_1.MraidAPI();
	                default:
	                    return null;
	            }
	            return null;
	        };
	        this.ad = el;
	    }
	    return SmartView;
	}());
	exports.SmartView = SmartView;


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MraidAPI = (function () {
	    function MraidAPI() {
	        var _this = this;
	        this.isReady = false;
	        this.isView = function () {
	            return mraid.isViewable();
	        };
	        this.doReadyCheck = function () {
	            if (mraid.getState() == 'loading') {
	                mraid.addEventListener('ready', _this.mraidIsReady);
	            }
	            else {
	                _this.isReady = true;
	            }
	        };
	        this.mraidIsReady = function () {
	            mraid.removeEventListener('ready', _this.mraidIsReady);
	        };
	        this.isSupported = function (cb) {
	            var status = true;
	            if (_this.isReady) {
	                status = false;
	            }
	            if (typeof cb === 'function') {
	                cb(status);
	            }
	            return status;
	        };
	        if (typeof mraid !== 'undefined') {
	            this.doReadyCheck();
	        }
	    }
	    return MraidAPI;
	}());
	exports.MraidAPI = MraidAPI;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var config = __webpack_require__(5);
	var SafeFrame = (function () {
	    function SafeFrame(el) {
	        var _this = this;
	        this.isSupported = function (cb) {
	            var status = true;
	            if (typeof _this.extern === 'undefined') {
	                status = false;
	            }
	            if (typeof _this.ad === 'undefined') {
	                status = false;
	            }
	            if (typeof cb === 'function') {
	                cb(status);
	            }
	            return status;
	        };
	        this.isOk = false;
	        this.inView = false;
	        /**
	    * This is the event listener to capture events from the publisher host page.
	    */
	        this.statusUpdate = function (status, data) {
	            //debugger;
	            if (status == 'expanded') {
	            }
	            else if (status == 'geom-update') {
	                _this.updateInView();
	            }
	        };
	        this.isView = function () {
	            return _this.inView;
	        };
	        this.updateInView = function () {
	            console.log('Percentage:' + _this.extern.inViewPercentage());
	            var ratio = _this.ad.scrollWidth * _this.ad.scrollHeight >= config.largeSize ? config.largeReduce : config.defaultReduce;
	            _this.inView = _this.extern.inViewPercentage() >= ratio * 100 ? true : false;
	            console.log(_this.isView());
	        };
	        this.register = function () {
	            if (_this.extern) {
	                try {
	                    _this.extern.register(_this.ad.scrollWidth, _this.ad.scrollHeight, _this.statusUpdate);
	                }
	                catch (e) {
	                    console.log('Exception or no safeframes available: ' + e.message);
	                }
	            }
	        };
	        this.ad = el;
	        if (typeof $sf !== 'undefined' || typeof window.extern !== 'undefined')
	            this.extern = $sf.ext;
	        if (this.isSupported())
	            this.register();
	    }
	    return SafeFrame;
	}());
	exports.SafeFrame = SafeFrame;


/***/ }),
/* 5 */
/***/ (function(module, exports) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.largeSize = 242500;
	exports.largeReduce = 0.3;
	exports.defaultReduce = 0.5;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	window.performance = window.performance || {};
	performance.now = (function () {
	    return performance.now ||
	        performance.mozNow ||
	        performance.msNow ||
	        performance.oNow ||
	        performance.webkitNow ||
	        function () {
	            return new Date().getTime();
	        };
	})();
	var RequestAnimationFrame = (function () {
	    function RequestAnimationFrame(el) {
	        var _this = this;
	        this.delta = 250;
	        this.viewable = false;
	        this.last = 0;
	        this.test = function () {
	            var isPass = false;
	            var self = _this;
	            var time = self.time();
	            if (!self.isWiredOk()) {
	                _this.passTest = false;
	            }
	            self.move(window.screen.width + 5000, window.screen.height + 5000);
	            cm.doYieldMsec(function () {
	                if (self.isView()) {
	                    this.passTest = false;
	                }
	                this.passTest = true;
	                self.move(-5000, -5000);
	            }, 100);
	        };
	        this.time = function () {
	            return performance.now();
	        };
	        this.listen = function () {
	            var self = _this;
	            self.last = 0; /* last time we received an update */
	            window.addEventListener('message', function (e) {
	                var time = self.time();
	                var diff = (time - self.last);
	                self.last = time;
	                var old = self.delta;
	                self.delta = Math.round((self.delta + diff) / 2);
	            });
	        };
	        this.isWiredOk = function () {
	            return (_this.last > 0);
	        };
	        this.isView = function () {
	            if (_this.isSupported())
	                return false;
	            var avg = (((_this.time() - _this.last) + _this.delta) / 2);
	            return (avg < 55);
	        };
	        this.move = function (x, y) {
	            _this.frame.style.top = y + 'px';
	            _this.frame.style.left = x + 'px';
	        };
	        var frame = document.createElement('iframe');
	        el.parentNode.appendChild(frame);
	        frame.id = 'VisFrame1';
	        frame.style.width = '4px';
	        frame.style.height = '4px';
	        frame.style.backgroundColor = 'blue';
	        frame.style.verticalAlign = 'top';
	        frame.scrolling = 'no';
	        frame.frameBorder = '0';
	        var top = el.offsetTop;
	        var left = el.offsetLeft;
	        var width = el.offsetWidth;
	        var height = el.offsetHeight;
	        while (el.offsetParent) {
	            el = el.offsetParent;
	            top += el.offsetTop;
	            left += el.offsetLeft;
	        }
	        frame.style.marginTop = '-' + Math.round((height + top) / 2) + 'px';
	        frame.style.marginLeft = Math.round((width + left) / 2) + 'px';
	        this.listen();
	        this.frame = frame;
	        frame.src = 'data:text/html;charset=UTF-8,' + '<html><head></head><body><script>window.parent.postMessage("yo","*"); function call(){window.parent.postMessage("hi","*"),window.requestAnimationFrame(call)}call();</script></body></html>';
	        //this.test();
	    }
	    RequestAnimationFrame.prototype.isSupported = function (cb) {
	        if (typeof requestAnimationFrame == 'undefined' || typeof this.ad == 'undefined' || this.ad == null || !this.passTest) {
	            return false;
	        }
	        return true;
	    };
	    return RequestAnimationFrame;
	}());
	exports.RequestAnimationFrame = RequestAnimationFrame;
	var cm = (function () {
	    function cm() {
	    }
	    cm.doYieldMsec = function (fn, msec) {
	        window.setTimeout(function () {
	            window.setTimeout(fn, 10);
	        }, msec);
	    };
	    cm.log = function (msg) {
	        var e = document.createElement('p');
	        e.innerHTML = Math.round(performance.now()) + '<span style=\'padding-left: 15px; color: #666\'>' + msg + '</span>';
	        document.getElementById('msgs').appendChild(e);
	    };
	    cm.testResult = function (passed, msg) {
	        if (msg === void 0) { msg = ''; }
	        if (msg) {
	            this.log(msg);
	            document.getElementById('testMsg').innerText = msg;
	        }
	        var el = document.getElementById('testResult');
	        if (passed) {
	            el.innerText = 'PASSED';
	            el.style.color = 'green';
	        }
	        else {
	            el.innerText = 'FAILED';
	            el.style.color = 'red';
	            document.getElementById('testMsg').innerText = msg;
	        }
	    };
	    return cm;
	}());


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var config = __webpack_require__(5);
	var IntersectionObserverAPI = (function () {
	    function IntersectionObserverAPI(el) {
	        var _this = this;
	        this.isView = function () {
	            return _this.inView;
	        };
	        this.ad = el;
	        var ratio = this.ad.scrollWidth * this.ad.scrollHeight >= config.largeSize ? config.largeReduce : config.defaultReduce;
	        console.log('duration:' + ratio);
	        var observer = new IntersectionObserver(function (enters) {
	            if (enters[0].intersectionRatio < ratio) {
	                _this.inView = false;
	            }
	            else {
	                _this.inView = true;
	            }
	        }, {
	            threshold: [ratio]
	        });
	        observer.observe(this.ad);
	    }
	    IntersectionObserverAPI.prototype.isSupported = function (cb) {
	        var status = true;
	        if (typeof this.ad === 'undefined' || this.ad == null || typeof IntersectionObserver === 'undefined') {
	            status = false;
	        }
	        if (typeof cb === 'function') {
	            cb(status);
	        }
	        return status;
	    };
	    return IntersectionObserverAPI;
	}());
	exports.IntersectionObserverAPI = IntersectionObserverAPI;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Geometry = (function () {
	    function Geometry(el) {
	        var _this = this;
	        this.isView = function () {
	            if (!_this.isSupported()) {
	                return false;
	            }
	            var el = _this.ad;
	            var top = el.offsetTop;
	            var left = el.offsetLeft;
	            var width = el.offsetWidth;
	            var height = el.offsetHeight;
	            while (el.offsetParent) {
	                el = el.offsetParent;
	                top += el.offsetTop;
	                left += el.offsetLeft;
	            }
	            var current = self;
	            if (_this.inFrame) {
	                top += current.pageYOffset;
	                left += current.pageXOffset;
	                while (current.parent) {
	                    current = current.parent;
	                    if (current === window.top) {
	                        break;
	                    }
	                }
	            }
	            return (top >= current.pageYOffset &&
	                left >= current.pageXOffset &&
	                top + height <= (current.pageYOffset + current.innerHeight) &&
	                left + width <= (current.pageXOffset + current.innerWidth));
	        };
	        this.inFrame = self == top ? false : true;
	        this.ad = el;
	    }
	    Geometry.prototype.isSupported = function (cb) {
	        var phostName;
	        var status = true;
	        try {
	            phostName = window.parent.location.hostname;
	        }
	        catch (error) {
	            status = false;
	        }
	        if (typeof this.ad === 'undefined' || this.ad == null || window.location.hostname != phostName) {
	            status = false;
	        }
	        if (typeof cb === 'function') {
	            cb(status);
	        }
	        return status;
	    };
	    return Geometry;
	}());
	exports.Geometry = Geometry;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Params = (function () {
	    function Params() {
	    }
	    return Params;
	}());
	exports.Params = Params;


/***/ }),
/* 10 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var IframeClickTracker = (function () {
	    function IframeClickTracker() {
	        var _this = this;
	        this.resolution = 200;
	        this.iframes = [];
	        this.interval = null;
	        this.track = function (element, cb) {
	            _this.iframes.push(new Iframe(element, cb));
	            if (!_this.interval) {
	                var self_1 = _this;
	                _this.interval = setInterval(function () { self_1.checkClick(); }, _this.resolution);
	            }
	        };
	        this.checkClick = function () {
	            if (document.activeElement) {
	                var activeElement = document.activeElement;
	                for (var i in _this.iframes) {
	                    if (activeElement === _this.iframes[i].element) {
	                        if (_this.iframes[i].hasTracked === false) {
	                            _this.iframes[i].cb.apply(window, []);
	                            _this.iframes[i].hasTracked = true;
	                        }
	                    }
	                    else {
	                        _this.iframes[i].hasTracked = false;
	                    }
	                }
	            }
	        };
	    }
	    return IframeClickTracker;
	}());
	exports.IframeClickTracker = IframeClickTracker;
	var Iframe = (function () {
	    function Iframe(el, func) {
	        this.hasTracked = false;
	        this.element = el;
	        this.cb = func;
	    }
	    return Iframe;
	}());


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Navigator_1 = __webpack_require__(12);
	var AdInformation = (function () {
	    function AdInformation() {
	        this.timeOnSite = 0;
	        this.viewDuration = 0;
	        var nav = new Navigator_1.Navigator();
	        this.userAgent = nav.GetUserAgent();
	        this.pixelDepth = nav.GetpixelDepth();
	        this.connectionType = nav.GetConnectionType();
	        this.platform = nav.GetPlatform();
	        this.touchPoints = nav.GetTouchPoints();
	        this.xDomain = window.location != window.parent.location;
	    }
	    return AdInformation;
	}());
	exports.AdInformation = AdInformation;


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Navigator = (function () {
	    function Navigator() {
	        this.window = window;
	    }
	    Navigator.prototype.GetUserAgent = function () {
	        return window.navigator.userAgent;
	    };
	    Navigator.prototype.GetpixelDepth = function () {
	        return window.screen.pixelDepth;
	    };
	    Navigator.prototype.GetConnectionType = function () {
	        return null;
	    };
	    Navigator.prototype.GetPlatform = function () {
	        return window.navigator.platform;
	    };
	    Navigator.prototype.GetTouchPoints = function () {
	        return window.navigator.maxTouchPoints;
	    };
	    return Navigator;
	}());
	exports.Navigator = Navigator;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var config = __webpack_require__(14);
	var Http = (function () {
	    function Http() {
	        var _this = this;
	        this.createXHR = function () {
	            if (typeof XMLHttpRequest != 'undefined') {
	                return new XMLHttpRequest();
	            }
	            else if (typeof ActiveXObject != 'undefined') {
	                var version = [
	                    'MSXML2.XMLHttp.6.0',
	                    'MSXML2.XMLHttp.3.0',
	                    'MSXML2.XMLHttp'
	                ];
	                for (var i = 0; version.length; i++) {
	                    try {
	                        return new ActiveXObject(version[i]);
	                    }
	                    catch (e) {
	                        console.log(e);
	                    }
	                }
	            }
	            else {
	                throw new Error('system do not support XHR object！');
	            }
	        };
	        this.params = function (data) {
	            var arr = [];
	            for (var i in data) {
	                arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
	            }
	            return arr.join('&');
	        };
	        this.apiCall = function (obj) {
	            var xhr = _this.createXHR();
	            if (obj.method === 'get') {
	                obj.data = _this.params(obj.data);
	                obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
	            }
	            if (obj.async === true) {
	                xhr.onreadystatechange = function () {
	                    if (xhr.readyState == 4) {
	                        callback();
	                    }
	                };
	            }
	            if (config.dev_stage) {
	                //  console.log(obj);
	                return;
	            }
	            xhr.open(obj.method, obj.url, obj.async);
	            if (obj.method === 'post') {
	                xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
	                xhr.send(JSON.stringify(obj.data));
	            }
	            else {
	                xhr.send(null);
	            }
	            if (obj.async === false) {
	                callback();
	            }
	            function callback() {
	                if (xhr.status == 200) {
	                    obj.success(xhr.responseText);
	                }
	                else {
	                    console.log('bad request：' + xhr.status + '，error msg：' + xhr.statusText);
	                }
	            }
	        };
	        this.xhr = this.createXHR();
	    }
	    return Http;
	}());
	exports.Http = Http;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

	'use strict';
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.remote_api = 'http://smartview.com';
	exports.dev_stage = true;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var config = __webpack_require__(14);
	var RequestObj = (function () {
	    function RequestObj(action, impid) {
	        var _this = this;
	        this.method = 'post';
	        this.async = true;
	        this.success = function (res) {
	            _this.responseData = res;
	        };
	        this.url = config.remote_api + '/' + action + '/' + impid;
	    }
	    return RequestObj;
	}());
	exports.RequestObj = RequestObj;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=moq.js.map