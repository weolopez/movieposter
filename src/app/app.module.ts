import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { ShowTimesPage } from '../pages/showtimes/showtimes';
import { ImdbPage } from '../pages/imdb/imdb';
import { RatingsPage } from '../pages/ratings/ratings';
import { TicketsPage } from '../pages/tickets/tickets';
import { TrailerPage } from '../pages/trailer/trailer';
import { ActorsPage } from '../pages/actors/actors';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    ShowTimesPage,
    ImdbPage,
    RatingsPage,
    TicketsPage,
    TrailerPage, 
    ActorsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    ShowTimesPage,
    ImdbPage,
    RatingsPage,
    TicketsPage,
    TrailerPage, 
    ActorsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
