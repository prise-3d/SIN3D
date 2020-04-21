# main import
import os
import argparse

def count_folder_elements(folder):

    folders = os.listdir(folder)

    for folder_name in folders:

        folder_path = os.path.join(folder, folder_name)

        images = sorted(os.listdir(folder_path))
        print('Folder %s has %s elements' % (folder_name, len(images)))

        
def main():

    parser = argparse.ArgumentParser(description="extract and create 7 parts of image from HD one")

    parser.add_argument('--folder', type=str, help="folder with HD images", required=True)

    args = parser.parse_args()

    p_folder = args.folder

    count_folder_elements(p_folder)

if __name__ == "__main__":
    main()
