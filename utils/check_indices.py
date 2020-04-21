# main import
import os
import argparse
import shutil

# parameters
scene_image_quality_separator     = '_'
scene_image_extension             = '.png'

def get_scene_image_quality(img_path):

    # if path getting last element (image name) and extract quality
    img_postfix = img_path.split('/')[-1].split(scene_image_quality_separator)[-1]
    img_quality = img_postfix.replace(scene_image_extension, '')

    return int(img_quality)

def rename_folder_images(folder, output, expected):

    folders = os.listdir(folder)

    for folder_name in folders:

        folder_path = os.path.join(folder, folder_name)
        output_folder_path = os.path.join(output, folder_name)

        images = sorted(os.listdir(folder_path))

        last_index = get_scene_image_quality(images[-1])

        if last_index != expected:
            
            print('Update images indices for %s' % folder_path)

            if not os.path.exists(output_folder_path):
                os.makedirs(output_folder_path)

            for img in images:
                img_path = os.path.join(folder_path, img)
                current_quality = get_scene_image_quality(img_path)

                img_prefix_split = img_path.split('/')[-1].split(scene_image_quality_separator)
                del img_prefix_split[-1]

                img_prefix = "_".join(img_prefix_split)

                index_str = str(current_quality * 20)

                while len(index_str) < 5:
                    index_str = "0" + index_str

                img_output_name = img_prefix + '_' + index_str + '.png'
                img_output_path = os.path.join(output_folder_path, img_output_name)

                shutil.copy2(img_path, img_output_path)

        else:
            print('Max expected found for', folder_path, '(no need to update)')

        
def main():

    parser = argparse.ArgumentParser(description="rename image with correct indices")

    parser.add_argument('--folder', type=str, help="folder with HD images", required=True)
    parser.add_argument('--output', type=str, help="output folder", required=True)
    parser.add_argument('--expected', type=int, help="max expected index", required=True)

    args = parser.parse_args()

    p_folder = args.folder
    p_output = args.output
    p_expected = args.expected

    rename_folder_images(p_folder, p_output, p_expected)

if __name__ == "__main__":
    main()
