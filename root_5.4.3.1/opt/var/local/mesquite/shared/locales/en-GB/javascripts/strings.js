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
 * Module provides strings for Mesquite applications.  Individual applications
 * can add to this as needed by creating a module that modifies the strings
 * namespace.
 */
Kindle.add('strings', function (sandbox) {
    /**
     * Reference to strings namespace added to sandbox
     * @namespace
     */
    var strings = Kindle.addNamespace('strings', sandbox);

    // Strings added below.  These should be localized.

    /**
     * Error messages
     * @public
     * @namespace
     */
    strings.errors = {
        noConnection: 'Your Kindle is currently unable to connect.<br><br>Please try again later.'
    };

    /**
     * Page or dialog titles
     * @public
     * @namespace
     */
    strings.titles = {
        noConnection: 'Unable to Connect',
        wirelessOff: 'Connection Required',
        mainMenu: 'Menu'
    };

    /**
     * Button labels
     * @public
     * @namespace
     */
    strings.buttons = {
        close: 'Close',
        cancel: 'Cancel',
        remove: 'Remove',
        edit: 'Edit',
        ok: 'OK'
    };

    /**
     * Common menu items
     * @public
     * @namespace
     */
    strings.items = {
        turnWirelessOff: 'Turn Off Wireless',
        turnWirelessOn: 'Turn On Wireless',
        shopInStore: 'Shop in Kindle Store',
        screenLight: 'Screen Light'
    };
});
