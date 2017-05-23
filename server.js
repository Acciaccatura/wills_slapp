'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')

var slapp = Slapp({
  convo_store: ConvoStore(),
  context: Context()
})

slapp.message('eyy', ['direct_message'], (msg, text) => {
  msg.say(':o', (err, data) => {})
})

var app = express()
slapp.attachToExpress(app)

app.listen(process.env.PORT || 3000)