# Services Web avec Node.js

Ce cours est prévu pour être donné sur une journée.

- JavaScript (en fonction de ce qu'ils connaissent déjà) : closures, protoypes, this, JSON, programmation fonctionnelle, pièges du langage, nouveautés
- Node.js : motivation, architecture, fonctionnement, npm, trouver la documentation, les outils et librairies
- Programmation asynchrone à base de callback, à base de promesses, et à base de générateurs
- API HTTP : concepts, avantages, méthodes, status codes, headers
- Clients et serveurs HTTP avec Node.js

# Travaux pratiques

Les TP ont pour sujet le développement d'une application de gestion de contacts. Pour une question de simplicité, un contact est défini comme un nom, un prénom, et un identifiant.

Nous allons commencer par programmer une application en ligne de commande capable de lister les contacts enregistrés dans un fichier, puis d'ajouter et supprimer des contacts en repercutant les changements sur le fichier.

Nous coderons ensuite un serveur HTTP exposant une API pour ces mêmes actions. La gestion des contacts devient alors possible depuis n'importe quel client HTTP, comme un navigateur. Nous ajouterons un tel client à notre projet.

Pour chaque TP, le formateur fourni une suite de test vous permettant d'évaluer votre code de manière autonome. Pour qu'un TP puisse être considéré comme terminé, il faut que tous les tests de ce TP *et des TP précédents* soient au vert.

## Pré-requis : installation de Node.js

Les TP requiert l'installation de **Node.js 5** ou supérieur.

Plusieurs possibilités pour l'installation :
- Installateurs pour Windows 32/64 bits et Mac fourni par le formateur
- Distribution binaire générique pour Linux 32/64 bits fourni par le formateur
- Site de Node.js : nodejs.org
- Distributions binaires pour divers Linux : https://github.com/nodesource/distributions
- Image Docker officielle : https://hub.docker.com/_/node/

## Environnement de travail

Vous pouvez utiliser votre environnement de développement JavaScript préféré. Si vous n'en avez pas, je vous conseille Visual Studio Code, qui est gratuit, open-source, et qui dispose d'un débogueur Node.js intégré. Je vous conseille d'y ajouter l'extension ESLint pour une meilleure détection des erreurs de code. Pour installer cette extension, allez dans l'onglet des extensions (5e dans le panneau de gauche), cherchez `eslint` puis installez l'extension. Cliquez `Reload` à la fin de l'installation. Je recommande par ailleurs de configurer cette extension pour corriger automatiquement les erreurs de style. Pour cela, dirigez-vous vers `File > Preferences > Settings` et ajoutez (soit dans user settings soit dans les workspace settings) l'option `"eslint.autoFixOnSave": true`.

Une configuration pour le débogueur VS Code est fourni. Pour l'utiliser, allez dans l'onglet débogueur (4e dans le panneau de gauche), puis déroulez la liste à côté du bouton lecture. Vous aurez accès à quelques commandes qui lancent votre application en mode debug avec différents paramètres.

## Squelette fourni

Le formateur fourni un squelette pour commencer. Ce squelette comprend :
- un fichier `contacts.json` qui contient 8 contacts
- un fichier `app.js` vide ou presque, dans lequel vous coderez votre application (il bien évidemment autorisé de créer d'autres fichiers, mais le fichier main est forcément `app.js`)
- des fichiers `package.json` et `.npmrc` qui contiennent de la configuration et n'ont pas vocation à être modifiés dans le cadre des TP (vous êtes néanmoins encouragés à regarder leur contenu)
- un dossier `tests` qui contient les tests validant votre code pour chaque TP
- éventuellement un dossier `node_modules` qui contient des librairies ; **si ce dossier n'est pas présent, il faut exécuter `npm install` dans le dossier qui contient le `package.json`**

## Commandes

- Exécuter votre application : `npm start` suivi des paramètres
- Exécuter la vérification syntaxique et tous les tests : `npm test`
- Exécuter tous les tests : `npm run tests`
- Exécuter les tests du TP `n` : `npm run stepn`
- Exécuter tous les tests jusqu'au TP `n` inclus : `npm run upton`

Si une de ces commandes quitte avant de logguer quoi que ce soit, il s'agit sûrement d'une erreur silencieuse. Relancer la commande en ajoutant l'option `-q` juste après `npm`. Vous devriez alors avoir plus d'informations pour déterminer la source du problème.

## Premier test

Avant de commencer, exécuter la commande `npm run step0`. Vous devez vous apparaitre un résultat de test positif. Signalez le cas inverse au formateur.

## TP1

Objectif : afficher sur la sortie standard les contacts contenus dans `contacts.json`.

Le format est : un contact par ligne, le nom de famille en majuscules d'abord, suivi d'un espace, suivi du prénom. Votre application ne peut pas utiliser la sortie standard pour afficher autre chose. Vous pouvez par contre utiliser la sortie d'erreur avec `console.error`.

`npm run upto1` pour valider.

Documentation de Node.js : https://nodejs.org/api/

## TP2

Objectif : utiliser la librairie commander.js pour ajouter une interface en ligne de commande plus conviviale.

Ajoutez une commande `list`. Cette commande sera celle qui affichera votre liste du TP1. C'est-à-dire que pour afficher la liste, il faut lancer l'application comme ceci : `npm start list`. Faites en sorte que si aucune commande n'est spécifiée (simplement `npm start`), alors c'est l'aide auto-générée par commander.js qui s'affiche.

`npm run upto2` pour valider.

Documentation de commander.js : https://www.npmjs.com/package/commander

⚠ Les méthodes `commander.command(command, description)` et `commander.command(command).description(description)` ne font pas la même chose. C'est la seconde qu'il faut utiliser.

## TP3

Objectif : ajouter les commandes d'ajout et de suppression de contacts, avec persistence de ces actions entre chaque exécution.

Toujours en utilisant commander.js, ajoutez les commandes `add <firstName> <lastName>` puis `remove <id>`. Ces deux commandes doivent sauvegarder les modifications apportées à la liste des contacts dans le fichier `contacts.json`. Dans le cas de l'ajout, utilisez le module `shortid` pour générer des nouveaux identifiants.

`npm run upto3` pour valider.

Documentation de shortid : https://www.npmjs.com/package/shortid

## TP4

Objectif : coder un serveur avec une API HTTP qui expose les fonctionnalités de gestion des contacts.

Ajoutez une commande `serve` qui démarre le serveur. Utilisez ensuite Express pour mettre en place les routes suivantes :
- GET `/health` : ne retourne rien mais confirme que le serveur fonctionne en répondant 204 No Content
- GET `/contacts` : retourne la liste des contacts au format JSON
- POST `/contacts` : à partir de l'objet posté qui contient un prénom et un nom, crée un nouveau contact avec une id générée puis le sauvegarde et répond 201 Created (exemple d'objet accepté : `{"firstName": "Clark", "lastName": "Kent"}`) ; le test vous demande aussi de répondre l'URL du nouveau contact (sous la forme `/contact/id`) à la fois dans le header `Location` et le body
- GET `/contacts/:id` : retourne le contact d'id spécifiée ; si l'id n'existe pas, répond 404
- DELETE `/contacts/:id` : supprime le contact d'id spécifiée, puis répond 204 No Content ; si l'id n'existe pas, répond 404

Votre serveur doit impérativement afficher son port d'écoute sur la sortie standard lorsqu'il est prêt à recevoir des connexions. Le format doit être `port: <port>`. Votre serveur peut librement utiliser la sortie standard pour d'autres informations.

Le serveur étant une application persistante, il peut garder les contacts en mémoire sans les sauvegarder dans le fichier. A vous de choisir ce que vous désirez faire. Si vous avez de l'avance, faites les 2 et permettez le choix au moment du démarrage. Par exemple : `npm start -- serve --memory` (noter les deux tirets supplémentaire, qui permettent à `npm` de distinguer les options de l'application de ces propres options).

`npm run upto4` pour valider.

Documentation d'Express : http://expressjs.com/

Astuce : pour supporter facilement les requêtes/réponses au format JSON, utilisez le module `body-parser` et [sa méthode `.json()`](https://www.npmjs.com/package/body-parser#bodyparserjsonoptions) comme [ceci](https://www.npmjs.com/package/body-parser#expressconnect-top-level-generic).

## TP5

Objectif : coder un client HTTP qui communique avec le serveur.

Modifiez votre application pour qu'au lieu de répercuter les modifications directement sur le fichier JSON, elle fasse des appels au serveur codé précedemment. Pour cela il vous faudra lancer 2 instances de l'application : une pour le serveur (`npm start serve`), et une pour le client (`npm start add/remove/list`). Vous pouvez utiliser une option `--http` pour activer ce comportement.

`npm run upto5` pour valider (ne valide que le `add` et le `remove`).

Documentation de request : https://www.npmjs.com/package/request

## TP6

Objectif : ajouter la fonctionnalité de mise à jour d'un contact en s'appuyant sur le code existant

Modifiez votre application pour qu'elle supporte une commande `update <id> <firstName> <lastName>` qui met à jour les données du contact d'id spécifiée. Si le contact n'existe pas, l'application doit quitter sans erreur. Essayez de ré-utiliser (sans copier-coller !) le code de `add` et `remove` pour coder `update`.

`npm run upto6` pour valider. ⚠ Le test active l'option `--memory` introduite au TP4, si elle est présente.

## TP7 (bonus)

Objectif : créer une page web pour gérer les contacts via le serveur.

Pré-requis : expérience en JavaScript côté navigateur (manipulation du DOM, requête HTTP).

Note : pas de tests de validation pour ce TP.

Astuce : vous pouvez utiliser le module [serve-static](https://www.npmjs.com/package/serve-static) comme [ceci](https://www.npmjs.com/package/serve-static#simple) pour que votre serveur Node.js héberge votre page web.
