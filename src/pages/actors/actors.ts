import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-actor',
  templateUrl: 'actors.html'
})

export class ActorsPage {
  private unregisterKeyboardListener;

  public actorUrl;

  constructor(public navCtrl: NavController, public platform: Platform, public sanitizer: DomSanitizer) {

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
  getSafeTrailerUrl() {
    let safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.actorUrl);
    return safeUrl;
  }

}
