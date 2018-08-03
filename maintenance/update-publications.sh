#!/usr/bin/env bash

maintenance=$(dirname $0)
publications=$maintenance/../src_data/publications
out=$maintenance/../_includes

php $maintenance/bib2html.php $publications/pub-stein.bib $publications/pub-webis.bib > out/publications_bib.html
$maintenance/update-headers-and-footers.sh
