// import { handleCommand } from '@/../lib/commands';
import { handleCommand } from "@/lib/commands";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      const update = req.body;
    //   console.log(update.)
      try {
        if (update.message && update.message.text) {
          const chatId = update.message.chat.id;
          const text = update.message.text;
          console.log(text)
          console.log(chatId)
  
          await handleCommand(chatId, text);
        }

        res.status(200).send('OK');
      } catch (error) {
        console.error('Error handling update:', error);
        // res.status(500).send('Internal Server Error');
        res.status(200).send('OK');
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }

}