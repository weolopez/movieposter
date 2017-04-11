import { Component, ChangeDetectorRef } from '@angular/core';

import { MovieService } from '../../app/services/movie.service';

import { HomePage } from '../home/home';

import { NavController, Platform} from 'ionic-angular';

@Component({
  selector: 'page-movies',
  templateUrl: 'movies.html'
})

export class MoviesPage {
  private unregisterKeyboardListener;

  public movies;
  public selectedMovie: number;

  constructor(public navCtrl: NavController, public platform: Platform,  private movieService: MovieService) {
  }

   ngOnInit() {
  }

  ionViewDidEnter() {
    this.unregisterKeyboardListener = this.platform.registerListener(this.platform.doc(), 'keydown', (event) => this.handleKeyboardEvents(event), {});
  }

  ionViewDidLeave() {
    this.unregisterKeyboardListener();
  }

  handleKeyboardEvents(event) {
    switch (event.key) {
      case "ArrowUp":
        break;

      default:
        break;
    }
  }

  movieSelected() {
    if (this.selectedMovie > -1) {
      this.movieService.setSelectedMovie(this.movies[this.selectedMovie]);
      this.navCtrl.push(HomePage);
    }
  }
  getMovies() {
   /**
    
    this.movieService.getMovies().subscribe(response => {
         this.movies = response;
    });
    */ 
  }

}
