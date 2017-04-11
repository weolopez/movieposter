import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { DatePipe } from '@angular/common';

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
import { InstructionsPage } from '../pages/instructions/instructions';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MovieService } from './services/movie.service';

import { AngularFireModule } from 'angularfire2';
import { PosterService } from "./services/poster.service";
import { ApiaiService } from './services/apiai.service';
import { BluemixService } from './services/bluemix.service';
import { AnalyticsService } from './services/analytics.service';
import { FacesService } from "./services/faces.service";
import { M2XService } from "./services/m2x.service";

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
    SpeakPage,
    InstructionsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
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
    SpeakPage,
    InstructionsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    M2XService,
    PosterService,
    MovieService,
    ApiaiService,
    BluemixService,
    AnalyticsService,
    FacesService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
