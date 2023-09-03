require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({extended: false}))

let id = 0
const urls =  new Map()
urls.set(++id, new URL ("https://www.freecodecamp.org"))
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.post("/api/shorturl", (req, res) => {
  const addRes = addUrl(req.body.url)
  if(addRes === undefined) {
    return res.json({"error": "invalid url"}).status(400)
  }
  const { originalUrl, shortUrl } = addRes
  res.json({original_url: originalUrl, short_url: shortUrl}).status(200)
})
app.get("/api/shorturl/:id", (req, res) =>{
  res.redirect(urls.get(Number(req.params.id)).toString())
} )
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function addUrl(u) {
  let url
  try {
   url = new URL(u) 
  } catch {
    return 
  }
  if(!(url.protocol==="http:"||url.protocol==="https:")){
    return 
  }
  urls.set(++id, url)
  return {shortUrl: id, originalUrl: url}
}