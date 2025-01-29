import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.2.0";

// Debug environment variables
console.log('Available environment variables:', Object.keys(Deno.env.toObject()));
console.log('Attempting to get GOOGLE_API_KEY...');

// Initialize Gemini
const apiKey = Deno.env.get('GOOGLE_API_KEY');
console.log('API Key present:', !!apiKey);

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
    console.log('Request received')
    
    // Log request headers
    console.log('Request headers:', Object.fromEntries(req.headers.entries()))
    
    // Parse and log request body
    const body = await req.json()
    console.log('Request body:', JSON.stringify(body))

    const { 
      imageUrls, 
      recipeTitle,
      originalInstructions,
      originalIngredients,
      modifiedInstructions,
      modifiedIngredients 
    } = body

    // Validate required fields
    if (!imageUrls || !Array.isArray(imageUrls)) {
      throw new Error('imageUrls must be an array')
    }

    const apiKey = Deno.env.get('GOOGLE_API_KEY')
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is not set')
    }
    
    // Log the first few characters of the API key for debugging
    console.log('API key prefix:', apiKey.substring(0, 4) + '...')
    
    // Basic validation
    if (!apiKey.startsWith('AI')) {
      throw new Error('API key appears to be invalid - should start with "AI"')
    }

    try {
      console.log('Starting image analysis')
      // Analyze each image using Gemini
      const imageAnalysisPromises = imageUrls.map(async (url) => {
        // Fetch the image data
        const imageResponse = await fetch(url);
        const imageBlob = await imageResponse.blob();
        
        // Convert blob to base64
        const imageData = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(imageBlob);
        });
        
        // Create parts array for Gemini
        const prompt = "Analyze this baked good. Focus on texture, appearance, and potential areas for improvement.";
        
        // Generate content with the image
        const result = await model.generateContent({
          contents: [{
            parts: [
              { text: prompt },
              { 
                inlineData: {
                  mimeType: "image/jpeg",
                  data: (imageData as string).split(',')[1] // Remove data URL prefix
                }
              }
            ]
          }]
        });
        
        const response = await result.response;
        return response.text();
      });

      const imageAnalyses = await Promise.all(imageAnalysisPromises)
      console.log('Image analysis completed')

      console.log('Starting recipe analysis')
      // Analyze recipe modifications using Gemini
      const recipePrompt = `Analyze these recipe modifications for "${recipeTitle}":
        Original Instructions: ${JSON.stringify(originalInstructions)}
        Modified Instructions: ${JSON.stringify(modifiedInstructions)}
        Original Ingredients: ${JSON.stringify(originalIngredients)}
        Modified Ingredients: ${JSON.stringify(modifiedIngredients)}
        
        Consider the modifications' impact and suggest improvements.`;

      const recipeResult = await model.generateContent(recipePrompt);
      const recipeResponse = await recipeResult.response;
      const recipeInsights = recipeResponse.text();

      // Combine analyses
      const imageInsights = imageAnalyses.join("\n")

      console.log('Generating final analysis')
      // Generate final insights
      const finalPrompt = `Based on these analyses:
        Image Analysis: ${imageInsights}
        Recipe Analysis: ${recipeInsights}
        
        Provide concise, actionable insights for improving this recipe next time.`;

      const finalResult = await model.generateContent(finalPrompt);
      const finalResponse = await finalResult.response;
      const finalInsights = finalResponse.text();

      return new Response(
        JSON.stringify({ insights: finalInsights }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (geminiError) {
      console.error('Gemini API Error:', geminiError)
      throw new Error(`Gemini API Error: ${geminiError.message}`)
    }

  } catch (error) {
    console.error('Error in edge function:', error)
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