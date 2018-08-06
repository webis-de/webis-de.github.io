#!/usr/bin/env bash

maintenance=$(dirname $0)
cd ${maintenance}/..

# fetch dependencies
/usr/bin/yarn upgrade

# copy over files from node_modules folder
rsync -a --delete node_modules/uikit/src/scss/ _sass/uikit/

rsync -a --delete node_modules/uikit/dist/js/ js/thirdparty/uikit/
rsync -a --delete node_modules/@fortawesome/fontawesome-free/js/ js/thirdparty/fontawesome/
rsync -a --delete node_modules/jquery/dist/ js/thirdparty/jquery/
rsync -a --delete node_modules/datatables.net-dt/js/ js/thirdparty/datatables.net/
rsync -a --delete node_modules/datatables.net/js/ js/thirdparty/datatables.net/

cd ${maintenance}
