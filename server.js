require("dotenv").config();  //  loads configuration from a .env file into the environment using the dotenv package.

const express = require("express"); // import express.js library to create express.js app
const ExpressWs = require("express-ws"); // adds WebSocket support to an Express.js application.

const { TextToSpeechService } = require("./tts-service");
const { TranscriptionService } = require("./transcription-service");
const { OpenAIService } = require('./openai-service');
//const { DisfluencyService } = require('./disfluency-service');

const systemMessage = {
  role: "system",
  content: "As Rajeev Malhotra, you dont say you are an ai, but you are the CEO of Malhotra Tech Innovations, you carry a reputation for being unwavering and highly meticulous in your business dealings, especially when discussing potential partnerships like the one with KLM. Your personality is tinted with a definitive shade of red, symbolizing your drive, competitive nature, and a constant quest for efficient solutions. The main goals is to buy tickets under 500 euros per ticket. You have to persuade KLM to do this. Engaging in discussions, you rarely allow emotions to dilute the rigor of your business decisions and always ensure that every potential partnership aligns not only with the strategic objectives of Malhotra Tech Innovations but also adheres to your staunch and unwavering cultural values. Cultural heritage and traditional principles are not mere concepts but a sturdy backbone to every business relationship and deal you entertain. Hence, while exploring synergies with KLMs B2B sales department, you remain vigilant, ensuring that any collaboration forged is mutually beneficial, respectful towards cultural tenets, and, most importantly, adheres to the meticulous standards that have elevated Malhotra Tech Innovations to its esteemed position in the tech industry, keep your answers maximum 25 words."
  // Add the rest of the system message content
};

const app = express(); //express.js app instance
ExpressWs(app); //add websocket support

const PORT = 3000; //set server port

app.post("/incoming", (req, res) => { // Handle an incoming HTTP POST request at /incoming, it is the webhook for the phonecall
  console.log("picked up")
  res.status(200);
  res.type("text/xml"); //xml response that sets up bi-directional streaming phone call with the app streamed at the url defined in .env
  res.end(`
  <Response>
    <Connect>
      <Stream url="wss://${process.env.SERVER}/connection" />
    </Connect>
  </Response>
  `);
});

app.ws("/connection", (ws, req) => { // sets up a WebSocket route at /connection
  ws.on("error", console.error); //event listener for the "error" event and calling built-in javascript console.error 
  // Filled in from start message
  console.log("arrived at connection webhook");
  let streamSid;
  const openAIService = new OpenAIService(process.env.OPENAI_API_KEY, systemMessage);
  const transcriptionService = new TranscriptionService(); //initialize stt
  const ttsService = new TextToSpeechService({}); //initialize tts
  //const disfluencyService = new DisfluencyService();

  // Incoming from MediaStream
  ws.on("message", function message(data) {
    const msg = JSON.parse(data);
    if (msg.event === "start") {
      streamSid = msg.start.streamSid;
      console.log(`Starting Media Stream for ${streamSid}`);
    } else if (msg.event === "media") {
      transcriptionService.send(msg.media.payload);
      // const disfluency = disfluencyService.getNextDisfluency();
      // if (disfluency) {
      //     ttsService.generate(disfluency); // Send the disfluency to ElevenLabs
      // }
    } else if (msg.event === "mark") {
      const label = msg.mark.name;
      console.log(`Media completed mark (${msg.sequenceNumber}): ${label}`)
    }
  });

  transcriptionService.on('transcription', (transcription) => {
    console.log(`Received transcription: ${transcription}`);
    openAIService.generateResponse(transcription);
  });

  openAIService.on('response', (response) => {
    console.log(`Generated response: ${response}`);
    ttsService.generate(response);
  });

  ttsService.on("speech", (audio, label) => {
    console.log(`Sending audio to Twilio ${audio.length} b64 characters`);
    ws.send(
      JSON.stringify({
        streamSid,
        event: "media",
        media: {
          payload: audio,
        },
      })
    );
    // When the media completes you will receive a `mark` message with the label
    ws.send(
      JSON.stringify({
        streamSid,
        event: "mark",
        mark: {
          name: label
        }
      })
    )
  });
  // Reset the disfluencies for a new call
  // ws.on("close", function close() {
  //   disfluencyService.resetDisfluencies();
  // });
});

app.listen(PORT);
console.log(`Server running on port ${PORT}`);