## WordCamp APP for atendees

This is an APP made for WordCamp Belo Horizonte (Brazil), translation-ready, and easy to configure, that can be used by any other WordCamp that wishes to.

This App fetches info from WP-API from http://WCAMPNAME.wordcamp.org/wp-json/

It uses Ionic Framework as Hybrid mobile App Framework.

The translation and localization is performed with Angular Gettext, and is easy as WordPress' .po and .mo files.

----

### How to use it

- Clone this repo

- Change the info in Config.XML

- Make sure you have [NodeJS](http://nodejs.org) installed

- Open terminal and run `npm install -g ionic bower grunt-cli gulp`
That will install Ionic, Bower and Gulp globally. The first is the cli tools from the Ionic Framework. Bower is a dependency manager, and the other two are basically task Runners.

- Still in terminal, run `npm install`.
This will install the project dependencies

- Finally, run `ionic serve`.
This should open the liveReload server.


### Resources

You can find much usefull info for developping at [www.ionicframework.com](www.ionicframework.com)
