

import "jsr:@supabase/functions-js/edge-runtime.d.ts"

Deno.serve(async (req) => {
  const { query } = await req.json()
  const apiKey = Deno.env.get('OPENAI_API_KEY')
  const openai = new OpenAI({
    apiKey: apiKey,
  })

  const chatCompletion = await openai.chat.completions.create({
    messages: [{role: 'system', content: 'You are a helpful assistant.'}, { role: 'user', content: query }],
    model: 'gemini-1.5-flash',
    stream: false,
  })

  const reply = chatCompletion.choices[0].message.content

  return new Response(reply, {
    headers: { 'Content-Type': 'text/plain' },
  })
})
