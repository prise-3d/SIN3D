# main imports
import os, sys
import argparse
import numpy as np

# image processing
from PIL import Image

def reduce_image(image, size):
    """Reduce image from its center
    
    Arguments:
        image {PIL} -- PIL image expected
        size {tuple(int,int)} -- tuple of 2 elements int (width, height)
    """

    image = np.array(image)

    width, heigth, _ = image.shape
    n_w, n_h = size # new expected size

    # get center of image
    middle_w = int(width / 2)
    middle_h = int(heigth / 2)

    # start coordinates
    s_w = middle_w - int(n_w / 2)
    s_h = middle_h - int(n_h / 2)

    # end coordinates
    e_w = middle_w + int(n_w / 2)
    e_h = middle_h + int(n_h / 2)

    return image[s_w:e_w, s_h:e_h]


def main():
    """
    main function which is ran when launching script
    """ 
    parser = argparse.ArgumentParser(description="Reduce an image from its center coordinate")

    parser.add_argument('--image', type=str, help='image to convert')
    parser.add_argument('--size', type=str, help='size of expected output image (width, height)')
    parser.add_argument('--output', type=str, help='output image filename')

    args = parser.parse_args()

    p_image  = args.image
    p_size   = list(map(int, args.size.split(',')))
    p_output = args.output


    image = Image.open(p_image)

    # get reduced image
    reduced = reduce_image(image, p_size)

    # save image
    reduced = Image.fromarray(reduced)

    reduced.save(p_output)


if __name__ == "__main__":
    main()