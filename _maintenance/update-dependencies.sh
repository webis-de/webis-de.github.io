#!/usr/bin/env bash

maintenance=$(realpath $(dirname $0))
cd ${maintenance}/..

if ! command -v npm > /dev/null; then
    echo "NPM not installed. Please install it via" >&2
    echo "    sudo apt install npm" >&2
    exit 1
fi

# fetch dependencies
npm upgrade

# copy over files from node_modules folder
rsync -a --delete node_modules/uikit/src/scss/ _sass/uikit/

rsync -a --delete node_modules/uikit/dist/js/ js/thirdparty/uikit/
rsync -a --delete node_modules/@fortawesome/fontawesome-free/js/ js/thirdparty/fontawesome/
rsync -a --delete node_modules/jquery/dist/ js/thirdparty/jquery/
rsync -a --delete node_modules/datatables.net-dt/js/ js/thirdparty/datatables.net/
rsync -a --delete node_modules/datatables.net/js/ js/thirdparty/datatables.net/

cd ${maintenance}
