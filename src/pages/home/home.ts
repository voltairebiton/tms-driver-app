import { Component } from '@angular/core';
import {  NavController, IonicPage, ModalController } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { Order } from '../../models/order';
import { PoiProvider } from '../../providers/poi/poi';
import { ObservableProvider } from '../../providers/observable/observable';
import { ClientProvider } from '../../providers/client/client';
import { EquipmentProvider } from '../../providers/equipment/equipment';
import { Poi } from '../../models/poi';
import { UserProvider } from '../../providers/user/user';
import { NotificationProvider } from '../../providers/notification/notification';
import { Notification } from '../../models/notification';
import { Subscription } from '../../../node_modules/rxjs/Subscription';
import { DriverProvider } from '../../providers/driver/driver';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  orders: Order[] = [];
  pois: Poi[] = [];
  isLoading = true;

  id: string;
  notifications: Notification[] = [];
  warnings: Notification[] = [];
  unSeenNotifications = 0;

  subscriptions$: Subscription[] = [];

  constructor(public navCtrl: NavController, private orderProvider: OrderProvider, private poiProvider: PoiProvider,
    private observableProvider: ObservableProvider, private clientProvider: ClientProvider, private equipmentProvider: EquipmentProvider,
    private userProvider: UserProvider, private modalCtrl: ModalController, private notificationProvider: NotificationProvider,
    private driverProvider: DriverProvider) {
      this.id = localStorage.getItem('id');
  }

  ionViewDidLoad() {
    console.log('test');
    const authId = this.observableProvider.client$.authedId();
    if (!authId) {
      this.navCtrl.setRoot('LoginPage');
    } else {
      this.loadPois();
      this.loadEquipments();
      this.loadClients();
      this.loadUsers();
      this.fetchNotifications();
      this.fetchDriver();
      this.orderProvider.fetchOrders().then((data) => {
        this.orders = data;
        this.isLoading = false;
      });

      this.subscriptions$.push(
        this.observableProvider.warnings$.subscribe(
          (data) => {
            if (data) {
              const total = data.length;
              this.unSeenNotifications += total;
              // console.log(this.warnings);
              console.log(data);
            }
          }
        )
      );
    }
  }

  ionViewDidLeave() {
    this.subscriptions$.forEach(el => el.unsubscribe());
  }

  viewOrder(order: Order) {
    this.navCtrl.push('OrderPage', order);
  }

  loadPois() {
    this.poiProvider.fetchPois().then(
      (data) => {
        this.observableProvider.pois = data;
        this.pois = data;
      }
    );
  }

  loadEquipments() {
    this.equipmentProvider.fetchEquipments().then(
      (data) => {
        this.observableProvider.equipments = data;
      }
    );
  }

  loadClients() {
    this.clientProvider.fetchClients().then(
      (data) => {
        this.observableProvider.clients = data;
      }
    );
  }

  loadUsers() {
    this.userProvider.getUsers().then(
      (data) => {
        this.observableProvider.users = data;
      }
    );
  }

  displayPoiName(id) {
    if (this.pois.length > 0) {
      return this.pois.find(poi => poi.id === id).customer_name;
    } else {
      return '';
    }
  }

  showNotification() {
    this.setSeenNotifications();
    const modal = this.modalCtrl.create('NotificationPage', {notification: this.notifications});
    modal.present();
  }

  fetchNotifications() {
    this.notificationProvider.fetchTotalUnseenNotifications(this.id).then(
      (data) => {
        this.unSeenNotifications += data;
      }
    );

    this.notificationProvider.fetchNotifications(this.id).then(
      (data) => {
        if (data) {
          this.notifications = data;
        }
      }
    );
  }

  setSeenNotifications() {
    this.notificationProvider.setSeenNotifications(this.id).then(
      () => {
        this.notifications.map((notification) => {
          notification.seen = true;
          return notification;
        });
        this.unSeenNotifications = 0;
      }
    );
  }

  fetchDriver() {
    this.driverProvider.fetchDriverById().then(
      (data) => {

      }
    )
  }
}
