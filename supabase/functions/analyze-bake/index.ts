import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0";

// Initialize Gemini
const apiKey = Deno.env.get('GOOGLE_API_KEY');
const genAI = new GoogleGenerativeAI(apiKey || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://mpartificer.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const body = await req.json()

    const { 
      imageUrls, 
      recipeTitle,
      hasModifications,
      originalInstructions,
      modifiedInstructions,
      originalIngredients,
      modifiedIngredients 
    } = body

    // Validate required fields
    if (!imageUrls || !Array.isArray(imageUrls)) {
      throw new Error('imageUrls must be an array')
    }

    if (!recipeTitle) {
      throw new Error('recipeTitle is required')
    }

    // Analyze images
    const imageAnalysisPromises = imageUrls.map(async (url) => {
      const imageResponse = await fetch(url);
      const imageBlob = await imageResponse.blob();
      
      const imageData = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(imageBlob);
      });
      
      const prompt = "Analyze this baked good in detail. Assess the texture, color, shape, and overall appearance. Note any visible characteristics that might indicate potential improvements."
      
      const result = await model.generateContent({
        contents: [{
          parts: [
            { text: prompt },
            { 
              inlineData: {
                mimeType: "image/jpeg",
                data: (imageData as string).split(',')[1]
              }
            }
          ]
        }]
      });
      
      const response = await result.response;
      return response.text();
    });

    const imageAnalyses = await Promise.all(imageAnalysisPromises)

    let recipePrompt;
    
    if (hasModifications && originalInstructions.length > 0 && originalIngredients.length > 0) {
      recipePrompt = `Analyze this bake of "${recipeTitle}" with the following modifications:
        
        Original Ingredients: ${JSON.stringify(originalIngredients)}
        Modified Ingredients: ${JSON.stringify(modifiedIngredients)}
        
        Original Instructions: ${JSON.stringify(originalInstructions)}
        Modified Instructions: ${JSON.stringify(modifiedInstructions)}
        
        Evaluate how these modifications might have affected the final result and what improvements could be made.`;
    } else {
      recipePrompt = `Analyze this bake of "${recipeTitle}".
        No modifications were made to the original recipe.
        Based on the visual analysis, what techniques could be improved and what modifications might enhance the result?`;
    }

    const recipeResult = await model.generateContent(recipePrompt);
    const recipeResponse = await recipeResult.response;
    const recipeInsights = recipeResponse.text();

    // Combine all analyses for final insights
    const imageInsights = imageAnalyses.join("\n")
    
    const finalPrompt = `You are providing feedback on a user's bake of "${recipeTitle}". 
      Based on my analysis of the provided image(s) and ${hasModifications ? 'the recipe modifications they made' : 'the original recipe execution'}:

      Image Analysis I Just Performed:
      ${imageInsights}

      Recipe Analysis I Just Performed:
      ${recipeInsights}

      Now, synthesize a helpful response to the user. Start with a brief comment about what you see in their bake photos.
      Then provide clear, specific, and actionable insights for their next attempt. Include:
      1. Technique improvements based on what you observe in their photos
      2. ${hasModifications ? 'Suggestions to refine their modifications' : 'Potential beneficial modifications they could try'}
      3. Specific tips for achieving better results

      Keep the response friendly and constructive. Avoid referring to any "analysis" - instead, directly reference what you see in their photos.
      Focus on giving them practical advice for their next bake.`;

    const finalResult = await model.generateContent(finalPrompt);
    const finalResponse = await finalResult.response;
    const finalInsights = finalResponse.text();

    return new Response(
      JSON.stringify({ insights: finalInsights }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})