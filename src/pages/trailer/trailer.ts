import { Component } from '@angular/core';

import { NavController, Platform } from 'ionic-angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'page-trailer',
  templateUrl: 'trailer.html'
})

export class TrailerPage {
  private unregisterKeyboardListener;

  public trailerUrl;

  constructor(public navCtrl: NavController, public platform: Platform, public sanitizer: DomSanitizer) {

  }
  ngOnInit() {
    this.trailerUrl = "https://www.youtube.com/embed/h6DOpfJzmo0" + "?autoplay=1";
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
    let safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.trailerUrl);
    return safeUrl;
  }

}
