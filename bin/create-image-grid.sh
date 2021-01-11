#! /usr/bin/env bash
set -euo pipefail

# Input: $1 is an image name like "default-redlands-pie.png" that has pie plots
# generated for it already. This script will combine those pie plot images
# ("default-redlands-pie-[1-10].png") into one image "default-redlands-grid.jpg"

BASE_NAME=$(basename "${1}" .png)
echo "Creating tiled image for $BASE_NAME"

echo -n "" > ./list.txt
for i in {1..10}; \
do echo "../data/plots/${BASE_NAME}-${i}.png" >> ./list.txt; done;

# From ffmprovisr https://amiaopensource.github.io/ffmprovisr/#im_grid
# -tile width x height, -geometry +0+0 for no gap between images

montage @list.txt -tile 5x2 -geometry +0+0 ../data/plots/"${BASE_NAME}"-grid.jpg
