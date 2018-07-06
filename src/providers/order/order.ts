import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObservableProvider } from '../observable/observable';
import { Order } from '../../models/order';

/*
  Generated class for the OrderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class OrderProvider {
  public db: any;
  private driverId: string;

  constructor(public http: HttpClient, private observableProvider: ObservableProvider) {
    this.observableProvider.db$.subscribe(
      data => {
        if (data) {
          this.db = data;
        }
      }
    );
  }

  fetchOrders(): Promise<Order[]> {
    this.driverId = localStorage.getItem('id');
    const query = { is_deleted: 0, driver_ids: this.driverId };
    return this.db.collection('orders').find(query).limit(0).execute().then((data) => {
      console.log(data);
      const orders = data.map((order) => {
        delete order['_id'];
        return order;
      });

      return orders;
    }).catch((err) => console.log('connect err', err));
  }

  
  fetchOrderById(id):  Promise<Order> {
    const query = { id: id };
    return this.db.collection('orders').find(query).limit(1).execute().then((data) => {
      console.log(data);
      const orders = data.map((order) => {
        delete order['_id'];
        return order;
      });

      return orders[0];
    }).catch((err) => console.log('connect err', err));
  }

  updateOrders(id, data): Promise<Order> {
    return this.db.collection('orders').updateOne({id: id}, data)
    .then((response)=> {
        console.log('response', response);
        return Promise.resolve(data);
    });
  }
}
