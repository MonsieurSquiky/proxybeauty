/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const logging = require('@google-cloud/logging')();

admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'USD';

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeSubmit = functions.database.ref('/stripe_customers/{userId}/abonnement/{id}').onWrite((event) => {
  const val = event.data.val();
  // This onWrite will trigger whenever anything is written to the path, so
  // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
  if (val === null || val.id || val.error) return null;
  // Look up the Stripe customer id written in createStripeCustomer
  return admin.database().ref(`/stripe_customers/${event.params.userId}/customer_id`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then((customer) => {
    // Create a charge using the pushId as the idempotency key, protecting against double charges
    const amount = val.amount * 100;
    const idempotency_key = event.params.id;
    let charge = {amount, currency, customer};
    if (val.source !== null) charge.source = val.source;

    return stripe.charges.create({
          amount: amount,
          currency: "eur",
          source: charge.source,
          transfer_group: idempotency_key,
      }, {idempotency_key});
}).then((charge) => {
    // If the result is successful, write it back to the database
    return admin.database().ref(`/stripe_customers/${event.params.userId}/submitResponse/${event.params.id}`).child('resultCharge').set(charge);

  }).catch((error) => {
    // We want to capture errors and render them in a user-friendly way, while
    // still logging an exception with Stackdriver
    return admin.database().ref(`/stripe_customers/${event.params.userId}/submitResponse/${event.params.id}`).child('errorCharge').set(error.raw);
  }).then(() => {
    return reportError(error, {user: event.params.userId});
  });
});
// [END chargecustomer]]

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeCharge = functions.database.ref('/stripe_customers/{userId}/charges/{id}').onWrite((event) => {
  const val = event.data.val();
  // This onWrite will trigger whenever anything is written to the path, so
  // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
  if (val === null || val.id || val.error) return null;
  // Look up the Stripe customer id written in createStripeCustomer
  return admin.database().ref(`/stripe_customers/${event.params.userId}/customer_id`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then((customer) => {
    // Create a charge using the pushId as the idempotency key, protecting against double charges
    const amount = val.amount * 100;
    const idempotency_key = event.params.id;

    let charge = {amount, currency, customer};

    if (val.source !== null) charge.source = val.source;

    // Create a Charge:
    return stripe.charges.create({
          amount: amount,
          currency: "eur",
          source: charge.source,
          transfer_group: idempotency_key,
      }, {idempotency_key});
    }).then(function(charge) {
      // si on recupere le paiement, on transfere
      // Create a Transfer to the connected account (later):
      console.log('Charge Success');
      admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('resultCharge').set(charge);

      let val = event.data.val();
      let amount = val.amount * 100;
      let idempotency_key = event.params.id;
      let idempotency_key_prestataire = event.params.id+'-prestataire';
      let idempotency_key_parrain_prestataire = event.params.id+'-parrain_prestataire';
      let idempotency_key_parrain_client = event.params.id+'-parrain_client';

      let prestataire = val.destinataire;
      let parrain_prestataire = val.parrain_prestataire;
      let parrain_client = val.parrain_client;

      let amountPresta = Math.floor(amount * 0.85);
      let amount_parrain_prestataire = Math.floor(amount * 0.04);
      let amount_parrain_client = Math.floor(amount * 0.02);

      stripe.transfers.create({
                amount: amountPresta,
                currency: "eur",
                destination: prestataire,
                transfer_group: idempotency_key,
            }, { idempotency_key: idempotency_key_prestataire })
        .then( function(transfer) {
            admin.database().ref(`/prestataire-gains/${event.data.val().ids.prestataire}/${event.params.userId}`).push({
                amount: transfer.amount,
                date: transfer.created,
                currency: transfer.currency,
                transaction: transfer.transfer_group
            });

            return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('resultTransferPrestataire').set(transfer);
        }).catch( (error) => {
            console.log(error);

            return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('errorTransferPrestataire').set(error.raw);
        });

        if (parrain_prestataire) {
            stripe.transfers.create({
                      amount: amount_parrain_prestataire,
                      currency: "eur",
                      destination: parrain_prestataire,
                      transfer_group: idempotency_key,
                  }, { idempotency_key: idempotency_key_parrain_prestataire })
              .then( function(transfer) {
                  admin.database().ref(`/parrain-gains/${event.data.val().ids.parrain_prestataire}/${event.data.val().ids.prestataire}`).push({
                      amount: transfer.amount,
                      date: transfer.created,
                      currency: transfer.currency,
                      transaction: transfer.transfer_group
                  });

                  return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('resultTransferParrainPrestataire').set(transfer);
              }).catch( (error) => {
                  console.log(error);

                  return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('errorTransferParrainPrestataire').set(error.raw);
              }).catch( (error) => {
                  console.log(error);
              });
        }


        if (parrain_client) {
            stripe.transfers.create({
                      amount: amount_parrain_client,
                      currency: "eur",
                      destination: parrain_client,
                      transfer_group: idempotency_key,
                  }, { idempotency_key: idempotency_key_parrain_client })
              .then( function(transfer) {
                  admin.database().ref(`/parrain-gains/${event.data.val().ids.parrain_client}/${event.params.userId}`).push({
                      amount: transfer.amount,
                      date: transfer.created,
                      currency: transfer.currency,
                      transaction: transfer.transfer_group
                  });

                  return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('resultTransferParrainClient').set(transfer);
              }).catch( (error) => {

                  return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('errorTransferParrainClient').set(error.raw);
              });
        }


        }).catch((error) => {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with Stackdriver
        console.log(error);
        return admin.database().ref(`/stripe_customers/${event.params.userId}/response/${event.params.id}`).child('errorCharge').set(error.raw);
    });
});
// [END chargecustomer]]

// When a user is created, register them with Stripe as customer
exports.createStripeCustomer = functions.auth.user().onCreate((event) => {
  const data = event.data;
  return stripe.customers.create({
    email: data.email,
  }).then((customer) => {
    return admin.database().ref(`/stripe_customers/${data.uid}/customer_id`).set(customer.id);
  });
});

// When a user finished to fill its profile, register them with Stripe as connected account
exports.createStripeConnectedAccount = functions.database.ref('/users/{userId}/address/details').onWrite((event) => {
  const addressData = event.data.val();

  return admin.database().ref(`/users/${event.params.userId}`).once('value').then(function(snapshot) {
      var user = snapshot.val();
      return stripe.accounts.create({
            country: addressData.countryCode,
            legal_entity: {
                first_name: user.firstname,
                last_name: user.lastname,
                dob: {
                    year: user.birthdate.year,
                    month: user.birthdate.month,
                    day: user.birthdate.day
                },
                type: 'individual',
                address: {
                    city: addressData.locality,
                    line1: addressData.thoroughfare,
                    postal_code: addressData.postalCode,
                }
            },
            tos_acceptance: {
                  date: Math.floor(Date.now() / 1000),
                  ip: '8.8.8.8' // Assumes you're not using a proxy
            },
            type: "custom"
      }).then((sellerAccount) => {
        return admin.database().ref(`/stripe_sellers/${event.params.userId}/token`).set(sellerAccount);
    }).catch(function(error) {
        return admin.database().ref(`/stripe_sellers/${event.params.userId}/error`).set(error);
    });
  });
  /*
  return stripe.accounts.create({
        country: addressData.countryCode,
        legal_entity: {
            type: 'individual',
            address: {
                city: addressData.locality,
                line1: addressData.thoroughfare,
                postal_code: addressData.postalCode,
            }
        },
        type: "custom"
  }).then((sellerAccount) => {

    return admin.database().ref(`/stripe_sellers/${event.params.userId}/token`).set(sellerAccount);
  });
  */
});

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database.ref('/stripe_customers/{userId}/sources/{pushId}/token').onWrite((event) => {
  const source = event.data.val();
  if (source === null) return null;
  return admin.database().ref(`/stripe_customers/${event.params.userId}/customer_id`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then((customer) => {
    return stripe.customers.createSource(customer, {source});
  }).then((response) => {
    return event.data.adminRef.parent.set(response);
  }, (error) => {
    return event.data.adminRef.parent.child('error').set(userFacingMessage(error));
  }).then(() => {
    return reportError(error, {user: event.params.userId});
  });
});

// When a user deletes their account, clean up after them
exports.cleanupUser = functions.auth.user().onDelete((event) => {
  return admin.database().ref(`/stripe_customers/${event.data.uid}`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then((customer) => {
    return stripe.customers.del(customer.customer_id);
  }).then(() => {
    return admin.database().ref(`/stripe_customers/${event.data.uid}`).remove();
  });
});

// To keep on top of errors, we should raise a verbose error report with Stackdriver rather
// than simply relying on console.error. This will calculate users affected + send you email
// alerts, if you've opted into receiving them.
// [START reporterror]
function reportError(err, context = {}) {
  // This is the name of the StackDriver log stream that will receive the log
  // entry. This name can be any valid log stream name, but must contain "err"
  // in order for the error to be picked up by StackDriver Error Reporting.
  const logName = 'errors';
  const log = logging.log(logName);

  // https://cloud.google.com/logging/docs/api/ref_v2beta1/rest/v2beta1/MonitoredResource
  const metadata = {
    resource: {
      type: 'cloud_function',
      labels: {function_name: process.env.FUNCTION_NAME},
    },
  };

  // https://cloud.google.com/error-reporting/reference/rest/v1beta1/ErrorEvent
  const errorEvent = {
    message: err.stack,
    serviceContext: {
      service: process.env.FUNCTION_NAME,
      resourceType: 'cloud_function',
    },
    context: context,
  };

  // Write the error log entry
  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) => {
      if (error) {
 reject(error);
}
      resolve();
    });
  });
}
// [END reporterror]

// Sanitize the error message for the user
function userFacingMessage(error) {
  return error.type ? error.message : 'An error occurred, developers have been alerted';
}
