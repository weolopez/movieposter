import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';

import { MoviesPage } from '../pages/movies/movies';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { ShowTimesPage } from '../pages/showtimes/showtimes';
import { ImdbPage } from '../pages/imdb/imdb';
import { RatingsPage } from '../pages/ratings/ratings';
import { TicketsPage } from '../pages/tickets/tickets';
import { TrailerPage } from '../pages/trailer/trailer';
import { ActorsPage } from '../pages/actors/actors';
import { SpeakPage } from '../pages/speak/speak';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MovieService } from './services/movie.service';

import { AngularFireModule } from 'angularfire2';
import { M2EService } from "./services/m2e.service";
import { PosterService } from "./services/poster.service";
import { ApiaiService } from './services/apiai.service';
import { BluemixService } from './services/bluemix.service';
import { AnalyticsService } from './services/analytics.service';

export const firebaseConfig = {
    apiKey: "AIzaSyDQ1wWxzlqkGMuB6bL4bQmeyVH7-OfDgzM",
    authDomain: "bravehackers17.firebaseapp.com",
    databaseURL: "https://bravehackers17.firebaseio.com",
    storageBucket: "bravehackers17.appspot.com",
    messagingSenderId: "236868911507"
};

@NgModule({
  declarations: [
    MyApp,
    MoviesPage,
    HomePage,
    MenuPage,
    ShowTimesPage,
    ImdbPage,
    RatingsPage,
    TicketsPage,
    TrailerPage,
    ActorsPage,
    SpeakPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig)

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MoviesPage,
    HomePage,
    MenuPage,
    ShowTimesPage,
    ImdbPage,
    RatingsPage,
    TicketsPage,
    TrailerPage,
    ActorsPage,
    SpeakPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Storage,
    M2EService,
    PosterService,
    MovieService,
    ApiaiService,
    BluemixService,
    AnalyticsService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
