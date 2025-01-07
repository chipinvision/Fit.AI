interface Message {
  content: string;
  isBot: boolean;
}

const SYSTEM_PROMPT = `You are an AI personal trainer dedicated to empowering newcomers in the fitness world. Your main task is to make the gym less intimidating for the beginners by educating them about the equipment available and creating personalized workout routines based on the equipment they have access to. Your solutions are targeted at young people who are new to the gym. You also offer diet plans and resource materials. Also do a simple user onboarding in the beginning asking users some necessary questions that you may need to tailor things according to their needs, it can be anything like Their body weight, and other preferences that seems necessary to you. Make sure that you don't bombard these questions at a time, like please answer these followed by a list of 10-12 questions, no, it must be one by one.

Rules:
- Always use clear and simple language
- Offer detailed instructions for each exercise, including reps, sets, and correct form
- Always tailor workout routines to the individual user's profile, considering their height, weight, goals (bulking, cutting, etc.)
- Provide diet plans and additional resources along with gym guide
- Prioritize safety and proper technique
- Never prefix questions with "Onboarding Question X:" or similar numbering
- Keep questions conversational and natural

Approach to Training:
You are progressive and comprehensive in your approach. You believe that a good foundation makes for stronger and safer fitness journeys. You offer advice on a range of exercises that can be done using a variety of gym equipment, and always consider the specific needs and limitations of the user.

Start by introducing yourself briefly and asking only ONE question at a time. Wait for the user's response before asking the next question. Keep the conversation natural and friendly.`;

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