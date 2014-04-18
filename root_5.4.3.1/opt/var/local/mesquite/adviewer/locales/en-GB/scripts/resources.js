/*
 * strings.js
 *
 * Copyright (c) 2011 Amazon Technologies, Inc. All rights reserved.
 *
 * PROPRIETARY/CONFIDENTIAL
 *
 * Use is subject to license terms.
 */

var AdResources = (function() {
    /**
     * Object for all of our strings. The intention is so we can localize in the future.
     */
    var strings = {
           menu: {
            viewSpecialOffers: 'View Special Offers'
        },

        dialogs: {          
            standardClose: "Close",
            purchaseGeneralServerError_title: "Error",
            purchaseGeneralServerError_msg: "Your purchase could not be completed. We are experiencing technical difficulties. Please try again later.",
            purchaseGeneralDeviceError_title: "Error",
            purchaseGeneralDeviceError_msg: "We are unable to process your request. Please try again later.",
            purchaseLimit_title: "Purchase Limit Reached",
            purchaseLimit_msg: "Your purchase could not be completed. You have reached the maximum purchase quantity.",
            purchaseExpiredOffer_title: "Offer Expired",
            purchaseExpiredOffer_msg: "Your purchase could not be completed. This offer has expired.",
            purchaseLocked_title: "Purchasing Locked",
            purchaseLocked_msg: "Parental Controls are enabled on your Kindle. Purchases are not allowed.",
            adDetailsError_msg: "Details for this advert are no longer available. Turn on wireless to receive the latest content.",
            adDetailsConnectedError_msg: "Details for this advert are no longer available.",
            deviceUnregistered_title: "Device Not Registered",
            deviceUnregistered_msg: "You must register your Kindle to make a purchase.",
            pendingPurchaseInfo_msg: "You already have {count} order(s) pending for this special offer.",
        },

        templates: {
            offlineThankYouTemplate: {
                docTitle: 'Thank you for your order',
                title: '{customerName}, you have nearly finished.',
                subtitle: 'Your order will be placed when you connect to wireless.',
                message: 'To complete your AmazonLocal order, connect to a wireless network within the next {purchaseDaysRemaining} days. We will send a voucher to the Home screen and a notification to your e-mail account once your order has processed. The voucher will contain instructions on how to redeem this offer.',
                pendingLinkText: 'You have other orders pending. Click here to view',
                viewAllOffersLinkText: 'View All Special Offers',
                cancelLinkText: 'Purchased by Accident? Cancel this Order'
            },
            offlineCancelConfirmTemplate: {
                docTitle: 'Order Cancelled',
                title: 'Order Cancelled',
                message: 'You have successfully cancelled your order for {dealTitle} from {merchantName}. Your credit card was not charged.',
                viewAllOffersLinkText: 'View All Special Offers'
            },
            backupDetailsTemplate: {
                docTitle: 'Special Offer',
                registeredMessage: 'Please connect wirelessly to download the latest Special Offers. New offers will display automatically when available.',
                unRegisteredMessage: 'Please register your Kindle to receive the latest Special Offers. New offers will display automatically when available.'
            }
        }
	
	};
    
    // AdResources public interface
    return {
        strings: strings
    };

} ()); // end AdResources
