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

prefix="p3d_"

data_folder=$1
output_folder=$2
mkdir -p $output_folder

for folder_path in $(ls -d ${data_folder}*)
do
    IFS='/' read -ra ADDR <<< "${folder_path}"
    folder=${ADDR[-1]}

    if [[ "$folder" == ${prefix}* ]]; then

        python utils/extract_parts.py --folder ${folder_path} --output ${output_folder}
    fi
done