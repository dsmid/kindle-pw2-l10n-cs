kindle-pw2-l10n-cs
==================

Czech localization for Kindle Paperwhite 2

I took a different approach than ixtab & Co.
Instead of adding a new locale, I just 'replaced' en_GB specific files with Czech counterparts. I now that it is not POSIXly correct but it's safe and easy. Adding new files would be very difficult as many resources happen to dwell inside CRAMFS loopback files. One English locale is more than enough for a non-English speaking user anyway.
I've used Sir Alex' K3Translator to inject Czech phrases into the JARs instead of the British ones. It's very similar to K3 localization process.
To be on the safe side I don't overwrite stock files and dirs but bind-mount the Czech replacement instead. The only addition to the system is a simple upstart config file that performs the bindings listed in userstore.
This approach should work on all Kindle models, even Touch and Paperwhite 1 but I can't localize these because I don't own any of them.

I'm looking for volunteers brave enough to test the localization or able to help with translation.
When the Czech localization is ready I will be prepared to help with localizing to other languages.
