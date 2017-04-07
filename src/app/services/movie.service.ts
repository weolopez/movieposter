import {Injectable} from "@angular/core";
import {Http, Headers, RequestOptions} from "@angular/http";
import {Observable} from 'rxjs/Observable';
import 'rxjs/Rx'

import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { M2EService } from "./m2e.service";

@Injectable()

export class MovieService{
    accessToken: String;
    movieUrl: string;
    private selectedMovie: any;
    private posterid: string;

    constructor(private http: Http, 
                private m2e: M2EService,
                private af: AngularFire) {
        this.posterid = m2e.getPosterId();
        console.log('PosterID::'+this.posterid);

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
