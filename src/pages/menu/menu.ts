import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NavController, ViewController, Platform, Slides, ModalController, Modal } from 'ionic-angular';

import { ShowTimesPage } from '../../pages/showtimes/showtimes';
import { ImdbPage } from '../../pages/imdb/imdb';
import { RatingsPage } from '../../pages/ratings/ratings';
import { TicketsPage } from '../../pages/tickets/tickets';
import { TrailerPage } from '../../pages/trailer/trailer';
import { InstructionsPage } from '../../pages/instructions/instructions';

import { ApiaiService } from '../../app/services/apiai.service';
import { AnalyticsService } from "../../app/services/analytics.service";

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {

  @ViewChild('slides') slides: Slides;
  @ViewChild('slidesWrapper') slidesWrapper: ElementRef;

  private unregisterKeyboardListener;
  private modal: Modal;
  private modalShowing: Boolean;
  private isListening: Boolean;

  private recognition: any;
  private intents: any;
  public listeningText: string;

  private menuItems;

  constructor (
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public platform: Platform,
    private element: ElementRef,
    private changeDetector: ChangeDetectorRef,
    public apiaiService: ApiaiService,
    public analytics: AnalyticsService,
    private modalController: ModalController
  ) {
        this.intents = new Map();
  }

  ngOnInit() {
    this.loadIntents();
    this.menuItems = this.getMenuItems();

    // Make the modal full screen
    this.element.nativeElement.parentNode.classList.add("full-screen");
  }

  ionViewDidEnter() {
    this.startListeningToKeyboard();
    this.initializeListeningText();
    this.startRecognition();
  }

  ionViewDidLeave() {
    this.stopListeningToKeyboard();
    this.stopRecognition();
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

  gotoPage(page) {
    if (page) {
      this.navCtrl.push(page, {}, {animation: "md-transition"});
    }
  }

  presentModal(page) {
    let self = this;

    function showModal() {
        self.stopListeningToKeyboard();
        self.modal = self.modalController.create(page, {}, { showBackdrop: false });
        self.modal.onDidDismiss(() => {
          self.startListeningToKeyboard();
          self.modalShowing = false
          self.slides.enableKeyboardControl(true);
        })
        self.modal.present();
        self.modalShowing = true;
        self.slides.enableKeyboardControl(false);
        // This is cheating to solve the bug where Slides doesn't let you reenable keyboard once you turn it off
        delete self.slides._keyboardUnReg;
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

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowDown":
      this.viewCtrl.dismiss();
      break;

      case "ArrowUp":
      let activeButton = this.slidesWrapper.nativeElement.querySelector('.swiper-slide-next .menu-item');
      let menuItemIndex = activeButton.attributes["data-menu-item"].value;
      this.itemSelected(menuItemIndex);
      break;

      case " ":
      this.presentModal(InstructionsPage);
      break;

      default:
      break;
    }
  }

  startRecognition() {
    this.platform.ready().then(() => {

      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.onstart = (event => {
        this.isListening = true;
        this.tryToDetectChanges();
      });
      this.recognition.onend = (event => {
        this.isListening = false;
        this.tryToDetectChanges();
      });
      //this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.onnomatch = (event => {
        //this.listeningText = event.results[0][0].transcript;
        this.tryToDetectChanges();
      });
      this.recognition.onerror = (event => {
        //this.listeningText = event.results[0][0].transcript;
        this.tryToDetectChanges();
      });
      this.recognition.onresult = (event => {
        this.listeningText = event.results[0][0].transcript;
        this.tryToDetectChanges();
        if (event.results.length > 0) {
          console.log('Output STT: ', event.results[0][0].transcript);
          setTimeout(() => {
            this.ask(event.results[0][0].transcript);
          }, 1000);
        }
      });
      this.recognition.start();
    });
  }

  tryToDetectChanges() {
    try {
      this.changeDetector.detectChanges();
    } catch (error) {
      console.log(error);
    }
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
         this.analytics.addSpeech(text,response.result.action );
         if (null!=page) {
            this.listeningText = response.result.speech;
            this.tryToDetectChanges();
            setTimeout(() => {
              this.itemSelected(page)
              this.initializeListeningText();
            }, 1000);
         } else {
            if (text == "help") {
              this.presentModal(InstructionsPage);
            }
            setTimeout(() => {
              this.initializeListeningText();
              this.startRecognition();
            }, 1000);
         }
     });
  }

  initializeListeningText() {
    this.listeningText = "Listening...";
  }

  loadIntents() {
    this.intents.set('show-schedule', 0);
    this.intents.set('show-tickets', 1);
    this.intents.set('show-info', 2);
    this.intents.set('show-trailer', 3);
    this.intents.set('show-review', 4);
    this.intents.set('input.unknown', null);
    this.intents.set('smalltalk.greetings', 4);
  }

  getMenuItems() {
    return  [
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
