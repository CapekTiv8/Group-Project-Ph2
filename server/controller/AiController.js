const Groq = require("groq-sdk");

let groq;

function getGroqClient() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is required to use AI replies");
  }

  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groq;
}

class AiController {
  static async getReply(chats, message) {
    const chatString = chats.join(" || ");
    const completion = await getGroqClient().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `Kamu adalah partner chat anonim dalam aplikasi random chat realtime.
            Tugasmu adalah:
            - Membalas dengan santai, natural, dan tidak terlalu panjang.
            - Gunakan bahasa yang sama dengan user.
            - Jangan terlalu formal.
            - Jangan menjelaskan bahwa kamu adalah AI kecuali ditanya langsung.
            - Jika user toxic, balas dengan sopan atau alihkan topik.`,
        },
        {
          role: "user",
          content: message + 'berikut adalah message message sebelumnya dari yang lain: ' + chatString,
        },
      ],
      max_tokens: 100,
    });

    return completion.choices[0].message.content;
  }
}

module.exports = AiController;
