import json
import difflib

# Load DB data
with open('C:/Users/danil/.gemini/antigravity/brain/75a51ba6-67e8-42ec-8eb5-c937290deb2e/.system_generated/steps/133/output.txt', 'r', encoding='utf-8') as f:
    wrapper = json.load(f)
    text = wrapper['result']

# Extract json array from untrusted block
start = text.find('[')
end = text.rfind(']') + 1
db_data = json.loads(text[start:end])

# Load extracted PDF data
with open('extracted_synopsis.json', 'r', encoding='utf-8') as f:
    pdf_data = json.load(f)

sql_queries = []
matched_count = 0

for db_item in db_data:
    db_title = db_item['titulo'].lower()
    best_match = None
    best_ratio = 0
    
    for pdf_item in pdf_data:
        pdf_title = pdf_item['title'].lower()
        # Clean title spaces and garbage if needed
        ratio = difflib.SequenceMatcher(None, db_title, pdf_title).ratio()
        if ratio > best_ratio:
            best_ratio = ratio
            best_match = pdf_item
            
    if best_ratio > 0.7:  # good enough match
        sinopsis = best_match['sinopsis']
        # Replace URLs at the end of the text if they got mixed in
        words = sinopsis.split()
        clean_words = []
        for w in words:
            if w.startswith('http') or w.endswith('/'):
                continue
            clean_words.append(w)
            
        sinopsis = ' '.join(clean_words)
        
        # Escape single quotes
        sinopsis_escaped = sinopsis.replace("'", "''")
        sql = f"UPDATE public.\\\"FashionFilms\\\" SET sinopsis = '{sinopsis_escaped}' WHERE film_id = '{db_item['film_id']}';"
        sql_queries.append(sql)
        matched_count += 1
    else:
        print(f'No match found for: {db_item["titulo"]}')

with open('update_synopsis.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(sql_queries))

print(f'Generated {matched_count} SQL UPDATE statements.')
