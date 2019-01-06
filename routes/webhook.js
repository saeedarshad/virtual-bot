'use strict';

const dialogflow = require('dialogflow');
const config = require('../config');
const express = require('express');
const crypto = require('crypto');
const request = require('request');
const uuid = require('uuid');
const router = express.Router();

// Messenger API parameters
if (!config.FB_PAGE_TOKEN) {
	throw new Error('missing FB_PAGE_TOKEN');
}
if (!config.FB_VERIFY_TOKEN) {
	throw new Error('missing FB_VERIFY_TOKEN');
}
if (!config.GOOGLE_PROJECT_ID) {
	throw new Error('missing GOOGLE_PROJECT_ID');
}
if (!config.DF_LANGUAGE_CODE) {
	throw new Error('missing DF_LANGUAGE_CODE');
}
if (!config.GOOGLE_CLIENT_EMAIL) {
	throw new Error('missing GOOGLE_CLIENT_EMAIL');
}
if (!config.GOOGLE_PRIVATE_KEY) {
	throw new Error('missing GOOGLE_PRIVATE_KEY');
}
if (!config.FB_APP_SECRET) {
	throw new Error('missing FB_APP_SECRET');
}
if (!config.SERVER_URL) { //used for ink to static files
	throw new Error('missing SERVER_URL');
}



//verify request came from facebook
/* app.use(bodyParser.json({
	verify: verifyRequestSignature
})); */






const credentials = {
	client_email: config.GOOGLE_CLIENT_EMAIL,
	private_key: config.GOOGLE_PRIVATE_KEY,
};

//Establishing connection with Dialogflow
const sessionClient = new dialogflow.SessionsClient({
	projectId: config.GOOGLE_PROJECT_ID,
	credentials
});


const sessionIds = new Map();

// Index route
/* app.get('/', function (req, res) {
	res.send('Hello world, I am a chat bot')
}) */

// for Facebook verification
router.get('/', function (req, res) {
	console.log("request");
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.FB_VERIFY_TOKEN) {
		res.status(200).send(req.query['hub.challenge']);
	} else {
		console.error("Failed validation. Make sure the validation tokens match.");
		res.sendStatus(403);
	}
})

/*
 * All callbacks for Messages are POST-ed.
 */
router.post('/', function (req, res) {
	var data = req.body;
	console.log(JSON.stringify(data));

	if (data.object == 'page') {
		// Iterate over each entry
		// There may be multiple if batched
		data.entry.forEach(function (pageEntry) {

			// Iterate over each messaging event
			pageEntry.messaging.forEach(function (messagingEvent) {
				if (messagingEvent.message) {
					receivedMessage(messagingEvent); //All the messages from user handle here
				} else {
					console.log("Webhook received unknown messagingEvent: ", messagingEvent);
				}
			});
		});

		res.sendStatus(200);
	}
});


//All the message received here
function receivedMessage(event) {

	//Extract data from request
	var senderID = event.sender.id;
	var recipientID = event.recipient.id;
	var timeOfMessage = event.timestamp;
	var message = event.message;

	if (!sessionIds.has(senderID)) {
		sessionIds.set(senderID, uuid.v1());
	}
	//console.log("Received message for user %d and page %d at %d with message:", senderID, recipientID, timeOfMessage);
	//console.log(JSON.stringify(message));

	var isEcho = message.is_echo; //Messgae sent by page itself
	var messageId = message.mid;
	var appId = message.app_id;
	var metadata = message.metadata;

	// You may get a text or attachment but not both
	var messageText = message.text;
	var messageAttachments = message.attachments;
	var quickReply = message.quick_reply;

	if (isEcho) {
		handleEcho(messageId, appId, metadata);
		return;
	} else if (quickReply) { //In case of quick reply
		handleQuickReply(senderID, quickReply, messageId);
		return;
	}

	//If text message is received
	if (messageText) {
		//send message to api.ai
		sendToDialogFlow(senderID, messageText);
	}
}


/* function handleMessageAttachments(messageAttachments, senderID) {
	//for now just reply
	sendTextMessage(senderID, "Attachment received. Thank you.");
} */

//If user select quick reply button instead of writing a text

function handleQuickReply(senderID, quickReply, messageId) {
	var quickReplyPayload = quickReply.payload;
	//console.log("Quick reply for message %s with payload %s", messageId, quickReplyPayload);
	//send payload to dialogflow
	sendToDialogFlow(senderID, quickReplyPayload);
}

//Handle message send by page to itself
function handleEcho(messageId, appId, metadata) {
	// Just logging message echoes to console
	console.log("Received echo for message %s and app %d with metadata %s", messageId, appId, metadata);
}

/* function handleDialogFlowAction(sender, action, messages, contexts, parameters) {
	switch (action) {
		case 'initial-query':
			let replies = [{
					"content_type": "text",
					"title": "Laptops",
					"payload": "Laptops"
				},
				{
					"content_type": "text",
					"title": "Mobiles",
					"payload": "Mobiles"
				}
			];
			sendQuickReply(sender, messages, replies);
			break;
		case 'initial_mobile_query':
			let replies = [{
					"content_type": "text",
					"title": "Iphones",
					"payload": "Iphones"
				},
				{
					"content_type": "text",
					"title": "Samsung",
					"payload": "Samsung"
				}
			];
			sendQuickReply(sender, messages, replies);
			break;
		case 'book_order':
			let replies = [{
					"content_type": "text",
					"title": "please book my order",
					"payload": "please book my order"
				},
				{
					"content_type": "text",
					"title": "Show  other products",
					"payload": "Show other products"
				}
			];
			sendQuickReply(sender, messages, replies);
			break;
		case 'initial_mobile_query':
			let replies = [{
					"content_type": "text",
					"title": "Cash on delivery",
					"payload": "Cash on delivery"
				},
				{
					"content_type": "text",
					"title": "Credit Card",
					"payload": "Credit Card"
				}
			];
			sendQuickReply(sender, messages, replies);
			break;

		default:
			//unhandled action, just send back the text
			handleMessage(messages, sender);
	}
} */

//Check if the message send to user is text or quick reply
function handleMessage(message, sender) {
	switch (message.message) {
		case "text": //text
			message.text.text.forEach((text) => {
				if (text !== '') {
					sendTextMessage(sender, text);
				}
			});
			break;
		case "quickReplies": //quick replies
			let replies = [];
			message.quickReplies.quickReplies.forEach((text) => {
				let reply = {
					"content_type": "text",
					"title": text,
					"payload": text
				}
				replies.push(reply);
			});
			sendQuickReply(sender, message.quickReplies.title, replies);
			break;
			/* case "image": //image
				sendImageMessage(sender, message.image.imageUri);
				break; */
	}
}


/* function handleCardMessages(messages, sender) {

	let elements = [];
	for (var m = 0; m < messages.length; m++) {
		let message = messages[m];
		let buttons = [];
		for (var b = 0; b < message.card.buttons.length; b++) {
			let isLink = (message.card.buttons[b].postback.substring(0, 4) === 'http');
			let button;
			if (isLink) {
				button = {
					"type": "web_url",
					"title": message.card.buttons[b].text,
					"url": message.card.buttons[b].postback
				}
			} else {
				button = {
					"type": "postback",
					"title": message.card.buttons[b].text,
					"payload": message.card.buttons[b].postback
				}
			}
			buttons.push(button);
		}


		let element = {
			"title": message.card.title,
			"image_url": message.card.imageUri,
			"subtitle": message.card.subtitle,
			"buttons": buttons
		};
		elements.push(element);
	}
	sendGenericMessage(sender, elements);
} */

//Handle response fronm dialogflow
function handleDialogFlowResponse(sender, response) {
	//Db Response will not handle here
	let responseText = response.fulfillmentMessages.fulfillmentText;

	let messages = response.fulfillmentMessages;
	let action = response.action;
	let contexts = response.outputContexts;
	let parameters = response.parameters; //Read Parameters from conservation

	sendTypingOff(sender);

	if (isDefined(messages)) {
		handleMessage(messages, sender);
	} else if (responseText == '' && !isDefined(action)) {
		//dialogflow could not evaluate input.
		sendTextMessage(sender, "I'm not sure what you want. Can you be more specific?");
	} else if (isDefined(responseText)) {
		sendTextMessage(sender, responseText);
	}
}

//making a call to dialogflow api
async function sendToDialogFlow(sender, textString, params) {

	sendTypingOn(sender); //Show typing symbol on bot

	try {
		const sessionPath = sessionClient.sessionPath(
			config.GOOGLE_PROJECT_ID,
			sessionIds.get(sender)
		);
		//Request object to send to dialogflow 
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textString,
					languageCode: config.DF_LANGUAGE_CODE,
				},
			},
			queryParams: {
				payload: {
					data: params
				}
			}
		};
		//waiting for Response//
		//Detect intent check which intent hit
		const responses = await sessionClient.detectIntent(request);

		const result = responses[0].queryResult;
		handleDialogFlowResponse(sender, result);
	} catch (e) {
		console.log('error');
		console.log(e);
	}

}


//Send Simple text message

function sendTextMessage(recipientId, text) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: text
		}
	}
	callSendAPI(messageData);
}

/*
 * Send an image using the Send API.
 *
 */
function sendImageMessage(recipientId, imageUrl) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			attachment: {
				type: "image",
				payload: {
					url: imageUrl
				}
			}
		}
	};

	callSendAPI(messageData);
}

/*
 * Send a message with Quick Reply buttons.
 *
 */
function sendQuickReply(recipientId, text, replies, metadata) {
	var messageData = {
		recipient: {
			id: recipientId
		},
		message: {
			text: text,
			metadata: isDefined(metadata) ? metadata : '',
			quick_replies: replies
		}
	};

	callSendAPI(messageData);
}

/*
 * Turn typing indicator on
 *
 */
function sendTypingOn(recipientId) {


	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_on"
	};

	callSendAPI(messageData);
}

/*
 * Turn typing indicator off
 *
 */
function sendTypingOff(recipientId) {


	var messageData = {
		recipient: {
			id: recipientId
		},
		sender_action: "typing_off"
	};

	callSendAPI(messageData);
}

/*
 * Send a message with the account linking call-to-action
 *
 */

//Errorss
/* function greetUserText(userId) {
	//first read user firstname
	request({
		uri: 'https://graph.facebook.com/v2.7/' + userId,
		qs: {
			access_token: config.FB_PAGE_TOKEN
		}

	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {

			var user = JSON.parse(body);

			if (user.first_name) {
				console.log("FB user: %s %s, %s",
					user.first_name, user.last_name, user.gender);

				sendTextMessage(userId, "Welcome " + user.first_name + '!');
			} else {
				console.log("Cannot get data for fb user with id",
					userId);
			}
		} else {
			console.error(response.error);
		}

	});
} */

/*
 * Call the Send API. The message data goes in the body. If successful, we'll 
 * get the message id in a response 
 *
 */
//Sending DAta to messanger
function callSendAPI(messageData) {
	request({
		uri: 'https://graph.facebook.com/v2.6/me/messages',
		qs: {
			access_token: config.FB_PAGE_TOKEN
		},
		method: 'POST',
		json: messageData

	}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var recipientId = body.recipient_id;
			var messageId = body.message_id;

			if (messageId) {
				console.log("Successfully sent message with id %s to recipient %s",
					messageId, recipientId);
			} else {
				console.log("Successfully called Send API for recipient %s",
					recipientId);
			}
		} else {
			console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
		}
	});
}

//Validate if request come from right application
/* function verifyRequestSignature(req, res, buf) {
	var signature = req.headers["x-hub-signature"];

	if (!signature) {
		throw new Error('Couldn\'t validate the signature.');
	} else {
		var elements = signature.split('=');
		var method = elements[0];
		var signatureHash = elements[1];

		var expectedHash = crypto.createHmac('sha1', config.FB_APP_SECRET)
			.update(buf)
			.digest('hex');

		if (signatureHash != expectedHash) {
			throw new Error("Couldn't validate the request signature.");
		}
	}
} */

function isDefined(obj) {
	if (typeof obj == 'undefined') {
		return false;
	}

	if (!obj) {
		return false;
	}

	return obj != null;
}

module.exports = router;