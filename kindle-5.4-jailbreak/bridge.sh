#!/bin/sh
#
# Kindle Touch/PaperWhite JailBreak Bridge
#
# $Id: bridge.sh 10721 2014-07-21 22:23:15Z NiLuJe $
#
##

ROOT=""
IS_TOUCH="false"
IS_PW1="false"
IS_PW2="false"
K5_ATLEAST_54="false"

# Pull some helper functions for logging
source /etc/upstart/functions

LOG_DOMAIN="jb_bridge"

logmsg()
{
	f_log "${1}" "${LOG_DOMAIN}" "${2}" "${3}" "${4}"
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
	DEV=`rdev | awk '{ print $1 }'`
	if [ "${DEV}" != "/dev/mmcblk0p1" -a -n "${DEV}" ] ; then	# K4 doesn't have rdev on rootfs but does on diags, weird
		ROOT="/tmp/root"
		logmsg "I" "mount_root_rw" "" "We are not on rootfs, using ${ROOT}"
		[ -d "${ROOT}" ] || mkdir "${ROOT}"
		mount -o rw "/dev/mmcblk0p1" "${ROOT}"
	else
		logmsg "I" "mount_root_rw" "" "We are on rootfs"
		mount_rw
	fi
}

check_model()
{
	# Do the S/N dance...
	kmodel="$(cut -c3-4 /proc/usid)"
	case "${kmodel}" in
		"24" | "1B" | "1D" | "1F" | "1C" | "20" )
			# PaperWhite 1 (2012)
			IS_PW1="true"
		;;
		"D4" | "5A" | "D5" | "D6" | "D7" | "D8" | "F2" | "17" | "60" | "F4" | "F9" | "62" | "61" | "5F" )
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

check_version()
{
	# The great version check!
	kpver="$(grep '^Kindle 5' ${ROOT}/etc/prettyversion.txt 2>&1)"
	if [ $? -ne 0 ] ; then
		logmsg "W" "check_version" "" "couldn't detect the kindle major version!"
		# We're in a bit of a pickle... Make an educated guess...
		if [ "${IS_PW2}" == "true" ] ; then
			# The PW2 shipped on 5.4.0 ;)
			logmsg "I" "check_version" "" "PW2 detected, assuming >= 5.4"
			K5_ATLEAST_54="true"
		else
			# Poor man's last resort trick. See if we can find a new feature of FW 5.4 on the FS...
			if [ -f ${ROOT}/etc/upstart/contentpackd.conf ] ; then
				logmsg "I" "check_version" "" "found a fw >= 5.4 feature"
				K5_ATLEAST_54="true"
			fi
			# NOTE: Alternative checks:
			# -x ${ROOT}/usr/bin/contentpackd
			# -f ${ROOT}/opt/amazon/ebook/lib/VocabBuilderSDK.jar
			# -f ${ROOT}/opt/amazon/ebook/booklet/VocabBuilderBooklet.jar
		fi
	else
		# Weeee, the great case switch!
		khver="$(echo ${kpver} | sed -n -r 's/^(Kindle)([[:blank:]]*)([[:digit:].]*)(.*?)$/\3/p')"
		case "${khver}" in
			5.0* )
				K5_ATLEAST_54="false"
			;;
			5.1* )
				K5_ATLEAST_54="false"
			;;
			5.2* )
				K5_ATLEAST_54="false"
			;;
			5.3* )
				K5_ATLEAST_54="false"
			;;
			5.4* )
				K5_ATLEAST_54="true"
			;;
			5.* )
				# Assume newer, just to be safe ;)
				K5_ATLEAST_54="true"
			;;
			* )
				# Given the previous checks, this shouldn't be reachable, but cover all bases anyway...
				logmsg "W" "check_version" "" "couldn't detect the kindle version!"
				# Poor man's last resort trick. See if we can find a new feature of FW 5.4 on the FS...
				if [ -f ${ROOT}/etc/upstart/contentpackd.conf ] ; then
					logmsg "I" "check_version" "" "found a fw >= 5.4 feature"
					K5_ATLEAST_54="true"
				fi
			;;
		esac
	fi
}

print_jb_install_feedback()
{
	# We need to know our model
	check_model
	# Prepare our stuff...
	kh_eips_string="**** JAILBREAK ****"

	# And finally, show our message, centered on the bottom of the screen
	eips $(((${EIPS_MAXCHARS} - ${#kh_eips_string}) / 2)) $((${EIPS_MAXLINES} - 2)) "${kh_eips_string}"
}

print_fw54_exec_install_feedback()
{
	# We need to know our model
	check_model
	# Prepare our stuff...
	kh_eips_string="**** FW 5.4 JB ****"

	# And finally, show our message, centered on the bottom of the screen
	eips $(((${EIPS_MAXCHARS} - ${#kh_eips_string}) / 2)) $((${EIPS_MAXLINES} - 2)) "${kh_eips_string}"
}

install_touch_update_key()
{
	mount_root_rw
	logmsg "I" "install_touch_update_key" "" "Copying the jailbreak updater key"
	cat > "${ROOT}/etc/uks/pubdevkey01.pem" << EOF
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDJn1jWU+xxVv/eRKfCPR9e47lP
WN2rH33z9QbfnqmCxBRLP6mMjGy6APyycQXg3nPi5fcb75alZo+Oh012HpMe9Lnp
eEgloIdm1E4LOsyrz4kttQtGRlzCErmBGt6+cAVEV86y2phOJ3mLk0Ek9UQXbIUf
rvyJnS2MKLG2cczjlQIDAQAB
-----END PUBLIC KEY-----
EOF
	mount_ro

	# Show some feedback
	print_jb_install_feedback
}

install_fw54_exec_userstore_flag()
{
	# Make sure we're on FW >= 5.4...
	check_model
	check_version

	if [ "${K5_ATLEAST_54}" == "true" ] ; then
		mount_root_rw
		logmsg "I" "install_fw54_exec_userstore_flag" "" "Creating the userstore exec flag file"
		touch "${ROOT}/MNTUS_EXEC"
		mount_ro

		# Show some feedback
		print_fw54_exec_install_feedback
	fi
}

clean_up()
{
	if [ -n "${ROOT}" ] ; then
		logmsg "I" "clean_up" "" "Unmounting rootfs"
		umount "${ROOT}"
	fi
}

# Start with the userstore exec flag on FW >= 5.4 (so that the last eips print shown will make sense)
if [ ! -f "${ROOT}/MNTUS_EXEC" ] ; then
	install_fw54_exec_userstore_flag
fi

# Check if we need to do something
if [ ! -f "${ROOT}/etc/uks/pubdevkey01.pem" ] ; then
	# No jailbreak key, install it
	install_touch_update_key
else
	# Jailbreak key found... Check it.
        if [ "$(md5sum "${ROOT}/etc/uks/pubdevkey01.pem" | awk '{ print $1; }')" != "7130ce39bb3596c5067cabb377c7a9ed" ] ; then
		# Unknown (?) jailbreak key, install it
		install_touch_update_key
	fi
fi

# Nothing to do or cleanup...
clean_up

# And don't try anything fancier, the userstore isn't mounted yet...

return 0
