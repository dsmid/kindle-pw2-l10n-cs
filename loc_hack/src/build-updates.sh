#! /bin/bash

source config

PKGNAME="$HACKNAME"
PKGVER="${VERSION}-${RELEASE}"

# Prepare our files for this specific kindle model...
ARCH=${PKGNAME}_${PKGVER}

tar cvz --xform "s|^|localization/|" --show-transformed-names -f localization.tar.gz overlay.list -C ../.. overlay
recode -f utf8..flat < cti-me-utf8.txt > cti-me.txt
unix2dos cti-me.txt

# Build install update
cp -f install.sh run.ffs
./kindletool create ota2 --device paperwhite2 run.ffs localization.conf localization.tar.gz update_${ARCH}_install.bin

# Build uninstall update
cp -f uninstall.sh run.ffs
./kindletool create ota2 --device paperwhite2 run.ffs update_${ARCH}_uninstall.bin

rm -f run.ffs
rm -f localization.tar.gz

[ -f ../${PKGNAME}_${PKGVER}.zip ] && rm -f ../${PKGNAME}_${PKGVER}.zip
zip ../${PKGNAME}_${PKGVER}.zip *.bin cti-me.txt
rm -f *.bin
