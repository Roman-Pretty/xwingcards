#!/usr/bin/env python3
"""
Script to extract images from non-unique pilots and create:
1. A text file listing all image URLs
2. An HTML page displaying all images with pilot names
"""

import json
import re
import os
import glob

def extract_nonunique_pilots():
    """Extract image URLs and names from non-unique pilots"""
    
    # Process all JSON files in the input folder
    input_folder = "input"
    all_nonunique_pilots = []
    
    # Check if input folder exists
    if not os.path.exists(input_folder):
        print(f"Error: {input_folder} folder not found!")
        return []
    
    # Get all JSON files in the input folder
    json_files = glob.glob(os.path.join(input_folder, "*.json"))
    
    if not json_files:
        print(f"No JSON files found in {input_folder} folder!")
        return []
    
    print(f"Processing {len(json_files)} JSON files...")
    
    for file_path in json_files:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Extract ship name from filename (remove .json extension)
            ship_name = os.path.splitext(os.path.basename(file_path))[0]
            
            # Process only non-unique pilots (limited = 0)
            nonunique_pilots = []
            for pilot in data["pilots"]:
                if pilot.get("limited", 0) == 0:  # Non-unique pilots
                    name = pilot.get("name", "")
                    image = pilot.get("artwork", pilot.get("image", ""))
                    
                    if name and image:  # Only include if both name and image exist
                        # Extract pilot ID from image URL
                        # Example: "https://infinitearenas.com/xw2/images/artwork/pilots/firstordercollaborators.png" -> "firstordercollaborators"
                        pilot_id = ""
                        if "pilots/" in image:
                            pilot_id = image.split("pilots/")[1].split(".")[0]
                        
                        nonunique_pilots.append({
                            "name": name,
                            "image": image,
                            "pilot_id": pilot_id
                        })
            
            all_nonunique_pilots.extend(nonunique_pilots)
            print(f"  {os.path.basename(file_path)}: {len(nonunique_pilots)} non-unique pilots")
            
        except Exception as e:
            print(f"  Error processing {os.path.basename(file_path)}: {e}")
    
    return all_nonunique_pilots

def create_text_file(pilots):
    """Create a text file with all image URLs"""
    output_file = "nonunique_pilot_images.txt"
    
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write("Non-Unique Pilot Images\n")
            f.write("=" * 50 + "\n\n")
            
            for pilot in pilots:
                f.write(f"Name: {pilot['name']}\n")
                f.write(f"Pilot ID: {pilot['pilot_id']}\n")
                f.write(f"Image: {pilot['image']}\n")
                f.write("-" * 30 + "\n")
        
        print(f"Text file created: {output_file}")
        return True
        
    except Exception as e:
        print(f"Error creating text file: {e}")
        return False

def create_html_file(pilots):
    """Create an HTML page displaying all images with names"""
    output_file = "nonunique_pilot_images.html"
    
    try:
        with open(output_file, "w", encoding="utf-8") as f:
            # Write HTML header
            html_header = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Non-Unique Pilot Images</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            text-align: center;
            margin-bottom: 30px;
            color: #333;
        }}
        .pilot-grid {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            max-width: 1200px;
            margin: 0 auto;
        }}
        .pilot-card {{
            background: white;
            border-radius: 10px;
            padding: 15px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s ease;
            cursor: pointer;
        }}
        .pilot-card:hover {{
            transform: translateY(-5px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        }}
        .pilot-card.grayed-out {{
            background: #e0e0e0;
            opacity: 0.6;
            transform: none;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }}
        .pilot-card.grayed-out:hover {{
            transform: none;
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }}
        .pilot-card.grayed-out .pilot-image {{
            filter: grayscale(100%);
        }}
        .pilot-card.grayed-out .pilot-name,
        .pilot-card.grayed-out .pilot-ship {{
            color: #999;
        }}
        .pilot-image {{
            width: 100%;
            max-width: 200px;
            height: auto;
            border-radius: 8px;
            margin-bottom: 10px;
        }}
        .pilot-name {{
            font-weight: bold;
            font-size: 16px;
            color: #333;
            margin-bottom: 5px;
        }}
        .pilot-ship {{
            font-size: 14px;
            color: #666;
            font-style: italic;
        }}
        .stats {{
            text-align: center;
            margin-bottom: 20px;
            font-size: 18px;
            color: #555;
        }}
    </style>
    <script>
        function toggleCard(card) {{
            card.classList.toggle('grayed-out');
        }}
    </script>
</head>
<body>
    <div class="header">
        <h1>Non-Unique Pilot Images</h1>
        <div class="stats">Total Non-Unique Pilots: {len(pilots)}</div>
    </div>
    
    <div class="pilot-grid">
"""
            f.write(html_header)
            
            # Write each pilot card
            for pilot in pilots:
                f.write(f"""        <div class="pilot-card" onclick="toggleCard(this)">
            <img src="{pilot['image']}" alt="{pilot['name']}" class="pilot-image" 
                 onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
            <div style="display:none; color:#999; font-style:italic;">Image not available</div>
            <div class="pilot-name">{pilot['name']}</div>
            <div class="pilot-ship">{pilot['pilot_id']}</div>
        </div>
""")
            
            # Write HTML footer
            f.write("""    </div>
</body>
</html>""")
        
        print(f"HTML file created: {output_file}")
        return True
        
    except Exception as e:
        print(f"Error creating HTML file: {e}")
        return False

def main():
    """Main function to extract pilots and create output files"""
    print("Extracting non-unique pilot images...")
    
    # Extract non-unique pilots
    pilots = extract_nonunique_pilots()
    
    if not pilots:
        print("No non-unique pilots found!")
        return
    
    # Sort pilots by name for consistent output
    pilots.sort(key=lambda p: p['name'])
    
    print(f"\nFound {len(pilots)} non-unique pilots with images")
    
    # Create text file
    print("\nCreating text file...")
    create_text_file(pilots)
    
    # Create HTML file
    print("Creating HTML file...")
    create_html_file(pilots)
    
    print(f"\nComplete! Files created:")
    print(f"  - nonunique_pilot_images.txt")
    print(f"  - nonunique_pilot_images.html")

if __name__ == "__main__":
    main()
