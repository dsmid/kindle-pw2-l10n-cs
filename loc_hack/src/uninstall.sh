#!/bin/sh
OTA=com.lab126.blanket.ota
USERROOT="/mnt/us/localization"
BACKUPROOT="/opt/backup/localization"

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


restore() {
    if [ -d "$BACKUPROOT" ]
    then
        if [ -f "$BACKUPROOT"/ADDED_FILES ]
        then
            while read added_file
            do
                rm -f "$added_file" || true
            done < "$BACKUPROOT"/ADDED_FILES
        fi
        
        if [ -d /opt/keymap ]
        then
            rm -rf /opt/keymap || true
        fi

        OLDPWD=$PWD
        cd "$BACKUPROOT"
        if ! tar c -C "$BACKUPROOT" * | tar x -C /
        then
            if [ -d "$USERROOT" ]
            then
                echo "[$(date +'%F %T')] Unable extract backup, cannot restore" >> "$USERROOT"/error.log
            fi
        fi
        cd $OLDPWD

        [ -f /INSTALLED_MD5 ] && rm -f /INSTALLED_MD5 || true
        [ -f /ADDED_FILES ] && rm -f /ADDED_FILES || true
        [ -f "$BACKUPROOT/INSTALLED_MD5" ] && rm -f "$BACKUPROOT/INSTALLED_MD5" || true

        return 0
    else
        if [ -d "$USERROOT" ]
        then
            echo "[$(date +'%F %T')] Missing backup, cannot restore" >> "$USERROOT"/error.log
        fi
        return 2
    fi
}

progress 10 "Mounting main partition r/w"
mntroot rw || fail "Unable to mount main partition r/w".

progress 20 "Restoring original contents"
restore || fail "Unable to restore original contents"

progress 40 "Removing upstart config"
rm -f /etc/upstart/localization.conf || fail "Unable to remove upstart config"

progress 50 "Enabling autoupdates"
if [ -f /etc/todo/handler_registry.conf ]
then
    sed -i 's/^[#]\(.*=com[.]lab126[.]ota\)$/\1/g' /etc/todo/handler_registry.conf
fi

progress 60 "Removing l10n pack"
rm -rf "$USERROOT"

progress 80 "Removing backup"
rm -rf "$BACKUPROOT"

progress 100 "Uninstallation complete."
