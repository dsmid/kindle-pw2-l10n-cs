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

progress 30 "Removing upstart config"
rm -f /etc/upstart/localization.conf || fail "Unable to remove upstart config"

progress 60 "Enabling autoupdates"
if [ -f /etc/todo/handler_registry.conf ]
then
    sed -i 's/^[#]\(.*=com[.]lab126[.]ota\)$/\1/g' /etc/todo/handler_registry.conf
fi

progress 80 "Removing language files"
rm -rf /mnt/us/localization || fail "Unable to remove language files"

progress 100 "Uninstallation complete."
