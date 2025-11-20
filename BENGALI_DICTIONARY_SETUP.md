# Bengali Dictionary Setup

## Instructions

To enable Bengali translations in the app:

1. **Download the Bengali Dictionary JSON**

   - Visit: https://github.com/Nafisa41/Dictionary--English-to-Bangla-
   - Download the dictionary JSON file from the repository

2. **Add to Project**

   - Create a directory: `frontend/public/data/`
   - Place the downloaded JSON file as: `frontend/public/data/bengali-dictionary.json`

3. **Expected JSON Format**
   The dictionary should be in this format:

   ```json
   {
     "hello": {
       "word": "hello",
       "meaning": "হ্যালো",
       "partOfSpeech": "interjection",
       "examples": ["Hello, how are you?"]
     },
     "world": {
       "word": "world",
       "meaning": "বিশ্ব",
       "partOfSpeech": "noun"
     }
   }
   ```

4. **Usage**
   Once the file is in place, the app will automatically load it and provide Bengali translations when adding words.

## Features

- Automatic Bengali translation lookup
- Fallback to manual entry if word not found
- Case-insensitive search
- Supports multiple translations per word

## Alternative Approach

If the JSON file format is different, you may need to update the `bengali-dictionary.ts` service to match the actual structure of the downloaded file.
