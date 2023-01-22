# shopping-site-API
An API for an e-commerce website. Complete with authentication, authorization and access control
Heres the [API Documentation](https://documenter.getpostman.com/view/21602276/2s8Z6yYZ4B)

- Clone the repo.
- input environment variables for `MONGO_URI`, `PORT`, `JWT_SECRET`, `REFRESH_TOKEN`.
- enter `npm run devStart` in the terminal to start up the development server.

## Technology
- This API is created using the Node JS language and Express JS framework.
- It uses MongoDB database.
- Payments are handled with paystack API.
 
### Users are able to:
- Sign up or create accounts then sign in.
- Get list of available products for sale and their details.
- Search for a particular product.
- Place orders and make online payments to purchase products.
- like products and add as favourite.
### Admin is able to:
- Upload or create new products and details.
- Update or edit existing product details.
- Delete products.
- Get list of purchases made by users and details.
- Get all users signed up
