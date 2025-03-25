# monday.com Item Creator Form

This is a simple form app to create new items on a monday.com board using GraphQL.

## Instructions

1. Host this app using Netlify (or any static site host).
2. Embed the hosted URL into Power BI using an iframe visual.
3. In the Power BI parent container, add postMessage listeners to securely forward the GraphQL requests to monday.com.

## Security Note

The app uses `postMessage` to request the parent (Power BI) to make the API call, bypassing CORS issues and avoiding storing the API key in the frontend.
