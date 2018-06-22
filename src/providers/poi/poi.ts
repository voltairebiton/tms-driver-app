import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableProvider } from '../observable/observable';
import { Poi } from '../../models/poi';

/*
  Generated class for the PoiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PoiProvider {
  public db: any;

  constructor(public http: HttpClient, private observableProvider: ObservableProvider) {
    this.observableProvider.db$.subscribe(
      data => {
        if (data) {
          this.db = data;
        }
      }
    );
  }

  fetchPois(): Promise<Poi[]> {
    const query = { is_deleted: 0};
    return this.db.collection('pois').find(query).limit(0).execute().then((data) => {
      console.log(data);
      const pois = data.map((poi) => {
        delete poi['_id'];
        return poi;
      });

      return pois;
    }).catch((err) => console.log('connect err', err));
  }

  fetchPoiById(id): Promise<Poi> {
    const query = { is_deleted: 0, id: id };
    return this.db.collection('pois').find(query).limit(1).execute().then((data) => {
      console.log(data);
      const pois = data.map((poi) => {
        delete poi['_id'];
        return poi;
      });

      return pois[0];
    }).catch((err) => console.log('connect err', err));
  }

}
