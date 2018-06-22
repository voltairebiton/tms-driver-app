import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../models/model';
import { ObservableProvider } from '../observable/observable';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  public client: any;
  public db: any;
  
  constructor(public http: HttpClient, private observableProvider: ObservableProvider) {
    console.log('Hello UserProvider Provider');
    this.observableProvider.db$.subscribe(
      data => {
        if (data) {
          this.db = data;
        }
      }
    );
  }

  getUsers(): Promise<User[]> {
    return this.db.collection('users').find({}, { id: 1, first_name: 1, last_name: 1 }).limit(0).execute().then((data) => {
      console.log(data);
      const users = data.map((user) => {
        delete user['_id'];
        return user;
      });
      return Promise.resolve(users);
    }).catch((err) => console.log('connect err', err));
  }

}
