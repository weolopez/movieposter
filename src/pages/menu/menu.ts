import { Component, ViewChild } from '@angular/core';
import { NavController, ViewController, Platform, Slides } from 'ionic-angular';
import { ShowTimesPage } from '../showtimes/showtimes';
import { ImdbPage } from '../imdb/imdb';

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html'
})

export class MenuPage {
  @ViewChild('slides') slides: Slides;

  private unregisterKeyboardListener;

  menuItems = [
    {
      title: "Speak",
      buttonPage: null,
      pageWhenActive: null,
    },
    {
      title: "Show Times",
      buttonPage: ShowTimesPage,
      pageWhenActive: null,
    },
    {
      title: "Purchase Tickets",
      buttonPage: null,
      pageWhenActive: ImdbPage,
    },
    {
      title: "View IMDB",
      buttonPage: ImdbPage,
      pageWhenActive: null,
    },
    {
      title: "View Ratings",
      buttonPage: null,
      pageWhenActive: ShowTimesPage,
    },
  ];

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public platform: Platform
  ) { }

  gotoPage(page) {
    this.navCtrl.push(page);
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  handleKeyboardEvents(event) {
    console.log(this.slides);
    switch (event.key) {
      case "ArrowDown":
      this.viewCtrl.dismiss();
      break;

      case "ArrowUp":
      let index = this.slides.getActiveIndex();
      let activeMenuItem = this.menuItems[index];

      //this.navCtrl.push(activeMenuItem.pageWhenActive);
      this.navCtrl.push(ImdbPage);

      default:
      break;
    }
  }

}
