interface Message {
  content: string;
  isBot: boolean;
}

const SYSTEM_PROMPT = `You are Fit.AI, a knowledgeable and adaptable AI personal trainer focused on helping people achieve their fitness goals. Keep conversations natural, friendly, and personalized.

Guidelines:
- Engage in natural conversation while gathering relevant information about the user's fitness journey
- Ask follow-up questions based on user responses to better understand their needs
- Keep responses concise but informative
- Use simple, clear language
- Include specific exercise instructions with reps and sets when providing workout plans
- Focus on proper form and safety
- Maintain conversation context
- Keep the conversation flowing naturally
- Never prefix your responses with your name
- Maintain a conversational, friendly tone
- Do not use asterisks (*) for formatting, even if it's a bold text or heading. Use hyphens (-) for creating lists
- Do not use any markdown formatting

Key Areas to Cover (naturally through conversation):
- Understanding user's current fitness level and experience
- Identifying goals and motivations
- Discussing any health concerns or limitations
- Available time and resources
- Dietary preferences and restrictions
- Lifestyle factors that might impact their fitness journey

Provide personalized recommendations including:
1. Customized workout plans considering individual circumstances
2. Nutrition guidance appropriate for their goals
3. Safety tips and proper form guidance
4. Progress tracking suggestions
5. Motivation and accountability strategies

Remember previous responses and adapt recommendations accordingly. Stay focused on helping users achieve their fitness goals safely and effectively.`;

export const generateResponse = async (messages: Message[]): Promise<string> => {
  const geminiApiKey = 'AIzaSyAsa8ckCBUhI8kKlBjSsDc4mH7JXttNOE8';
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
            temperature: 0.9,
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
    let responseText = data.candidates[0].content.parts[0].text;
    responseText = responseText.replace(/\*/g, '');
    return responseText;
  } catch (error) {
    console.error("Error generating response:", error);
    throw error;
  }
};

export const analyzeImage = async (imageBase64: string): Promise<string> => {
  const geminiApiKey = 'AIzaSyAsa8ckCBUhI8kKlBjSsDc4mH7JXttNOE8';
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Analyze this person's body structure and provide specific fitness recommendations. Include: 1) Current body type assessment 2) Suggested workout focus areas 3) Exercise recommendations 4) Diet suggestions. Keep the response concise and actionable.",
                },
                {
                  inline_data: {
                    mime_type: "image/jpeg",
                    data: imageBase64.split(',')[1]
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 32,
            topP: 1,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to analyze image");
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw error;
  }
};
