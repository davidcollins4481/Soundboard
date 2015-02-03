#!/bin/bash

YOUTUBEDL=`which youtube-dl`

#    output filename template. Use %(title)s to
#    get the title, %(uploader)s for the
#    uploader name, %(uploader_id)s for the
#    uploader nickname if different,
#    %(autonumber)s to get an automatically
#    incremented number, %(ext)s for the
#    filename extension, %(format)s for the
#    format description (like "22 - 1280x720" or
#    "HD"), %(format_id)s for the unique id of
#    the format (like Youtube's itags: "137"),
#    %(upload_date)s for the upload date
#    (YYYYMMDD), %(extractor)s for the provider
#    (youtube, metacafe, etc), %(id)s for the
#    video id, %(playlist_title)s,
#    %(playlist_id)s, or %(playlist)s (=title if
#    present, ID otherwise) for the playlist the
#    video is in, %(playlist_index)s for the
#    position in the playlist. %(height)s and
#    %(width)s for the width and height of the
#    video format. %(resolution)s for a textual
#    description of the resolution of the video
#    format. %% for a literal percent. Use - to
#    output to stdout. Can also be used to
#    download to a different directory, for
#    example with -o '/my/downloads/%(uploader)s
#    /%(title)s-%(id)s.%(ext)s' .

$YOUTUBEDL --extract-audio --audio-format mp3 $1