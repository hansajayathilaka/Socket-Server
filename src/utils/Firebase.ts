import admin from "firebase-admin";
import { messaging } from "firebase-admin/lib/messaging";
import MessagingPayload = messaging.MessagingPayload;
import MessagingOptions = messaging.MessagingOptions;
import logger from './Logger';

const serviceAccount = require("../../certs/remedy-746b5-firebase-adminsdk-8gve5-721d654ac4.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://remedy-746b5.firebaseio.com"
});

export const sendFCM = (registrationTokens: string[], title: string, body: string, data?: any, customOption?: MessagingOptions) => {
    const payload: MessagingPayload = {
        data: {
            ...data
        },
        notification: {
            title,
            body,
        },
    }

    const option: MessagingOptions = {
        priority: "high",
        timeToLive: 60,
        ...customOption,
    }

    admin.messaging().sendToDevice(registrationTokens, payload , option)
        .then(doc => {
            logger.info(doc);
        })
        .catch(err => {
            logger.error(`Error while sending fcm. ${JSON.stringify(payload)}`);
            logger.error(err);
        });
}
