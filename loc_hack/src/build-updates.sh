#! /bin/bash

source config

PKGNAME="$HACKNAME"
PKGVER="${VERSION}-${RELEASE}"

# Prepare our files for this specific kindle model...
ARCH=${PKGNAME}_${PKGVER}

tar cvz --xform "s|^install/||" --xform "s|^install$|.|" --show-transformed-names -f localization.pack  -C ../.. install
recode -f utf8..flat < README_${VERSION} > ${README}.txt
unix2dos ${README}.txt
echo "$PKGVER" > version.txt
sed "s/%VERSION%/${VERSION}/g;s/%INSTALLKUG%/${INSTALLKUG}/g" < localization.conf.in > localization.conf

# Build install update
cp -f install.sh run.ffs
./kindletool create ota2 --device $DEVICE run.ffs localization.conf localization.pack debrick debrick.conf dropbear_dss_host_key dropbear_rsa_host_key dropbearmulti version.txt Update_${ARCH}_install.bin

# Build uninstall update
cp -f uninstall.sh run.ffs
./kindletool create ota2 --device $DEVICE run.ffs Update_${ARCH}_uninstall.bin

rm -f run.ffs
rm -f localization.pack
rm -f version.txt
rm -f localization.conf

[ -f ../${PKGNAME}_${PKGVER}.zip ] && rm -f ../${PKGNAME}_${PKGVER}.zip
zip ../${PKGNAME}_${PKGVER}.zip *.bin ${README}.txt original_margins original_fontsizes
rm -f *.bin

rm -f ${README}.txt
