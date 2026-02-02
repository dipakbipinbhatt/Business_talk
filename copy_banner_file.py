import shutil
import os

source = r"c:\Users\vrajr\Desktop\Dipak-bhatt\logo\bannner.png"
dest = r"c:\Users\vrajr\Desktop\Dipak-bhatt\frontend\public\banner.png"

try:
    shutil.copy2(source, dest)
    print(f"Successfully copied {source} to {dest}")
    print(f"File exists: {os.path.exists(dest)}")
except Exception as e:
    print(f"Error: {e}")
