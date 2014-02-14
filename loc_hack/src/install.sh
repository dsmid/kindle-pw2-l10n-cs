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

progress 30 "Copying upstart config to main partition"
cp -f localization.conf /etc/upstart/ || fail "Unable to copy upstart config"


progress 50 "Copying l10n pack to user store"
[ -d /mnt/base-us/localization ] || mkdir /mnt/base-us/localization || fail "Unable to create l10n dir"
cp -f localization.pack /mnt/base-us/localization/ || fail "Unable to copy l10n pack"

bookmarks=/mnt/base-us/.active_content_sandbox/browser/resource/LocalStorage/file__0.localstorage
md5=$(md5sum $bookmarks 2>/dev/null | (read md file; echo $md))
if [ "$md5" == "e97836b4b5a37a608ff01208542ac870" -o "$md5" == "6a5d715e7411f4958da84927fbbc100b" ]
then
    progress 70 "Resetting bookmarks"
    rm -f $bookmarks
fi

progress 80 "Setting system locale"
echo -e "LANG=en_GB.UTF-8\nLC_ALL=en_GB.UTF-8" > /var/local/system/locale
sed -i 's/^locale=.*$/locale=en-GB/' /var/local/java/prefs/com.amazon.ebook.framework/prefs

progress 90 "Disabling autoupdates"
if [ -f /etc/todo/handler_registry.conf ]
then
    sed -i 's/^[^#].*=com[.]lab126[.]ota$/#\0/g' /etc/todo/handler_registry.conf
fi

progress 100 "Installation complete."
