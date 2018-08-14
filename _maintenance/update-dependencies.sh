#!/usr/bin/env bash

maintenance=$(dirname $0)
cd ${maintenance}/..

# find out which command to use
if [ -x /usr/bin/yarn ]; then
    # use absolute path to avoid clashes with Apache Yarn
    # which may be somewhere on the path, but hopefully
    # not in /usr/bin
    CMD=/usr/bin/yarn
elif command -v npm > /dev/null; then
    CMD=npm
else
    echo "Neither Yarn nor NPM are installed." >&2
    exit 1
fi

# fetch dependencies
$CMD upgrade

# copy over files from node_modules folder
rsync -a --delete node_modules/uikit/src/scss/ _sass/uikit/

rsync -a --delete node_modules/uikit/dist/js/ js/thirdparty/uikit/
rsync -a --delete node_modules/@fortawesome/fontawesome-free/js/ js/thirdparty/fontawesome/
rsync -a --delete node_modules/jquery/dist/ js/thirdparty/jquery/
rsync -a --delete node_modules/datatables.net-dt/js/ js/thirdparty/datatables.net/
rsync -a --delete node_modules/datatables.net/js/ js/thirdparty/datatables.net/

cd ${maintenance}
