# main imports
import os, sys
import argparse
import json
import numpy as np
import shutil

# PNG images
from PIL import Image

# others import
from ipfml import utils
from scipy.signal import savgol_filter

'''
Display progress information as progress bar
'''
def write_progress(progress):
    barWidth = 180

    output_str = "["
    pos = barWidth * progress
    for i in range(barWidth):
        if i < pos:
           output_str = output_str + "="
        elif i == pos:
           output_str = output_str + ">"
        else:
            output_str = output_str + " "

    output_str = output_str + "] " + str(int(progress * 100.0)) + " %\r"
    print(output_str)
    sys.stdout.write("\033[F")


def extract_index(filepath):

    return int(filepath.split('_')[-1].split('.')[0])


def extracts_linear_indices(images_path, n_expected=50, indices_step=20, start_at=20, smooth_arr=False):

    # TODO : check this part
    default_add = start_at - indices_step
    
    # extract variance for each image path
    var_arr = []

    n_counter = 0
    n_images = len(images_path)

    for p in sorted(images_path):
        img = Image.open(p)
        var_arr.append(np.var(img))

        n_counter += 1
        write_progress((n_counter + 1) / n_images)
        
    # normalize variance values
    norm_arr = np.array(utils.normalize_arr_with_range(var_arr))
    
    if smooth_arr:
        norm_arr = utils.normalize_arr_with_range(savgol_filter(norm_arr, 201, 3)) # window size 7, polynomial order 3
    
    # get expected linear step (using n_expectec output images)
    linear_steps = utils.normalize_arr_with_range((1 - (np.arange(n_expected) / n_expected)))
    
    # get image indices from variance convergence and linear
    # => when linear step is reached we store the index found from variance values
    indices_found = []
    for i in linear_steps: 
        
        find_index = 0
        
        for index, y in enumerate(norm_arr):
            if i <= y:
                find_index = index

        indices_found.append(find_index + 1)

    indices = np.array(indices_found) * indices_step
    
    # add tricks to avoid same indice
    # => when index is same as previous, then add number of samples expected by step 
    # Example with step of 20 : [20, 20, 20, 100, 200] => [20, 40, 60, 100, 200]
    final_indices = []
    for index, i in enumerate(indices):
        value = indices[index]
        if index > 0:
            if i <= indices[index - 1]:
                value = indices[index - 1] + indices_step
                indices[index] = value

        final_indices.append(value)
        
    return np.array(final_indices) + default_add


def main():
    """
    main function which is ran when launching script
    """ 
    parser = argparse.ArgumentParser(description="Compute new dataset scene")

    parser.add_argument('--file', type=str, help='file data extracted from `utils/extract_stats_freq_and_min.py` script', required=True)
    parser.add_argument('--png_folder', type=str, help='png dataset folder with scene', required=True)
    parser.add_argument('--users', type=int, help='min number of users required per scene', required=True, default=10)
    #parser.add_argument('--samples', type=int, help='expected samples to get for this dataset', required=True, default=10000)
    parser.add_argument('--output', type=str, help='output image folder', required=True)

    args = parser.parse_args()

    p_file   = args.file
    p_png_folder = args.png_folder
    p_users  = args.users
    #p_samples = args.samples
    p_output = args.output

    with open(p_file, 'r') as f:

        for line in f.readlines():

            data = line.split(';')

            scene = data[0]
            n_users = int(data[1])
            min_index = int(data[2])

            # remove _partX from scene name
            scene_parts = scene.split('_')
            del scene_parts[-1]
            scene_name = '_'.join(scene_parts)

            output_scene_dir = os.path.join(p_output, scene)

            if os.path.exists(output_scene_dir):
                print('Extraction of custom indices already done for', scene)
                continue

            if n_users >= p_users:
                print('Extract custom indices based on minimum index for', scene)

                png_folder_scene = os.path.join(p_png_folder, scene)

                if not os.path.exists(png_folder_scene):
                    print(png_folder_scene, 'png folder does not exist')
                else:
                    
                    # get all rawls files
                    png_files = [ os.path.join(png_folder_scene, p) for p in sorted(os.listdir(png_folder_scene)) ]

                    # extract max samples found for this scene
                    _, filename = os.path.split(png_files[-1])

                    max_samples = extract_index(filename)

                    # extract step from these files
                    input_step = int(max_samples / len(png_files))

                    # get indices using min index
                    indices = extracts_linear_indices(png_files[int(min_index / input_step):], n_expected=50, indices_step=input_step, start_at=min_index, smooth_arr=True)
                    
                    # here add the most noisy image + mean between first predicted and most noisy image
                    min_index = extract_index(png_files[0])

                    if not min_index in indices:
                    
                        # get mean between min and next one in list
                        mean_index = int((min_index + indices[1]) / 2)

                        # check mean index step
                        if mean_index % input_step != 0:
                            mean_index = mean_index + (mean_index % input_step)

                        if not mean_index in indices:
                            indices = np.insert(indices, 0, mean_index)
                        
                        # add min index as first
                        indices = np.insert(indices, 0, min_index)

                    # print('Indices found are', indices)
                    # create output directory
                    if not os.path.exists(output_scene_dir):
                        os.makedirs(output_scene_dir)

                    # get expected png image and move it
                    for index in indices:
                        
                        str_index = str(index)

                        while len(str_index) < 5:
                            str_index = "0" + str_index

                        image_name = scene_name + '_' + str_index + '.png'
                        png_image_path = os.path.join(png_folder_scene, image_name)

                        # create output filepath
                        output_img_filepath = os.path.join(output_scene_dir, image_name)

                        # copy expected image path
                        shutil.copy2(png_image_path, output_img_filepath)
            else:
                print('Only', n_users, 'users who passed the experiment for', scene)
            
            print('\n---------------------------------------------')
    


if __name__ == "__main__":
    main()