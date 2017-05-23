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
//function takes string, string, string, callback(data).
//data is the json from translatr
//TODO: make data return the translated text or null
function translate(phrase, from, to, callback) {
  let string = {
    'text': phrase,
    'from': from,
    'to': to
  }
  let req = http.request(translate_options, (res) => {
    res.setEncoding('utf-8')
    res.on('data', (data) => {
      data = JSON.parse(data).translationText //null if, failed to translate 
      callback(data || '')
    })
  })
  req.write(JSON.stringify(string))
  req.end()
}

translate('hello', 'en', 'es', (data) => {
  console.log(data)
})

//Slapp starts here!!!!
var slapp = Slapp({
  convo_store: ConvoStore(),
  context: Context()
})

slapp.message('translate from (\\w+) to (\\w+): (.*)', (msg, text, from, to, phrase) => {
  translate(phrase, from, to, (data) => {
    msg.say(data, (err, data) => {
      if (err) {
        console.log(err)
      }
    })
  })
})

//initialize express!!!
var app = slapp.attachToExpress(express())

app.listen(port, () => {
  console.log('Brunch was delicious, and now we usually see a movie, like we always do. What are you thinking this time, partner, ' + port + '?')
})