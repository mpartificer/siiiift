import { OpenAI } from "openai";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': 'http://localhost:3000',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      imageUrls, 
      recipeTitle,
      originalInstructions,
      originalIngredients,
      modifiedInstructions,
      modifiedIngredients 
    } = await req.json();

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    const openai = new OpenAI({ apiKey });

    // Analyze each image
    const imageAnalysisPromises = imageUrls.map(url => 
      openai.chat.completions.create({
        model: "gpt-4-vision-preview",
        messages: [{
          role: "user",
          content: [
            { type: "text", text: "Analyze this baked good. Focus on texture, appearance, and potential areas for improvement." },
            { type: "image_url", image_url: { url } }
          ]
        }],
        max_tokens: 300
      })
    );

    const imageAnalyses = await Promise.all(imageAnalysisPromises);

    // Analyze recipe modifications
    const recipeAnalysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Analyze these recipe modifications for "${recipeTitle}":
          Original Instructions: ${JSON.stringify(originalInstructions)}
          Modified Instructions: ${JSON.stringify(modifiedInstructions)}
          Original Ingredients: ${JSON.stringify(originalIngredients)}
          Modified Ingredients: ${JSON.stringify(modifiedIngredients)}
          
          Consider the modifications' impact and suggest improvements.`
      }],
      max_tokens: 500
    });

    // Combine analyses
    const imageInsights = imageAnalyses.map(analysis => 
      analysis.choices[0].message.content).join("\n");
    const recipeInsights = recipeAnalysis.choices[0].message.content;

    // Generate final insights
    const finalAnalysis = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "user",
        content: `Based on these analyses:
          Image Analysis: ${imageInsights}
          Recipe Analysis: ${recipeInsights}
          
          Provide concise, actionable insights for improving this recipe next time.`
      }],
      max_tokens: 300
    });

    return new Response(
      JSON.stringify({ insights: finalAnalysis.choices[0].message.content }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});