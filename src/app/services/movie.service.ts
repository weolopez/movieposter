import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

import {AngularFire, FirebaseObjectObservable} from 'angularfire2';

@Injectable()

export class MovieService{
    accessToken: String;
    movieUrl: string;
    private selectedMovie: any;
    private posterid = 'blainetest';

    constructor(private http: Http, private af: AngularFire) {
        this.movieUrl = "assets/json/movies.json";
    }

    getMovies() {
      return this.af.database.object('/posters/'+this.posterid)
    }

    handleError(error:any) {
        console.error(error);
        return Observable.throw(error.json().error || 'Movie Server error');
    }

    setSelectedMovie(movie: any) {
      this.selectedMovie = movie;
    }

    getSelectedMovie() {
      return this.selectedMovie || {};
    }

}
