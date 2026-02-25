const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

class AiController {
  static async getReply(chats, message) {
    const chatString = chats.join(" | ");
    const completion = await groq.chat.completions.create({
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
          content: message + 'berikut adalah message message sebelumnya: ' + chatString,
        },
      ],
      max_tokens: 100,
    });

    return completion.choices[0].message.content;
  }
}

module.exports = AiController;
