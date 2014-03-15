/**
 * strings.js
 *
 * Copyright (c) 2012 Amazon Technologies, Inc.  All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL
 *
 * Use is subject to license terms.
 */

/**
 * Module adds browser strings to the default Mesquite strings pre-added
 * to the b (browser) namespace.
 *
 * This file should have localized versions.
 */
Kindle.add('browserStrings', function (b) {
    /**
     * Object with browser strings
     */
    var browserStrings = {
        /**
         * Browser error messages
         */
        errors: {
            badProtocol: 'Web Browser cannot download files using this protocol. &nbsp;Only HTTP and HTTPS protocols are supported.',
            downloadFailed: 'Web Browser was unable to download {filename}. &nbsp;Please try again later.',
            downloadRejected: 'Web Browser cannot download this kind of file.<p>Only files with the extension .AZW, .PRC, .MOBI or .TXT can be downloaded to your Kindle.</p>',
            uploadRejected: 'Web Browser does not support file uploads.',
            register: 'In order to browse, you must first register your Kindle with your Amazon user account.',
            confirmSsl: 'Web Browser is unable to establish a secure connection. Do you still want to proceed?',
            blockedDomain: 'Web Browser requires a Wi-Fi connection. &nbsp;Tap OK to establish a Wi-Fi connection.',
            noAccess: 'Sorry, the browser cannot access this website.',
            accountError: 'There is a problem with your Kindle account.<p>Please contact Customer Service at www.kindle.com/support.</p>',
            systemFailure: 'We are experiencing some technical difficulties. Please try again later.',
            remoteFailure: 'Sorry, the browser cannot access this website currently. &nbsp;Please try again later.',
            accessEmbargo: 'Due to local restrictions, web browsing is not available for all countries.',
            appInvalid: 'Sorry, application is invalid.',
            roamingBlocked: 'Sorry, roaming is not allowed.',
            deviceBlocked: 'Sorry, the device was blocked.',
            appBlocked: 'Sorry, the application was blocked.',
            quotaExceeded: 'Sorry, the application has exceeded its quota.',
            accessBlocked: 'Sorry, access to Whispernet is blocked.'
        },

        /**
         * Browser page and dialog titles
         */
        titles: {
            bookmarks: 'Bookmarks',
            editBookmark: 'Edit Bookmark',
            removeBookmark: 'Remove a Bookmark',
            history: 'History',
            settings: 'Settings',
            search: 'Search',
            downloadFile: 'Download File',
            downloadFailed: 'Download Failed',
            downloadRejected: 'Invalid File Type',
            badProtocol: 'Invalid Protocol',
            uploadFile: 'Upload File',
            register: 'Registration Required',
            confirmSsl: 'Invalid Certificate',
            duplicateBookmark: 'Duplicate Bookmark',
            blockedDomain: 'Wi-Fi Connection Required',
            httpError: 'Website Inaccessible'
        },

        /**
         * Browser menu item labels
         */
        items: {
            articleMode: 'Article Mode',
            webMode: 'Web Mode',
            bookmarks: 'Bookmarks',
            bookmarkPage: 'Bookmark this Page',
            history: 'History',
            settings: 'Browser Settings',
            clearHistory: 'Clear History',
            clearCookies: 'Clear Cookies',
            enableJavascript: 'Enable JavaScript',
            disableJavascript: 'Disable JavaScript',
            enableImages: 'Enable Images',
            disableImages: 'Disable Images',
            todayFormat: 'Today - {date}',
            yesterdayFormat: 'Yesterday - {date}'
        },

        /**
         * Browser messages that are not errors
         */
        messages: {
            downloadConfirm: 'Download {filename}?<br><br>Once the download is complete, the file will appear on the Home screen. &nbsp;Are you sure you wish to proceed?',
            downloadSuccess: 'Web Browser downloaded {filename} successfully.',
            duplicateBookmark: 'Another page with the same URL is already bookmarked.<br><br>Do you wish to overwrite it?'
        },

        /**
         * Default Bookmarks.  Browser loads these when first run and stores
         * them in local storage.
         */
        defaultBookmarks: [
            {
                name: 'Amazon',
                url: 'http://www.amazon.co.uk/'
            },
            {
                name: 'Wikipedia',
                url: 'http://en.wikipedia.org/'
            },
            {
                name: 'Google',
                url: 'http://www.google.co.uk/'
            },
            {
                name: 'Gmail',
                url: 'http://m.gmail.com/'
            },
            {
                name: 'Yahoo',
                url: 'http://uk.yahoo.com/'
            },
            {
                name: 'Yahoo Mail',
                url: 'http://m.yahoo.com/mail?.intl=gb'
            },
            {
                name: 'The Daily Mail',
                url: 'http://www.dailymail.co.uk/'
            },
            {
                name: 'BBC News',
                url: 'http://news.bbc.co.uk/'
            },
            {
                name: 'Facebook',
                url: 'http://m.facebook.com/'
            },
            {
                name: 'Twitter',
                url: 'http://mobile.twitter.com/'
            },
            {
                name: 'Internet Movie DB',
                url: 'http://uk.imdb.com/'
            }
        ],

        /**
         * Actions available to browser's go function
         */
        goActions: {
            website: {
                label: 'Web',
                description: 'Web Address'
            },
            google: {
                label: 'Google',
                description: 'Google',
                url: 'http://www.google.co.uk/search?q='
            }
        }
    };

    /**
     * Merge with strings object
     */
    b.strings = b.object.extend(browserStrings, b.strings);
},
// preload modules
['strings', 'object']);
