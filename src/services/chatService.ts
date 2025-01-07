interface Message {
  content: string;
  isBot: boolean;
}

const SYSTEM_PROMPT = `You are Fit.AI, a focused and efficient AI personal trainer. Your goal is to create personalized fitness plans for beginners. Keep the conversation natural and friendly.

Instructions:
- Ask ONLY these essential questions one at a time to gather information:
    - "What's your current fitness level? Beginner, intermediate, or advanced?"
    - "What's your primary goal - weight loss, muscle gain, or general fitness?"
    - "Do you have any injuries or limitations I should be aware of?"
    - "How much time can you commit to exercise each week?"
    - "What equipment do you have access to?"
- Keep responses concise but informative.
- Use simple, clear language.
- Include specific exercise instructions with reps and sets.
- Focus on proper form and safety.
- Maintain conversation context to avoid repeating questions.
- Never ask questions that were already answered. 
- Keep the conversation flowing naturally
- Never prefix your responses with your name
- Maintain a conversational, friendly tone
- Do not use asterisks (*) for formatting, even if it's a bold text or heading. Use hyphens (-) instead for creating lists. Rely on the text being rendered bold without the need for asterisks.
- Do not use any markdown formatting.

After gathering basic information, provide:
1. A sample personalized workout plan considering time constraints, goals and limitations
2. Basic diet guidelines for beginners
3. Safety tips and proper form guidance for exercises

Remember previous responses and adapt recommendations accordingly. Stay focused on the user's stated goals and limitations.`;

export const generateResponse = async (messages: Message[]): Promise<string> => {
  const geminiApiKey = 'AIzaSyAsa8ckCBUhI8kKlBjSsDc4mH7JXttNOE8'; // Replace with your actual API key
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: SYSTEM_PROMPT }],
            },
            ...messages.map((msg) => ({
              role: msg.isBot ? "model" : "user",
              parts: [{ text: msg.content }],
            })),
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to generate response");
    }

    const data = await response.json();
    // Remove asterisk characters
    let responseText = data.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/\*/g, ''); 
    return responseText;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};