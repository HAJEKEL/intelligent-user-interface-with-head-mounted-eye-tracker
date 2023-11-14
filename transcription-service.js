const { Deepgram } = require("@deepgram/sdk");
const EventEmitter = require("events");


class TranscriptionService extends EventEmitter { //transcription service that can interact with Deepgram and emit events when transcripts are received or errors occur.

  constructor() {
    super();
    const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY); //authentication of deepgram-api
    this.deepgramLive = deepgram.transcription.live({  //  live transcription service using Deepgram.
      encoding: "mulaw",
      sample_rate: "8000",
      model: "nova",
      punctuate: true,
      interim_results: false,
    });
    this.deepgramLive.addListener("transcriptReceived", (transcriptionMessage) => { // event listener is attached to the deepgramLive instance. 
      const transcription = JSON.parse(transcriptionMessage); //listening  for the "transcriptReceived" event, which is emitted when a transcription message is received. When this event occurs it parses the JSON message and extracts the transcript,
      const text = transcription.channel?.alternatives[0]?.transcript;  // extract the transcript property from a nested object structure, but it does so in a way that gracefully handles potential missing or null properties at each step. If any of the properties (channel, alternatives, or [0]) do not exist, or if they are null, text will be assigned undefined. This helps avoid "Cannot read property 'x' of undefined" errors.
      if (text) {
        this.emit("transcription", text); //emitting a "transcription" event with the extracted text.
      }
    });
    this.deepgramLive.addListener("error", (error) => { // Logging deepgram errors when they occur
      console.error("deepgram error");
      console.error(error);
    });
    this.deepgramLive.addListener("close", () => { // logging close message when deepgram connection is closed 
      console.log("Deepgram connection closed");
    });
  }

  /**
   * Send the payload to Deepgram
   * @param {String} payload A base64 MULAW/8000 audio stream
   */
  send(payload) { //send method 
    // TODO: Buffer up the media and then send
    if (this.deepgramLive.getReadyState() === 1) { // checks the ready state of the deepgramLive instance. If the ready state is equal to 1 (which means the connection is open and ready), it sends the payload to Deepgram after converting it from base64 to a Buffer.
      this.deepgramLive.send(Buffer.from(payload, "base64")); //  base64-encoded MULAW/8000 audio stream as this is the output of twilio
    }
  }
}

module.exports = { TranscriptionService } // exports the TranscriptionService class so that it can be used in other parts of the application.