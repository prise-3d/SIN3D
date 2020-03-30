# main import
import os
import argparse
import numpy as np

# images imports
from PIL import Image

image_block = 800, 800
zone_block = 200, 200

def get_parts(img):

    parts = []


    h, w, c = img.shape
    h_block, w_block = image_block
    h_zone, w_zone = zone_block

    m_h = int(h/2)
    m_w = int(w/2)

    m_h_img_block = int(h_block/2)
    m_w_img_block = int(w_block/2)

    # extract left up  image
    h_start = int((h % h_zone) / 2)
    left_up_image = img[h_start:h_block+h_start, m_w-h_block:m_w]

    parts.append(left_up_image)

    # extract middle up image
    h_start = int((h % h_zone) / 2)
    middle_up_image = img[h_start:h_block+h_start, m_w-m_w_img_block:m_w+m_w_img_block]

    parts.append(middle_up_image)

    # extract right up  image
    h_start = int((h % h_zone) / 2)
    right_up_image = img[h_start:h_block+h_start, m_w:m_w+w_block]
    
    parts.append(right_up_image)

    # extract left bottom image
    h_end = h - int((h % h_zone) / 2)
    h_start = h_end - h_block
    left_bottom_image = img[h_start:h_end, m_w-h_block:m_w]

    parts.append(left_bottom_image)

    # extract middle bottom image
    h_end = h - int((h % h_zone) / 2)
    h_start = h_end - h_block
    
    middle_bottom_image = img[h_start:h_end, m_w-m_w_img_block:m_w+m_w_img_block]

    parts.append(middle_bottom_image)

    # extract left bottom image
    h_end = h - int((h % h_zone) / 2)
    h_start = h_end - h_block
    right_bottom_image = img[h_start:h_end, m_w:m_w+w_block]

    parts.append(right_bottom_image)

    # extract middle center image
    middle_image = img[m_h-m_h_img_block:m_h+m_h_img_block, m_w-m_w_img_block:m_w+m_w_img_block]

    parts.append(middle_image)

    return parts


def extract(folder, output):

    images_path = sorted(os.listdir(folder))

    # for each image get sub parts
    for img_name in images_path:

        img_path = os.path.join(folder, img_name)
        img = np.array(Image.open(img_path))

        # get all expected parts from image
        parts = get_parts(img)

        for index, part in enumerate(parts):

            # get part output folder and create it if not exists
            prefix_image_folder_path = os.path.join(output, folder.replace('/', '') + '_part' + str(index))

            if not os.path.exists(prefix_image_folder_path):
                os.makedirs(prefix_image_folder_path)

            # build output image path and save it
            image_output_folder_path = os.path.join(prefix_image_folder_path, img_name)
            
            Image.fromarray(part).save(image_output_folder_path)

        
def main():

    parser = argparse.ArgumentParser(description="extract and create 7 parts of image from HD one")

    parser.add_argument('--folder', type=str, help="folder which HD images", required=True)
    parser.add_argument('--output', type=str, help="output data folder", required=True)

    args = parser.parse_args()

    p_folder = args.folder
    p_output = args.output

    extract(p_folder, p_output)

if __name__ == "__main__":
    main()
