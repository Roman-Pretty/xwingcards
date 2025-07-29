import json
import re
from collections import defaultdict

def kebab_case(text):
    # Convert to kebab-case: remove special characters, convert to lowercase, replace spaces with hyphens
    text = re.sub(r'[^\w\s-]', '', text)  # Remove special characters except hyphens
    text = re.sub(r'\s+', '-', text.strip())  # Replace spaces with hyphens
    return text.lower()

def fix_duplicate_ids(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        cards = json.load(f)
    
    # Track ID usage
    id_count = defaultdict(int)
    
    # First pass: count occurrences of each ID
    for card in cards:
        id_count[card['id']] += 1
    
    # Second pass: fix duplicates
    id_usage = defaultdict(int)
    for card in cards:
        original_id = card['id']
        if id_count[original_id] > 1:
            # This ID has duplicates, need to make it unique
            id_usage[original_id] += 1
            
            # Create new unique ID based on ability name
            ability_name = card['name']
            ability_suffix = kebab_case(ability_name)
            
            # Create new ID: remove '-ability' suffix if it exists, then add ability name
            base_id = original_id.replace('-ability', '')
            new_id = f"{base_id}-{ability_suffix}-ability"
            
            card['id'] = new_id
            print(f"Changed: {original_id} -> {new_id} ('{ability_name}')")
    
    # Write back to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(cards, f, indent=2, ensure_ascii=False)
    
    print(f"\nFixed duplicate IDs in {file_path}")

if __name__ == "__main__":
    fix_duplicate_ids("src/data/cards/ace.json")
