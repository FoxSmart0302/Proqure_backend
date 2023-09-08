const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const { isEmpty, getCurrentFormatedDate } = require("../utils");
const { API_KEY } = require("../config");

const openai = new OpenAI({
  apiKey: API_KEY, // defaults to process.env["OPENAI_API_KEY"]
});
const speech = require("@google-cloud/speech");
const client = new speech.SpeechClient();
exports.upload = (req, res) => {
  console.log("upload_chatbot:", req.body);
  // return

  if (req.files && Object.keys(req.files).length) {
    const file = req.files.file;
    fileName = req.body.filename;
    console.log("fileName", fileName);
    uploadPath = path.join(__dirname, `..\\public\\upload\\ai`);
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    uploadPath = path.join(__dirname, `..\\public\\upload\\ai\\${fileName}`);
    filePath = `\\\\upload\\\\ai\\\\${fileName}`;
    console.log("uploadPath", filePath);
    file.mv(uploadPath, function (err) {
      if (err) {
        return res.json({
          status: 1,
          message: "Please try again later",
        });
      }
      // text analyze

      transcribeAudio(uploadPath)
        .then((transcription) => {
          // Use the transcription as needed
          console.log("Transcription:", transcription);
        })
        .catch((error) => {
          // Handle any errors that occurred during transcription
          console.error("Transcription Error:", error);
        });

      return res.json({
        status: 0,
        message: "Successfully moved",
      });
    });
  } else {
    return res.json({
      status: 1,
      message: "Please try again later",
    });
  }
};

async function audioAnalyze(audioFile) {
  // transcribeAudio(audioFile).then((result) => {
  //     console.log("====data", result);
  // })
  const fileBuffer = fs.readFileSync(audioFile);
  const base64File = fileBuffer.toString("base64");
  console.log("fileButter", fileBuffer);
  console.log("base64File", base64File);
  try {
    const response = await openai.asr.transcribe({
      audio: base64File,
      model: "whisper",
    });

    console.log(response);
  } catch (error) {
    console.error("Error occurred during transcription:", error);
  }
}

async function transcribeAudio(audioFile) {
  // Read the audio file
  const audioBuffer = fs.readFileSync(audioFile);

  // Configure the audio settings
  const audioConfig = {
    encoding: "LINEAR16",
    sampleRateHertz: 16000,
    languageCode: "en-US",
  };

  // Create a recognition request
  const request = {
    audio: {
      content: audioBuffer.toString("base64"),
    },
    config: audioConfig,
  };

  try {
    // Perform the speech-to-text transcription
    const [response] = await client.recognize(request);

    // Extract the transcription results
    const transcription = response.results
      .map((result) => result.alternatives[0].transcript)
      .join("\n");

    console.log("Transcription:", transcription);
    return transcription;
  } catch (error) {
    console.error("Error occurred during transcription:", error);
    throw error;
  }
}
