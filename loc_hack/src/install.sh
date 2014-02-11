#!/bin/sh

OTA=com.lab126.blanket.ota

progress()
{
	lipc-send-event $OTA otaSplashProgress -i $1
	local x=48
	local y=11
	eips 0 $y "                                                ";
	eips $((($x - $(expr length "$2")) / 2)) $y "$2"
	sleep 2
}

fail()
{
	lipc-send-event $OTA otaSplashError -s "${1}"
	sleep 10
	exit 1;
}

progress 10 "Mounting main partition r/w"
mntroot rw || fail "Unable to mount main partition r/w".

progress 20 "Copying upstart config to main partition"
cp localization.conf /etc/upstart/ || fail "Unable to copy upstart config"


if [ -d /mnt/base-us/localization ]
then
    progress 30 "Removing existing language files"
    mv -f /mnt/base-us/localization /mnt/base-us/tmp.$$
    rm -rf /mnt/base-us/tmp.$$
fi

progress 40 "Unpacking language files to user store"
tar xzf localization.tar.gz -C /mnt/base-us/

bookmarks=/mnt/base-us/.active_content_sandbox/browser/resource/LocalStorage/file__0.localstorage
md5=$(md5sum $bookmarks 2>/dev/null | (read md file; echo $md))
if [ "$md5" == "e97836b4b5a37a608ff01208542ac870" -o "$md5" == "6a5d715e7411f4958da84927fbbc100b" ]
then
    progress 60 "Resetting bookmarks"
    rm -f $bookmarks
fi

progress 70 "Copying manual to Kindle"
cp -f /mnt/base-us/localization/overlay/kug/Kindle_Users_Guide.azw3 /mnt/base-us/documents/
[ -d /mnt/base-us/documents/Kindle_Users_Guide.sdr ] && rm -rf /mnt/base-us/documents/Kindle_Users_Guide.sdr

progress 80 "Setting system locale"
echo -e "LANG=en_GB.UTF-8\nLC_ALL=en_GB.UTF-8" > /var/local/system/locale
sed -i 's/^locale=.*$/locale=en-GB/' /var/local/java/prefs/com.amazon.ebook.framework/prefs

progress 90 "Disabling autoupdates"
if [ -f /etc/todo/handler_registry.conf ]
then
    sed -i 's/^[^#].*=com[.]lab126[.]ota$/#\0/g' /etc/todo/handler_registry.conf
fi

progress 100 "Installation complete."
