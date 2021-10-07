import { cold } from "jest-marbles";
import { Subject } from "rxjs";
import { MovieService } from "./movie.service";
import { Movie, MovieStore } from "./movie.store";

describe("MovieStore", () => {
  it("check state while forkJoin is resolving", () => {
    const source1 = new Subject<Movie[]>()
    const source2 = new Subject<Movie[]>()
    const service = new MovieService();
    jest.spyOn(service, 'get').mockImplementation(source => source === "source1" ? source1 : source2)
    const store = new MovieStore(service);

    const allLoaded$ = store.selectAllLoaded();
    const movies$ = store.selectMovies();

    store.loadMovies(["source1", "source2"]);

    source1.next(service.movies["source1"]);
    source1.complete();

    expect(allLoaded$).toBeObservable(cold('a', {
      a: false
    }));
    expect(movies$).toBeObservable(cold('a', {
      a: service.movies["source1"]
    }));

    source2.next(service.movies["source2"]);
    source2.complete();

    expect(allLoaded$).toBeObservable(cold('a', {
      a: true
    }));
    expect(movies$).toBeObservable(cold('a', {
      a: [
        ...service.movies["source1"],
        ...service.movies["source2"]
      ]
    }));
  });
});