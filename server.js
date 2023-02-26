 var express = require('express');
 var bodyParser = require('body-parser');
 var app = express();
 var http = require('http').Server(app)
 var io = require('socket.io')(http)
 var mongoose = require('mongoose');

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))

var dburl = 'mongodb+srv://user:user@cluster0.nnb6g5b.mongodb.net/?retryWrites=true&w=majority'

var schema = new mongoose.Schema({ name: String, message: String});
var Message = mongoose.model('Message', schema);
//hehehe

app.get('/messages', (req, res) =>{
  Message.find({}, (err, message) =>{
    res.send(message)

  })
});


app.post('/messages', async (req, res) => {

  try {
      var message = new Message(req.body)

      var savedMessage = await message.save()

      console.log('saved')

      var censored = await Message.findOne({ message: 'xxx' })

      if (censored)
          await Message.remove({ _id: censored.id })
      else
          io.emit('message', req.body)

      res.sendStatus(200)
  } catch (error) {
      res.sendStatus(500)
      return console.error(error)
  } finally {
      console.log('message post called')
  }
})

io.on('connection', (socket) => {
  console.log('a user connected')
});

mongoose.connect(dburl, (err) => {
  console.log('mongoDB connected', err)
});

var server = http.listen(3000, () => {
   console.log('server is listening on port', server.address().port);
 }); 