'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const http = require('http')

const port = process.env.PORT || 3000

//test for translation API
const translate_options = {
  'host': 'www.transltr.org',
  'path': '/api/translate/',
  'method': 'POST',
  'headers': {
    'Content-Type': 'application/json'
  }
}
//note to self, modularize this if you ever consider making this something
function translate(phrase, from, to, callback) {
  let string = {
    'text': phrase,
    'from': from,
    'to': to
  }
  let req = http.request(translate_options, (res) => {
    res.setEncoding('utf-8')
    res.on('data', (data) => {
      callback(data)
    })
  })
  req.write(JSON.stringify(string))
  req.end()
}

//Slapp starts here!!!!
var slapp = Slapp({
  convo_store: ConvoStore(),
  context: Context()
})

slapp.message('hello', (msg, text) => {
  console.log('simplicity is key')
  if (msg.meta.app_token) {
    msg.say('wow!', (err, data) => {
      if (err) {
        console.log(err)
      }
    })
  }
})

slapp.event()

//initialize express!!!
var app = slapp.attachToExpress(express())

app.listen(port, () => {
  console.log('Brunch was delicious, and now we usually see a movie, like we always do. What are you thinking this time, partner, ' + port + '?')
})