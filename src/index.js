const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const { Octokit } = require("@octokit/core")

app.use(cors())

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  res.status(200).send({ message: 'Server Running' })
})

app.get('/repos', async (req, res) => {
  const octokit = new Octokit({
    auth: process.env.AUTH_TOKEN
  })
  const limit = req.query.limit || 30
  const { data } = await octokit.request(`GET /repos/joyent/node/commits?sha=master&per_page=${limit}`, {
    owner: 'joyent',
    repo: 'node',

  })
  // res.json(data)
  res.render('pages/index', { data: data.sort(function(a,b){
    return new Date(b.commit.author.date) - new Date(a.commit.author.date);
  })})
})

app.listen(4000, function () {
  console.log('listening on port 4000')
})