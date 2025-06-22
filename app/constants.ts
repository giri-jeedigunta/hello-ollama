export const RecipeExtractionPrompt = `
Extract the complete recipe from a YouTube cooking video with the following detailed requirements:

- Recipe Title: Use the official name of the dish.
- Author Credit: Mention the YouTube channel or creator’s name.
- Recipe Description: Write a short, engaging description of the dish — include flavors, origins (if mentioned), and a bit of personality.

- Ingredients Table:
  Create a structured table with these columns:
  - Ingredient Name
  - Quantity (as shown in the video)
  - Ingredient Name translated into Swedish
  - Quantity (converted to EU standard measurements — metric)

- Preparation and Cooking Details:
  - List all marination, soaking, or pre-cooking preparation steps clearly.
  - Separate sections for:
    - Marination Time
    - Cooking Time
    - Preparation Time (if applicable)
  - Full detailed step-by-step instructions (not just bullet points), including:
    - Cooking methods
    - Temperature settings (both °C and °F if mentioned)
    - Timing for each step
    - Resting or cooling times

- Tips and Tricks:
  - Summarize any tips, tricks, or chef’s secrets shared during the video to make the cooking successful.

- Fun Notes:
  - Capture any jokes, funny remarks, or casual/fun comments made by the chef to add a human and playful touch.

- Additional Important Information:
  - Alternative ingredient options, if suggested
  - Warnings about common mistakes
  - Special tools or utensils needed
  - Serving suggestions or storage tips

Ensure the final result feels like a friendly, complete, cookbook-quality recipe that's detailed enough for beginners but polished enough for experienced cooks. Keep the tone warm, clear, and slightly playful when relaying jokes or light-hearted moments from the chef. 
Provide the recipe in HTML format that can be easily rendered in a React Component with dangerouslySetInnerHTML only provide the actual html content. I do not require the html and body scaffolding, just the content inside the body tag. I already have the html and body tags in my component.
`;
