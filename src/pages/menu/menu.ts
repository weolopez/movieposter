import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ViewController, Platform, Slides } from 'ionic-angular';
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

  menuItems = [
    {
      title: "Speak",
      icon: "assets/images/svg/voiceCommandIco.svg",
      buttonPage: ShowTimesPage
    },
    {
      title: "Show Times",
      icon: "assets/images/svg/showTimesIco.svg",
      buttonPage: ShowTimesPage
    },
    {
      title: "Purchase Tickets",
      icon: "assets/images/svg/ticketsIco.svg",
      buttonPage: TicketsPage
    },
    {
      title: "View IMDB",
      icon: "assets/images/svg/imdbIco.svg",
      buttonPage: ImdbPage,
    },
    {
      title: "View Trailer",
      icon: "assets/images/svg/trailerIco.svg",
      buttonPage: TrailerPage,
    },
    {
      title: "View Ratings",
      icon: "assets/images/svg/ratingsIco.svg",
      buttonPage: RatingsPage,
    },
  ];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public platform: Platform,
    private element: ElementRef
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

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowDown":
      this.viewCtrl.dismiss();
      break;

      case "ArrowUp":
      let activeButton = this.slidesWrapper.nativeElement.querySelector('.swiper-slide-next .menu-item');
      let menuItem = activeButton.attributes["data-menu-item"].value;
      let page = this.menuItems[menuItem].buttonPage;
      this.gotoPage(page);

      default:
      break;
    }
  }

}
