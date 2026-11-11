# Guide de soutenance – Skinora

Ce document sert à expliquer le projet à l'oral. Il reprend uniquement ce qui est dans le code.

## Phrase d'introduction

Skinora est un catalogue de produits cosmétiques. Un visiteur peut lire les produits et les catégories. Un utilisateur connecté peut ajouter un produit et supprimer seulement les siens. Le front est en React, l'API en Express, les données dans MongoDB Atlas.

## Architecture

Le dossier `server` est l'API. Le dossier `client` est l'interface.

Côté serveur, le fichier `server.js` démarre Express, autorise le front avec CORS, puis branche trois groupes de routes :

- `/api/auth` pour l'inscription et la connexion
- `/api/products` pour le catalogue
- `/api/categories` pour les catégories

Chaque groupe suit le même schéma vu en cours : la route reçoit la requête, le controller contient le `try/catch`, le modèle parle à MongoDB.

Côté client, `main.jsx` enveloppe l'application avec `Provider` (Redux) et `BrowserRouter` (pages). `App.jsx` affiche la barre de navigation et choisit la page selon l'URL.

## Les trois modèles

**User** : `name`, `email`, `password`. L'email est unique.

**Category** : `name`, `description`. Les quatre catégories du sujet sont insérées automatiquement au premier lancement si la collection est vide (`config/seedCategories.js`).

**Product** : `title`, `description`, `price`, `imageUrl` facultatif, `author`, `category`.

`author` et `category` ne stockent pas tout l'objet. Ils stockent un `ObjectId` :

- plusieurs produits peuvent avoir le même auteur : relation **One-to-Many** de User vers Product
- plusieurs produits peuvent avoir la même catégorie : relation **One-to-Many** de Category vers Product

`ref: 'User'` et `ref: 'Category'` disent à Mongoose vers quelle collection pointer.

## populate

Sans `populate`, MongoDB renvoie seulement les identifiants. Avec :

```js
Product.find().populate('author', 'name email').populate('category', 'name description')
```

Mongoose va chercher l'utilisateur et la catégorie, puis les place dans la réponse. Le front affiche donc `product.author.name` et `product.category.name`. On ne demande pas le mot de passe : le deuxième argument de `populate` choisit les champs.

## bcrypt

Dans `models/User.js`, un middleware `pre('save')` s'exécute avant chaque enregistrement. Si le mot de passe a changé, `bcrypt.genSalt(10)` crée un sel et `bcrypt.hash` transforme le mot de passe. La base ne contient jamais le mot de passe en clair.

À la connexion, `bcrypt.compare` compare le mot de passe tapé avec le hash. On ne peut pas « décoder » le hash : on compare seulement.

## JWT

Après une inscription ou une connexion réussie, `jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' })` crée un token. Le token contient l'id de l'utilisateur et une signature. Sans le secret `JWT_SECRET`, on ne peut pas fabriquer un token valide.

Le front enregistre la réponse (`_id`, `name`, `email`, `token`) dans `localStorage` sous la clé `user`. Au rechargement de la page, `authSlice` relit cette clé : l'utilisateur reste connecté.

## Axios et l'intercepteur

`services/api.js` crée une instance Axios. `baseURL` vient de `VITE_API_URL`.

L'intercepteur de requête lit `localStorage`. S'il y a un token, il ajoute l'en-tête :

```text
Authorization: Bearer <token>
```

Les pages n'ont pas à répéter cet en-tête. `POST /api/products` et `DELETE /api/products/:id` partent donc déjà authentifiés.

## Middleware protect

`middleware/authMiddleware.js` est placé seulement sur l'ajout et la suppression :

```js
router.post('/', protect, createProduct);
router.delete('/:id', protect, deleteProduct);
```

`protect` lit le header, vérifie le token avec `jwt.verify`, charge l'utilisateur sans son mot de passe et le place dans `req.user`. Si le token manque ou est faux, la réponse est `401` et le controller n'est pas appelé.

La consultation (`GET`) n'utilise pas `protect` : le mode visiteur reste possible.

Dans `deleteProduct`, on compare `product.author` et `req.user._id`. Si ce n'est pas le même utilisateur, la réponse est `403`.

## Redux Toolkit

`configureStore` réunit trois reducers : `auth`, `products`, `categories`.

Chaque `createSlice` décrit l'état et les actions qui le modifient. Exemple : `authStart` met `loading` à vrai, `authSuccess` enregistre l'utilisateur, `authFail` enregistre le message d'erreur.

Les pages lisent l'état avec `useSelector` et envoient les actions avec `useDispatch`. Les appels HTTP restent dans les pages, en `async/await` et `try/catch`, comme en cours. Après la réponse, on fait un `dispatch`.

## useState et useEffect

`useState` garde les champs des formulaires. Ce sont des formulaires contrôlés : la valeur de l'input est `value={form.email}` et `onChange` met à jour le state. React est donc la source de vérité du formulaire.

`useEffect` lance le chargement quand la page s'affiche. Le tableau de dépendances contient `dispatch` et, sur la fiche produit, `id`. Quand l'id change, le produit est rechargé.

Le menu mobile utilise aussi `useState` pour ouvrir ou fermer la navigation.

## Messages

Le state Redux contient `loading`, `error` et `success`. Le composant `Message` les affiche : « Chargement... », le message renvoyé par l'API, ou le message de succès. En cas d'erreur Axios, on lit `error.response.data.message`.

## Ce qu'il ne faut pas inventer à l'oral

Il n'y a pas de panier, de paiement, de rôle administrateur, ni d'upload de fichier. L'image est une URL facultative. Si elle est vide ou cassée, la carte affiche un fond coloré.

## Questions probables

**Pourquoi séparer routes, controllers et models ?**  
La route indique l'URL et la méthode. Le controller traite la demande. Le model décrit la donnée. On retrouve plus vite le code, et chaque fichier a un seul rôle.

**Pourquoi CommonJS et pas import ?**  
Le serveur du cours utilise `require` et `module.exports`. Le client Vite, lui, utilise `import` parce que c'est le fonctionnement standard de React avec Vite.

**Où est hashé le mot de passe ?**  
Dans le modèle User, avant `save`. Le controller fait seulement `User.create`. Il n'a pas besoin d'appeler bcrypt lui-même.

**Que contient le JWT ?**  
L'id de l'utilisateur, une date d'expiration (7 jours) et une signature faite avec `JWT_SECRET`. Il ne contient pas le mot de passe.

**Pourquoi localStorage ?**  
Le state React disparaît au rafraîchissement. `localStorage` garde le token dans le navigateur. Au démarrage, le slice d'authentification le relit.

**Que se passe-t-il si je supprime le token et que j'ajoute un produit ?**  
L'intercepteur n'envoie pas d'en-tête. `protect` répond 401. Le front affiche le message d'erreur.

**Pourquoi un autre utilisateur ne peut-il pas supprimer mon produit ?**  
Le token prouve qui est connecté (`req.user`). Le controller vérifie que cet id est égal à `product.author`. Sinon il répond 403.

**À quoi sert populate ?**  
À remplacer les ObjectId par les documents liés, pour afficher le nom de l'auteur et le nom de la catégorie sans faire ces recherches dans le front.

**Pourquoi CORS ?**  
Le site tourne sur le port 5173 (ou sur Vercel) et l'API sur le port 5000 (ou sur Render). Ce sont deux origines différentes. CORS autorise seulement les adresses mises dans `CLIENT_URL`.

**Pourquoi les variables d'environnement ?**  
L'URI MongoDB et le secret JWT ne doivent pas être écrits dans Git. `.env` reste sur la machine ou dans le tableau de bord Render / Vercel. `.env.example` montre les noms des variables sans les vraies valeurs.

**Quelle est la différence entre visiteur et connecté ?**  
Le visiteur peut appeler les GET. Le connecté possède un token, donc il peut appeler les routes protégées. L'interface cache l'ajout et la suppression quand `user` est nul.

**Pourquoi Redux si useState existe déjà ?**  
`useState` convient à un formulaire local. L'utilisateur connecté est utile dans la navbar, les cartes et les pages : Redux le partage sans le passer de parent en enfant à chaque fois. Le catalogue est aussi centralisé pour afficher chargement et erreurs.

**Que se passe-t-il au premier lancement sur Atlas ?**  
`connectDB` ouvre la connexion. `seedCategories` compte les catégories. S'il n'y en a pas, il insère les quatre catégories du sujet. Si elles existent déjà, il ne les duplique pas.
