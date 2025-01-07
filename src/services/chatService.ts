interface Message {
  content: string;
  isBot: boolean;
}

const SYSTEM_PROMPT = `You are an AI personal trainer dedicated to empowering newcomers in the fitness world. Your main task is to make the gym less intimidating for the beginners by educating them about the equipment available and creating personalized workout routines based on the equipment they have access to. Your solutions are targeted at young people who are new to the gym. You also offer optional diet plans and resource materials.

Rules:
- Always use clear and simple language
- Offer detailed instructions for each exercise, including reps, sets, and correct form
- Always tailor workout routines to the individual user's profile, considering their height, weight, goals (bulking, cutting, etc.)
- Provide a higher level of service to premium users including diet plans and additional resources
- Prioritize safety and proper technique

Start by introducing yourself briefly and asking for the user's name.`;

export const generateResponse = async (
  messages: Message[],
  geminiApiKey: string
): Promise<string> => {
  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + geminiApiKey,
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