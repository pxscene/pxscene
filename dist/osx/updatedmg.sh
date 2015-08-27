#!/bin/bash
if [ "$#" -ne 1 ]; then
  printf "Updates the Info.plist new .dmg's hash and size and copies the .dmg to the correct location.\n"
  printf "Usage: $0 <dmg file>\n"
  printf "Example: $0 deploy/MacOSX/pxscene.dmg\n"
  exit 1
fi
<<<<<<< HEAD
#name="${1%.*}"
#echo "$name"
updatefile=osx/Info.plist
dmg=osx/pxscene/pxscene.dmg
size=`ls -l "$1" | cut -d" " -f7`
sline=16
srep="      <string>$size<\/string>"
echo "$srep"
# using : instead of / due slashes in replacement text
sed -i "" -e "${sline}s:.*:${srep}:" $updatefile
hash=`openssl sha1 -binary "$1" | openssl base64`
hline=14
hrep="      <string>$hash<\/string>"
echo "$hrep"
sed -i "" -e "${hline}s:.*:${hrep}:" $updatefile
cp $1 osx/pxscene/pxscene.dmg
git status
=======

FILE=osx/Info.plist
SIZE=`ls -l "$1" | cut -d" " -f7`
SLINE=16
SREP="      <string>${SIZE}<\/string>"
HASH=`openssl sha1 -binary "${1}" | openssl base64`
HLINE=14
HREP="      <string>${HASH}<\/string>"
DEST=osx/pxscene/pxscene.dmg

printf "Updating ${FILE} for ${1}\n"
# using : instead of / due slashes in replacement text
printf "Changing size on line ${SLINE} to ${SIZE}\n"
sed -i "" -e "${SLINE}s:.*:${SREP}:" ${FILE}
printf "Changing hash on line ${HLINE} to ${HASH}\n"
sed -i "" -e "${HLINE}s:.*:${HREP}:" ${FILE}
printf "Copying ${1} to ${DEST}\n"
cp ${1} ${DEST}
printf "Update complete.\n"
#git status
>>>>>>> a5c128e209b0ed6fce59e531457131226019430a
#git commit -a
#git push
#cd ..
