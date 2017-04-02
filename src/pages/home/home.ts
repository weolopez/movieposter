import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MenuPage } from '../menu/menu';
import { ApiaiService } from '../../app/services/apiai.service';
import { BluemixService } from '../../app/services/bluemix.service';
import { MovieService } from '../../app/services/movie.service';
import { ShowTimesPage } from '../showtimes/showtimes';
import { ImdbPage } from '../imdb/imdb';
import { RatingsPage } from '../ratings/ratings';
import { TicketsPage } from '../tickets/tickets';
import { TrailerPage } from '../trailer/trailer';
import { ActorsPage } from '../actors/actors';

import { NavController, ModalController, Modal, Platform, ViewController, Gesture } from 'ionic-angular';
declare var webkitSpeechRecognition: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private modal: Modal;
  private modalShowing: Boolean;
  private unregisterKeyboardListener;
  private recognition: any;
  private intents: any;

  public selectedMovie;

  constructor(
              public navCtrl: NavController, 
              public modalCtrl: ModalController, 
              public platform: Platform, 
              public viewCtrl: ViewController, 
              private apiaiService:ApiaiService, 
              private bluemixService:BluemixService, 
              private cdRef:ChangeDetectorRef, 
              private movieService: MovieService
              ) {
      this.intents = new Map();
      
  }

   ngOnInit() {
      console.log("OnInit Ran...");
      this.loadIntents();
      this.selectedMovie = this.movieService.getSelectedMovie();
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  presentModal() {
    if (!this.modalShowing) {
      this.modal = this.modalCtrl.create(MenuPage, {}, {showBackdrop: false});
      this.modal.onDidDismiss(() => this.modalShowing = false)
      this.modal.present();
      this.modalShowing = true;
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
         if (page) {
            this.navCtrl.push(page, {}, {animation: "md-transition"});
         }
         this.modal.dismiss();
      });
      this.bluemixService.send('../../assets/images/lego_batman.jpg').subscribe(response => {
         console.log(response);
      });
  }

  activate(e, type) {
    alert(type+e.direction);
    console.log(type);
    console.dir(e);
    e.key="ArrowUp";
    this.handleKeyboardEvents(e);
  }
  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowUp":
        this.presentModal();
        this.startRecognition();
        break;

      case "Escape":
        this.navCtrl.pop({animation: "md-transition"});
        break;

      default:
        break;
    }
  }

  loadIntents() {
    this.intents.set('show-schedule', ShowTimesPage);
    this.intents.set('show-tickets', TicketsPage);
    this.intents.set('show-imdb', ImdbPage);
    this.intents.set('show-trailer', TrailerPage);
    this.intents.set('show-review', RatingsPage);
    this.intents.set('show-actors', ActorsPage);
    this.intents.set('input.unknown', TrailerPage);
  }

}
