#!/usr/bin/env python3
"""
Script to fix duplicate IDs in ace.json by replacing 'ability' with the card name.
The card name will be converted to lowercase and have spaces/special characters replaced with hyphens.
"""

import json
import re
import os

def normalize_name_for_id(name):
    """Convert a card name to a normalized format suitable for IDs."""
    # Convert to lowercase
    normalized = name.lower()
    # Replace spaces and special characters with hyphens
    normalized = re.sub(r'[^\w]+', '-', normalized)
    # Remove leading/trailing hyphens
    normalized = normalized.strip('-')
    # Replace multiple consecutive hyphens with single hyphen
    normalized = re.sub(r'-+', '-', normalized)
    return normalized

def fix_ace_ids():
    """Fix duplicate IDs in ace.json by replacing 'ability' with normalized card names."""

    # Path to the sensitive.json file
    ace_file_path = os.path.join(os.path.dirname(__file__), 'sensitive.json')
    
    try:
        # Read the JSON file
        with open(ace_file_path, 'r', encoding='utf-8') as file:
            cards = json.load(file)
        
        print(f"Processing {len(cards)} cards...")
        
        # Track changes
        changes_made = 0
        
        # Process each card
        for card in cards:
            if 'id' in card and 'name' in card:
                old_id = card['id']
                
                # Check if the ID contains 'ability'
                if 'ability' in old_id:
                    # Extract the base part (everything before '-ability')
                    base_id = old_id.replace('-ability', '')
                    
                    # Create new ID using the normalized card name
                    normalized_name = normalize_name_for_id(card['name'])
                    new_id = f"{base_id}-{normalized_name}"
                    
                    # Update the ID
                    card['id'] = new_id
                    changes_made += 1
                    
                    print(f"Changed: '{old_id}' -> '{new_id}' (name: '{card['name']}')")
        
        # Write the updated JSON back to file
        if changes_made > 0:
            with open(ace_file_path, 'w', encoding='utf-8') as file:
                json.dump(cards, file, indent=2, ensure_ascii=False)
            
            print(f"\nSuccessfully updated {changes_made} card IDs!")
            print(f"Updated file saved to: {ace_file_path}")
        else:
            print("No changes needed - no cards with 'ability' in their IDs found.")
            
    except FileNotFoundError:
        print(f"Error: Could not find ace.json file at {ace_file_path}")
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON format in ace.json - {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_ace_ids()
