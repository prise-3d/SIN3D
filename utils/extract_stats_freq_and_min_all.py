# main imports
import os, sys
import argparse
import json
import numpy as np


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
                dict_data[scene][extract['index']] = [extract['quality']]
            else:
                dict_data[scene][extract['index']].append(extract['quality'])
            
    
    output_file = open(p_output, 'w')
    # output_file.write('scene;n_users;min_scene;\n')

    for scene in dict_data:
        output_file.write(scene + ';')
        
        all_thresholds = []
        n_users = 0
        for extract in dict_data[scene]:
            thresholds_data = dict_data[scene][extract]
            
            all_thresholds.append(int(np.min(thresholds_data)))
            n_users = len(thresholds_data)

        output_file.write(str(n_users) + ';' + str(np.min(all_thresholds)) + ';')

        output_file.write('\n')



if __name__ == "__main__":
    main()