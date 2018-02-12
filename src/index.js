'use strict';

var Alexa = require('alexa-sdk');
var https = require("https");
var dashbot = require("dashbot")("3M0wHk4MHGLVKnl9ahijVuTcbOViQdTz4XfAHg63").alexa;
var Airtable = require('airtable');
Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: 'keynLGHM8Jor40KNX'
});
var base = Airtable.base('appjn0CLnWflpjTSV');

var APP_ID = "amzn1.ask.skill.ceaf32b1-15bc-4b03-b951-baaee234c05d";  // TODO replace with your app ID (OPTIONAL).

var handlers = {
    'LaunchRequest': function () {
        console.log("LAUNCH REQUEST")
        console.log("THIS = " + JSON.stringify(this));

        
        httpsGet("Scenarios", (data) => {
            var speechText = "I call this one, " + data.records[0].fields.Name + "<break time='1s'/>Would you rather<break time='.5s'/>" + data.records[0].fields.SpeechScenario;

            base('Scenarios').update(data.records[0].id, {"UsageCount": data.records[0].fields.UsageCount + 1, "LastUsed": Date.now()});

            this.response.speak(speechText);
            this.emit(":responseReady");
        });
        

        //this.response.speak("Welcome to Would You Rather!  A game that asks you to pick from two terrible options!");
        //this.emit(":responseReady");
        
        //var data = base("Scenarios").select({sort: [{field:"UsageCount", direction: "asc"}]});

        //console.log("DATA = ", JSON.stringify(data.records));
        

    },
    'GetScenario': function () {
        
    },
    'AMAZON.HelpIntent': function () {
        
    },
    'AMAZON.CancelIntent': function () {
        
    },
    'AMAZON.StopIntent': function () {
        
    },
    "Unhandled": function () {
        console.log("THIS = " + this);
    }
};

function httpsGet(location, callback) {
    var options = {
        host: "api.airtable.com",
        port: 443,
        path: "/v0/appjn0CLnWflpjTSV/" + location + "?api_key=keynLGHM8Jor40KNX&pageSize=3&sort%5B0%5D%5Bfield%5D=UsageCount&sort%5B0%5D%5Bdirection%5D=asc&sort%5B1%5D%5Bfield%5D=LastUsed&sort%5B1%5D%5Bdirection%5D=asc",
        method: 'GET',
    };

    console.log("PATH = https://" + options.host + options.path);

    var req = https.request(options, res => {
        res.setEncoding('utf8');
        var returnData = "";

        res.on('data', chunk => {
            returnData = returnData + chunk;
        });

        res.on('end', () => {
            var data = JSON.parse(returnData);
            console.log("DATA = " + JSON.stringify(data));
            callback(data);
        });

    });
    req.end();

}

exports.handler = dashbot.handler((event, context, callback) => {
    console.log("EVENT = ", JSON.stringify(event));
    console.log("CONTEXT = ", JSON.stringify(context));
    const alexa = Alexa.handler(event, context);
    alexa.appId = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
  });
