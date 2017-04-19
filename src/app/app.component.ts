import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { ApiaiService } from './services/apiai.service';
import { BluemixService } from './services/bluemix.service';
import { AnalyticsService } from './services/analytics.service';
import { PosterService } from "./services/poster.service";
import { FacesService } from "./services/faces.service";



@Component({
  templateUrl: 'app.html',
  providers: [ApiaiService, BluemixService, AnalyticsService, FacesService]
})

export class MyApp {
  rootPage: any = HomePage;
  isMenuActive = false;

  private unregisterKeyboardListener;

  constructor(private platform: Platform,
    public events: Events,
    statusBar: StatusBar,
    splashScreen: SplashScreen
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
    });
  }

  ionViewDidEnter() {
  }

  ionViewDidLeave() {
  }

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowUp":
    console.log('ArrowUp!!!!');
        if (!this.isMenuActive) {
          this.isMenuActive = true;
          this.events.publish('menu:activate');
        }
        else {
          this.isMenuActive = false;
          this.events.publish('menu:select');
        }
        break;

      case "ArrowDown":
        this.isMenuActive = false;
        this.events.publish('menu:escape');
        this.events.publish('menu:dismiss');
        break;

      case "Escape":
        this.isMenuActive = false;
        this.events.publish('menu:escape');
        break;

      case " ":
        this.isMenuActive = false;
        this.events.publish('menu:help');
        break;

      default:
        break;
    }
  }

  startListeningToKeyboard() {
    this.stopListeningToKeyboard();
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
    //this.slides.enableKeyboardControl(true);
  }

  stopListeningToKeyboard() {
    if (this.unregisterKeyboardListener) {
      this.unregisterKeyboardListener();
    }
    //this.slides.enableKeyboardControl(false);
  }
}
