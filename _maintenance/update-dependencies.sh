#!/usr/bin/env bash

maintenance=$(realpath $(dirname $0))
cd ${maintenance}/..


echo "Updating Webis commons.."
git submodule update --init --recursive --remote

cd ${maintenance}
