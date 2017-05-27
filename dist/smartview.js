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
	var IframeClickTracker_1 = __webpack_require__(2);
	var MraidAPI_1 = __webpack_require__(3);
	var SafeFrame_1 = __webpack_require__(4);
	var RequestAnimationFrame_1 = __webpack_require__(5);
	var IntersectionObserverAPI_1 = __webpack_require__(6);
	var AdInformation_1 = __webpack_require__(7);
	var Geometry_1 = __webpack_require__(9);
	var SmartView = (function () {
	    function SmartView() {
	        var _this = this;
	        this.count = 1;
	        this.activeIntersection = false;
	        this.intersectionView = false;
	        this.testMethod = 0;
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
	        this.UpdateTrackObj = function () {
	        };
	        this.starttrack = function () {
	            switch (_this.testMethod) {
	                case 1:
	                    _this.viewAbility = new Geometry_1.Geometry(_this.ad);
	                    break;
	                case 2:
	                    _this.viewAbility = new IntersectionObserverAPI_1.IntersectionObserverAPI(_this.ad);
	                    break;
	                case 3:
	                    _this.viewAbility = new SafeFrame_1.SafeFrame({ reqh: 120, reqw: 600, domain: '' });
	                    break;
	                case 4:
	                    _this.viewAbility = new RequestAnimationFrame_1.RequestAnimationFrame(_this.ad);
	                    break;
	                case 5:
	                    _this.viewAbility = new MraidAPI_1.MraidAPI();
	                    break;
	            }
	            console.log('use method:' + _this.testMethod);
	            _this.tracker = setInterval(_this.trackingGeometry, 1000);
	            setTimeout(_this.stopTracker, 1000 * 300);
	        };
	        this.trackingGeometry = function () {
	            var d = new Date();
	            var options = { timeZone: 'UTC', timeZoneName: 'short' };
	            var t = d.toLocaleTimeString('en-US', options);
	            document.getElementById('time').innerHTML = t;
	            document.getElementById('trackingtime').innerHTML = 'tracking : ' + _this.count++;
	            if (_this.adInformation.timeOnSite < 120) {
	                if (_this.viewAbility.isView()) {
	                    _this.adInformation.timeOnSite++;
	                    document.getElementById('isview').innerHTML = 'is view : true';
	                }
	                else {
	                    document.getElementById('isview').innerHTML = 'is view : false';
	                }
	            }
	            document.getElementById('timeonsite').innerHTML = 'on site : ' + _this.adInformation.timeOnSite;
	        };
	        this.stopTracker = function () {
	            clearInterval(_this.tracker);
	            console.log(_this.adInformation);
	        };
	        this.safeframe = function () {
	            var sf = new SafeFrame_1.SafeFrame({ reqh: 600, reqw: 120, domain: '' });
	            if (sf.isAvailable) {
	                sf.register();
	            }
	            console.log('isAvailable:' + sf.isAvailable());
	            console.log('isView:' + sf.isView());
	            return sf.isView();
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
	        var scripts = document.getElementsByTagName('script');
	        var re = /smartview.js/gi;
	        var myScript;
	        for (var i = 0; i < scripts.length; i++) {
	            if (scripts[i].outerHTML.search(re) != -1) {
	                myScript = scripts[i];
	                break;
	            }
	        }
	        var queryString = myScript.src.replace(/^[^\?]+\??/, '');
	        this.srcParm = this.parseQuery(queryString);
	        var id = '-1';
	        try {
	            id = this.srcParm['impid'].prop;
	            this.testMethod = parseInt(this.srcParm['method'].prop);
	        }
	        catch (error) {
	        }
	        this.ad = document.getElementById(id);
	        // if (typeof IntersectionObserver !== 'undefined') {
	        //   if (this.ad != null) {
	        //     this.intersectionObserver();
	        //   }
	        // }
	        this.adInformation = new AdInformation_1.AdInformation();
	    }
	    return SmartView;
	}());
	exports.SmartView = SmartView;


/***/ }),
/* 2 */
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
	                        if (_this.iframes[i].hasTracked == false) {
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
	// let div = document.createElement('div');
	// div.innerText = '0';
	// let frame = document.createElement('iframe');
	// frame.src='"http://www.baidu.com'
	// document.body.appendChild(div);
	// document.body.appendChild(frame);
	// new IframeClickTracker().track(frame,function(){
	//   div.innerText = (parseInt(div.innerText) + 1).toString();
	// }) 


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var MraidAPI = (function () {
	    function MraidAPI() {
	        this.isView = function () {
	            if (mraid) {
	                return mraid.isViewable();
	            }
	            else {
	                return false;
	            }
	        };
	    }
	    return MraidAPI;
	}());
	exports.MraidAPI = MraidAPI;


/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var SafeFrame = (function () {
	    function SafeFrame(params) {
	        var _this = this;
	        this.isOk = false;
	        this.inView = false;
	        this.isAvailable = function () {
	            return (typeof _this.extern !== 'undefined');
	        };
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
	            _this.inView = _this.extern.inViewPercentage() >= 50 ? true : false;
	            console.log(_this.isView());
	        };
	        this.register = function () {
	            if (_this.extern) {
	                try {
	                    _this.extern.register(_this.params.reqw, _this.params.reqh, _this.statusUpdate);
	                }
	                catch (e) {
	                    console.log('Exception or no safeframes available: ' + e.message);
	                }
	            }
	        };
	        this.params = params;
	        if (typeof $sf !== 'undefined' || typeof window.extern !== 'undefined')
	            this.extern = $sf.ext;
	    }
	    return SafeFrame;
	}());
	exports.SafeFrame = SafeFrame;


/***/ }),
/* 5 */
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
	            /* we average the last update delay with the time since last update
	            to smooth out browser hiccups that occur from resizing, etc which can
	            occasionally cause it to report out of view otherwise */
	            var avg = (((_this.time() - _this.last) + _this.delta) / 2);
	            return (avg < 55);
	        };
	        this.move = function (x, y) {
	            _this.frame.style.top = y + 'px';
	            _this.frame.style.left = x + 'px';
	        };
	        var frame = document.createElement('iframe');
	        el.appendChild(frame);
	        frame.id = 'VisFrame1';
	        frame.style.width = '4px';
	        frame.style.height = '4px';
	        frame.style.backgroundColor = 'blue';
	        frame.style.verticalAlign = 'top';
	        frame.scrolling = 'no';
	        frame.frameBorder = '0';
	        var width = el.offsetWidth;
	        var height = el.offsetHeight;
	        frame.style.marginTop = Math.round(height / 2) + 'px';
	        frame.style.marginLeft = Math.round(width / 2) + 'px';
	        this.listen();
	        this.frame = frame;
	        frame.src = 'data:text/html;charset=UTF-8,' + '<html><head></head><body><script>window.parent.postMessage("yo","*"); function call(){window.parent.postMessage("hi","*"),window.requestAnimationFrame(call)}call();</script></body></html>';
	    }
	    return RequestAnimationFrame;
	}());
	exports.RequestAnimationFrame = RequestAnimationFrame;


/***/ }),
/* 6 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var IntersectionObserverAPI = (function () {
	    function IntersectionObserverAPI(el) {
	        var _this = this;
	        this.isView = function () {
	            return _this.inView;
	        };
	        var observer = new IntersectionObserver(function (enters) {
	            if (enters[0].intersectionRatio < 0.5) {
	                _this.inView = false;
	            }
	            else {
	                _this.inView = true;
	            }
	        }, {
	            threshold: [0.5]
	        });
	        observer.observe(el);
	    }
	    return IntersectionObserverAPI;
	}());
	exports.IntersectionObserverAPI = IntersectionObserverAPI;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Navigator_1 = __webpack_require__(8);
	var AdInformation = (function () {
	    function AdInformation() {
	        this.timeOnSite = 0;
	        var nav = new Navigator_1.Navigator();
	        this.userAgent = nav.GetUserAgent();
	        this.pixelDepth = nav.GetpixelDepth();
	        this.connectionType = nav.GetConnectionType();
	        this.platform = nav.GetPlatform();
	        this.touchPoints = nav.GetTouchPoints();
	    }
	    return AdInformation;
	}());
	exports.AdInformation = AdInformation;


/***/ }),
/* 8 */
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
/* 9 */
/***/ (function(module, exports) {

	"use strict";
	Object.defineProperty(exports, "__esModule", { value: true });
	var Geometry = (function () {
	    function Geometry(el) {
	        var _this = this;
	        this.isView = function () {
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
	            return (top >= window.pageYOffset &&
	                left >= window.pageXOffset &&
	                (top + height) <= (window.pageYOffset + window.innerHeight) &&
	                (left + width) <= (window.pageXOffset + window.innerWidth));
	        };
	        this.ad = el;
	    }
	    return Geometry;
	}());
	exports.Geometry = Geometry;


/***/ })
/******/ ])
});
;
//# sourceMappingURL=smartview.js.map