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
cp localization.conf /etc/upstart/ || fail "Unable to copy upstart config"


if [ -d /mnt/us/localization ]
then
    progress 40 "Removing existing language files"
    rm -rf /mnt/us/localization
fi

progress 60 "Unpacking language files to user store"
tar xzf localization.tar.gz -C /mnt/us/

progress 80 "Setting system locale"
echo -e "LANG=en_GB.UTF-8\nLC_ALL=en_GB.UTF-8" > /var/local/system/locale

progress 90 "Disabling autoupdates"
if [ -f /etc/todo/handler_registry.conf ]
then
    sed -i 's/^[^#].*=com[.]lab126[.]ota$/#\0/g' /etc/todo/handler_registry.conf
fi

progress 100 "Installation complete."
