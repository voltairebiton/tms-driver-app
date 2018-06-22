import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableProvider } from '../observable/observable';
import { Client } from '../../models/client';

/*
  Generated class for the ClientProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ClientProvider {
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

  fetchClients(): Promise<Client[]> {
    const query = { is_deleted: 0};
    return this.db.collection('clients').find(query).limit(0).execute().then((data) => {
      console.log(data);
      const clients = data.map((client) => {
        delete client['_id'];
        return client;
      });

      return clients;
    }).catch((err) => console.log('connect err', err));
  }

}
