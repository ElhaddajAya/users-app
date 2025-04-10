# Gestion des Utilisateurs - Aya EL HADDAJ

Ce projet est une application de gestion des utilisateurs construite avec React pour le frontend et Express avec MongoDB pour le backend. Le projet inclut également la dockerisation, les tests avec Mocha, et l'intégration continue via GitHub Actions.

## Structure du Projet

```
/backend
|-- app.js (Backend server)
|-- Dockerfile (Docker configuration for backend)
|-- models/User.js (User model)
|-- tests/ (Mocha tests)
|-- package.json
|-- package-lock.json

/frontend
|-- App.js (React frontend)
|-- Dockerfile (Docker configuration for frontend)
|-- package.json
|-- package-lock.json

/docker-compose.yml (Docker Compose configuration to run backend and frontend)
/ci.yml (GitHub Actions CI configuration)
```

## Prérequis

- Node.js
- npm ou yarn
- Docker et Docker Compose (si vous souhaitez utiliser la version dockerisée)

## Installation

### Backend

1. Naviguez vers le répertoire backend :
```sh
cd backend
```

2. Installez les dépendances :
```sh
npm install
```

3. Démarrez le serveur backend (en mode développement) :
```sh
node app.js
```

Le serveur backend sera disponible sur http://localhost:5002.

### Frontend

1. Naviguez vers le répertoire frontend :
```sh
cd frontend
```

2. Installez les dépendances :
```sh
npm install
```

3. Démarrez l'application React (en mode développement) :
```sh
npm start
```

L'application sera disponible sur http://localhost:3000.

## Dockerisation du Projet

### Docker Compose

Le projet est configuré pour être exécuté avec Docker Compose, ce qui permet de lancer les services backend, frontend, et MongoDB dans des conteneurs distincts.

1. Assurez-vous que Docker et Docker Compose sont installés sur votre machine.

2. Exécutez la commande suivante pour démarrer tous les services dans des conteneurs Docker :
```sh
docker-compose up -d
```

Cela lancera les services backend, frontend, et MongoDB dans des conteneurs Docker. Vous pouvez accéder à l'application frontend sur http://localhost:3000 et au backend sur http://localhost:5002.

### Dockerfiles

- **Backend** : Utilise une image officielle Node.js (node:18-alpine) pour exécuter l'application Express.
- **Frontend** : Utilise également une image officielle Node.js pour exécuter l'application React.

### docker-compose.yml

Voici la configuration Docker Compose utilisée pour démarrer les services backend, frontend et MongoDB :

```yml
services:
  mongodb:
    image: mongo:6.0
    container_name: mongodb
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    restart: always
  
  backend:
    build: ./backend
    container_name: backend
    ports:
      - "${BACKEND_PORT}:5002"
    env_file:
      - .env
    depends_on:
      - mongodb
  
  frontend:
    build: ./frontend
    container_name: frontend
    ports:
      - "${FRONTEND_PORT}:3000"
    env_file:
      - .env
    depends_on:
      - backend
    stdin_open: true
    tty: true

volumes:
  mongodb_data:
```

## Tests avec Mocha

Les tests sont écrits avec Mocha et Chai. Ils sont utilisés pour tester les routes du backend, telles que l'ajout et la récupération d'utilisateurs.

1. Pour lancer les tests localement, naviguez dans le répertoire backend et exécutez la commande suivante :
```sh
npm test
```

2. Vous pouvez également tester les API via des outils comme Postman ou en exécutant directement les tests.

Les tests incluent des vérifications pour la création, la lecture et la suppression d'utilisateurs dans la base de données MongoDB.

## Intégration Continue avec GitHub Actions

Le fichier ci.yml est configuré pour exécuter les tests backend via GitHub Actions à chaque push ou pull request sur la branche master.

### GitHub Actions - CI Workflow

Voici la configuration de GitHub Actions pour exécuter les tests backend :

```yml
name: CI - Backend Tests

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - name: 📥 Checkout du code
        uses: actions/checkout@v3
      
      - name: 🔧 Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      
      - name: 📦 Installer les dépendances backend
        working-directory: ./backend
        run: npm install
      
      - name: 🧪 Lancer les tests backend
        working-directory: ./backend
        run: npm test
```

## Erreurs connues

L'intégration continue a échoué, malgré plusieurs essaies, dans certains cas à cause d'une erreur de permission avec les tests Mocha. Veuillez consulter les captures d'écran dans le répertoire backend/Screenshots pour plus de détails.

## Fonctionnalités

- Afficher la liste des utilisateurs
- Ajouter un nouvel utilisateur
- Mettre à jour un utilisateur existant
- Supprimer un utilisateur

## Captures d'écran

Les captures d'écran des tests, execution et interface utilisateur sont disponibles dans le répertoire backend/Screenshots.
