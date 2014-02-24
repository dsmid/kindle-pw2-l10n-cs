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
var Translator = function(initializer) {
    if (!initializer) {
        throw "No initializer specified";
    }
    if (!(initializer.stringLoader instanceof StringLoader)) {
        throw "No valid widget stringLoader found: " + (initializer.stringLoader ? initializer.stringLoader : "(unknown)");
    }
    this.onLoading = initializer.onLoading;
    this.onLookup = initializer.onLookup;
    this.onLookupError = initializer.onLookupError;
    this.maximizeHeight = initializer.maximizeHeight;
    this.initUI = initializer.initUI;
    this.isQueryObsolete = false;
    this.previousQuery = null;
    var _this = this;
    var _stringLoader = initializer.stringLoader;
    var _serviceUrlUK = "http://david.smidovi.eu/kindle/GoogleTranslate.php";
    var _serviceUrl = "http://david.smidovi.eu/kindle/GoogleTranslate.php";
    var _targetLanguageStorePrefix = "amazon.acx.translator.toLang.";
    var _defaultItemSuffix = "default_no_id";
    var _localStorage = initializer.localStorage || kindle.localStorage;
    var getUrl = function() {
        var currentMarketplace = getMarketplace();
        var obfuscatedId = currentMarketplace.obfuscatedId;
        if (marketplaceEU.indexOf(obfuscatedId) != -1) {
            return _serviceUrlUK;
        }
        return _serviceUrl;
    };
    var getDataMap = function(args) {
        var currentContentItem = getReader().getCurrentContentItem();
        var dataOut = {
            acxId: widget.id,
            contentGuid: currentContentItem.contentGuid,
            asin: currentContentItem.asin,
            publisherId: currentContentItem.publisherId,
            version: 1,
            languageCode: getReader().getCurrentContentMetadata().contentLanguage || "",
            deviceLanguageCode: (new Locale()).locale
        };
        if (args.destinationLanguage) {
            dataOut.destinationLanguage = args.destinationLanguage;
        }
        if (args.sourceLanguage) {
            dataOut.sourceLanguage = args.sourceLanguage;
        }
        if (args.text) {
            dataOut.text = args.text;
        }
        if (args.startingPosition) {
            dataOut.startingPosition = args.startingPosition;
        }
        if (args.endingPosition) {
            dataOut.endingPosition = args.endingPosition;
        }
        if (args.format) {
            dataOut.format = args.format;
        }
        return dataOut;
    };
    this.getStringLoader = function() {
        return _stringLoader;
    };
    this.showErrorMessage = function(errorMsg, shouldInitUI) {
        if (shouldInitUI) {
            _this.initUI();
        }
        propagateErrorSafely(_this.onLookupError, errorMsg, widget.name);
    };
    var errorCallBack = function(shouldInitUI) {
        _this.showErrorMessage(_stringLoader.findString("no_network"), shouldInitUI);
        metricLogger("NetworkUnavailable", widget.id, "NA");
    };
    var wirelessCallBack = function() {
        _this.maximizeHeight();
        _this.onLoading(_stringLoader.findString("awaiting_connectivity"));
    };
    var lookupCachedResult = function(text, sourceLang, destLang) {
        if (_localStorage === undefined) {
            return undefined;
        }
        if (_localStorage.cachedText === undefined || _localStorage.cachedText !== text || _localStorage.cachedDestLang === undefined || _localStorage.cachedDestLang !== destLang || _localStorage.cachedResult === undefined) {
            return undefined;
        }
        if (_localStorage.cachedSourceLang === undefined || (sourceLang !== undefined && sourceLang !== _localStorage.cachedSourceLang)) {
            return undefined;
        }
        if (_localStorage.cachedDeviceLocale !== new Locale().locale) {
            return undefined;
        }
        return JSON.parse(_localStorage.cachedResult);
    };
    var storeResult = function(text, sourceLang, destLang, result) {
        if (_localStorage === undefined || sourceLang === undefined) {
            return;
        }
        metricLogger("CachingTranslation", widget.id, "NA");
        _localStorage.cachedText = text;
        _localStorage.cachedSourceLang = sourceLang;
        _localStorage.cachedDestLang = destLang;
        _localStorage.cachedResult = result;
        _localStorage.cachedDeviceLocale = new Locale().locale;
    };
    this.lookup = function(text, beginPosition, endPosition, sourceLanguage, destinationLanguage, shouldInitUI) {
        if (!text || typeof(text) != "string" || trim(text).length === 0) {
            _this.showErrorMessage(_stringLoader.findString("no_text_selected"), shouldInitUI);
            metricLogger("InvalidText", widget.id, "NA");
            return;
        }
        if (typeof(destinationLanguage) !== "string" || trim(destinationLanguage).length === 0) {
            _this.showErrorMessage(_stringLoader.findString("unknown_error"), shouldInitUI);
            return;
        }
        var cachedResult = lookupCachedResult(text, sourceLanguage, destinationLanguage);
        if (cachedResult !== undefined) {
            if (shouldInitUI) {
                _this.initUI();
            }
            setTimeout(function() {
                _this.onLookup(cachedResult);
            }, 0);
            metricLogger("CacheHit", widget.id, "NA");
            return;
        }
        var connectivityObject = getConnectivity();
        if (!connectivityObject.isWirelessEnabled()) {
            var connectivityRequest = new connectivityObject.ConnectivityRequest();
            connectivityRequest.onresponse = function(response) {
                if (response.code === connectivityObject.ConnectivityDetails.NETWORK_AVAILABLE) {
                    if (!_this.isQueryObsolete) {
                        lookupInternal(text, beginPosition, endPosition, sourceLanguage, destinationLanguage);
                    } else {
                        metricLogger("QuerySuppressed", widget.id, "NA");
                    }
                } else {
                    errorCallBack(shouldInitUI);
                }
            };
            if (connectivityObject.canForceConnect && connectivityObject.canForceConnect()) {
                connectivityRequest.forceConnect = true;
                var wirelessButton;
                var wirelessMsg;
                var hideDiv = document.getElementById("translator-main");
                var wirelessDialogDiv = document.getElementById("wireless");
                var errorCallbackFn = function() {
                    errorCallBack(shouldInitUI);
                };
                if (window.devicePixelRatio == 1) {
                    wirelessButton = _stringLoader.findString("turn_on_wireless");
                    wirelessMsg = _stringLoader.findString("wireless_connect_message");
                } else {
                    wirelessButton = _stringLoader.findString("turn_off_airplane_mode");
                    wirelessMsg = _stringLoader.findString("airplane_mode_message");
                }
                turnOnWireless(wirelessMsg, wirelessButton, hideDiv, wirelessDialogDiv, connectivityRequest, errorCallbackFn, wirelessCallBack, (shouldInitUI ? _this.initUI : undefined));
            } else {
                _this.showErrorMessage(_stringLoader.findString("no_network"), shouldInitUI);
                metricLogger("NetworkUnavailable", widget.id, "NA");
            }
        } else {
            if (connectivityObject.isConnected()) {
                if (_this.previousQuery) {
                    _this.previousQuery.abort();
                }
                if (shouldInitUI) {
                    _this.initUI();
                }
                lookupInternal(text, beginPosition, endPosition, sourceLanguage, destinationLanguage);
            } else {
                _this.isQueryObsolete = true;
                _this.showErrorMessage(_stringLoader.findString("no_network"), shouldInitUI);
                metricLogger("NetworkUnavailable", widget.id, "NA");
            }
        }
    };
    var lookupInternal = function(text, beginPosition, endPosition, sourceLanguage, destinationLanguage) {
        _this.onLoading(_stringLoader.findString("connecting"));
        var url = getUrl();
        var dataMap = getDataMap({
            startingPosition: beginPosition,
            endingPosition: endPosition,
            sourceLanguage: sourceLanguage,
            destinationLanguage: destinationLanguage,
            text: text
        });
        var queryTimeLogger = metricTimer("QueryTime", widget.id, "NA");
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
                    storeResult(text, parsedResult.sourceLanguage, destinationLanguage, result);
                    _this.onLookup(parsedResult);
                } else {
                    _this.onLookupError(_stringLoader.findString("unknown_error"));
                }
                queryTimeLogger.submit();
                _this.previousQuery = null;
            },
            error: function(ajaxRequest) {
                _this.onLookupError(_stringLoader.findString("unknown_error"));
                _this.previousQuery = null;
                metricLogger("UnknownError", widget.id, "NA");
            },
            timeout: function() {
                _this.onLookupError(_stringLoader.findString("request_timeout"));
                _this.previousQuery = null;
                metricLogger("AjaxTimeout", widget.id, "NA");
            }
        });
        _this.previousQuery = ajax;
        metricLogger("QueryEvent", widget.id, "NA");
    };
    this.languageFromLocale = function(localeString) {
        if (!localeString) {
            return null;
        }
        var locale = new Locale(localeString);
        if (locale.language == "zh") {
            return locale.locale;
        }
        return locale.language;
    };
    var getLocalStorageKey = function() {
        var item = getReader().getCurrentContentItem();
        var suffix = item.asin || item.contentId || _defaultItemSuffix;
        return _targetLanguageStorePrefix + suffix;
    };
    this.loadDefaultTargetLanguage = function() {
        var lang;
        if (_localStorage) {
            lang = _localStorage[getLocalStorageKey()];
        }
        return lang || this.languageFromLocale(getReader().getCurrentContentMetadata().contentLocale);
    };
    this.saveDefaultTargetLanguage = function(lang) {
        if (_localStorage) {
            _localStorage[getLocalStorageKey()] = lang;
        }
    };
};
var stringLoader = new StringLoader(TranslatorData.strings);
var scroller = null;
var updateScrollBar = function() {
    if (scroller !== null) {
        scroller.setScrollBar();
    }
};
var elementResult;
var elementWarnMessage;
var elementAboutLink;
var elementAboutDiv;
var elementSystemMessage;
var elementSrcLangLabel;
var elementDestLangLabel;
var elementSrcLangList;
var elementDestLangList;
var elementContent;
var elementScrollArea;
var elementAboutMsg;
var elementLinkMsg;
var elementTranslatorMain;
var AUTODETECT_OPTION_VAL = "";
var initElement = function() {
    elementResult = document.getElementById("destination-text");
    elementWarnMessage = document.getElementById("warning-message");
    elementAboutLink = document.getElementById("about-link-message");
    elementAboutDiv = document.getElementById("about-message-div");
    elementSystemMessage = document.getElementById("message");
    elementSrcLangLabel = document.getElementById("from-label");
    elementDestLangLabel = document.getElementById("to-label");
    elementSrcLangList = document.getElementById("source-lang");
    elementDestLangList = document.getElementById("destination-lang");
    elementContent = document.getElementById("content");
    elementScrollArea = document.getElementById("scrollArea");
    elementAboutMsg = document.getElementById("about-message");
    elementLinkMsg = document.getElementById("back-link-message");
    elementTranslatorMain = document.getElementById("translator-main");
};
var oldResultDisplayVal;
var oldWarningDisplayVal;
var oldAboutDisplayVal;
var oldAboutDivVal;
var oldSysMsgDisplayVal;
var oldelementTranslatorMainDisplayVal;
var initAllTextDivs = function() {
    oldResultDisplayVal = hideElement(elementResult);
    oldWarningDisplayVal = hideElement(elementWarnMessage);
    oldAboutDisplayVal = hideElement(elementAboutLink);
    oldSysMsgDisplayVal = hideElement(elementSystemMessage);
    oldAboutDivVal = hideElement(elementAboutDiv);
};
var hideAllTextDivs = function() {
    hideElement(elementResult);
    hideElement(elementWarnMessage);
    hideElement(elementAboutLink);
    hideElement(elementSystemMessage);
};
var showSystemMessage = function() {
    hideElement(elementResult);
    hideElement(elementWarnMessage);
    hideElement(elementAboutLink);
    showElement(elementSystemMessage, oldSysMsgDisplayVal);
};
var showTranslationResult = function() {
    hideElement(elementSystemMessage);
    showElement(elementResult, oldResultDisplayVal);
};
var onLoadingCallback = function(displayString) {
    elementSystemMessage.innerHTML = convertStringToHtmlEntities(displayString);
    showSystemMessage();
    updateScrollBar();
};
var autoLanguage;
var onLookupCallback = function(json) {
    if (json.status === 200) {
        var destinationLang = convertStringToHtmlEntities(json.destinationLanguage);
        elementResult.innerHTML = convertStringToHtmlEntities(json.translation);
        elementResult.lang = destinationLang;
        var providerMessage = json.providerMessage || "";
        elementAboutMsg.innerHTML = json.providerMessage;
        if (json.providerMessage) {
            showElement(elementAboutLink, oldAboutDisplayVal);
        }
        elementSrcLangList.selectedIndex = findOptionIndexByValue(elementSrcLangList, convertStringToHtmlEntities(json.sourceLanguage));
        elementDestLangList.selectedIndex = findOptionIndexByValue(elementDestLangList, destinationLang);
        if (json.warningMessage) {
            elementWarnMessage.innerHTML = convertStringToHtmlEntities(json.warningMessage);
            showElement(elementWarnMessage, oldWarningDisplayVal);
        } else {
            hideElement(elementWarnMessage);
        } if (!autoLanguage) {
            autoLanguage = json.sourceLanguage;
        }
    } else {
        if (json.errorMessage) {
            elementResult.innerHTML = convertStringToHtmlEntities(json.errorMessage);
        } else {
            elementResult.innerHTML = convertStringToHtmlEntities(stringLoader.findString("unknown_error"));
        }
    }
    elementSrcLangList.options[findOptionIndexByValue(elementSrcLangList, AUTODETECT_OPTION_VAL)].innerHTML = convertStringToHtmlEntities(stringLoader.findString("language_unknown"));
    showTranslationResult();
    updateScrollBar();
};
var onLookupErrorCallback = function(message) {
    elementSystemMessage.innerHTML = '<span class="message">' + convertStringToHtmlEntities(message) + "</span>";
    elementSrcLangList.options[findOptionIndexByValue(elementSrcLangList, AUTODETECT_OPTION_VAL)].innerHTML = convertStringToHtmlEntities(stringLoader.findString("language_unknown"));
    showSystemMessage();
    updateScrollBar();
};
var maximizeHeight = function() {
    var newHeight = window.innerHeight - parseInt(window.getComputedStyle(document.getElementById("table-container")).marginTop, 10) - elementTranslatorMain.offsetHeight + parseInt(window.getComputedStyle(elementContent).height, 10);
    elementContent.style.height = newHeight + "px";
    elementScrollArea.style.height = newHeight + "px";
    updateScrollBar();
};
var supportedLanguages = {
    en: "lang_en",
    "zh-CN": "lang_zh_hans",
    "zh-TW": "lang_zh_hant",
    nl: "lang_nl",
    fr: "lang_fr",
    de: "lang_de",
    it: "lang_it",
    ja: "lang_ja",
    ko: "lang_ko",
    pt: "lang_pt",
    ru: "lang_ru",
    es: "lang_es",
    fi: "lang_fi",
    no: "lang_no",
    hi: "lang_hi",
    da: "lang_da",
    cs: "lang_cs",
    sk: "lang_sk",
    pl: "lang_pl",
    uk: "lang_uk",
    la: "lang_la",
    el: "lang_el",
    iw: "lang_iw",
    tr: "lang_tr"
};
var sortedLanguageArray;
var populateLanguageOptions = function(selectElement, selectionOptionValue, includeAutoDetect) {
    if (includeAutoDetect) {
        var autoOption = document.createElement("option");
        autoOption.value = AUTODETECT_OPTION_VAL;
        autoOption.innerHTML = convertStringToHtmlEntities(stringLoader.findString("language_detecting"));
        autoOption.style.display = "none";
        selectElement.add(autoOption, null);
    }
    if (!sortedLanguageArray) {
        var collator = new Collator();
        var unsortedLanguageArray = [];
        for (var key in supportedLanguages) {
            if (supportedLanguages.hasOwnProperty(key)) {
                unsortedLanguageArray.push({
                    value: key,
                    language: stringLoader.findString(supportedLanguages[key])
                });
            }
        }
        sortedLanguageArray = unsortedLanguageArray.sort(function(a, b) {
            return collator.compare(a.language, b.language);
        });
    }
    for (var index in sortedLanguageArray) {
        if (sortedLanguageArray.hasOwnProperty(index)) {
            var newOption = document.createElement("option");
            newOption.value = sortedLanguageArray[index].value;
            newOption.innerHTML = convertStringToHtmlEntities(sortedLanguageArray[index].language);
            if (selectionOptionValue && newOption.value == selectionOptionValue) {
                newOption.selected = "selected";
            }
            selectElement.add(newOption, null);
        }
    }
};
var translator;
var contentLanguage;
var destinationLang;
var initUI = function() {
    populateLanguageOptions(elementSrcLangList, null, true);
    populateLanguageOptions(elementDestLangList, destinationLang, false);
    if (kindle.ui && kindle.ui.select && kindle.ui.select.styleAsNative) {
        kindle.ui.select.styleAsNative(elementSrcLangList);
        kindle.ui.select.styleAsNative(elementDestLangList);
    }
    var paginateDiv = document.getElementById("content");
    var compStyle = getComputedStyle(paginateDiv, "");
    var lineHeight = compStyle.getPropertyValue("line-Height");
    lineHeight = lineHeight.replace("px", "");
    scroller = kindle.createLitePaginationController(paginateDiv, lineHeight);
    updateScrollBar();
};
var initOnLoad = function() {
    initElement();
    initAllTextDivs();
    translator = new Translator({
        stringLoader: stringLoader,
        onLoading: onLoadingCallback,
        onLookup: onLookupCallback,
        onLookupError: onLookupErrorCallback,
        maximizeHeight: maximizeHeight,
        initUI: initUI
    });
    destinationLang = translator.loadDefaultTargetLanguage();
    if (!supportedLanguages[destinationLang]) {
        destinationLang = translator.languageFromLocale((new Locale()).locale);
    }
    elementSrcLangLabel.innerHTML = convertStringToHtmlEntities(stringLoader.findString("from_language"));
    elementDestLangLabel.innerHTML = convertStringToHtmlEntities(stringLoader.findString("to_language"));
    var selection = kindle.reader.getCurrentSelection();
    if (selection !== undefined && selection.text !== null) {
        translator.lookup(selection.text, selection.range.begin, selection.range.end, undefined, destinationLang, true);
        elementSrcLangList.onchange = function() {
            hideAllTextDivs();
            var sourceLanguage = elementSrcLangList.options[elementSrcLangList.selectedIndex].value;
            translator.lookup(selection.text, selection.range.begin, selection.range.end, sourceLanguage, elementDestLangList.options[elementDestLangList.selectedIndex].value, false);
            if (autoLanguage && autoLanguage != sourceLanguage) {
                metricLogger("SourceLanguageChanged", widget.id, "NA");
            }
        };
        elementDestLangList.onchange = function() {
            hideAllTextDivs();
            elementSrcLangList.options[findOptionIndexByValue(elementSrcLangList, AUTODETECT_OPTION_VAL)].innerHTML = convertStringToHtmlEntities(stringLoader.findString("language_detecting"));
            var destinationLanguage = elementDestLangList.options[elementDestLangList.selectedIndex].value;
            translator.lookup(selection.text, selection.range.begin, selection.range.end, elementSrcLangList.options[elementSrcLangList.selectedIndex].value, destinationLanguage, false);
            if (!contentLanguage) {
                contentLanguage = translator.languageFromLocale(getReader().getCurrentContentMetadata().contentLocale);
            }
            if (destinationLanguage != contentLanguage) {
                metricLogger("DestinationLanguageChanged", widget.id, "NA");
            }
            translator.saveDefaultTargetLanguage(destinationLanguage);
        };
    } else {
        elementResult.innerHTML = convertStringToHtmlEntities(stringLoader.findString("unknown_error"));
        showTranslationResult();
    }
    elementAboutLink.innerHTML = convertStringToHtmlEntities(stringLoader.findString("about_link_text"));
    elementLinkMsg.innerHTML = convertStringToHtmlEntities(stringLoader.findString("back_link_text"));
    elementAboutLink.onclick = function() {
        oldelementTranslatorMainDisplayVal = hideElement(elementTranslatorMain);
        showElement(elementAboutDiv, oldAboutDivVal);
    };
    elementLinkMsg.onclick = function() {
        oldAboutDivVal = hideElement(elementAboutDiv);
        showElement(elementTranslatorMain, oldelementTranslatorMainDisplayVal);
        updateScrollBar();
    };
    document.body.style.setProperty("display", "block");
    maximizeHeight();
};
window.onresize = function() {
    maximizeHeight();
};
kindle.reader.onbutton = function(params) {
    initOnLoad();
};
