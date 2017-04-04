import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ViewController, Platform, Slides, ModalController, Modal } from 'ionic-angular';
import { ShowTimesPage } from '../showtimes/showtimes';
import { ImdbPage } from '../imdb/imdb';
import { RatingsPage } from '../ratings/ratings';
import { TicketsPage } from '../tickets/tickets';
import { TrailerPage } from '../trailer/trailer';

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

  menuItems = [
    {
      title: "Speak",
      icon: "assets/images/svg/voiceCommandIco.svg",
      buttonPage: ShowTimesPage,
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
      title: "View IMDB",
      icon: "assets/images/svg/imdbIco.svg",
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
    },
  ];

  constructor (
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public platform: Platform,
    private element: ElementRef,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    // Make the modal full screen
    this.element.nativeElement.parentNode.classList.add("full-screen");
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  gotoPage(page) {
    if (page) {
      this.navCtrl.push(page, {}, {animation: "md-transition"});
    }
  }

  presentModal(page) {
    let self = this;

    function showModal() {
        self.modal = self.modalController.create(page, {});
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

      default:
      break;
    }
  }

}
