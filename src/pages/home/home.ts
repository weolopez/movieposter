import { Component } from '@angular/core';
import { MenuPage } from '../menu/menu'

import { NavController, ModalController, Modal, Platform, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  private modal: Modal;
  private modalShowing: Boolean;
  private unregisterKeyboardListener;
  public backgroundImage;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public platform: Platform, public viewCtrl: ViewController) {

  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
    this.backgroundImage = "lego_batman.jpg"
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

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowUp":
        this.presentModal();
        break;

      default:
        break;
    }
  }

}
