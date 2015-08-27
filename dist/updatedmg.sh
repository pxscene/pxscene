#!/bin/bash
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <dmg file>"
  echo "Example: $0 testapp.dmg"
  exit 1
fi
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
#git commit -a
#git push
#cd ..
