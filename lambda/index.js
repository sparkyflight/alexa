import { getRequestType, getIntentName, SkillBuilders } from "ask-sdk-core";
import * as Sentry from "@sentry/node";

Sentry.init({
	dsn: "https://5ca469c98e44c99cb451800603386ee2@trace.select-list.xyz/11",
	tracesSampleRate: 1.0,
});

const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
	},
	handle(handlerInput) {
		const speakOutput =
			"Welcome, you can say Hello or Help. Which would you like to try?";

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse();
	},
};

const HelloWorldIntentHandler = {
	canHandle(handlerInput) {
		return (
			getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
			getIntentName(handlerInput.requestEnvelope) === "HelloWorldIntent"
		);
	},
	handle(handlerInput) {
		const speakOutput = "Hello World!";

		return (
			handlerInput.responseBuilder
				.speak(speakOutput)
				//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse()
		);
	},
};

const HelpIntentHandler = {
	canHandle(handlerInput) {
		return (
			getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
			getIntentName(handlerInput.requestEnvelope) === "AMAZON.HelpIntent"
		);
	},
	handle(handlerInput) {
		const speakOutput = "You can say hello to me! How can I help?";

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse();
	},
};

const CancelAndStopIntentHandler = {
	canHandle(handlerInput) {
		return (
			getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
			(getIntentName(handlerInput.requestEnvelope) ===
				"AMAZON.CancelIntent" ||
				getIntentName(handlerInput.requestEnvelope) ===
					"AMAZON.StopIntent")
		);
	},
	handle(handlerInput) {
		const speakOutput = "Goodbye!";

		return handlerInput.responseBuilder.speak(speakOutput).getResponse();
	},
};

const FallbackIntentHandler = {
	canHandle(handlerInput) {
		return (
			getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
			getIntentName(handlerInput.requestEnvelope) ===
				"AMAZON.FallbackIntent"
		);
	},
	handle(handlerInput) {
		const speakOutput = "Sorry, I don't know about that. Please try again.";

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse();
	},
};

const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return (
			getRequestType(handlerInput.requestEnvelope) ===
			"SessionEndedRequest"
		);
	},
	handle(handlerInput) {
		console.log(
			`~~~~ Session ended: ${JSON.stringify(
				handlerInput.requestEnvelope
			)}`
		);
		return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
	},
};

const IntentReflectorHandler = {
	canHandle(handlerInput) {
		return getRequestType(handlerInput.requestEnvelope) === "IntentRequest";
	},
	handle(handlerInput) {
		const intentName = getIntentName(handlerInput.requestEnvelope);
		const speakOutput = `You just triggered ${intentName}`;

		return (
			handlerInput.responseBuilder
				.speak(speakOutput)
				//.reprompt('add a reprompt if you want to keep the session open for the user to respond')
				.getResponse()
		);
	},
};

const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		const speakOutput =
			"Sorry, I had trouble doing what you asked. Please try again.";
		console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

		Sentry.captureException(error);

		return handlerInput.responseBuilder
			.speak(speakOutput)
			.reprompt(speakOutput)
			.getResponse();
	},
};

export const handler = SkillBuilders.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		HelloWorldIntentHandler,
		HelpIntentHandler,
		CancelAndStopIntentHandler,
		FallbackIntentHandler,
		SessionEndedRequestHandler,
		IntentReflectorHandler
	)
	.addErrorHandlers(ErrorHandler)
	.withCustomUserAgent("sparkyflight@v0.0.1")
	.lambda();
