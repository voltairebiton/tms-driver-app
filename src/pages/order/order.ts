import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ModalController } from 'ionic-angular';
import { Order } from '../../models/order';
import { ObservableProvider } from '../../providers/observable/observable';
import { Poi } from '../../models/poi';
import { Equipment } from '../../models/equipment';
import { Client } from '../../models/client';
import { OrderProvider } from '../../providers/order/order';
import { CommentPage } from '../comment/comment';

/**
 * Generated class for the OrderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {

  order:Order;
  pois: Poi[] = [];
  equipments: Equipment[] = [];
  clients: Client[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private observableProvider: ObservableProvider,
    private orderProvider: OrderProvider,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController) {
    this.observableProvider.pois$.subscribe(
      data => {
        if (data) {
          this.pois = data;
        }
      }
    );
    this.observableProvider.clients$.subscribe(
      data => {
        if (data) {
          this.clients = data;
        }
      }
    );
    this.observableProvider.equipments$.subscribe(
      data => {
        if (data) {
          this.equipments = data;
        }
      }
    );

    this.order = this.navParams.data;
    if(Object.keys(this.order).length === 0 && this.order.constructor === Object) {
      this.navCtrl.setRoot('HomePage');
      this.order.pickups = [];
      this.order.dropoffs = [];
    }
    console.log(this.order);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderPage');
    // this.poiProvider.fetchPoiById()
  }

  displayPoiName(id) {
    if (this.pois.length > 0) {
      return this.pois.find(poi => poi.id === id).customer_name;
    } else {
      return id;
    }

  }

  displayClientName(id) {
    if (this.clients.length > 0) {
      return this.clients.find(client => client.id === id).customer_name;
    } else {
      return id;
    }
  }

  displayTrailerName(id) {
    if (this.equipments.length > 0) {
      return this.equipments.find(equipment => equipment.id === id).name;
    } else {
      return id;
    }
  }

  savePickupOrder(index) {
    console.log(this.order);

    if (this.order.pickups[index].status == 3) {
      const confirm = this.alertCtrl.create({
        title: 'Say something?',
        message: 'Would you like to say something regarding this issue?',
        buttons: [
          {
            text: 'No',
            handler: () => {
              this.orderProvider.updateOrders(this.order.id, this.order).then(
                (data) => {
                  console.log('success');
                }
              ).catch((error) => {
                console.log(error);
              });
            }
          },
          {
            text: 'Yes',
            handler: () => {
              this.orderProvider.updateOrders(this.order.id, this.order).then(
                (data) => {
                  console.log('success');
                }
              ).catch((error) => {
                console.log(error);
              });
              this.presentModal();
            }
          }
        ]
      });
      confirm.present();
    } else {
      this.orderProvider.updateOrders(this.order.id, this.order).then(
        (data) => {
          console.log('success');
        }
      ).catch((error) => {
        console.log(error);
      });
    }

  }

  presentModal() {
    const modal = this.modalCtrl.create('CommentPage', {order: this.order, comments: this.order.comments});
    modal.present();
  }
}
