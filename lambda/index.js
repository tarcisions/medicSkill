/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');

 

const persistenceAdapter = require('ask-sdk-s3-persistence-adapter');

 


const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        
        
        let speakOutput = 'Bem vindo! Posso te ajudar a lembrar de tomar um medicamento. Me informe qual remédio, hora, dia e mês quer que eu cadastre?'; 
 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

 

const HasHoraLaunchRequestHandler = {
    canHandle(handlerInput) {

 

        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};

 
        const remedio = sessionAttributes.hasOwnProperty('remedio') ? sessionAttributes.remedio : 0;
        const hora = sessionAttributes.hasOwnProperty('hora') ? sessionAttributes.hora : 0;
        const dia = sessionAttributes.hasOwnProperty('dia') ? sessionAttributes.dia : 0;
        const mes = sessionAttributes.hasOwnProperty('mes') ? sessionAttributes.mes : 0;

 

        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest' && remedio && 
            hora && dia && mes; 

 

    },
    handle(handlerInput) {

 

        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = attributesManager.getSessionAttributes() || {};
        const remedio = sessionAttributes.hasOwnProperty('remedio') ? sessionAttributes.remedio : 0;
        const hora = sessionAttributes.hasOwnProperty('hora') ? sessionAttributes.hora : 0;
        const dia = sessionAttributes.hasOwnProperty('dia') ? sessionAttributes.dia : 0;
        const mes = sessionAttributes.hasOwnProperty('mes') ? sessionAttributes.mes : 0;
        const speakOutput = `Bem vindo de volta! Você será lembrado de tomar o remédio ${remedio} ${hora} horas no dia ${dia} de ${mes} `;

 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

 

const LembrarRemedioIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'LembrarRemedioIntent';
    },
    async handle(handlerInput) {
        const remedio = handlerInput.requestEnvelope.request.intent.slots.remedio.value;
        const hora = handlerInput.requestEnvelope.request.intent.slots.hora.value;
        const dia = handlerInput.requestEnvelope.request.intent.slots.dia.value;
        const mes = handlerInput.requestEnvelope.request.intent.slots.mes.value;
        const attributesManager = handlerInput.attributesManager;
        
        let horaAttributes = {
            "remedio" : remedio,
            "hora" : hora,
            "dia" : dia,
            "mes" : mes
        };
        
        attributesManager.setPersistentAttributes(horaAttributes);
        await attributesManager.savePersistentAttributes();
        
        const speakOutput = `Ok! Vou te lembrar de tomar o remédio ${remedio} ${hora} horas no dia ${dia} de ${mes} . Em que posso te ajudar mais?`;

 

        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
        
    }
};

 

const LoadRepeticaoInterceptor = {
    async process(handlerInput) {
        const attributesManager = handlerInput.attributesManager;
        const sessionAttributes = await attributesManager.getPersistentAttributes() || {};

 
        const remedio = sessionAttributes.hasOwnProperty('remedio') ? sessionAttributes.remedio : 0;
        const hora = sessionAttributes.hasOwnProperty('hora') ? sessionAttributes.hora : 0;
        const dia = sessionAttributes.hasOwnProperty('dia') ? sessionAttributes.dia : 0;
        const mes = sessionAttributes.hasOwnProperty('mes') ? sessionAttributes.mes : 0;

 

        if (remedio && hora && dia && mes) {
            attributesManager.setSessionAttributes(sessionAttributes);
        }
    }
};

 

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

 

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Ok! Até a próxima!';

 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Desculpe, não sei nada sobre isso. Tente de novo!';

 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

 

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

 

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .withPersistenceAdapter(
        new persistenceAdapter.S3PersistenceAdapter({bucketName:process.env.S3_PERSISTENCE_BUCKET})
    )
    .addRequestHandlers(
        HasHoraLaunchRequestHandler,
        LaunchRequestHandler,
        LembrarRemedioIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler
    )
    .addRequestInterceptors(
        LoadRepeticaoInterceptor
    )
    .addErrorHandlers(
        ErrorHandler
    )
    .lambda();