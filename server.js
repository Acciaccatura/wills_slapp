'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

const port = process.env.PORT || 3000

var slapp = Slapp({
  convo_store: ConvoStore(),
  context: Context()
})

slapp.message('eyy', ['direct_message'], (msg, text) => {
  msg.say(':o', (err, data) => {})
})

slapp.event('message', (msg) => {
  if (msg.meta.app_token) {
    msg.say('howdy', (err, data) => {
      if (err) {
        console.log(err)
      }
     })
  } else {
    msg.say('aww...')
  }
})

var app = express()
slapp.attachToExpress(app)



app.listen(port, () => {
  console.log('Brunch was delicious, and now we\'re going to go see a movie, like we always do. What are you thinking this time, partner, ' + port + '?')
})