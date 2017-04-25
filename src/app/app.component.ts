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
import { WebSocketService } from "./services/websocket.service";
import { Subject } from "rxjs/Subject";


const CHAT_URL = 'ws://localhost:3005';
const DATA_URL = 'ws://localhost:3006';

export interface Message {
  author: string,
  message: string,
  newDate?: string
}

@Component({
  templateUrl: 'app.html',
  providers: [ApiaiService, BluemixService, AnalyticsService, FacesService]
})

export class MyApp {
  public messages: Subject<Message> = new Subject<Message>();
  rootPage: any = HomePage;
  isMenuActive = false;

  private unregisterKeyboardListener;

  constructor(private platform: Platform,
    public events: Events,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private wsService: WebSocketService) {

    // 1. subscribe to chatbox
    this.messages = <Subject<Message>>this.wsService
      .connect(CHAT_URL)
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          author: data.author,
          message: data.message,
          newDate: data.newDate
        }
      });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
      this.messages.subscribe(msg => {
        console.log(msg);

        if (msg.message === 'UP') {
          if (!this.isMenuActive) {
            this.isMenuActive = true;
            this.events.publish('menu:activate');
          }
          else {
            this.isMenuActive = false;
            this.events.publish('menu:select');
          }
        }
        if (msg.message === 'DOWN') {
            this.isMenuActive = false;
            this.events.publish('menu:escape');
            this.events.publish('menu:dismiss');
        }
        if (msg.message === 'ESCAPE') {
            this.isMenuActive = false;
            this.events.publish('menu:escape');
        }
        if (msg.message === 'SPACE') {
          this.isMenuActive = false;
          this.events.publish('menu:help');
        }
        if (msg.message === 'RIGHT') this.events.publish('menu:right');
        if (msg.message === 'LEFT') this.events.publish('menu:left');
      })
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
