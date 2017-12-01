#! /bin/sh

# <codex>
# <abstract>Script to remove everything installed by the sample.</abstract>
# </codex>

# This uninstalls everything installed by the sample.  It's useful when testing to ensure that 
# you start from scratch.

sudo launchctl unload /Library/LaunchDaemons/com.aescripts.ZXP-Installer.Helper.plist
sudo rm /Library/LaunchDaemons/com.aescripts.ZXP-Installer.Helper.plist
sudo rm /Library/PrivilegedHelperTools/com.aescripts.ZXP-Installer.Helper.plist
