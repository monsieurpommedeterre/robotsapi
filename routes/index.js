var express = require('express');
var router = express.Router();
require('../models/connection');
const Robot = require('../models/robots');
const { getRandomNumber } = require('../helpers/random');

/* POOL pour les générations de noms et descriptions, on pourrait aussi faire appel à un fichier externe, ou même une bdd pour nourrir ce pool plutôt que d'avoir des variables en dur */

const namesPool1 = ["turbo", "steel", "terra", "thunder", "chrome", "crusher", "crazy", "funny", "electric", "rusty"]

const namesPool2 = ["theo", "pete", "willy", "patrick", "john", "tom", "gerard", "michael", "ryan", "jim"]

const descriptionPool1 = ["goes fast", "is undestructible", "loves to help", "lights up", "shines", "crushes you", "goes totally crazy", "makes you laugh", "convenient to charge your phone", "goes slow"]

const descriptionPool2 = ["and", "or", "but"]

const descriptionPool3 = ["needs lots of fuel", "is super heavy", "doesnt know how to make jokes", "can dance very well", "will repair your car", "breaks lots of things", "only eats hot dogs", "knows a lot of silly jokes", "can light up your christmas tree", "is very very, very... very old"]

/* Les routes CRUD */

router.post('/addrobot', function(req, res, next) {
  Robot.find().then((robots) => {
    if(robots.length >= 10) {

      res.json(500, { result: false, message: "impossible d'ajouter un robot, trop de robots dans le hangar" });

    } else {

      const generatedName = `${namesPool1[getRandomNumber(namesPool1.length)]} ${namesPool2[getRandomNumber(namesPool2.length)]}`
  
      const generatedDescription = `${descriptionPool1[getRandomNumber(descriptionPool1.length)]} ${descriptionPool2[getRandomNumber(descriptionPool2.length)]} ${descriptionPool3[getRandomNumber(descriptionPool3.length)]}`
      
      const newRobot = new Robot({
        name: generatedName,
        description: generatedDescription,
        batteryLevel: getRandomNumber(101),
      });
    
      newRobot.save().then((robot) => {
        res.json({ result: true, message: "robot crée avec succès", robot });
      }).catch(error =>  {
        res.json({ result: false, message: "erreur lors de la création du robot", error });
      });
    }
  })
});

router.get('/getrobots', function(req, res, next) {
  Robot.find().then((robots) => {
    res.json({result: true, robots})
  }).catch(error => {
    res.json(500, { result: false, message: "erreur lors de la récupération des robots", error });
  })
});

router.get('/getrobot/:robotid', function(req, res, next) {
  Robot.findById(req.params.robotid).then((robot) => {
    res.json({result: true, robot})
  }).catch(error => {
    res.json(500, { result: false, message: "erreur lors de la récupération du robot", error });
  })
});

router.put('/chargerobot/:robotid', function(req, res, next) {
  Robot.updateOne({_id: req.params.robotid }, { batteryLevel: 100 }).then(() => {
    res.json({ result: true, message: "robot rechargé" });
  }).catch(error => {
    res.json(500, { result: false, message: "erreur lors de la tentative de recharge du robot", error });
  })
});

router.delete('/deleterobot/:robotid', function(req, res, next) {
  Robot.deleteOne({_id: req.params.robotid}).then(() => {
    res.json({ result: true, message: "robot supprimé" });
  }).catch(error => {
    res.json(500, { result: false, message: "erreur lors de la tentative de suppression du robot", error });
  })
});

module.exports = router;
