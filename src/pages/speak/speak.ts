import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import { ApiaiService } from '../../app/services/apiai.service';
import { AnalyticsService } from "../../app/services/analytics.service";
import { ShowTimesPage } from '../showtimes/showtimes';
import { ImdbPage } from '../imdb/imdb';
import { RatingsPage } from '../ratings/ratings';
import { TicketsPage } from '../tickets/tickets';
import { TrailerPage } from '../trailer/trailer';
import { ActorsPage } from '../actors/actors';

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'page-speak',
  templateUrl: 'speak.html'
})

export class SpeakPage {
  private unregisterKeyboardListener;

  private recognition: any;
  private intents: any;
  public listeningText: string;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public apiaiService: ApiaiService,
    public analytics: AnalyticsService
  )
  {
    this.intents = new Map();
  }

  ngOnInit() {
    this.loadIntents();
  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
    this.initializeListeningText();
    this.startRecognition();
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowDown":
        this.navCtrl.pop({animation: "md-transition"});
        break;

      default:
        break;
    }
  }

  startRecognition() {
    this.platform.ready().then(() => {

      this.recognition = new webkitSpeechRecognition();
      //this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.onnomatch = (event => {
        //this.showAlert('No match found.');
      });
      this.recognition.onerror = (event => {
        //this.showAlert('Error happens.');
      });
      this.recognition.onresult = (event => {
        if (event.results.length > 0) {
          console.log('Output STT: ', event.results[0][0].transcript);
          this.ask(event.results[0][0].transcript);
        }
        this.stopRecognition();
      });
      this.recognition.start();
    });
  }

  stopRecognition() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
  }

  ask(text: any) {
     this.apiaiService.send(text).subscribe(response => {
         console.log(response);
         let page = this.intents.get(response.result.action);
         this.analytics.addSpeech(text, response.result.action );
         if (page) {
            this.listeningText = response.result.speech;
            setTimeout(() => {
              this.navCtrl.push(page, {}, {animation: "md-transition"}).then((res)=>this.initializeListeningText());
            }, 1000);
         }
     });
  }

  initializeListeningText() {
    this.listeningText = "Listening...";
  }
  loadIntents() {
    this.intents.set('show-schedule', ShowTimesPage);
    this.intents.set('show-tickets', TicketsPage);
    this.intents.set('show-imdb', ImdbPage);
    this.intents.set('show-trailer', TrailerPage);
    this.intents.set('show-review', RatingsPage);
    this.intents.set('show-actors', ActorsPage);
    this.intents.set('input.unknown', TrailerPage);
    this.intents.set('smalltalk.greetings', RatingsPage);

  }

}
