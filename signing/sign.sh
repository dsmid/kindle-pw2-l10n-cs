#!/bin/bash

BASE=$(dirname "$(readlink -f "$0")")
java -jar $BASE/widgetsigner.jar -w "$1" -s 0 -k $BASE/author.p12 -a 'HomebrewActiveContentExtensions' -p ''
