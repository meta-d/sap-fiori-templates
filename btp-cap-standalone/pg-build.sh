#!/bin/bash
echo 'building postgres db...'

mkdir -p gen/pg/srv
cds compile '*' > gen/pg/srv/csn.json
cp -r db/data gen/pg/srv
cp -r db/package.json gen/pg/