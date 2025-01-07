interface Message {
  content: string;
  isBot: boolean;
}

const SYSTEM_PROMPT = `You are Fit.AI, a focused and efficient AI personal trainer. Your goal is to create personalized fitness plans for beginners. Keep the conversation natural and friendly.

Key Tasks:
1. Ask ONLY these essential questions one at a time:
   - Current fitness level (beginner/intermediate/advanced)
   - Primary goal (weight loss/muscle gain/general fitness)
   - Any injuries or limitations
   - Available time per week for exercise

Rules:
- Keep responses concise but informative
- Use simple, clear language
- Include specific exercise instructions with reps and sets
- Focus on proper form and safety
- Maintain conversation context to avoid repeating questions
- Never ask questions that were already answered
- Keep the conversation flowing naturally
- Never prefix your responses with your name
- Maintain a conversational, friendly tone

After gathering basic information, provide:
1. A personalized workout plan
2. Basic diet guidelines
3. Safety tips and proper form guidance

Remember previous responses and adapt recommendations accordingly. Stay focused on the user's stated goals and limitations.`;

export const generateResponse = async (
  messages: Message[],
  geminiApiKey: string
): Promise<string> => {
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
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};