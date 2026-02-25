const Groq = require("groq-sdk");

const groq = new Groq({
  apikey: process.env.GROQ_API_KEY,
});

class AiController {
  static async Ai(req, res, next) {
    try {
      const { message } = req.body;
      if (!message)
        throw { name: "BadRequest", message: "Message is required" };

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
            content: message,
          },
        ],
        max_tokens: 100,
      });

      const reply = completion.choices[0].message.content;
      res.status(200).json({ data: { reply } });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AiController;
