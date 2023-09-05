require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser")
const cors = require('cors');
const postgres = require('postgres');
const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


// Basic Configuration
const port = process.env.PORT || 3000;

async function addWebsiteURL(website) {
  let shortcut = await sql`insert into sites (website)
    values(${website})
  returning id as short_url, website as original_url
  `
  return shortcut
}
async function getWebsiteUrlByID(id) {
  const shortcut = await sql`
    select id as id, website as website from sites
    where id = ${id}
  `
  return shortcut
}

const sql = postgres(process.env.POSTGRES_URI)

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});
app.post("/api/shorturl", async (req, res) => {
  try{
  const url = req.body.url
  console.log(req.body)
  if(!isUrl(url)) return  res.json({error: "invalid url"})
  let shortcut = await addWebsiteURL(url)
  res.json(shortcut[0])
  }catch(e) {
    console.log(e)
    res.json({error: "invalid url"})
  }
})
app.get("/api/shorturl/:id", async (req, res) =>{
  try {
  let id = Number(req.params.id)
  let shortcut = await getWebsiteUrlByID(id)
  res.redirect(shortcut[0].website)
  }
  catch{
    res.json({error: "something went wrong"})
  }
} )
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

function isUrl(url) {
  try {
    url = new URL(url);
  } catch  {
    return false;  
  }
  return url.protocol === "http:" || url.protocol === "https:";
}