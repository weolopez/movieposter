import { Http } from '@angular/http';
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



const CHAT_URL = //'ws://localhost:3005';
  'wss://run-scrum2aic-flow.att.io/adb7ef18de59d/8e1d949bbb52/142dfa143104e3d/in/flow/ws/sensor';
  //'wss://runm-central.att.io/6bf1777bccc5b/9935c8fe67e8/b460bdada1e22e9/in/flow/ws/sensor';
const DATA_URL = 'ws://localhost:3006';

export interface Message {
  data: string;
  value?: number,
  message?: string,
  author?: string,
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
  deviceID = '123';
  private unregisterKeyboardListener;
  private lastMessage = 0.0;

  constructor(private platform: Platform,
    private http: Http,
    public events: Events,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    private wsService: WebSocketService) {

    var query = window.location.search.substring(1);
    let id = this.parse_query_string(query)['deviceid'];
    if (id) this.deviceID=id;


    this.messages = <Subject<Message>>this.wsService.connect(CHAT_URL)
    /*
      .map((response: MessageEvent): Message => {
        let data = JSON.parse(response.data);
        return {
          author: data.author,
          message: data.message,
          newDate: data.newDate
        }
      });
*/
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});

      setTimeout(this.getData(), 1000);
    });
  }

  private serverURL = 'http://zltv2050.vci.att.com:8080/api/clients/bravehackers/3203/10/5650';
  getData() {
    /**
     * hhtp implementation
      this.http.get(this.serverURL)
     */
    /*  .map(resp => {
      let data = resp.json().content;
      return {
        id: data.id,
        value: data.value,
        message: 'UP'
      }})
      */
      //this.http.post()
    this.messages
      .subscribe(data => {
        let msg = JSON.parse(data.data);
        /*
        let mod = msg.value % 1;
        if (mod != this.lastMessage) {
              console.log("New Message: "+mod);
              this.lastMessage = mod;
        }
        else {
          console.log("Mod: "+mod);
          console.log("lastmessage: "+this.lastMessage);
       //   setTimeout( this.getData(), 1000);
          return;
        }
      */
        if (Math.floor(msg.value)==1) msg['message'] = 'LEFT';
        if (Math.floor(msg.value)==2) msg['message'] = 'RIGHT';
        if (Math.floor(msg.value)==3) msg['message'] = 'UP';
        if (Math.floor(msg.value)==4) msg['message'] = 'DOWN';

        if (msg.id !== this.deviceID) return;
        console.log('Direction: ' + msg.message);

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

        //     setTimeout( this.getData(), 1000);
      })

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
  parse_query_string(query) {
    var vars = query.split("&");
    var query_string = {};
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = decodeURIComponent(pair[1]);
        // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
        query_string[pair[0]] = arr;
        // If third or later entry with this name
      } else {
        query_string[pair[0]].push(decodeURIComponent(pair[1]));
      }
    }
    return query_string;
  }
}
