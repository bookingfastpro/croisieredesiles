# Déploiement sur Coolify

Ce projet est configuré pour être déployé facilement sur **Coolify** via Docker.

## Configuration

1. **Dockerfile** : Un fichier `Dockerfile` a été ajouté à la racine. Il utilise Node.js 22 pour supporter nativement le TypeScript du serveur.
2. **Scripts** : Le script `npm start` est configuré pour lancer le serveur en mode production.
3. **Variables d'environnement** : Assurez-vous de configurer les variables suivantes dans l'interface de Coolify :
   - `NODE_ENV=production`
   - `ADMIN_PASSWORD` (votre mot de passe pour le panel admin)
   - `GEMINI_API_KEY` (si utilisé)

## Étapes de déploiement

1. Créez une nouvelle application sur **Coolify**.
2. Liez votre dépôt GitHub (ou Git).
3. Sélectionnez **Dockerfile** comme type de déploiement.
4. Coolify détectera automatiquement le `Dockerfile` à la racine.
5. Ajoutez vos variables d'environnement dans l'onglet **Variables**.
6. Cliquez sur **Deploy**.

Le site sera accessible sur le port 3000 par défaut (Coolify s'occupera du reverse proxy).

## Dépannage (Erreur 502)

Si vous obtenez une erreur **502 Bad Gateway**, cela signifie généralement que le serveur n'a pas pu démarrer ou n'écoute pas sur le bon port.

1. **Vérifiez les logs** dans Coolify pour voir s'il y a une erreur au démarrage (ex: module manquant).
2. **Port** : Assurez-vous que Coolify envoie le trafic vers le port `3000`.
3. **Santé du serveur** : Essayez d'accéder à `votre-url.com/api/health`. Si cela répond, le serveur backend fonctionne.

## Persistance des données (Volumes)

Si vous modifiez les circuits ou les bateaux via le panel admin, les changements sont enregistrés dans des fichiers JSON. Pour ne pas perdre ces données lors d'un nouveau déploiement, vous devez monter des **Volumes** dans Coolify :

1. **Données JSON** : Montez un volume sur `/app/src/data`
2. **Images (si uploadées)** : Montez un volume sur `/app/public/images/circuits`

Sans ces volumes, vos modifications seront réinitialisées à chaque redémarrage du conteneur.
