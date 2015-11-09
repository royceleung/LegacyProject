# Sport Locator

REPL Team Legacy Project

Project Lead: Royce Leung  
Scrum Master: Cyrus Gomez  
Developers: Jordan Winkelman, Stephen Donahue, Jia Li

## Summary

Sport Locator is a quick, easy way to find sports sites near you. After automatically locating your position or entering a custom address in the auto-fill search box, you can select from a variety of sports and view the sites closest to you. Click each site or marker to view more information about the site, and checkin to the site as well. Login via Facebook to write reviews, create events and invite your friends to play. And the site is fully functional on mobile as well!


## Local Deployment
Checkout project from github: https://github.com/Envisioners/LegacyProject

Build site locally:

* npm install
* bower install
* grunt build
* grunt shell [opens app in chrome, and watches for updated files]

## Setup Google Maps and Facebook APIs
In [google developers console](https://console.developers.google.com), under **API and auth**, select **Credentials**. In the list of apps, select the app name. Under **Accept requests from these HTTP referrers**, add your development URI (http://localhost:8000) and deployment URI.

In [https://developers.facebook.com](facebook developers dashboard), under **My Apps**, select the app name. Under **Basic**, the App Id and App Secret must match what's in router.js. Next, click **Settings** and then **Advanced**. Under **Valid OAuth redirect URIs**, add your development and deployment URIs.

## Future Features
* A calendar to store future checkins for each site, allowing for scheduling of future meetups.
* More site info, including photos. This could be displayed within the same view, or in a different view.
* User profile pages, with additional user information including favorite sites, sports, and friends.
* Social features and integration, using Facebook and Twitter to enable more social interaction. This could also include chat functionality or a forum for each site/sport.
* Twilio integration for alerts / notifications about upcoming checkins and social features.
* Mobile-specific site design.
