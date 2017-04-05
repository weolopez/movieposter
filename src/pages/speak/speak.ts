import { Component, ChangeDetectorRef } from '@angular/core';

import { NavController, Platform, ModalController, Modal } from 'ionic-angular';
import { ApiaiService } from '../../app/services/apiai.service';
import { AnalyticsService } from "../../app/services/analytics.service";

import { ShowTimesPage } from '../../pages/showtimes/showtimes';
import { ImdbPage } from '../../pages/imdb/imdb';
import { RatingsPage } from '../../pages/ratings/ratings';
import { TicketsPage } from '../../pages/tickets/tickets';
import { TrailerPage } from '../../pages/trailer/trailer';

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'page-speak',
  templateUrl: 'speak.html'
})

export class SpeakPage {
  private unregisterKeyboardListener;
  private modal: Modal;
  private modalShowing: Boolean;
  private menuItems;

  private recognition: any;
  private intents: any;
  public listeningText: string;

  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public apiaiService: ApiaiService,
    public analytics: AnalyticsService,
    private changeDetector: ChangeDetectorRef,
    private modalController: ModalController
  )
  {
    this.intents = new Map();
  }

  ngOnInit() {
    this.menuItems = this.getMenuItems();
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
            this.changeDetector.detectChanges();
            setTimeout(() => {
              this.itemSelected(page)
              this.initializeListeningText();
            }, 1000);
         }
     });
  }

  initializeListeningText() {
    this.listeningText = "Listening...";
  }

  loadIntents() {
    this.intents.set('show-schedule', 1);
    this.intents.set('show-tickets', 2);
    this.intents.set('show-info', 3);
    this.intents.set('show-trailer', 4);
    this.intents.set('show-review', 5);
    this.intents.set('input.unknown', 4);
    this.intents.set('smalltalk.greetings', 5);
  }

  gotoPage(page) {
    if (page) {
      this.navCtrl.push(page, {}, {animation: "md-transition"});
    }
  }

  presentModal(page) {
    let self = this;

    function showModal() {
        self.modal = self.modalController.create(page, {}, { showBackdrop: false });
        self.modal.onDidDismiss(() => self.modalShowing = false)
        self.modal.present();
        self.modalShowing = true;
    }
    if (this.modalShowing) {
      this.modal.dismiss().then((res) => {
        showModal();
      });
    } else {
        showModal();
    }
  }

  itemSelected(itemIndex) {
      let menuItem = this.menuItems[itemIndex];
      let page = menuItem.buttonPage;
      if (menuItem.presentAs == "page") {
        this.gotoPage(page);
      } else if (menuItem.presentAs == "modal") {
        this.presentModal(page);
      }

  }

  getMenuItems() {
    return  [{
                  title: "Speak",
                  icon: "assets/images/svg/voiceCommandIco.svg",
                  buttonPage: SpeakPage,
                  presentAs: "modal"
              },
              {
                  title: "Show Times",
                  icon: "assets/images/svg/showTimesIco.svg",
                  buttonPage: ShowTimesPage,
                  presentAs: "modal"
              },
              {
                  title: "Purchase Tickets",
                  icon: "assets/images/svg/ticketsIco.svg",
                  buttonPage: TicketsPage,
                  presentAs: "modal"
              },
              {
                  title: "Info",
                  icon: "assets/images/svg/aboutIco.svg",
                  buttonPage: ImdbPage,
                  presentAs: "modal"
              },
              {
                  title: "View Trailer",
                  icon: "assets/images/svg/trailerIco.svg",
                  buttonPage: TrailerPage,
                  presentAs: "modal"
              },
              {
                  title: "View Ratings",
                  icon: "assets/images/svg/ratingsIco.svg",
                  buttonPage: RatingsPage,
                  presentAs: "modal"
              }
          ];
  }

}
