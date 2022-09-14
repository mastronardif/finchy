# Notes
# To Run the Development Backend Server

We can start the sample application backend with the following command:

    npm run server

This is a small Node REST API server.

# To run the Development UI Server

To run the frontend part of our code, we will use the Angular CLI:

    npm start 

The application is visible at port 4200: [http://localhost:4200](http://localhost:4200)



# SdkDemo
This project was created to demonstrate the capabilities of the Finchy Angular SDK.

## Usage
<!-- 
Before running the app, you need to import the [SDK Demo Model.xml](https://github.com/finchy-co/angular-sdk/blob/master/sdk-demo/SDK%20Demo%20Model.xml) file into your Finchy instance and build the queries needed. -->

Within the main `app.component.ts` file, there is a FinchyConfig object that is declared at the beginning. You must config it to work with your Finchy instance.
```typescript
export const MyFinchyAppConfig: FinchyConfig = {
  finchyRootUrl: 'http://qa1-app1.finchy.co',
  authority: 'http://qa1-sso.finchy.co/FinchySSO/identity',
  redirectUri: 'http://localhost:3000/',
  clientId: 'alvin-rest-sample'
};
```
`finchyRootUrl` is the URL to your own Finchy instance.
`authority` is the URL to your own IdentityServer.
`redirectUri` is the URL to your application after logging in.
`clientId` is the Id of the integrated app. You need to register your application before running it by inserting the app's info into the Integrated Apps table.

Simply run `ng serve` for a local server that'll listen on port 4200.
You may also use `ng serve --port ####` for a specific port number.

## License
This project is license under the terms of the [GNU General Public License v3.0]
