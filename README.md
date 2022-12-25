# shopping-site-API
An API for an e-commerce website.

- Clone the repo.
- input environment variables for `MONGO_URI`, `PORT`, `JWT_SECRET`, `REFRESH_TOKEN`.
- enter `npm run devStart` in terminal to start up the development server.

## Technology
- This API is created using the Node JS backend language and Express JS framework.
- It uses a MongoDB database.
- Multer npm package is used in uploading image files to the server.

## Functionality
- This API is able to authenticate and authorize an admin and users.
### Users are able to:
- Sign up or create accounts then sign in.
- Get list of available products for sale and their details.
- Search for a particular product by name.
- Place orders and make online payments to purchase products.
- Comment on and like products.
### Admin is able to:
- Update profile
- Upload or create new products and details.
- Update or edit existing product details.
- Delete products.
