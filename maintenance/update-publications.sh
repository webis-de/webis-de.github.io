#!/bin/bash

maintenance=$(dirname $0)
publications=$maintenance/../publications

php $maintenance/bib2html.php $publications/pub-stein.bib $publications/pub-webis.bib > $publications/publications.html
$maintenance/update-headers-and-footers.sh

