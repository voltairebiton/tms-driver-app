import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { ObservableProvider } from '../../providers/observable/observable';
import { Notification } from '../../models/notification';
import { Subscription } from '../../../node_modules/rxjs/Subscription';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  subscriptions$: Subscription[] = [];
  warnings: Notification[] = [];
  notifications: Notification[] = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private observableProvider: ObservableProvider,
    private viewCtrl: ViewController,
    private notificationController: NotificationProvider) {
      this.subscriptions$.push(
        this.observableProvider.warnings$.subscribe(
          (data) => {
            if (data) {
              this.warnings = data;
            }
          }
        )
      );

      this.notifications = this.navParams.data.notification;
      console.log(this.notifications);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewDidLeave() {
    this.subscriptions$.forEach(el => el.unsubscribe());
  }

  close() {
    this.viewCtrl.dismiss();
  }

}
