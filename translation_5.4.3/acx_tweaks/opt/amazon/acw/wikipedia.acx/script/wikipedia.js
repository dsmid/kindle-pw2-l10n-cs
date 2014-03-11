var getQueryParameter = function(name, queryString) {
    if (typeof(name) === "string" && name && typeof(queryString) === "string" && queryString) {
        if (queryString.charAt(0) == "?") {
            queryString = queryString.slice(1);
        }
        var pairs = queryString.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split("=");
            if (decodeURIComponent(pair[0]) == name) {
                return decodeURIComponent(pair[1]);
            }
        }
    }
    return undefined;
};
var isString = function(string) {
    return (typeof(string) === "string");
};
var trim = function(string) {
    return string.replace(/^[\r\n\t\s]+/, "").replace(/[\r\n\t\s]+$/, "");
};
var getSymbolCharacters = function() {
    return "[\\\\/~,.?!:;*\\s\"'\u201c\u201d\u201e\u2018\u2019\u201a<>\u2039\u203a\u27e8\u27e9\u00ab\u00bb\u300c\u300d\u300e\u300f()&+@\u2026#<>\\[\\]|{}]";
};
var convertStringToHtmlEntities = function(text) {
    var textElement = document.createTextNode(text);
    var containerElement = document.createElement("p");
    containerElement.appendChild(textElement);
    return containerElement.innerHTML;
};
var convertHtmlEntitiesToString = function(text) {
    var element = document.createElement("p");
    element.innerHTML = text;
    return element.textContent;
};
var propagateErrorSafely = function(errorCallback, msg, logHeader) {
    if (!logHeader) {
        logHeader = "unknown module";
    }
    if (!msg) {
        msg = "no error message found";
    }
    if (typeof(errorCallback) == "function") {
        errorCallback(msg);
    } else {
        console.error(logHeader + ": " + msg);
    }
};
var findOptionIndexByValue = function(selectElement, value) {
    for (var index = 0; index < selectElement.length; ++index) {
        if (selectElement.options[index].value === value) {
            return index;
        }
    }
    return -1;
};
var metricLogger = function(metricName, metricSource, metricContext) {
    kindle.logEventMetric(metricName, metricSource, metricContext);
};
var metricTimer = function(timerName, metricSource, metricContext) {
    return kindle.MetricTimeLoggerFactory.createTimeLogger(timerName, metricSource, metricContext);
};
var hideElement = function(elem) {
    var ret;
    if (elem) {
        ret = window.getComputedStyle(elem, null).display;
        elem.style.display = "none";
        elem.style.visibility = "hidden";
    }
    return ret;
};
var showElement = function(elem, displayValue) {
    if (elem) {
        if (displayValue) {
            elem.style.display = displayValue;
        } else {
            elem.style.display = "inherit";
        }
        elem.style.visibility = "visible";
    }
};

function parseHttpPostData(dataMap) {
    var mapArray = [];
    for (var key in dataMap) {
        if (dataMap.hasOwnProperty(key)) {
            mapArray.push(encodeURIComponent(key) + "=" + encodeURIComponent(dataMap[key]));
        }
    }
    return mapArray.join("&");
}
var AjaxRequest = function() {
    this.init();
};
AjaxRequest.fn = AjaxRequest.prototype = {
    ajaxRequest: undefined,
    successCallback: undefined,
    errorCallback: undefined,
    timeoutCallback: undefined,
    timeoutHandler: undefined,
    isManualAbort: false,
    _this: undefined,
    init: function() {
        _this = this;
    },
    onTimeout: function() {
        if (_this.ajaxRequest) {
            _this.ajaxRequest.abort();
            _this.ajaxRequest = null;
        }
        _this.timeoutCallback();
    },
    abort: function() {
        _this.isManualAbort = true;
        if (_this.ajaxRequest) {
            _this.ajaxRequest.abort();
            _this.ajaxRequest = null;
        }
    },
    setupTimeout: function(timeoutValue) {
        return setTimeout(_this.onTimeout, timeoutValue);
    },
    sendRequest: function(args) {
        _this.ajaxRequest = new XMLHttpRequest();
        var type = args.type;
        var url = args.url;
        var data = args.data;
        var contentType = args.contentType;
        var timeoutVal = args.timeoutVal;
        _this.successCallback = args.success;
        _this.errorCallback = args.error;
        _this.timeoutCallback = args.timeout;
        _this.ajaxRequest.onreadystatechange = function() {
            if (_this.ajaxRequest.readyState === 4) {
                clearTimeout(_this.timeoutHandler);
                if (_this.ajaxRequest.status === 200 && _this.ajaxRequest.responseText) {
                    _this.successCallback(_this.ajaxRequest.responseText);
                } else {
                    if (!_this.isManualAbort) {
                        _this.errorCallback(_this.ajaxRequest);
                    }
                }
                _this.ajaxRequest = null;
            }
        };
        if (!type || type === "GET") {
            _this.ajaxRequest.open("GET", url + "?" + parseHttpPostData(data), true);
        } else {
            if (type === "POST") {
                _this.ajaxRequest.open("POST", url, true);
            } else {
                throw "unsupported Ajax type: " + type;
            }
        } if (contentType) {
            _this.ajaxRequest.setRequestHeader("Content-Type", contentType);
        }
        if (timeoutVal && timeoutVal > 0) {
            _this.timeoutHandler = _this.setupTimeout(timeoutVal);
        }
        if (type === "POST") {
            _this.ajaxRequest.send(parseHttpPostData(data));
        } else {
            _this.ajaxRequest.send();
        }
    }
};
var getScrollCallbackForRefresh = function(refreshInterval) {
    if (!kindle || !kindle.device || !kindle.device.eInk || typeof(refreshInterval) != "number") {
        return;
    }
    var MODE_MAX = kindle.device.eInk.REFRESH_MODE_AUTO_MAXIMAL;
    var MODE_MIN = kindle.device.eInk.REFRESH_MODE_AUTO_MINIMAL;
    var currentRefreshMode = null;
    var scrollCount = 0;
    return function() {
        ++scrollCount;
        if (scrollCount > refreshInterval) {
            scrollCount = 0;
            currentRefreshMode = MODE_MAX;
            kindle.device.eInk.refreshMode = MODE_MAX;
        } else {
            if (currentRefreshMode != MODE_MIN) {
                currentRefreshMode = MODE_MIN;
                kindle.device.eInk.refreshMode = MODE_MIN;
            }
        }
    };
};
var marketplaceEU = ["A13V1IB3VIYZZH", "A1F83G8C2ARO7P", "A1PA6795UKMFR9", "APJ6JRA9NG5V4", "A1RKKUPIHCS9HS", "AD2EMQ3L3PG8S"];
var getReader = function() {
    return kindle.reader;
};
var getConnectivity = function() {
    return kindle.connectivity;
};
var getMarketplace = function() {
    return kindle.marketplace;
};
var Wikipedia = function(initializer) {
    if (!initializer) {
        throw "No initializer specified";
    }
    if (!(initializer.stringLoader instanceof StringLoader)) {
        throw "No valid widget stringLoader found: " + (initializer.stringLoader ? initializer.stringLoader : "(unknown)");
    }
    this.onLoading = initializer.onLoading;
    this.onLookup = initializer.onLookup;
    this.onLookupError = initializer.onLookupError;
    this.onMaximizeHeight = initializer.onMaximizeHeight;
    this.onAjaxError = initializer.onAjaxError;
    var _this = this;
    var _stringLoader = initializer.stringLoader;
    var _serviceUrl = "https://wiki-acx.amazon.com/V1/wiki";
    var _serviceUrlEU = "https://wiki-acx.amazon.co.uk/V1/wiki";
    var getUrl = function() {
        var currentMarketplace = getMarketplace();
        var obfuscatedId = currentMarketplace.obfuscatedId;
        if (marketplaceEU.indexOf(obfuscatedId) != -1) {
            return _serviceUrlEU;
        }
        return _serviceUrl;
    };
    var getDataMap = function(args) {
        var currentContentItem = getReader().getCurrentContentItem();
        var currentContentMetadata = getReader().getCurrentContentMetadata();
        var data = {
            acxId: widget.id,
            contentGuid: currentContentItem.contentGuid || "unknown-content-guid",
            asin: currentContentItem.asin || "IAMUNKNOWN",
            publisherId: currentContentItem.publisherId || "unknown-publisher",
            version: 1,
            languageCode: currentContentMetadata.contentLocale || "",
            deviceLanguageCode: (new Locale()).locale
        };
        if (args.article) {
            data.article = args.article;
        }
        if (args.format) {
            data.format = args.format;
        }
        return data;
    };
    this.getStringLoader = function() {
        return _stringLoader;
    };
    var errorCallBack = function() {
        metricLogger("NetworkUnavailable", widget.id, "NA");
        propagateErrorSafely(_this.onLookupError, _stringLoader.findString("no_network"), widget.name);
    };
    var wirelessCallBack = function() {
        _this.onMaximizeHeight();
        _this.onLoading(_stringLoader.findString("awaiting_connectivity"));
    };
    this.lookup = function(text) {
        if (!text || !isString(text)) {
            metricLogger("InvalidText", widget.id, "NA");
            propagateErrorSafely(this.onLookupError, _stringLoader.findString("wiki_no_article_found"), widget.name);
            return;
        }
        if (kindle.localStorage !== undefined && kindle.localStorage.cachedArticle === text && kindle.localStorage.cachedDeviceLocale === new Locale().locale) {
            metricLogger("CacheHit", widget.id, "NA");
            var parsedResult = JSON.parse(kindle.localStorage.cachedResult);
            if (parsedResult) {
                _this.onLookup(parsedResult);
                return;
            }
        }
        var connectivityObject = getConnectivity();
        if (!connectivityObject.isWirelessEnabled()) {
            var connectivityRequest = new connectivityObject.ConnectivityRequest();
            connectivityRequest.onresponse = function(response) {
                if (response.code === connectivityObject.ConnectivityDetails.NETWORK_AVAILABLE) {
                    lookupInternal(text);
                } else {
                    errorCallBack();
                }
            };
            if (connectivityObject.canForceConnect && connectivityObject.canForceConnect()) {
                connectivityRequest.forceConnect = true;
                var wirelessButton;
                var wirelessMsg;
                var hideDiv = document.getElementById("wiki-main");
                var wirelessDialogDiv = document.getElementById("wireless");
                if (window.devicePixelRatio == 1) {
                    wirelessButton = _stringLoader.findString("turn_on_wireless");
                    wirelessMsg = _stringLoader.findString("wireless_connect_message");
                } else {
                    wirelessButton = _stringLoader.findString("turn_off_airplane_mode");
                    wirelessMsg = _stringLoader.findString("airplane_mode_message");
                }
                turnOnWireless(wirelessMsg, wirelessButton, hideDiv, wirelessDialogDiv, connectivityRequest, errorCallBack, wirelessCallBack);
            } else {
                propagateErrorSafely(_this.onLookupError, _stringLoader.findString("no_network"), widget.name);
            }
        } else {
            if (connectivityObject.isConnected()) {
                lookupInternal(text);
            } else {
                metricLogger("NetworkUnavailable", widget.id, "NA");
                propagateErrorSafely(_this.onLookupError, _stringLoader.findString("no_network"), widget.name);
            }
        }
    };
    var lookupInternal = function(text) {
        var url = getUrl();
        var dataMap = getDataMap({
            article: text
        });
        _this.onLoading(_stringLoader.findString("connecting"));
        var queryTimeLogger = new metricTimer("QueryTime", widget.id, "NA");
        var ajax = new AjaxRequest();
        ajax.sendRequest({
            url: url,
            type: "POST",
            timeoutVal: 15000,
            data: dataMap,
            success: function(result) {
                var parsedResult;
                try {
                    parsedResult = JSON.parse(result);
                } catch (e) {
                    metricLogger("JsonParseError", widget.id, "NA");
                }
                if (parsedResult) {
                    if (kindle.localStorage !== undefined) {
                        metricLogger("CachingArticle", widget.id, "NA");
                        kindle.localStorage.cachedArticle = text;
                        kindle.localStorage.cachedResult = result;
                        kindle.localStorage.cachedDeviceLocale = new Locale().locale;
                    }
                    _this.onLookup(parsedResult);
                } else {
                    _this.onLookupError(_stringLoader.findString("unknown_error"));
                }
                queryTimeLogger.submit();
            },
            error: function(ajaxRequest) {
                _this.onLookupError(_stringLoader.findString("unknown_error"));
                metricLogger("UnknownError", widget.id, "NA");
            },
            timeout: function() {
                _this.onLookupError(_stringLoader.findString("request_timeout"));
                metricLogger("AjaxTimeout", widget.id, "NA");
            }
        });
        metricLogger("QueryEvent", widget.id, "NA");
    };
};

function StringLoader(stringMap) {
    var _stringMap = stringMap || {};
    var _macro = function(string, key, replacement) {
        var template = "\\$\\{" + key + "\\}";
        var regEx = new RegExp(template, "g");
        return string.replace(regEx, replacement);
    };
    this.findString = function(stringId, args) {
        var string = _stringMap[stringId];
        if (string) {
            if (args) {
                for (var key in args) {
                    if (args.hasOwnProperty(key)) {
                        string = _macro(string, key, args[key]);
                    }
                }
            }
        } else {
            string = "";
        }
        return string;
    };
}
var resizeWirelessDialog = function() {
    var height = window.innerHeight - document.getElementById("wireless_body").offsetHeight + parseInt(getComputedStyle(document.getElementById("wireless_message")).height, 10);
    document.getElementById("wireless_message").style.height = height + "px";
};
var turnOnWireless = function(wirelessMsg, wirelessButton, hideDiv, wirelessDialogDiv, connectivityRequest, errorCallBack, onClickCallBack, initUICallBack) {
    var handleSuccess = function(text) {
        wirelessDialogDiv.innerHTML = text;
        var saveHideDivDisplay = hideElement(hideDiv);
        document.getElementById("wireless_message").innerHTML = wirelessMsg;
        document.getElementById("turnOn").innerHTML = wirelessButton;
        document.getElementById("turnOn").onclick = function() {
            wirelessDialogDiv.innerHTML = "";
            showElement(hideDiv, saveHideDivDisplay);
            onClickCallBack();
            if (initUICallBack) {
                initUICallBack();
            }
            connectivityRequest.requestConnectivity();
        };
        window.onresize = function() {
            resizeWirelessDialog();
        };
        resizeWirelessDialog();
    };
    var handleError = function(ajaxRequest) {
        console.log("wireless js ajax GET failed: ");
        errorCallBack();
    };
    var ajax = new AjaxRequest();
    ajax.sendRequest({
        url: "content/wireless.html",
        type: "GET",
        timeoutVal: 5000,
        success: handleSuccess,
        error: handleError,
        timeout: handleError
    });
};
var stringLoader = new StringLoader(WikipediaData.strings);
var scroller = null;
var updateScrollBar = function() {
    if (scroller !== null) {
        scroller.setScrollBar();
    }
};
var elementWikiContent;
var elementLicenseMessage;
var elementConnectingMessage;
var elementMessage;
var elementMoreDiv;
var elementMoreLink;
var elementGMoreDiv;
var elementGMoreLink;
var elementScrollableContent;
var elementContainer;
var initElement = function() {
    elementWikiContent = document.getElementById("w_wiki-content");
    elementLicenseMessage = document.getElementById("w_license-message");
    elementConnectingMessage = document.getElementById("w_connecting-msg");
    elementMessage = document.getElementById("w_message");
    elementMoreDiv = document.getElementById("w_launch-wikipedia");
    elementMoreLink = document.getElementById("w_more-link");
    elementGMoreDiv = document.getElementById("w_launch-google");
    elementGMoreLink = document.getElementById("g_more-link");
    elementScrollableContent = document.getElementById("w_scrollable-content");
    elementContainer = document.getElementById("container");
};
var oldMsgDisplayVal;
var oldContentDisplayVal;
var oldLicenseDisplayVal;
var initDivs = function() {
    oldContentDisplayVal = hideElement(elementWikiContent);
    oldMsgDisplayVal = hideElement(elementConnectingMessage);
    oldLicenseDisplayVal = hideElement(elementLicenseMessage);
};
var configureLaunchWikiButton = function(props) {};
var onLoadingCallback = function(displayString) {
    hideElement(elementWikiContent);
    hideElement(elementLicenseMessage);
    showElement(elementConnectingMessage, oldMsgDisplayVal);
    elementMessage.innerHTML = convertStringToHtmlEntities(displayString);
    elementMoreDiv.classList.add("w_hidden_div");
    elementMoreLink.classList.add("w_disabled");
    elementGMoreDiv.classList.add("w_hidden_div");
    elementGMoreLink.classList.add("w_disabled");
    elementMoreLink.onclick = kindle.reader.onexternal = function(args) {};
    elementGMoreLink.onclick = kindle.reader.onexternal = function(args) {};
    configureLaunchWikiButton({
        enabled: false
    });
    updateScrollBar();
};
var onLookupCallback = function(json) {
    if (json.status === 200) {
        elementWikiContent.innerHTML = json.articleHtml;
    } else {
        if (json.errorMessage) {
            elementWikiContent.innerHTML = convertStringToHtmlEntities(stringLoader.findString("wiki_no_article_found"));
        } else {
            elementWikiContent.innerHTML = convertStringToHtmlEntities(stringLoader.findString("unknown_error"));
        }
    }
    elementMoreDiv.classList.remove("w_hidden_div");
    elementGMoreDiv.classList.remove("w_hidden_div");
    if (json.articleUrl) {
        elementMoreLink.onclick = kindle.reader.onexternal = function() {
            kindle.applicationlauncher.launchApplication(json.articleUrl);
            metricLogger("BrowserOpened", widget.id, "NA");
        };
        elementMoreLink.classList.remove("w_disabled");
        configureLaunchWikiButton({
            enabled: true
        });
    }
    elementGMoreLink.onclick = kindle.reader.onexternal = function() {
        var selection = kindle.reader.getCurrentSelection();
        if (selection !== undefined && selection.text !== null) {
            kindle.applicationlauncher.launchApplication("https://www.google.cz/search?hl=cs&q=" + selection.text);
            metricLogger("BrowserOpened", widget.id, "NA");
        }
    };
    elementGMoreLink.classList.remove("w_disabled");
    hideElement(elementConnectingMessage);
    showElement(elementWikiContent, oldContentDisplayVal);
    if (json.licenseMessage) {
        elementLicenseMessage.innerHTML = json.licenseMessage;
        showElement(elementLicenseMessage, oldLicenseDisplayVal);
        var licenseLink = elementLicenseMessage.getElementsByTagName("a")[0];
        if (licenseLink) {
            var licenseTarget = licenseLink.getAttribute("href");
            licenseLink.onclick = function() {
                kindle.applicationlauncher.launchApplication(licenseTarget);
                metricLogger("LicenseOpened", widget.id, "NA");
            };
            licenseLink.setAttribute("href", "#");
        }
    }
    updateScrollBar();
};
var onLookupErrorCallback = function(message) {
    hideElement(elementConnectingMessage);
    elementWikiContent.innerHTML = convertStringToHtmlEntities(message);
    showElement(elementWikiContent, oldContentDisplayVal);
    updateScrollBar();
};
var onAjaxErrorCallback = onLookupErrorCallback;
var maximizeHeight = function() {
    var newHeight = window.innerHeight - parseInt(window.getComputedStyle(elementContainer).marginTop, 10) - document.getElementById("wiki-main").offsetHeight + parseInt(window.getComputedStyle(elementScrollableContent).height, 10);
    elementScrollableContent.style.height = newHeight + "px";
    elementConnectingMessage.style.height = newHeight + "px";
    updateScrollBar();
};
var wiki = new Wikipedia({
    stringLoader: stringLoader,
    onLoading: onLoadingCallback,
    onLookup: onLookupCallback,
    onLookupError: onLookupErrorCallback,
    onAjaxError: onAjaxErrorCallback,
    onMaximizeHeight: maximizeHeight
});
var initOnLoad = function() {
    initElement();
    var openWikiText = convertStringToHtmlEntities(stringLoader.findString("open_wikipedia"));
    elementMoreLink.innerHTML = openWikiText;
    elementMoreDiv.classList.add("w_hidden_div");
    elementMoreLink.classList.add("w_disabled");
    elementMoreLink.onclick = kindle.reader.onexternal = function(args) {};
    configureLaunchWikiButton({
        enabled: false,
        label: stringLoader.findString("more_link")
    });
    var searchGoogleText = convertStringToHtmlEntities(stringLoader.findString("search_google"));
    elementGMoreLink.innerHTML = searchGoogleText;
    elementGMoreDiv.classList.add("w_hidden_div");
    elementGMoreLink.classList.add("w_disabled");
    elementGMoreLink.onclick = kindle.reader.onexternal = function(args) {};
    var scrollCallback = getScrollCallbackForRefresh(5);
    elementScrollableContent.classList.add("w_kindle-scroll-margins");
    var paginateDiv = document.getElementById("w_scrollable-content");
    var compStyle = getComputedStyle(paginateDiv, "");
    var lineHeight = compStyle.getPropertyValue("font-size");
    lineHeight = parseInt(lineHeight.replace("px", ""), 10) * 0.6;
    scroller = kindle.createLitePaginationController(elementContainer, lineHeight, null, null, scrollCallback);
    updateScrollBar();
    document.body.style.setProperty("display", "block");
    maximizeHeight();
    initDivs();
    if (kindle.device && kindle.device.getPolicy) {
        var restrictions = kindle.device.getPolicy("kindle.device.settings.policy.wikipedia");
        if (restrictions === "freetimeControls") {
            elementWikiContent.innerHTML = convertStringToHtmlEntities(stringLoader.findString("in_freetime_mode"));
            hideElement(elementConnectingMessage);
            showElement(elementWikiContent, oldContentDisplayVal);
            return;
        }
    }
    var selection = kindle.reader.getCurrentSelection();
    if (selection !== undefined && selection.text !== null) {
        wiki.lookup(selection.text);
    } else {
        elementWikiContent.innerHTML = convertStringToHtmlEntities(stringLoader.findString("unknown_error"));
        hideElement(elementConnectingMessage);
        showElement(elementWikiContent, oldContentDisplayVal);
    }
};
window.onresize = function() {
    maximizeHeight();
    updateScrollBar();
};

function lookup(text) {
    var entityDecoded = convertHtmlEntitiesToString(text);
    metricLogger("NewArticleOpened", widget.id, "NA");
    wiki.lookup(entityDecoded);
}
kindle.reader.onbutton = function(params) {
    initOnLoad();
};
