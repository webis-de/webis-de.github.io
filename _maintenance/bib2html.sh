#!/usr/bin/env bash

maintenance=$(dirname $0)
publications=$maintenance/../_src_data/publications
out=$maintenance/../_includes

if ! command -v sponge 2>&1 > /dev/null; then
    echo "'sponge' command not installed, please install it with" >&2
    echo "  sudo apt install moreutils" >&2
    exit 1
fi

php ${maintenance}/bib2html.php ${publications}/pub-stein.bib ${publications}/pub-webis.bib | sponge ${out}/publications_bib.html
