import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableProvider } from '../observable/observable';
import { Notification } from '../../models/notification';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {
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

  fetchNotifications(id): Promise<Notification[]> {
    return this.db.collection('notifications').find({user_id: id}).limit(100).execute().then((data) => {
      const notifications = data.map((notification) => {
        delete notification['_id'];
        return notification;
      });
      return notifications;

    }).catch((err) => console.log('connect err', err));
  }

  createNotification(data: Notification): Promise<boolean> {
    return this.db.collection('notifications').insertOne(data)
    .then((response) => {
      let id = response.insertedId.toString();
      data.id = id;
      return this.updateNotification(response.insertedId, data);
    })
    .then((response) => {
      console.log('response', response);
      return Promise.resolve(true);
    })
    .catch((err) => {
      console.log(err);
      return Promise.resolve(false);
    });
  }

  updateNotification(id, data) {
    return this.db.collection('notifications').updateOne({id: id}, data);
  }

  fetchTotalUnseenNotifications(id) {
    return this.db.collection('notifications').count({user_id: id, seen: false});
  }

  setSeenNotifications(id) {
    return this.db.collection('notifications').updateMany({user_id: id}, {$set: {'seen': true}});
  }

}
