#Greenfield

Unbalanced ()) team greenfield project

Project Lead: Ryan James  
Scrum Master: Aaron Spafford  
Developers: Kevin Aujla, Renan Deswarte, Alex Kim

##Local Deployment
Checkout project from github: https://github.com/unbalancedparens/greenfield

Build site locally:

* npm install
* bower install
* grunt build

##Setup Google Maps and Facebook APIs
In [google developers console](https://console.developers.google.com), under **API and auth**, select **Credentials**. In the list of apps, select the app name. Under **Accept requests from these HTTP referrers**, add your development URI (http://localhost:8000) and deployment URI.

In [https://developers.facebook.com](facebook developers dashboard), under **My Apps**, select the app name. Under **Basic**, the App Id and App Secret must match what's in router.js. Next, click **Settings** and then **Advanced**. Under **Valid OAuth redirect URIs**, add your development and deployment URIs.

##Deploymet to Digital Ocean
* On digital ocean, create doplet using Dokku image (Dokku v0.4.3 on 14.04). 
* SSH into d.o. server to create dokku app `dokku apps:create greenfield`. 
* In local repo add a remote that points to this app `git remote add dokku dokku@104.236.108.223:greenfield`. 
* Now from your local repo you can push a new deployment `git push dokku master`. Dokku should run through the build steps automatically and deploy the app:  
`=====> Application deployed:`  
`http://104.236.108.223:32780 (container)`

