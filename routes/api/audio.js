const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const Audio = require("../../models/Audio");


async function syncRecognize(
  fileName
) {
  // [START speech_transcribe_sync]
  // Imports the Google Cloud client library
  const fs = require('fs');
  const speech = require('@google-cloud/speech');



  // Creates a client
  const client = new speech.SpeechClient({keyFilename:"/Users/sabman/Projects/foundry/transcribe-backend/files/my-first-project-d2ba0fb646f8.json",
  projectId:"planar-ember-233320"});

   const fullFileName = `${process.cwd()}/files/${fileName}`;
   const encoding = 'ENCODING_UNSPECIFIED';
   const sampleRateHertz = null;
   const languageCode = 'en-US';

  const config = {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  };
  const audio = {
    content: fs.readFileSync(fullFileName).toString('base64'),
  };

  const request = {
    config: config,
    audio: audio,
  };

  console.log("TRANSCRIBING");
  // Detects speech in the audio file
  const [response] = await client.recognize(request);
  const transcription = response.results
    .map(result => result.alternatives[0].transcript)
    .join('\n');
  return transcription;
  // [END speech_transcribe_sync]
}


router.get("/list", (req, res) => {

  var decoded = jwt.verify(req.headers.authorization, keys.secretKey);
  Audio.find({ userId: decoded.email })
    .then(doc => {
      console.log("Found:  " , doc);
      return res.status(200).send(doc);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).send(err);
    })

});


/* @route POST api/users/add
   @desc Register user
   @access Public
*/
router.post("/add", (req, res) => {
  const Email  = require("email-templates");
  console.log("Decoding");
  var decoded = jwt.verify(req.headers.authorization, keys.secretKey);
  console.log("decoded: ", decoded)
	let uploadFile = req.files.file;
  const fileName = req.files.file.name;
  uploadFile.mv(
    `${process.cwd()}/files/${fileName}`,
    function (err) {
      if (err) {
        return res.status(500).send(err)
      }


      //create new Audio record
      let record = new Audio({
        name: req.body.descr,
        userId: decoded.email,
        text: "",
        status: "In Progress"
      });

      record.save()
        .then(doc => { //upload to gcs

          syncRecognize(req.files.file.name)
            .then(function(res){
              console.log("TRANSCRIBED SUCCESSFULLY!", res);

              //Send email
              const email = new Email({
                message: {
                  from: 'career@foundry.com',
                  attachments: [
                    {
                      filename: req.files.file.name + '.txt',
                      content: res
                    }
                  ]
                },
                //send: true
              });

              email.send({
                message: {
                  to: "saby83@gmail.com"
                }
              })
              .then(console.log("SENT EMAIL"))
              .catch(console.error);

              Audio.findByIdAndUpdate( //update text on completion
                doc._id,
                {
                  status: 'Success',   // field:values to update
                  text: res
                },
                {
                  new: true,                       // return updated doc
                })
              .then(doc => {
                console.log("Saved to DB: " , doc);

              })
              .catch(err => {
               Audio.findOneAndUpdate( //update status on error
                { _id: doc._id },
                {
                  status: 'Error: ' + err,   // field:values to update
                })
                console.error(err)
              })
            }, function(err){
              console.log("TRANSCRIBE FAILED", err);
            });
        })
        .catch(err => {
          return res.status(500).send(err)
          console.log(err);
        })

      console.log(record);

      res.json({
        file: `/${req.files.file.name}`,
      })

    },
    )
	}
);
module.exports = router;
