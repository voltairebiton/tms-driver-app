import { Component } from '@angular/core';
import {  NavController, IonicPage } from 'ionic-angular';
import { OrderProvider } from '../../providers/order/order';
import { Order } from '../../models/order';
import { PoiProvider } from '../../providers/poi/poi';
import { ObservableProvider } from '../../providers/observable/observable';
import { ClientProvider } from '../../providers/client/client';
import { EquipmentProvider } from '../../providers/equipment/equipment';
import { Poi } from '../../models/poi';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  orders: Order[] = [];
  pois: Poi[] = [];
  isLoading = true;
  constructor(public navCtrl: NavController, private orderProvider: OrderProvider, private poiProvider: PoiProvider,
    private observableProvider: ObservableProvider, private clientProvider: ClientProvider, private equipmentProvider: EquipmentProvider,
    private userProvider: UserProvider) {
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
      this.orderProvider.fetchOrders().then((data) => {
        this.orders = data;
        this.isLoading = false;
      });
    }

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

}
