import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { MoviesPage } from '../pages/movies/movies';

import { ApiaiService } from './services/apiai.service';
import { BluemixService } from './services/bluemix.service';
import { MovieService } from './services/movie.service';



@Component({
  templateUrl: 'app.html',
  providers: [ApiaiService, BluemixService, MovieService]
})

export class MyApp {
  rootPage:any = MoviesPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
