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
const express = require('express');
const cors = require('cors')({ origin: true });

const app = express();

// Automatically allow cross-origin requests
//app.use(cors({ origin: true }));

// Add middleware to authenticate requests
//app.use(myMiddleware);

/*
// build multiple CRUD interfaces:
app.get('/:uid', (req, res) => {
});
// Expose Express API as a single Cloud Function:
exports.acceptConditions = functions.https.onRequest(app);
*/

admin.initializeApp(functions.config().firebase);

const stripe = require('stripe')(functions.config().stripe.token);
const currency = functions.config().stripe.currency || 'EUR';
const nodemailer = require('nodemailer');

const mailAuth = {
    service: 'gmail',
    auth: {
         user: 'myproxybeauty@gmail.com',
         pass: 'Slimani13'
     }
};

const giftRdv = [3, 10, 25, 50, 100];
const giftComment = [3, 10, 25, 50, 100];
const giftValue = [5, 10, 20, 40, 70];
const giftProducts = [  {ids: [1, 2, 3], qte: 1, title:'1 masque au choix' },
                        {ids: [7, 8], qte: 1, title:'1 masque bio au choix' },
                        {ids: [16, 17], qte: 1, title:'1 crème "fruitée" au choix' },
                        {ids: [19, 21, 23], qte: 1, title:'1 crème au choix' },
                        {ids: [0], qte: 1, title:'1 trousse Ambassadrice' }];

const products = [
                    {
                      "components" : "Code Ambassadeur, Formation & coaching assuré pour un bon démarrage",
                      "description" : "Ce pack va vous permettre de rejoindre le réseau ProxyBeauty, et de commencer à générer des revenus en parlant de l'application autour de vous. Transmettez votre code Ambassadeur a toutes les personnes auquelles vous parlerez de l'application, aussi bien aux professionnels qu'aux particuliers.",
                      "id" : 0,
                      "name" : "Starting Licence",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fstarting-licence.jpg?alt=media&token=15d2a0c3-398d-4af9-8c86-23abc21e7425",
                      "prix" : 5.5,
                      "statut" : "ambassador",
                      "usage" : "Un guide inclus et la formation dont vous bénéficierez vous permettra de faire un usage optimal de ce kit."
                    }, {
                      "components" : "Vitamine B6, charbon actif",
                      "description" : "Le masque tissu charbon puri-detox est imprégné d’un sérum possédant un fort pouvoir absorbant permettant de retenir les impuretés et les toxines. Connu pour leurs propriétés anti-pollution, les actifs de ce masque vont venir purifier la peau.",
                      "id" : 1,
                      "name" : "Masque tissu charbon puri-détox",
                      "pictureUrl" : "./assets/img/masque-charbon.jpg",
                      "prix" : 5.9,
                      "statut" : "client",
                      "usage" : "  Prêt à l’emploi, appliquer sur le visage et laisser poser 15 à 20 minutes. Retirer le masque et masser doucement l’excédent de sérum."
                    }, {
                      "components" : "Acide hyaluronique, agent lilftant, agent anti-âge",
                      "description" : "  Ce masque tissu est imprégné d’un sérum enrichi en actifs anti-âge. Ces actifs permettent d’estomper les premiers signes du vieillissement de la peau et apportent à la peau douceur et souplesse.",
                      "id" : 2,
                      "name" : "Masque tissu anti-âge",
                      "pictureUrl" : "./assets/img/masque-anti-age.jpg",
                      "prix" : 5.9,
                      "statut" : "client",
                      "usage" : "Prêt à l’emploi, appliquer sur le visage et laisser poser 15 à 20 minutes. Retirer le masque et masser doucement l’excédent de sérum."
                    }, {
                      "components" : "Vitamine E, collagène",
                      "description" : "Ce masque tissu est imprégné d’un sérum enrichi en vitamine E et en collagène. Composant majeur des tissus de la peau, le collagène est connu pour ses propriétés hydrantes et anti-âge permettant de raffermir et d’améliorer l’élasticité de la peau.",
                      "id" : 3,
                      "name" : "Masque tissu collagène",
                      "pictureUrl" : "./assets/img/masque-collagene.jpg",
                      "prix" : 5.9,
                      "statut" : "client",
                      "usage" : "Prêt à l’emploi, appliquer sur le visage et laisser poser 15 à 20 minutes. Retirer le masque et masser doucement l’excédent de sérum."
                    }, {
                      "components" : "Vitamine B6, charbon actif",
                      "description" : "(Pack de 25) Le masque tissu charbon puri-detox est imprégné d’un sérum possédant un fort pouvoir absorbant permettant de retenir les impuretés et les toxines. Connu pour leurs propriétés anti-pollution, les actifs de ce masque vont venir purifier la peau.",
                      "id" : 4,
                      "name" : "Masque tissu charbon puri-détox (pack de 25)",
                      "pictureUrl" : "./assets/img/masque-charbon-presta.jpg",
                      "prix" : 72.5,
                      "statut" : "prestataire",
                      "usage" : "  Prêt à l’emploi, appliquer sur le visage et laisser poser 15 à 20 minutes. Retirer le masque et masser doucement l’excédent de sérum."
                    }, {
                      "components" : "Acide hyaluronique, agent lilftant, agent anti-âge",
                      "description" : " (Pack de 25) Ce masque tissu est imprégné d’un sérum enrichi en actifs anti-âge. Ces actifs permettent d’estomper les premiers signes du vieillissement de la peau et apportent à la peau douceur et souplesse.",
                      "id" : 5,
                      "name" : "Masque tissu anti-âge (pack de 25)",
                      "pictureUrl" : "./assets/img/masque-anti-age-presta.jpg",
                      "prix" : 72.5,
                      "statut" : "prestataire",
                      "usage" : "Prêt à l’emploi, appliquer sur le visage et laisser poser 15 à 20 minutes. Retirer le masque et masser doucement l’excédent de sérum."
                    }, {
                      "components" : "Vitamine E, collagène",
                      "description" : " (Pack de 25) Ce masque tissu est imprégné d’un sérum enrichi en vitamine E et en collagène. Composant majeur des tissus de la peau, le collagène est connu pour ses propriétés hydrantes et anti-âge permettant de raffermir et d’améliorer l’élasticité de la peau.",
                      "id" : 6,
                      "name" : "Masque tissu collagène (pack de 25)",
                      "pictureUrl" : "./assets/img/masque-collagene-presta.jpg",
                      "prix" : 72.5,
                      "statut" : "prestataire",
                      "usage" : "Prêt à l’emploi, appliquer sur le visage et laisser poser 15 à 20 minutes. Retirer le masque et masser doucement l’excédent de sérum."
                    }, {
                      "components" : "Cellule souche de pomme, Extraits de myrtille",
                      "description" : "Un masque constitué d'une membrane en Bio-Cellulose 100% naturelle, gorgé d'actifs anti-âge ultra-performants, pour une peau revitalisée, lisse et tonique.",
                      "id" : 7,
                      "name" : "Masque Bio-Cellulose anti-âge",
                      "pictureUrl" : "./assets/img/masque-myrtille.jpg",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "Prêt à l’emploi, retirer les gazes puis appliquer sur le visage et laisser poser 10 minutes. Retirer le masque et masser l'excédent sans rincer"
                    }, {
                      "components" : "Extraits de Capucine et de Graines de Muringa Oleifera",
                      "description" : "Un masque constitué d'une membrane en Bio-Cellulose 100% naturelle, gorgé d'actifs hautement efficaces, pour une purifiée, oxygénée, éclatante de santé.",
                      "id" : 8,
                      "name" : "Masque Bio-Cellulose purifiant",
                      "pictureUrl" : "./assets/img/masque-the.jpg",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "Prêt à l’emploi, retirer les gazes puis appliquer sur le visage et laisser poser 10 minutes. Retirer le masque et masser l'excédent sans rincer"
                    }, {
                      "components" : "Cellule souche de pomme, Extraits de myrtille",
                      "description" : "Un masque constitué d'une membrane en Bio-Cellulose 100% naturelle, gorgé d'actifs anti-âge ultra-performants, pour une peau revitalisée, lisse et tonique.",
                      "id" : 9,
                      "name" : "Masque Bio-Cellulose anti-âge (pack de 25)",
                      "pictureUrl" : "./assets/img/masque-myrtille-presta.jpg",
                      "prix" : 125.09,
                      "statut" : "prestataire",
                      "usage" : "Prêt à l’emploi, retirer les gazes puis appliquer sur le visage et laisser poser 10 minutes. Retirer le masque et masser l'excédent sans rincer"
                    }, {
                      "components" : "Extraits de Capucine et de Graines de Muringa Oleifera",
                      "description" : "Un masque constitué d'une membrane en Bio-Cellulose 100% naturelle, gorgé d'actifs hautement efficaces, pour une purifiée, oxygénée, éclatante de santé.",
                      "id" : 10,
                      "name" : "Masque Bio-Cellulose purifiant (pack de 25)",
                      "pictureUrl" : "./assets/img/masque-the-presta.jpg",
                      "prix" : 125.09,
                      "statut" : "prestataire",
                      "usage" : "Prêt à l’emploi, retirer les gazes puis appliquer sur le visage et laisser poser 10 minutes. Retirer le masque et masser l'excédent sans rincer"
                    }, {
                      "components" : "L-PCA, Extrait de laminaires",
                      "description" : " Cette lotion purifiante et équilibrante rafraîchit et tonifie les peaux grasses ou brillantes. Apaisante et régulatrice, elle nettoie tout en douceur la peau de ses impuretés, atténue l'aspect cutané brillant. Elle laisse la peau saine et nette. ",
                      "id" : 11,
                      "name" : "Brume & Lotion purifiante",
                      "pictureUrl" : "./assets/img/lotion.jpg",
                      "prix" : 12.9,
                      "statut" : "client",
                      "usage" : "Utiliser régulièrement matin et soir sur la peau du visage, le cou et la nuque. Eviter le contour des yeux."
                    }, {
                      "components" : "L-PCA, Extrait de laminaires",
                      "description" : " Cette lotion purifiante et équilibrante rafraîchit et tonifie les peaux grasses ou brillantes. Apaisante et régulatrice, elle nettoie tout en douceur la peau de ses impuretés, atténue l'aspect cutané brillant. Elle laisse la peau saine et nette. ",
                      "id" : 12,
                      "name" : "Brume & Lotion purifiante",
                      "pictureUrl" : "./assets/img/lotion.jpg",
                      "prix" : 10,
                      "statut" : "prestaire",
                      "usage" : "Utiliser régulièrement matin et soir sur la peau du visage, le cou et la nuque. Eviter le contour des yeux."
                    }, {
                      "components" : "Collagène Marin, Zinc",
                      "description" : "Une crème «ingénieuse» traitante contenant 2 complexes matifiants brevetés anti-peaux grasses. Un soin qui resserre les pores et diminue efficacement les brillances de la zone médiane. Cette crème matifiante contribue' à freiner la production excessive de sébum pour une peau mate et hydratée tout au long de la journée. ",
                      "id" : 13,
                      "name" : "Complexe Matifiant",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-mat.jpg?alt=media&token=0782c548-c252-44d5-8ff1-e8b5eea0bf25",
                      "prix" : 29.9,
                      "statut" : "client",
                      "usage" : "Appliquer le Complexe Matifiant sur peau propre et sèche matin et/ou soir sur l'ensemble du visage ou sur la zone médiane T-zone. Peaux mixtes à grasses. "
                    }, {
                      "components" : "Collagène Marin, Zinc",
                      "description" : "Une crème «ingénieuse» traitante contenant 2 complexes matifiants brevetés anti-peaux grasses. Un soin qui resserre les pores et diminue efficacement les brillances de la zone médiane. Cette crème matifiante contribue' à freiner la production excessive de sébum pour une peau mate et hydratée tout au long de la journée. ",
                      "id" : 14,
                      "name" : "Complexe Matifiant",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-mat.jpg?alt=media&token=0782c548-c252-44d5-8ff1-e8b5eea0bf25",
                      "prix" : 17,
                      "statut" : "prestataire",
                      "usage" : "Appliquer le Complexe Matifiant sur peau propre et sèche matin et/ou soir sur l'ensemble du visage ou sur la zone médiane T-zone. Peaux mixtes à grasses. "
                    }, {
                      "components" : "Acide Hyaluronique, Collagène Marin, Germes de blé, Abricot",
                      "description" : "Formule Complexe composée de 22 actifs qui stimulent une régénération rapide du tissu dermique et améliorent son élasticité. Plus douce, plus hydratée, la peau gagne en douceur, éclat et fermeté grâce aux apports de l'huile de noyau d'Abricot, de l'Acide Hyaluronique, du Collagène Marin et de l'huile de Germe de Blé. ",
                      "id" : 15,
                      "name" : "Crème \"22\" à l'abricot",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-abricot.jpg?alt=media&token=599a224b-3e24-43d5-9c73-cb2c74b90646",
                      "prix" : 34.9,
                      "statut" : "client",
                      "usage" : "Appliquer tous les matins sur le visage et le cou parfaitement nettoyés."
                    }, {
                      "components" : "Acide Hyaluronique, Collagène Marin, Germes de blé, Abricot",
                      "description" : "Formule Complexe composée de 22 actifs qui stimulent une régénération rapide du tissu dermique et améliorent son élasticité. Plus douce, plus hydratée, la peau gagne en douceur, éclat et fermeté grâce aux apports de l'huile de noyau d'Abricot, de l'Acide Hyaluronique, du Collagène Marin et de l'huile de Germe de Blé. ",
                      "id" : 16,
                      "name" : "Crème \"22\" à l'abricot",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-abricot.jpg?alt=media&token=599a224b-3e24-43d5-9c73-cb2c74b90646",
                      "prix" : 17.9,
                      "statut" : "prestataire",
                      "usage" : "Appliquer tous les matins sur le visage et le cou parfaitement nettoyés."
                    }, {
                      "components" : "Pulpe de Fraise, Vitamine A, Kaolin",
                      "description" : "En plus des Vitamines C et A (puissants anti-oxydants) contenues dans la Pulpe de Fraise, les tanins améliorent l'éclat du teint et assainissent la peau.",
                      "id" : 17,
                      "name" : "Masque éclat à la pulpe de fraise",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-fraise.jpg?alt=media&token=e85d0451-7382-485c-8d8f-ca59499abe41",
                      "prix" : 24.9,
                      "statut" : "client",
                      "usage" : "Utiliser une à deux fois par semaine, idéalement après un gommage. Appliquer en couche épaisse le masque pendant 10 à 15 minutes. Retirer à l'aide d'un coton humidifié. Eviter le contour des yeux."
                    }, {
                      "components" : "Pulpe de Fraise, Vitamine A, Kaolin",
                      "description" : "En plus des Vitamines C et A (puissants anti-oxydants) contenues dans la Pulpe de Fraise, les tanins améliorent l'éclat du teint et assainissent la peau.",
                      "id" : 18,
                      "name" : "Masque éclat à la pulpe de fraise",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-fraise.jpg?alt=media&token=e85d0451-7382-485c-8d8f-ca59499abe41",
                      "prix" : 19,
                      "statut" : "prestataire",
                      "usage" : "Utiliser une à deux fois par semaine, idéalement après un gommage. Appliquer en couche épaisse le masque pendant 10 à 15 minutes. Retirer à l'aide d'un coton humidifié. Eviter le contour des yeux."
                    }, {
                      "components" : "Acide Hyaluronique, Oligogéline, Aloé Vera",
                      "description" : "Riche en actifs réparateurs et hydratants, ce sérum à la tecture gel est un soin d'une extrême douceur pour tous les types de peaux, même les plus sensibles : son pouvoir apaisant calme les peaux les plus délicates, tandis que ses propriétés hydratantes et réparatrices améliorent l'aspect de l'épiderme.",
                      "id" : 19,
                      "name" : "Sérum \"22\" Formule Renforcée",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fserum.jpg?alt=media&token=99949d78-0e85-4d0f-a928-b62b652fc29c",
                      "prix" : 37.9,
                      "statut" : "client",
                      "usage" : "Appliquer le matin et le soir après avoir nettoyé la peau et avant l'appliation de la crème 22 à l'abricot. Peut également être utilisé tel un soin apaisant, réparateur après rasage. Eviter le contour des yeux."
                    }, {
                      "components" : "Acide Hyaluronique, Oligogéline, Aloé Vera",
                      "description" : "Riche en actifs réparateurs et hydratants, ce sérum à la tecture gel est un soin d'une extrême douceur pour tous les types de peaux, même les plus sensibles : son pouvoir apaisant calme les peaux les plus délicates, tandis que ses propriétés hydratantes et réparatrices améliorent l'aspect de l'épiderme.",
                      "id" : 20,
                      "name" : "Sérum \"22\" Formule Renforcée",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fserum.jpg?alt=media&token=99949d78-0e85-4d0f-a928-b62b652fc29c",
                      "prix" : 26,
                      "statut" : "prestataire",
                      "usage" : "Appliquer le matin et le soir après avoir nettoyé la peau et avant l'appliation de la crème 22 à l'abricot. Peut également être utilisé tel un soin apaisant, réparateur après rasage. Eviter le contour des yeux."
                    }, {
                      "components" : "Acide Hyaluronique, Vitamine A, Vitamine E, Karité",
                      "description" : "Ce soin \"cocoon\" de nuit a une action restructurante et repulpante grâce à la vitamine E, au Rétinol et aux extraits d'origine marine qui stimulent la synthèse de Collagène et d'Élastine. L'Acide Hyaluronique, le Nalidone et le beurre de Karité apportent un pouvoir hydratant et régénérant renforcés. ",
                      "id" : 21,
                      "name" : "Crème Puissante Nuit",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-nuit.jpg?alt=media&token=b765233d-90ac-4bc1-8e85-8c12807a5eb2",
                      "prix" : 37.9,
                      "statut" : "client",
                      "usage" : "Appliquer tous les soirs sur le visage et le cou parfaitement nettoyés, de préférence après votre sérum. Eviter le contour des yeux. "
                    }, {
                      "components" : "Acide Hyaluronique, Vitamine A, Vitamine E, Karité",
                      "description" : "Ce soin \"cocoon\" de nuit a une action restructurante et repulpante grâce à la vitamine E, au Rétinol et aux extraits d'origine marine qui stimulent la synthèse de Collagène et d'Élastine. L'Acide Hyaluronique, le Nalidone et le beurre de Karité apportent un pouvoir hydratant et régénérant renforcés. ",
                      "id" : 22,
                      "name" : "Crème Puissante Nuit",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-nuit.jpg?alt=media&token=b765233d-90ac-4bc1-8e85-8c12807a5eb2",
                      "prix" : 22.9,
                      "statut" : "prestataire",
                      "usage" : "Appliquer tous les soirs sur le visage et le cou parfaitement nettoyés, de préférence après votre sérum. Eviter le contour des yeux. "
                    }, {
                      "components" : "Anti-Rides (Hibiscus & Baobab), Osilift, Acide Hyaluronique",
                      "description" : "Une crème gorgée de principes actifs anti-rides puissants issus de la nature. Le Complexe Anti-Age [Hibiscus & Baobab] réduit la profondeur des rides d'expression et prévient leur formation [alternative non chirurgicale aux traitements à base de toxîne botulique. Des actifs anti-âge hautement régénérants [Acide Hyaluronique - extrait de Myrtille - Collagène Marin - Vitamine A) tonifient, restructurent et redensifient en profondeur l'épiderme. ",
                      "id" : 23,
                      "name" : "Crème Puissante Jour",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-jour.jpg?alt=media&token=fdc27bcc-d329-4f05-a8ac-1cf149107962",
                      "prix" : 39.9,
                      "statut" : "client",
                      "usage" : "Appliquer tous les matin sur le visage et le cou parfaitement nettoyés, de préférence en complément votre sérum. Eviter le contour des yeux. "
                    }, {
                      "components" : "Anti-Rides (Hibiscus & Baobab), Osilift, Acide Hyaluronique",
                      "description" : "Une crème gorgée de principes actifs anti-rides puissants issus de la nature. Le Complexe Anti-Age [Hibiscus & Baobab] réduit la profondeur des rides d'expression et prévient leur formation [alternative non chirurgicale aux traitements à base de toxîne botulique. Des actifs anti-âge hautement régénérants [Acide Hyaluronique - extrait de Myrtille - Collagène Marin - Vitamine A) tonifient, restructurent et redensifient en profondeur l'épiderme. ",
                      "id" : 24,
                      "name" : "Crème Puissante Jour",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-jour.jpg?alt=media&token=fdc27bcc-d329-4f05-a8ac-1cf149107962",
                      "prix" : 24.9,
                      "statut" : "prestataire",
                      "usage" : "Appliquer tous les matin sur le visage et le cou parfaitement nettoyés, de préférence en complément votre sérum. Eviter le contour des yeux. "
                    }, {
                      "components" : "Rose Damas-cena, Beurre de Karité, Huile de Germes de Blé et de Noyaux d'Abricot, Collagène Marin, Acide Hyaluronique, Nalidone, Vitamine E.",
                      "description" : "Un masque booster d'hydratation à la texture fraîche et onctueuse qui désaltère intensément les épidermes les plus assoiffés grâce à ses 22 constituants qui stimulent une régénération rapide du tissu dermique et améliorent son élasticité.",
                      "id" : 25,
                      "name" : "Crème 22 à la rose",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-rose.jpg?alt=media&token=b224e68f-a35e-49b8-bbb2-553325f77bd6",
                      "prix" : 24.9,
                      "statut" : "client",
                      "usage" : "Appliquer ie masque en couche épaisse sur le visage et le cou. Laisser poser 10 à 15 minutes ou toute la nuit pour les épidermes les plus assoiffés. Pour une efficacité renforcée, poser le masque après avoir appliqué le Sérum 22. L'effet 'booster' d'hydratation n'en sera que décuplé. Se rince avec une lotion tonique."
                    }, {
                      "components" : "Rose Damas-cena, Beurre de Karité, Huile de Germes de Blé et de Noyaux d'Abricot, Collagène Marin, Acide Hyaluronique, Nalidone, Vitamine E.",
                      "description" : "Un masque booster d'hydratation à la texture fraîche et onctueuse qui désaltère intensément les épidermes les plus assoiffés grâce à ses 22 constituants qui stimulent une régénération rapide du tissu dermique et améliorent son élasticité.",
                      "id" : 26,
                      "name" : "Crème 22 à la rose",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fcreme-rose.jpg?alt=media&token=b224e68f-a35e-49b8-bbb2-553325f77bd6",
                      "prix" : 15.9,
                      "statut" : "prestataire",
                      "usage" : "Appliquer le masque en couche épaisse sur le visage et le cou. Laisser poser 10 à 15 minutes ou toute la nuit pour les épidermes les plus assoiffés. Pour une efficacité renforcée, poser le masque après avoir appliqué le Sérum 22. L'effet 'booster' d'hydratation n'en sera que décuplé. Se rince avec une lotion tonique."
                    }, {
                      "components" : "Vitamine A, Vitamine E, Huile de noyau d’abricot, Acide Hyaluronique, Cellules végétales de Lys Blanc, Poudre d’Or – effet bonne mine",
                      "description" : "Le Sérum anti-âge global profond est un soin d’exception sur mesure composé de molécules inspirées de la nature et sublimées par la science au service d’un soin régénérant de pointe. Grace à un système unique d’encapsulation breveté, les actifs sont protégés dans les « perles à double coeur ». ",
                      "id" : 27,
                      "name" : "Sérum absolu d'or",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fserum-or.png?alt=media&token=05adfc64-1862-488d-89d0-3dd3a287c189",
                      "prix" : 69.9,
                      "statut" : "client",
                      "usage" : "Matin et soir, sur une peau nettoyée, appliquez le Sérum Absolu d’Or avant votre crème de soin (2 à 3 pressions pour le visage et le cou). Eviter le contour des yeux."
                    }, {
                      "components" : "Vitamine A, Vitamine E, Huile de noyau d’abricot, Acide Hyaluronique, Cellules végétales de Lys Blanc, Poudre d’Or – effet bonne mine",
                      "description" : "Le Sérum anti-âge global profond est un soin d’exception sur mesure composé de molécules inspirées de la nature et sublimées par la science au service d’un soin régénérant de pointe. Grace à un système unique d’encapsulation breveté, les actifs sont protégés dans les « perles à double coeur ». ",
                      "id" : 28,
                      "name" : "Sérum absolu d'or",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fserum-or.png?alt=media&token=05adfc64-1862-488d-89d0-3dd3a287c189",
                      "prix" : 58.9,
                      "statut" : "prestataire",
                      "usage" : "Matin et soir, sur une peau nettoyée, appliquez le Sérum Absolu d’Or avant votre crème de soin (2 à 3 pressions pour le visage et le cou). Eviter le contour des yeux."
                    }, {
                      "components" : "Code Ambassadeur, Pack de 10 masques, Formation & coaching assuré pour un bon démarrage",
                      "description" : "Ce pack va vous permettre de rejoindre le réseau ProxyBeauty, et de commencer à générer des revenus en parlant de l'application autour de vous. Transmettez votre code Ambassadeur a toutes les personnes auquelles vous parlerez de l'application, aussi bien aux professionnels qu'aux particuliers.",
                      "id" : 29,
                      "name" : "Starting Business & Licence",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2Fstarting-business-license.jpg?alt=media&token=3851c812-e3e1-4fc1-9e40-7b04d7fd2c8b",
                      "prix" : 34.9,
                      "statut" : "ambassador",
                      "usage" : "Un guide inclus et la formation dont vous bénéficierez vous permettra de faire un usage optimal de ce kit. Revendez les masques pour être rentable dès le départ !"
                    }, {
                      "components" : " Code Ambassadeur, 20 Masque De Tissu Hydratant avec présentoir, 10 Présentoir Avec Boite de Bonbon Proxy Beauty, 1 Masque éclat a la fraise, 1 crème puissante de Nuit , 1 Brume lotion Purifiante, 1 sérum absolu d'or 24 carats,  Formation & coaching assuré",
                      "description" : "Ce pack  vous permet, en plus du services ProxyBeauty d'avoir des produits de  la gamme en possession  de  manière a booster vos ventes sur la boutique en ligne. Faite  découvrir  les produits lors de vos réunion  entres Amis ou visite chez les profesionnels une fois qu'ils auront télecharger l'application.  ",
                      "id" : 30,
                      "name" : "Beauty Box",
                      "pictureUrl" : "./assets/img/box-beauty.jpg",
                      "prix" : 229,
                      "statut" : "ambassador",
                      "usage" : "Un guide inclus et la formation dont vous bénéficierez vous permettra de faire un usage optimal de ce kit."
                    }, {
                      "components" : "Code Ambassadeur, Assortiment de 11 Tisanes Avec Présentoir + 1 thermo Affiché +livret, 11 Chambre a Senteur, 3 infuseurs à tisanes, Formation et coaching assuré ",
                      "description" : "En plus du service ce pack va vous permettre de faire déguster la gamme de  tisane 'Les jardins de Gamracy'. Quoi de mieux que de profiter d'une bonne tasse de thé entre Amis ou famille. ",
                      "id" : 31,
                      "name" : "Health Box",
                      "pictureUrl" : "./assets/img/box-health.jpg",
                      "prix" : 169,
                      "statut" : "ambassador",
                      "usage" : "Un guide inclus et la formation dont vous bénéficierez vous permettra de faire un usage optimal de ce kit."
                    }, {
                      "components" : "1 roll up Application Mobile ProxyBeauty, 1 roll up ProxyBeauty Cosmétique, 1 roll up gamme Bien être Les Jardins de Gamracy By ProxyBeauty, Formation et coaching assuré",
                      "description" : "En plus du service  vous avez une gamme cosmétique et bien-être à proposer. Idéal pour une présentation en  stand, salon,vente en réunion, événement partenaire ect.....",
                      "id" : 32,
                      "name" : "Full Box",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FFull%20Box.png?alt=media&token=f10e0063-39de-4a71-b9da-1538f61e447d",
                      "prix" : 449,
                      "statut" : "ambassador",
                      "usage" : "Un guide inclus et la formation dont vous bénéficierez vous permettra de faire un usage optimal de ce kit."
                    }, {
                      "category" : "Tisanes",
                      "components" : "Menthe poivrée, Cassis, Ortie, Artichaut, Pensées sauvage, Pétales de souci",
                      "description" : "Elimine les toxines. A boire en cure lors des changements de saison- purifie et draine pour une remise en forme complète de l’organisme.",
                      "id" : 33,
                      "name" : "Détox",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2028.jpg?alt=media&token=beb35c5a-d343-46bc-9d5e-5689c2771859",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion 3 min maximum"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Fleurs d’Hibiscus, Menthe Nanah, Thé Vert, Racines de Pissenlit, Reine des Prés",
                      "description" : "Purifie l’organisme. Ce mélange de plantes est un allié indirect dans la perte de poids. A prendre en cure, ou quotidiennement.",
                      "id" : 34,
                      "name" : "Minceur",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2029.jpg?alt=media&token=73b288f5-b46d-4d65-a42e-7de77bb575db",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion 3 min maximum"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Rooibos, Cannelle, Cardamome, Orange, Gingembre, Poivre, Badiane, Girofle",
                      "description" : "Stimulante, cette tisane aux vertus antioxydantes redonne énergie et vitalité afin de commencer sa journée en pleine forme.   ",
                      "id" : 35,
                      "name" : "RÉVEIL",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2030.jpg?alt=media&token=bda2404d-eb78-447c-a28a-3e14c43f7608",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Citronnelle, Gingembre Gris, Citron, Cardamome",
                      "description" : "Énergisant, ce mélange de plantes aux notes citronnées offre des bienfaits revitalisants et stimulants à boire toute la journée.",
                      "id" : 36,
                      "name" : "Tonique",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2031.jpg?alt=media&token=bf0cea69-050f-4984-9032-a7ca78e18662",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Anis Vert, Carvi, Menthe Nanah, Fenugrec, Basilic, Fenouil",
                      "description" : "Favorise la lactation. Sa composition à base de fenouil et d’anis facilite la digestion. Son goût délicatement anisé est très apprécié des nourrissons.",
                      "id" : 37,
                      "name" : "ALLAITEMENT",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2032.jpg?alt=media&token=977ecb9b-d5d3-47df-b34b-f7923b6657be",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Houblon, Fenouil, Anis vert, Mélisse, Menthe nanah",
                      "description" : "Soulage les maux liés à la grossesse, ce mélange aux bienfaits apaisants vous accompagne tout au long de votre grossesse. ",
                      "id" : 38,
                      "name" : "GROSSESSE",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2033.jpg?alt=media&token=519f1cb9-25ff-4ab2-9036-d5e9b00d4064",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Raisins de Corinthe, Hibiscus, Cynorrhodon, Réglisse, Vigne rouge, Mélilot",
                      "description" : "Favorise et stimule le flux du sang au niveau des vaisseaux sanguins. Idéale pour pallier aux problèmes de jambes lourdes. ",
                      "id" : 39,
                      "name" : "CIRCULATOIRE",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2034.jpg?alt=media&token=b3b5fe54-f7b0-4eac-b8db-7825fb1a03a9",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude ou glacée. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Romarin, Cannelle, Sureau, Réglisse, Mélisse, Bourrache, Mauve",
                      "description" : "Tonifie le système immunitaire et revitalise l’organisme afin de lutter contre les rigueurs de l’hiver. Cure d’un mois.",
                      "id" : 40,
                      "name" : "IMMUNITÉ",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2035.jpg?alt=media&token=0ea1410d-be4a-40db-ba67-8772d33dcb6c",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Eucalyptus, Hysope, Réglisse, Fleurs de Mauve, Menthe poivree",
                      "description" : "Soulage les voies respiratoires, calme la toux et adoucit la gorge. A boire sous forme de cure de 3 semaines. ",
                      "id" : 41,
                      "name" : "Respiratoire",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2036.jpg?alt=media&token=7942f95f-3700-456c-be97-e27e23383fa8",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Fruits de fenouil, Verveine odorante, Semence d’Angélique, Romarin, Anis vert, Badiane, Hysope",
                      "description" : "Apaise et facilite la digestion, à boire en fin de repas pour stimuler les voies digestives. L’alliance du romarin, verveine et hysope apaise et offre des vertus relaxantes. ",
                      "id" : 42,
                      "name" : "DIGESTIVE",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2037.jpg?alt=media&token=ace98bc9-5b8a-47b8-a1b0-b563bc6722b7",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude. Temps d’infusion: 7 à 10 min"
                    }, {
                      "category" : "Tisanes",
                      "components" : "Raisins de Corinthe, Anis Vert, Carvi Noir, Amande, Cannelle de Ceylan, Aspérule Odorante",
                      "description" : "Réduit le stress de la journée et détend les muscles pour favoriser un sommeil réparateur. L’Aspérule est reconnue pour ses effets  antistress et ses bienfaits sur les insomnies. ",
                      "id" : 43,
                      "name" : "SOMMEIL",
                      "pictureUrl" : "https://firebasestorage.googleapis.com/v0/b/proxybeauty-2.appspot.com/o/img%2Fshop%2FPRODUIT%2038.jpg?alt=media&token=e72527f4-1d93-44b6-966f-d8c805fb2002",
                      "prix" : 9.9,
                      "statut" : "client",
                      "usage" : "A boire chaude. Temps d’infusion: 7 à 10 min"
                    }
                ];
exports.checkGift = functions.database.ref('/user-gift/{userId}/checkin').onWrite((event) => {
    // Ici la valeur de checkin est le numero du palier auquel le user se trouve avant l'upgrade
    const val = event.data.val();
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
    if (val === null || val == 'failed' || val == 'success' || !Number.isInteger(val)) return null;

    let nbRdv = 0;
    let nbComment = 0;

    return admin.database().ref('/user-rdv/' + event.params.userId).once('value', function(snapshot) {
        snapshot.forEach( function(childSnapshot) {
            nbRdv += 1;
            if (childSnapshot.hasChild('review'))
                nbComment += 1;

          return false;
        });
        return true;
    }).then( () => {
        if (nbRdv >= giftRdv[val] && nbComment >= giftComment[val]) {

            // Le user peut passer au palier supplementaire et debloquer son cadeau
            let updates = {};
            let newKey = admin.database().ref(`/user-gift/${event.params.userId}/gifts`).push().key;

            let newGift = JSON.parse(JSON.stringify(giftProducts[val]));
            newGift['pictureUrl'] = products[newGift.ids[0]].pictureUrl;
            newGift['palier'] = val + 1;
            newGift['value'] = giftValue[val];
            newGift['state'] = 'available';

            updates['/user-gift/'+event.params.userId+'/palier'] = val +1;
            updates['/user-gift/'+event.params.userId+'/gifts/'+newKey] = newGift;
            updates['/user-gift/'+event.params.userId+'/checkin'] = 'success';

            return admin.database().ref().update(updates);
        }
        else {
            return admin.database().ref('/user-gift/'+event.params.userId+'/checkin').set('failed');
        }

    }).catch( (error) => {
        return admin.database().ref('/user-gift/'+event.params.userId+'/checkin').set(error);
    });

});

exports.retrieveGift = functions.database.ref('/user-gift/{userId}/retrieving').onWrite((event) => {
    // Ici la valeur de checkin est le numero du palier auquel le user se trouve avant l'upgrade
    const val = event.data.val();
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
    if (val.state === null || val.state == 'error' || val === null) return null;

    return admin.database().ref('/user-gift/' + event.params.userId + '/gifts/'+ val.giftKey).once('value', function(snapshot) {
        if (snapshot.val().state == 'available') {
            // Send mail to Nadir
            var val = event.data.val();;
            const mailToNadirOptions = {
              from: 'myproxybeauty@gmail.com', // sender address
              to: 'myproxybeauty@gmail.com', // list of receivers
              subject: 'Proxybeauty produit à expedier', // Subject line
              html: '<p> Produit a envoyer : '+ products[val.product.id].name +' x'+ snapshot.val().qte+
              '<br /> Adresse de livraison : '+val.place.street+' '+val.place.city+val.place.zipCode+' '+val.place.country+
               '<br /> Client :'+val.user_infos.firstname + ' '+ val.user_infos.lastname+', mail : '+ val.user_infos.email+' </p>'// plain text body
            };

            const receipt = {
              from: 'myproxybeauty@gmail.com', // sender address
              to: val.user_infos.email, // list of receivers
              subject: 'Commande Proxybeauty : '+ products[val.product.id].name +' x'+ snapshot.val().qte, // Subject line
              html: '<p> Votre commande a bien été prise en compte et sera expédiée sous 48h ! </p>'// plain text body
            };

            let transporter = nodemailer.createTransport(mailAuth);
            transporter.sendMail(mailToNadirOptions, function (err, info) {
               if(err)
                 console.error(err);
               else
                 console.log(info);
            });

            transporter.sendMail(receipt, function (err, info) {
               if(err)
                 console.error(err);
               else
                 console.log(info);
            });

            return admin.database().ref('/user-gift/' + event.params.userId + '/gifts/'+ val.giftKey + '/state').set('retrieved');
        }
        else {
            return admin.database().ref('/user-gift/' + event.params.userId + '/retrieving').set('notAvailable');
        }
    });
});

exports.setBankAccountandroid = functions.database.ref('/user-bankaccount/{userId}/banktoken').onWrite((event) => {
    // Ici la valeur de checkin est le numero du palier auquel le user se trouve avant l'upgrade
    const val = event.data.val();
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)

    if ( val === null) return null;

    return admin.database().ref('/stripe_sellers/' + event.params.userId + '/token/id').once('value', function(snapshot) {
        let CONNECTED_STRIPE_ACCOUNT_ID = snapshot.val();

        stripe.accounts.update(
            CONNECTED_STRIPE_ACCOUNT_ID,
            {
                external_account : val
            }
        ).then( function(acct) {
             // asynchronously called
             return admin.database().ref('/user-bankaccount/' + event.params.userId + '/accountList').set(acct);
         }).catch( (err) => {
              console.log(err);
              return admin.database().ref('/user-bankaccount/' + event.params.userId + '/error').set(err.message);
         });

    });
});


exports.setBankAccountios = functions.database.ref('/user-bankaccount/{userId}/rawData').onWrite((event) => {
    // Ici la valeur de checkin est le numero du palier auquel le user se trouve avant l'upgrade
    const val = event.data.val();
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)

    if ( val === null) return null;

    return admin.database().ref('/stripe_sellers/' + event.params.userId + '/token/id').once('value', function(snapshot) {
        let CONNECTED_STRIPE_ACCOUNT_ID = snapshot.val();

        return stripe.accounts.createExternalAccount(
            CONNECTED_STRIPE_ACCOUNT_ID,
            {
                external_account : {
                    object: 'bank_account',
                    country: 'FR',
                    currency: 'EUR',
                    account_holder_name: val.name,
                    account_number: val.iban,
                     default_for_currency: true
                }
            }
        ).then( function(acct) {
             // asynchronously called
             return admin.database().ref('/user-bankaccount/' + event.params.userId + '/accountList').set(acct);
         }).catch( (err) => {
              console.log(err);
              return admin.database().ref('/user-bankaccount/' + event.params.userId + '/error').set(err.message);
         });
    });
});


exports.receiveComplain = functions.database.ref('/sav/{userId}/{complainId}').onWrite((event) => {

    const val = event.data.val();
    // This onWrite will trigger whenever anything is written to the path, so
    // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)

    if ( val === null) return null;

    // send a mail to Nadir so he can send product
    const mailToNadirOptions = {
      from: 'myproxybeauty@gmail.com', // sender address
      to: 'myproxybeauty@gmail.com', // list of receivers
      subject: '[SAV] '+val.subject, // Subject line
      html: '<p> Réclamation : '+ val.details+' <br /> Client :'+val.userData.firstname+' '+val.userData.lastname+'<br /> Email :'+val.userData.email+'</p>'// plain text body
    };
    let transporter = nodemailer.createTransport(mailAuth);
    transporter.sendMail(mailToNadirOptions, function (err, info) {
       if(err)
         console.error(err);
       else
         console.log(info);
    });
});


// Shop command by a non resgistered user
// Make a POST HTTP request to https://us-central1-proxybeauty-2.cloudfunctions.net/shopOrder
// JSON body request and X-Request-ID header containing email+timestamp

exports.shopOrder = functions.https.onRequest((req, res) => {
  // Grab the req parameter.
  const val = req.body;
  val['id'] = req.get('x-request-id');

  // This onWrite will trigger whenever anything is written to the path, so
  // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
  //if (val) res.status(200).send(val);

  if (val === null || !val.qte || !val.idProduct || !val.source || !val.place || !val.user_infos) res.status(400).send({ message: "La requete n'est pas reglementire"});

  return admin.database().ref(`/products/${val.idProduct}/prix`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then((prix) => {

        // Create a charge using the pushId as the idempotency key, protecting against double charges
        const amount = Math.ceil(prix * val.qte * 100);
        const idempotency_key = req.get('x-request-id');

        return stripe.charges.create({
              amount: amount,
              currency: "eur",
              source: val.source,
              transfer_group: idempotency_key,
          }, {idempotency_key});
        }).then((charge) => {
            // If the result is successful, write it back to the database
            var val = req.body;
            let updates = {};

            // send a mail to Nadir so he can send product
            const mailToNadirOptions = {
              from: 'myproxybeauty@gmail.com', // sender address
              to: 'myproxybeauty@gmail.com', // list of receivers
              subject: 'Proxybeauty produit à expedier', // Subject line
              html: '<p> Produit a envoyer : '+ products[val.idProduct].name +' x'+ val.qte+
              ' <br /> Adresse de livraison :'+val.place.street+' '+val.place.city+val.place.zipCode+' '+val.place.country+
              ' <br /> Client :'+val.user_infos.firstname + ' '+ val.user_infos.lastname+', mail : '+ val.user_infos.email+' </p>'// plain text body
            };

            const receipt = {
              from: 'myproxybeauty@gmail.com', // sender address
              to: val.user_infos.email, // list of receivers
              subject: 'Commande Proxybeauty : '+ products[val.idProduct].name +' x'+ val.qte, // Subject line
              html: '<p> Votre commande a bien été prise en compte et sera expédiée sous 48h ! </p>'// plain text body
            };

            let transporter = nodemailer.createTransport(mailAuth);
            transporter.sendMail(mailToNadirOptions, function (err, info) {
               if(err)
                 console.error(err);
               else
                 console.log(info);
            });

            transporter.sendMail(receipt, function (err, info) {
               if(err)
                 console.error(err);
               else
                 console.log(info);
            });
            /////////////////

            //admin.database().ref(`/stripe_customers/non-registered/shopResponse/${val.user_infos.firstname + val.user_infos.lastname}`).child('resultCharge').push(charge);
            res.status(200).send({ message: "Achat effectué avec succès ! Vous allez recevoir sous peu un mail de confirmation de votre commande"});
          }).catch((error) => {
              console.log(error);
            // We want to capture errors and render them in a user-friendly way, while
            // still logging an exception with Stackdriver
            //admin.database().ref(`/stripe_customers/non-registered/shopResponse/${val.user_infos.firstname + val.user_infos.lastname}`).child('errorCharge').set(error.raw);
            res.status(200).send({ error: true, message: "Le paiement a échoué", error_details: error});
          });

});

// [START chargecustomer]
// Charge the Stripe customer whenever an amount is written to the Realtime database
exports.createStripeShop = functions.database.ref('/stripe_customers/{userId}/shopping/{id}').onWrite((event) => {
  const val = event.data.val();
  // This onWrite will trigger whenever anything is written to the path, so
  // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
  if (val === null || val.id || val.error) return null;
  /*
  try {
      let prixSnap = admin.database().ref(`/products/${val.idProduct}/prix`).once('value');
      let prix = prixSnap.val();
      let nbPurchase = 0;
      let reduction = 1;

      let snapRed = await admin.database().ref(`/stripe_customers/${event.params.userId}/shopResponse`).once('value');
      snapRed.forEach( function(childSnapshot) {
          nbPurchase += 1;
          console.log(nbPurchase);
        return false;
      });
      console.log(nbPurchase);
      reduction = (nbPurchase == 0 && change.after.val().parrainId) ? 0.8 : false;
      console.log(reduction);

      const amount = Math.ceil(prix * val.qte * 100 * reduction);
      const idempotency_key = event.params.id;

      try {
          let charge = await stripe.charges.create({
                amount: amount,
                currency: "eur",
                source: val.source,
                transfer_group: idempotency_key,
            }, {idempotency_key});
        } catch(error) {
            console.log(error);
            // We want to capture errors and render them in a user-friendly way, while
            // still logging an exception with Stackdriver
            return admin.database().ref(`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}`).child('errorCharge').set(error.raw);

        }

        let updates = {};
        updates[`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}/resultCharge`] = charge;

        if (products[val.idProduct].statut == "ambassador") {
            updates['/parrains/' + event.params.userId+'/ambassador'] = true;
            updates['/users/' + event.params.userId + '/ambassador'] = true;
        }
        // send a mail to Nadir so he can send product
        const mailToNadirOptions = {
          from: 'myproxybeauty@gmail.com', // sender address
          to: 'myproxybeauty@gmail.com', // list of receivers
          subject: 'Proxybeauty produit à expedier', // Subject line
          html: '<p> Produit a envoyer : '+ products[val.idProduct].name +' x'+ val.qte+
          ' <br /> Adresse de livraison :'+val.place.street+' '+val.place.city+val.place.zipCode+' '+val.place.country+
          ' <br /> Client :'+val.user_infos.firstname + ' '+ val.user_infos.lastname+', mail : '+ val.user_infos.email+' </p>'// plain text body
        };

        const receipt = {
          from: 'myproxybeauty@gmail.com', // sender address
          to: val.user_infos.email, // list of receivers
          subject: 'Commande Proxybeauty : '+ products[val.idProduct].name +' x'+ val.qte, // Subject line
          html: '<p> Votre commande a bien été prise en compte et sera expédiée sous 48h ! </p>'// plain text body
        };

        let transporter = nodemailer.createTransport(mailAuth);
        transporter.sendMail(mailToNadirOptions, function (err, info) {
           if(err)
             console.error(err);
           else
             console.log(info);
        });

        transporter.sendMail(receipt, function (err, info) {
           if(err)
             console.error(err);
           else
             console.log(info);
        });
        /////////////////

        let updateRes = await admin.database().ref().update(updates);

        if (change.after.val().parrainId) {
            let amount_parrain = Math.floor(charge.amount * 0.3);
            let idempotency_key = event.params.id;
            let idempotency_key_parrain = idempotency_key+'-parrain';

            try {
                let transfer = await stripe.transfers.create({
                          amount: amount_parrain,
                          currency: "eur",
                          destination: change.after.val().parrainAccount,
                          transfer_group: idempotency_key,
                          source_transaction: charge.id
                      }, { idempotency_key: idempotency_key_parrain });

            } catch (error) {
                console.log(error);
                // Send mail to support
                const mailToNadirOptions = {
                  from: 'myproxybeauty@gmail.com', // sender address
                  to: 'myproxybeauty@gmail.com', // list of receivers
                  subject: 'WARNING : Payment or Transfer error', // Subject line
                  html: '<p> customer ID : '+ event.params.userId +' <br /> operation ID' + event.params.id+'</p>'// plain text body
                };
                let transporter = nodemailer.createTransport(mailAuth);
                transporter.sendMail(mailToNadirOptions, function (err, info) {
                   if(err)
                     console.error(err);
                   else
                     console.log(info);
                });

                return admin.database().ref(`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}`).child('errorTransferParrain').set(error.raw);

            }

            let newKey = admin.database().ref(`/parrain-gains/${change.after.val().parrainId}/${event.params.userId}`).push().key;
            let updates = {};
            updates[`/parrain-gains/${change.after.val().parrainId}/${event.params.userId}/${newKey}`] = {
                amount: transfer.amount,
                date: transfer.created,
                currency: transfer.currency,
                transaction: transfer.transfer_group
            };
            updates[`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}/resultTransfer`] = transfer;


            return admin.database().ref().update(updates);

        }
        return updateRes;
  } catch (e) {
      console.error(e);
  }
  */

  return admin.database().ref(`/products/${val.idProduct}/prix`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then(function(prix) {
    let nbPurchase = 0;
    let reduction = 1;

    // Si le client a un parrain, il a une reduc de 20%
    if (event.data.val().parrainId)
        reduction = 0.8;
    /*
    try {
        let snapRed = await admin.database().ref(`/stripe_customers/${event.params.userId}/shopResponse`).once('value');
        snapRed.forEach( function(childSnapshot) {
            nbPurchase += 1;
            console.log(nbPurchase);
          return false;
        });
        console.log(nbPurchase);
        reduction = (nbPurchase == 0 && event.data.val().parrainId) ? 0.8 : false;
        console.log(reduction);


    }
    catch (err){
        console.error(err);
    }
    */

    // Create a charge using the pushId as the idempotency key, protecting against double charges
    const amount = Math.ceil(prix * val.qte * 100 * reduction);
    const idempotency_key = event.params.id;

    return stripe.charges.create({
          amount: amount,
          currency: "eur",
          source: val.source,
          transfer_group: idempotency_key,
      }, {idempotency_key});
    }).then((charge) => {
        // If the result is successful, write it back to the database
        var val = event.data.val();
        let updates = {};
        updates[`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}/resultCharge`] = charge;

        if (products[val.idProduct].statut == "ambassador") {
            updates['/parrains/' + event.params.userId+'/ambassador'] = true;
            updates['/users/' + event.params.userId + '/ambassador'] = true;
        }
        // send a mail to Nadir so he can send product
        const mailToNadirOptions = {
          from: 'myproxybeauty@gmail.com', // sender address
          to: 'myproxybeauty@gmail.com', // list of receivers
          subject: 'Proxybeauty produit à expedier', // Subject line
          html: '<p> Produit a envoyer : '+ products[val.idProduct].name +' x'+ val.qte+
          ' <br /> Adresse de livraison :'+val.place.street+' '+val.place.city+val.place.zipCode+' '+val.place.country+
          ' <br /> Client :'+val.user_infos.firstname + ' '+ val.user_infos.lastname+', mail : '+ val.user_infos.email+' </p>'// plain text body
        };

        const receipt = {
          from: 'myproxybeauty@gmail.com', // sender address
          to: val.user_infos.email, // list of receivers
          subject: 'Commande Proxybeauty : '+ products[val.idProduct].name +' x'+ val.qte, // Subject line
          html: '<p> Votre commande a bien été prise en compte et sera expédiée sous 48h ! </p>'// plain text body
        };

        let transporter = nodemailer.createTransport(mailAuth);
        transporter.sendMail(mailToNadirOptions, function (err, info) {
           if(err)
             console.error(err);
           else
             console.log(info);
        });

        transporter.sendMail(receipt, function (err, info) {
           if(err)
             console.error(err);
           else
             console.log(info);
        });
        /////////////////

        admin.database().ref().update(updates);

        if (event.data.val().parrainId) {
            let amount_parrain = Math.floor(charge.amount * 0.3);
            let idempotency_key = event.params.id;
            let idempotency_key_parrain = idempotency_key+'-parrain';

            stripe.transfers.create({
                      amount: amount_parrain,
                      currency: "eur",
                      destination: event.data.val().parrainAccount,
                      transfer_group: idempotency_key,
                      source_transaction: charge.id
                  }, { idempotency_key: idempotency_key_parrain })
              .then( function(transfer) {
                  let newKey = admin.database().ref(`/parrain-gains/${event.data.val().parrainId}/${event.params.userId}`).push().key;
                  let updates = {};
                  updates[`/parrain-gains/${event.data.val().parrainId}/${event.params.userId}/${newKey}`] = {
                      amount: transfer.amount,
                      date: transfer.created,
                      currency: transfer.currency,
                      transaction: transfer.transfer_group
                  };
                  updates[`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}/resultTransfer`] = transfer;


                  return admin.database().ref().update(updates);

              }).catch( (error) => {
                  console.log(error);
                  // Send mail to support
                  const mailToNadirOptions = {
                    from: 'myproxybeauty@gmail.com', // sender address
                    to: 'myproxybeauty@gmail.com', // list of receivers
                    subject: 'WARNING : Payment or Transfer error', // Subject line
                    html: '<p> customer ID : '+ event.params.userId +' <br /> operation ID' + event.params.id+'</p>'// plain text body
                  };
                  let transporter = nodemailer.createTransport(mailAuth);
                  transporter.sendMail(mailToNadirOptions, function (err, info) {
                     if(err)
                       console.error(err);
                     else
                       console.log(info);
                  });

                  return admin.database().ref(`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}`).child('errorTransferParrain').set(error.raw);
              });
        }

      }).catch((error) => {
          console.log(error);
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with Stackdriver
        return admin.database().ref(`/stripe_customers/${event.params.userId}/shopResponse/${event.params.id}`).child('errorCharge').set(error.raw);
      });

});
// [END chargecustomer]]

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
      // On inscrit simplement le client qui a deja une carte enregistree
      return stripe.subscriptions.create({
          customer: customer,
          items: [{plan: 'plan_D7bEuSret8nyUj'}],
        });
    }).then((susbcription) => {
        // If the result is successful, write it back to the database
        let updates = {};
        updates[`/stripe_customers/${event.params.userId}/submitResponse/${event.params.id}/resultSubscription`] = susbcription;
        updates['/parrains/' + event.params.userId+'/ambassador'] = true;
        updates['/users/' + event.params.userId + '/ambassador'] = true;
        return admin.database().ref().update(updates);

      }).catch((error) => {
        // We want to capture errors and render them in a user-friendly way, while
        // still logging an exception with Stackdriver
        return admin.database().ref(`/stripe_customers/${event.params.userId}/submitResponse/${event.params.id}`).child('errorSubscription').set(error.raw);
    });
    /*
        // Create a charge using the pushId as the idempotency key, protecting against double charges
        const amount = Math.ceil(val.amount * 100);
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
    }); */
});
// [END submit]]

exports.sendReclaim = functions.database.ref('user-rdv/{userId}/{idRdv}/state').onWrite((event) => {

    const val = event.data.val();

    if (val === null || val !== 'issued') return null;

    // Send mail to support
    const mailToNadirOptions = {
      from: 'myproxybeauty@gmail.com', // sender address
      to: 'myproxybeauty@gmail.com', // list of receivers
      subject: 'RECLAIM : Reclamation sur un rendez-vous client', // Subject line
      html: '<p> customer ID : '+ event.params.userId +' <br /> rdv ID' + event.params.idRdv+' <br /> </p>'// plain text body
    };
    let transporter = nodemailer.createTransport(mailAuth);
    transporter.sendMail(mailToNadirOptions, function (err, info) {
       if(err)
         console.error(err);
       else
         console.log(info);
    });
});

exports.payPresta = functions.database.ref('rdv/{idRdv}/state').onWrite((event) => {
  const val = event.data.val();
  // This onWrite will trigger whenever anything is written to the path, so
  // noop if the charge was deleted, errored out, or the Stripe API returned a result (id exists)
  if (val === null || val !== 'confirmed' || val == 'issued') return null;
  // on recup les infos rdv
  return admin.database().ref(`/rdv/${event.params.idRdv}`).once('value').then((snapshot) => {
    return snapshot.val();
    }).then((data) => {
      // On recup le montant de la charge associee
      var rdv = data;

      admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}/resultCharge`).once('value').then((snapshot) => {
          let charge = snapshot.val();
          let amount = charge.amount;
          let idempotency_key = rdv.charge;
        let idempotency_key_prestataire = rdv.charge+'-prestataire';
        let idempotency_key_parrain_prestataire = rdv.charge+'-parrain_prestataire';
        let idempotency_key_parrain_client = rdv.charge+'-parrain_client';

        let prestataire = charge.destinataire;
        let parrain_prestataire = charge.parrain_prestataire;
        let parrain_client = charge.parrain_client;

        let amountPresta = Math.floor(amount * 0.82);
        let amount_parrain_prestataire = Math.floor(amount * 0.04);
        let amount_parrain_client = Math.floor(amount * 0.02);
        console.log(amount);
        console.log(prestataire);
        console.log(idempotency_key);
        console.log(charge.id);

        stripe.transfers.create({
                  amount: amountPresta,
                  currency: "eur",
                  destination: prestataire,
                  transfer_group: idempotency_key,
                  source_transaction: charge.id
              }, { idempotency_key: idempotency_key_prestataire })
          .then( function(transfer) {
              console.log('In');
              console.log(rdv.client);
              admin.database().ref(`/prestataire-gains/${charge.ids.prestataire}/${rdv.client}`).push({
                  amount: transfer.amount,
                  date: transfer.created,
                  currency: transfer.currency,
                  transaction: transfer.transfer_group
              });
              console.log('Still In');
              return admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}`).child('resultTransferPrestataire').set(transfer);
          }).catch( (error) => {
              console.log(error);

              return admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}`).child('errorTransferPrestataire').set(error.raw);
          });

          console.log(parrain_prestataire);

          if (parrain_prestataire) {
              console.log('Presta parrain in');
              stripe.transfers.create({
                        amount: amount_parrain_prestataire,
                        currency: "eur",
                        destination: parrain_prestataire,
                        transfer_group: idempotency_key,
                        source_transaction: charge.id
                    }, { idempotency_key: idempotency_key_parrain_prestataire })
                .then( function(transfer) {
                    admin.database().ref(`/parrain-gains/${charge.ids.parrain_prestataire}/${charge.ids.prestataire}`).push({
                        amount: transfer.amount,
                        date: transfer.created,
                        currency: transfer.currency,
                        transaction: transfer.transfer_group
                    });

                    return admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}`).child('resultTransferParrainPrestataire').set(transfer);
                }).catch( (error) => {
                    console.log(error);

                    return admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}`).child('errorTransferParrainPrestataire').set(error.raw);
                }).catch( (error) => {
                    console.log(error);
                });
          }

          console.log(parrain_client);
          if (parrain_client) {
              stripe.transfers.create({
                        amount: amount_parrain_client,
                        currency: "eur",
                        destination: parrain_client,
                        transfer_group: idempotency_key,
                        source_transaction: charge.id
                    }, { idempotency_key: idempotency_key_parrain_client })
                .then( function(transfer) {
                    admin.database().ref(`/parrain-gains/${charge.ids.parrain_client}/${rdv.client}`).push({
                        amount: transfer.amount,
                        date: transfer.created,
                        currency: transfer.currency,
                        transaction: transfer.transfer_group
                    });

                    return admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}`).child('resultTransferParrainClient').set(transfer);
                }).catch( (error) => {

                    return admin.database().ref(`/stripe_customers/${rdv.client}/response/${rdv.charge}`).child('errorTransferParrainClient').set(error.raw);
                });
          }
      });
    });

});
// [END submit]]

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
    const amount = Math.ceil(val.amount * 100);
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
      let val = event.data.val();

      charge['destinataire'] = val.destinataire;
      charge['parrain_prestataire'] = val.parrain_prestataire;
      charge['parrain_client'] = val.parrain_client;
      charge['ids'] = val.ids;
      // Creation du rdv dans la base de donnee (en dur, chez le prestataire et chez le client)

      let newRDVKey = admin.database().ref().child('rdv').push().key;

      // Write the new rdv's data simultaneously in the rdv list and the users datas.
      let firstUpdates = {};
      firstUpdates['/rdv/' + newRDVKey] = val.rdvDatas;
      firstUpdates['/user-rdv/' + val.rdvDatas.client + '/' + newRDVKey] = val.rdvDatas;
      firstUpdates['/user-rdv/' + val.rdvDatas.prestataire + '/' + newRDVKey] = val.rdvDatas;
      firstUpdates[`/stripe_customers/${event.params.userId}/response/${event.params.id}/resultCharge`] = charge;

      admin.database().ref().update(firstUpdates).then(function() {
          admin.database().ref('/devices/'+val.rdvDatas.prestataire+'/tokenList').once('value', function(snapshot) {
              if (snapshot.exists()) {
                  let rdvDate = new Date(val.rdvDatas.timestamp);
                  let tokens = snapshot.val();
                  let payload = {
                      notification: {
                          title: 'Nouveau rendez vous !',
                          body: 'Le '+ rdvDate.toDateString()
                      }
                  }
                  admin.messaging().sendToDevice(tokens, payload);
              }
          });
      });


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
exports.acceptConditions = functions.https.onRequest((req, res) => {
    // creer le compte Stripe Seller
    let uid = req.body.uid;
    var CONNECTED_STRIPE_ACCOUNT_ID;
    if (uid === null || !uid) {
        res.status(400).send({ message: 'No firebase uid send', code: 'no-uid'});
    }

    // On verifie si le user a deja un compte, et dans ce cas on l'update
    admin.database().ref('/stripe_sellers/' + uid + '/token/id').once('value', function(snapshot) {
        CONNECTED_STRIPE_ACCOUNT_ID = snapshot.exists() ? snapshot.val() : false;

        console.log(snapshot.val());

        return CONNECTED_STRIPE_ACCOUNT_ID;
    }).then( function(account2) {

        admin.database().ref('/users/'+uid).once('value').then(function(snapshot) {

            let uid = req.body.uid;
            var user = snapshot.val();
            const ipAddress = (req.get('X-Forwarded-For') || req.get('x-forwarded-for') || '').split(',')[0] || req.connection.remoteAddress;

            let userDatas = {
                  country: 'FR',
                  legal_entity: {
                      first_name: user.firstname,
                      last_name: user.lastname,
                      type: 'individual'
                  }
            };

            // Send mail CLIENT accueil

            if (snapshot.hasChild('birthdate')) {
                userDatas.legal_entity['dob'] = {
                    year: user.birthdate.year ? user.birthdate.year : "1995",
                    month: user.birthdate.month ? user.birthdate.month : "01",
                    day: user.birthdate.day ? user.birthdate.day : "01"
                };
            }

            if (snapshot.hasChild('address')) {
                let addressData = snapshot.child('address').child('details').val();
                userDatas.country = addressData.countryCode ? addressData.countryCode : userDatas.country;
                userDatas.legal_entity['address'] = {
                        city: addressData.locality ? addressData.locality : 'non renseigne',
                        line1: addressData.thoroughfare ? addressData.thoroughfare : 'non renseigne',
                        postal_code: addressData.postalCode ? addressData.postalCode : 'non renseigne',
                    };
            }

            // Si un compte existe, on l'update
            if (CONNECTED_STRIPE_ACCOUNT_ID) {
                console.log('Updating seller account, but not today');
                /*
                stripe.accounts.update(
                    CONNECTED_STRIPE_ACCOUNT_ID,
                    userDatas
                ).then( function(sellerAccount) {
                     // asynchronously called
                     admin.database().ref('/stripe_sellers/'+uid+'/token').set(sellerAccount);
                     res.status(200).send(sellerAccount);
                 }).catch(function(error) {
                     admin.database().ref('/stripe_sellers/'+ uid +'/error').set(error.message);
                     res.status(500).send(error);
                 });
                 */
                 res.status(200).send({ code: 200, message: 'succès relatif du developpeur epuise'});
            }   //Sinon on le creer
            else {
                userDatas['tos_acceptance'] = {
                      date: Math.floor(Date.now() / 1000),
                      ip: ipAddress // Assumes you're not using a proxy
                };
                userDatas['type'] = "custom";

                stripe.accounts.create(userDatas).then((sellerAccount) => {
                  admin.database().ref('/stripe_sellers/'+uid+'/token').set(sellerAccount);
                  res.status(200).send(sellerAccount);
              }).catch(function(error) {
                  console.log(error);
                  admin.database().ref('/stripe_sellers/'+ uid +'/error').set(error.message);
                  res.status(500).send(error);
              });
            }


        });

   });

});
/*
exports.createStripeConnectedAccount = functions.database.ref('/users/{userId}/address/details').onWrite((event) => {
  const addressData = event.data.val();

  if (addressData === null) return null;

  return admin.database().ref(`/users/${event.params.userId}`).once('value').then(function(snapshot) {
      var user = snapshot.val();
      return stripe.accounts.create({
            country: addressData.countryCode,
            legal_entity: {
                first_name: user.firstname,
                last_name: user.lastname,
                dob: {
                    year: user.birthdate ? user.birthdate.year : "1995",
                    month: user.birthdate ? user.birthdate.month : "01",
                    day: user.birthdate ? user.birthdate.day : "01"
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

});
*/

// Add a payment source (card) for a user by writing a stripe payment source token to Realtime database
exports.addPaymentSource = functions.database.ref('/stripe_customers/{userId}/sources/{pushId}/token').onWrite((event) => {
  const source = event.data.val();
  if (source === null) return null;
  return admin.database().ref(`/stripe_customers/${event.params.userId}/customer_id`).once('value').then((snapshot) => {
    return snapshot.val();
  }).then((customer) => {
    return stripe.customers.createSource(customer, {source});
  }).then((response) => {
    return event.data.adminRef.parent.child('result').set(response);
}).catch( (error) => {
      console.debug(error);
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
