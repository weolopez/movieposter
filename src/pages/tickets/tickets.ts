import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-tickets',
  templateUrl: 'tickets.html'
})

export class TicketsPage {
  private unregisterKeyboardListener;

  constructor(public navCtrl: NavController, public platform: Platform) {

  }

  ionViewDidLoad() {
  }

  ionViewDidEnter() {
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

}
