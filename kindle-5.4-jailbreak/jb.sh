#!/bin/sh
#
# Kindle Touch/PaperWhite JailBreak Install
#
# $Id: 5.4-install.sh 10177 2013-11-28 17:49:29Z NiLuJe $
#
##


# Pull some helper functions for logging
source /etc/upstart/functions

LOG_DOMAIN=jb_install

logmsg()
{
	f_log $1 ${LOG_DOMAIN} $2 "$3" "$4"
}

RW=
mount_rw() {
	if [ -z "$RW" ] ; then
		RW=yes
		mount -o rw,remount /
	fi
}

mount_ro() {
	if [ -n "$RW" ] ; then
		RW=
		mount -o ro,remount /
	fi
}

mount_root_rw()
{
	logmsg "I" "mount_root_rw" "Mounting rootfs rw"
	mount_rw
}

IS_TOUCH="false"
IS_PW1="false"
IS_PW2="false"
check_model()
{
	# Do the S/N dance...
	kusid="$(cat /proc/usid 2>&1)"
	kmodel="$(echo "${kusid}" | sed -n -r 's/^([B9]0)([0-9A-F]{2})([0-9A-Z]{12})$/\2/p')"
	case "${kmodel}" in
		"24" | "1B" | "1D" | "1F" | "1C" | "20" )
			# PaperWhite 1 (2012)
			IS_PW1="true"
		;;
		"D4" | "5A" | "D5" | "D7" | "D8" | "F2" )
			# PaperWhite 2 (2013)
			IS_PW2="true"
		;;
		* )
			# Touch
			IS_TOUCH="true"
		;;
	esac

	# Use the proper constants for our screen...
	if [ "${IS_TOUCH}" == "true" ] ; then
		# Touch
		SCREEN_X_RES=600
		SCREEN_Y_RES=800
		EIPS_X_RES=12
		EIPS_Y_RES=20
	else
		# PaperWhite
		SCREEN_X_RES=768
		SCREEN_Y_RES=1024
		EIPS_X_RES=16
		EIPS_Y_RES=24
	fi
	EIPS_MAXCHARS="$((${SCREEN_X_RES} / ${EIPS_X_RES}))"
	EIPS_MAXLINES="$((${SCREEN_Y_RES} / ${EIPS_Y_RES}))"
}

print_jb_install_feedback()
{
	# Prepare our stuff...
	kh_eips_string="**** JAILBREAK ****"

	# And finally, show our message, centered on the bottom of the screen
	eips $(((${EIPS_MAXCHARS} - ${#kh_eips_string}) / 2)) $((${EIPS_MAXLINES} - 2)) "${kh_eips_string}"
}

install_update_key()
{
	logmsg "I" "install_update_key" "Copying the jailbreak updater key"
	cat > "/etc/uks/pubdevkey01.pem" << EOF
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJn1jWU+xxVv/eRKfCPR9e47lP
WN2rH33z9QbfnqmCxBRLP6mMjGy6APyycQXg3nPi5fcb75alZo+Oh012HpMe9Lnp
eEgloIdm1E4LOsyrz4kttQtGRlzCErmBGt6+cAVEV86y2phOJ3mLk0Ek9UQXbIUf
rvyJnS2MKLG2cczjlQIDAQAB
-----END PUBLIC KEY-----
EOF
}

install_pw2_exec_userstore_flag()
{
	logmsg "I" "install_pw2_exec_userstore_flag" "Creating the userstore exec flag file"
	touch "/MNTUS_EXEC"
}

install_bridge()
{
	logmsg "I" "install_bridge" "Installing the jailbreak bridge"
	cp -f "/mnt/us/bridge.sh" /var/local/system/fixup
	chmod a+x /var/local/system/fixup
}

clean_up()
{
	# Cleanup behind us...
	rm -f "/mnt/us/bridge.sh" /mnt/us/*.bin "/mnt/us/jb.sh"
}


## And... Go!
check_model
mount_root_rw
install_update_key
install_pw2_exec_userstore_flag
install_bridge
mount_ro
print_jb_install_feedback
clean_up

return 0
