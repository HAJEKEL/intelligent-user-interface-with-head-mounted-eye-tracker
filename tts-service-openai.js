const OpenAI = require('openai').default;
const EventEmitter = require('events');
const { spawn } = require('child_process');
const stream = require('stream');

class TextToSpeechService extends EventEmitter {
  constructor(apiKey) {
    super();
    this.openai = new OpenAI({apiKey}); // Ensure the API key is properly configured
  }

  async generate(text) {
    try {
      const response = await this.openai.audio.speech.create({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
        format: 'mp3' // Using Opus for potentially lower latency
      });

      const opusStream = response.body; // Assuming this is a stream
      const ffmpegProcess = spawn('ffmpeg', [
        '-i', 'pipe:0',           // Input from stdin
        '-f', 'wav',              // Output format as WAV
        '-ar', '8000',            // Sample rate for μ-law
        '-ac', '1',               // Mono channel
        '-map_channel', '0.0.0',  // Map to mono
        '-c:a', 'pcm_mulaw',      // μ-law audio codec
        'pipe:1'                  // Output to stdout
      ]);

      const transformStream = new stream.Transform({
        transform(chunk, encoding, callback) {
          this.push(chunk);
          callback();
        }
      });

      opusStream.pipe(ffmpegProcess.stdin);
      ffmpegProcess.stdout.pipe(transformStream);

      transformStream.on('data', (chunk) => {
        // Emit each chunk of μ-law encoded audio
        this.emit("speech", chunk.toString("base64"));
      });

      ffmpegProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`ffmpeg process closed with code ${code}`);
        }
      });

      ffmpegProcess.stderr.on('data', (data) => {
        console.error(`ffmpeg stderr: ${data}`);
      });

    } catch (error) {
      console.error('Error occurred in TextToSpeech service');
      console.error(error);
      this.emit("error", error);
    }
  }
}

module.exports = { TextToSpeechService };
