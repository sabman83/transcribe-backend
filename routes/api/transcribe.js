
let Transcribe = require('./models/Transcribe');

router.route('/:userId').get(function(req, res) {
  Transcribe.findById(req.params.id, function(err, list) {
    if(err) {
      console.log(err);
    } else {
      res.json(list);
    }
  });
});

router.route('/add').post(function(req, res) {
  });
