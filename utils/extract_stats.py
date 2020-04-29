# main imports
import os, sys
import argparse
import json


def main():
    """
    main function which is ran when launching script
    """ 
    parser = argparse.ArgumentParser(description="Extract scenes data and save thresholds into .csv")

    parser.add_argument('--file', type=str, help='image to convert', required=True)
    parser.add_argument('--output', type=str, help='output csv filename', required=True)

    args = parser.parse_args()

    p_file   = args.file
    p_output = args.output

    f = open(p_file)
    json_data = json.load(f)

    dict_data = {}

    for element in json_data:

        scene = element['msg']['sceneName']

        if scene not in dict_data:
            dict_data[scene] = {}

        extracts = element['msg']['extracts']

        for extract in extracts:
            if extract['index'] not in dict_data[scene]:
                dict_data[scene][extract['index']] = (extract['quality'], 1)
            else:
                dict_data[scene][extract['index']] = (dict_data[scene][extract['index']][0] + extract['quality'], dict_data[scene][extract['index']][1] + 1)
            
    
    output_file = open(p_output, 'w')
    for scene in dict_data:
        output_file.write(scene + ';')

        for extract in dict_data[scene]:
            thresholds_data = dict_data[scene][extract]
            output_file.write(str(int(thresholds_data[0] / thresholds_data[1])) + ';')

        output_file.write('\n')



if __name__ == "__main__":
    main()