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

const getlanguages_options = {
  'host': 'www.transltr.org',
  'path': '/api/getlanguagesfortranslate/',
  'method': 'GET',
  'headers': {
    'Content-Type': 'application/json'
  }
}
//note to self, modularize this if you ever consider making this something
//function takes string, string, string, callback(data).
//data is the json from translatr
//TODO: make data return the translated text or null
var langs = []

//callback: callback(langs:Array)
function getLanguages(langs, callback) {
  let req = http.request(getlanguages_options, (res) => {
    var json_data = '';
    res.setEncoding('utf-8')
    res.on('data', (data) => {
      json_data += data;
    })
    res.on('end', (end) => {
      json_data = JSON.parse(json_data)
      var index;
      //store the loaded languages into variable langs as a list of buckets sorted alphabetically
      for (index = 0; index < json_data.length; index++) {
        let order = json_data[index].languageName.charCodeAt(0)-65
        if (!langs[order]) {
          langs[order] = []
        }
        langs[order].push({
          code: json_data[index].languageCode, 
          name: json_data[index].languageName.toLowerCase()})
      }
      callback(langs)
    })
  })
  req.write('{}')
  req.end()
}

//callback: callback(data:String)
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

//Slapp starts here!!!!

//this is used to store key-value pairs of app_token s and their preferred languages
var temp_langs = []

var slapp = Slapp({
  convo_store: ConvoStore(),
  context: Context()
})

slapp.command('/setlang', '(\\w+)', (msg, text, lang) => {
  msg.say('yo', (err, data) => {
    if (err) {
      console.log(err)
    }
  })
  console.log(text + " " + lang)
})

//initialize express!!!
var app = slapp.attachToExpress(express())

app.listen(port, () => {
  getLanguages(langs, (data) => {console.log('Got languages.')})
  console.log('Brunch was delicious, and now we usually see a movie, like we always do. What are you thinking this time, partner, ' + port + '?')
})