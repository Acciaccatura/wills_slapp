'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var slapp = Slapp({
  convo_store = ConvoStore()
  context = Context()
})

slapp.event('message.im', (msg) => {
  if (msg.meta.app_token) {
    msg.say('hello, ' + msg.meta.app_user_id, (err, data) => {})
  } else {
    msg.say('whoa', (err, data) => {})
  }
})

var app = express()
slapp.attachToExpress(app)

app.listen(process.env.PORT || 3000)