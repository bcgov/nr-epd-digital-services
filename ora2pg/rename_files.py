import os

def rename_files_with_suffix(directory, suffix):
    # Check if the directory exists
    if not os.path.isdir(directory):
        print("Error: Directory not found.")
        return

    # List all files in the directory
    files = os.listdir(directory)

    # Iterate through each file
    for file_name in files:
        # Check if the file is a regular file
        if os.path.isfile(os.path.join(directory, file_name)):
            # Split the file name and extension
            name, ext = os.path.splitext(file_name)
            # Rename the file by appending the suffix
            new_name = f"{name}.{suffix}{ext}"
            os.rename(os.path.join(directory, file_name), os.path.join(directory, new_name))
            print(f"Renamed {file_name} to {new_name}")

# Provide the directory path and suffix
directory_path = "C:/Users/JaiseT/Documents/EPD/epd-src-latest/site-model/output/entities"
suffix = "entity"

# Rename files in the directory
rename_files_with_suffix(directory_path, suffix)
