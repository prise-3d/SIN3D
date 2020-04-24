#! /bin/bash

if [ -z "$1" ]
  then
    echo "No argument supplied"
    echo "Need data folder"
    exit 1
fi

if [ -z "$2" ]
  then
    echo "No argument supplied"
    echo "Need output folder"
    exit 1
fi

if [ -z "$3" ]
  then
    echo "No argument supplied"
    echo "Need width size"
    exit 1
fi

if [ -z "$4" ]
  then
    echo "No argument supplied"
    echo "Need height size"
    exit 1
fi

prefix="p3d_"

data_folder=$1
output_folder=$2

width=$3
height=$4

for folder_path in $(ls -d ${data_folder}*)
do
    IFS='/' read -ra ADDR <<< "${folder_path}"
    folder=${ADDR[-1]}

    if [[ "$folder" == ${prefix}* ]]; then

        output_scene_folder=$output_folder/${folder}_part6
        mkdir -p $output_scene_folder

        for file in $(ls ${folder_path}*)
        do
            filepath=$folder_path/$file

            python utils/get_center_image.py --image ${filepath} --size "${width},${height}" --output $output_scene_folder/$file
            echo "Images centered saved into $output_scene_folder/$file"
        done

    fi
done