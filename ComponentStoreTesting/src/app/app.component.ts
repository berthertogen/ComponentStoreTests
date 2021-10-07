import { Component } from '@angular/core';
import { MovieStore } from './movie.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MovieStore],
})
export class AppComponent {
  title = 'ComponentStoreTesting';
  readonly movies$ = this.movieStore.selectMovies();

  constructor(private readonly movieStore: MovieStore) {
    this.movieStore.loadMovies(["source1", "source2"]);
  }
}
