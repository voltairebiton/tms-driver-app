import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableProvider } from '../observable/observable';
import { Equipment } from '../../models/equipment';

/*
  Generated class for the EquipmentProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class EquipmentProvider {
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

  fetchEquipments(): Promise<Equipment[]> {
    const query = { is_deleted: 0};
    return this.db.collection('equipments').find(query).limit(0).execute().then((data) => {
      console.log(data);
      const equipments = data.map((equipment) => {
        delete equipment['_id'];
        return equipment;
      });

      return equipments;
    }).catch((err) => console.log('connect err', err));
  }

}
