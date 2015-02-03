#!/bin/bash

#sox Bud\ Schwartz\ Celebrity\ Roast-27919061.mp3 out.mp3 trim 15 4

SOX=`which sox`
OUT=$2
START=$3
DURATION=$4

$SOX $1 $OUT trim $START $DURATION