import json
import re
import os
import glob

def convert_faction(faction):
    """Convert faction to proper format for manual adjustment"""
    faction_map = {
        "rebelalliance": "Neutral",
        "galacticempire": "Empire", 
        "resistance": "theresistance",
        "firstorder": "FirstOrder",
        "scumandvillainy": "Scum",
        "galacticrepublic": "Republic",
        "separatistalliance": "Separatist"
    }
    return faction_map.get(faction, faction)

def format_pilot(pilot, faction):
    """Convert pilot data to cards.json format - only for limited pilots"""
    # Only process limited (unique) pilots
    if pilot.get("limited", 0) == 0:
        return None
    
    # Use name for both id and name (not caption/callsign)
    name = pilot.get("name", "")
    if not name:
        return None  # Skip if no name
    
    # Format ID: remove all non-alphanumeric characters, convert to lowercase, and append '-ability'
    id_str = re.sub(r'[^a-zA-Z0-9]', '', name.lower()) + '-ability'
    
    # Handle charges for energy fields
    energy = None
    energy_recurring = None
    
    if "charges" in pilot:
        charges = pilot["charges"]
        energy = charges.get("value")
        if charges.get("recovers", 0) > 0:
            energy_recurring = charges["recovers"]
    
    # Check if pilot has Force abilities (look for "force" field)
    has_force = "force" in pilot
    pilot_type = "Sensitive" if has_force else "Ace"
    
    # Calculate cost based on pilot type
    if pilot_type == "Sensitive":
        cost = pilot["initiative"] * 3
    else:
        cost = pilot["initiative"] * 2
    
    # Build the pilot object
    pilot_obj = {
        "id": id_str,
        "name": name,
        "type": pilot_type,
        "cost": cost,
        "description": pilot.get("ability", pilot.get("text", "")),
        "image": pilot.get("artwork", pilot.get("image", "")),
        "unique": True,
        "faction": convert_faction(faction),
        "initiative": pilot["initiative"]
    }
    
    # Add energy fields only if they exist
    if energy is not None:
        pilot_obj["energy"] = energy
    if energy_recurring is not None:
        pilot_obj["recurringEnergy"] = energy_recurring
    
    return pilot_obj

# Process all JSON files in the input folder
input_folder = "input"
all_converted = []

# Check if input folder exists
if not os.path.exists(input_folder):
    print(f"Error: {input_folder} folder not found!")
    exit(1)

# Get all JSON files in the input folder
json_files = glob.glob(os.path.join(input_folder, "*.json"))

if not json_files:
    print(f"No JSON files found in {input_folder} folder!")
    exit(1)

print(f"Processing {len(json_files)} JSON files...")

for file_path in json_files:
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        
        # Convert only limited pilots (filter out None results)
        converted = [format_pilot(pilot, data["faction"]) for pilot in data["pilots"]]
        converted = [pilot for pilot in converted if pilot is not None]
        
        # Add to the master list
        all_converted.extend(converted)
        
        print(f"  {os.path.basename(file_path)}: {len(converted)} limited pilots")
        
    except Exception as e:
        print(f"  Error processing {os.path.basename(file_path)}: {e}")

# Remove duplicates where both id and description are the same
seen = set()
unique_pilots = []
for pilot in all_converted:
    key = (pilot["id"], pilot["description"])
    if key not in seen:
        seen.add(key)
        unique_pilots.append(pilot)

# Separate pilots by type
ace_pilots = [pilot for pilot in unique_pilots if pilot.get("type") == "Ace"]
sensitive_pilots = [pilot for pilot in unique_pilots if pilot.get("type") == "Sensitive"]

# Sort ace pilots by cost first, then alphabetically by id
ace_pilots.sort(key=lambda pilot: (pilot["cost"], pilot["id"]))

# Sort sensitive pilots by description
sensitive_pilots.sort(key=lambda pilot: pilot["description"])

# Output ace pilots to output-ace.json
with open("output-ace.json", "w", encoding="utf-8") as f:
    json.dump(ace_pilots, f, indent=2)

# Output sensitive pilots to output-sensitive.json
with open("output-sensitive.json", "w", encoding="utf-8") as f:
    json.dump(sensitive_pilots, f, indent=2)

print(f"\nTotal: {len(all_converted)} pilots processed")
print(f"Unique: {len(unique_pilots)} pilots after removing duplicates")
print(f"Removed: {len(all_converted) - len(unique_pilots)} duplicate pilots")
print(f"\nOutput files created:")
print(f"  output-ace.json: {len(ace_pilots)} Ace pilots (sorted by cost, then alphabetically by id)")
print(f"  output-sensitive.json: {len(sensitive_pilots)} Sensitive pilots (sorted by description)")
