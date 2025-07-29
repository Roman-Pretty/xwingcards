#!/usr/bin/env python3
"""
Script to move all "Sensitive" type cards from ace.json to sensitive.json
"""

import json
import os

def move_sensitive_cards():
    """Move all cards with type 'Sensitive' from ace.json to sensitive.json"""
    
    ace_file = 'src/data/cards/ace.json'
    sensitive_file = 'src/data/cards/sensitive.json'
    
    # Read ace.json
    try:
        with open(ace_file, 'r', encoding='utf-8') as f:
            ace_cards = json.load(f)
    except FileNotFoundError:
        print(f"Error: {ace_file} not found!")
        return
    except json.JSONDecodeError as e:
        print(f"Error reading {ace_file}: {e}")
        return
    
    # Read sensitive.json (might be empty)
    try:
        with open(sensitive_file, 'r', encoding='utf-8') as f:
            sensitive_cards = json.load(f)
    except FileNotFoundError:
        print(f"Creating {sensitive_file} as it doesn't exist")
        sensitive_cards = []
    except json.JSONDecodeError:
        print(f"Warning: {sensitive_file} has invalid JSON, starting with empty array")
        sensitive_cards = []
    
    # Separate cards by type
    remaining_ace_cards = []
    cards_to_move = []
    
    for card in ace_cards:
        if card.get('type') == 'Sensitive':
            cards_to_move.append(card)
        else:
            remaining_ace_cards.append(card)
    
    # Add moved cards to sensitive cards and sort by cost, then by id
    all_sensitive_cards = sensitive_cards + cards_to_move
    all_sensitive_cards.sort(key=lambda card: (card.get('cost', 0), card.get('id', '')))
    
    # Write back to files
    try:
        # Write updated ace.json (without sensitive cards)
        with open(ace_file, 'w', encoding='utf-8') as f:
            json.dump(remaining_ace_cards, f, indent=2, ensure_ascii=False)
        
        # Write updated sensitive.json (with moved cards)
        with open(sensitive_file, 'w', encoding='utf-8') as f:
            json.dump(all_sensitive_cards, f, indent=2, ensure_ascii=False)
        
        print(f"Successfully moved {len(cards_to_move)} Sensitive cards from ace.json to sensitive.json")
        print(f"Remaining cards in ace.json: {len(remaining_ace_cards)}")
        print(f"Total cards in sensitive.json: {len(all_sensitive_cards)}")
        
        if cards_to_move:
            print("\nMoved cards:")
            for card in cards_to_move:
                print(f"  - {card.get('name', 'Unknown')} (ID: {card.get('id', 'Unknown')})")
    
    except Exception as e:
        print(f"Error writing files: {e}")

if __name__ == "__main__":
    move_sensitive_cards()
