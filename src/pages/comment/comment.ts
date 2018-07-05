import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ObservableProvider } from '../../providers/observable/observable';
import { User } from '../../models/model';
import { Order } from '../../models/order';
import { OrderProvider } from '../../providers/order/order';
import { Socket } from 'ng-socket-io';
import { NotificationProvider } from '../../providers/notification/notification';
import { Notification } from '../../models/notification';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  @ViewChild('content') content:any;
  comments: any = [];
  users: User[] = [];
  order: Order;

  comment: string;
  currentId =  localStorage.getItem('id');

  isPosting: boolean;
  random: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private observableProvider: ObservableProvider,
    private viewCtrl: ViewController, private orderProvider: OrderProvider, private socket: Socket,
    private notificationProvider: NotificationProvider) {
    this.comments = this.navParams.data.comments.slice().reverse();
    this.order = this.navParams.data.order;
    this.observableProvider.users$.subscribe(
      data => {
        if (data) {
          this.users = data;
        }
      }
    );
    this.random = Math.random();
  }

  ionViewDidLoad() {
    this.socket.connect();
    this.removeSocketListener();
    this.addSocketListener();

    console.log('ionViewDidLoad CommentPage');
    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 200);
  }

  displayUserName(id) {
    if (this.users.length > 0) {
      const user = this.users.find(user => user.id === id);
      if (user) {
        if(user.id == this.currentId) {
          return 'You';
        } else {
          return user.first_name + ' ' + user.last_name;
        }
      }
    } else {
      return '';
    }
  }

  close() {
    this.viewCtrl.dismiss();
  }

  postComment() {

    this.random = Math.random();
    this.isPosting = true;
    const comment = {
      content: this.comment,
      sender: localStorage.getItem('id'),
      date: new Date()
    };
    this.comment = '';
    this.order.comments.unshift(comment);
    this.comments = this.order.comments.slice().reverse();
    setTimeout(() => {
      this.content.scrollToBottom(300);
   }, 200);
    this.orderProvider.updateOrders(this.order.id, this.order).then(
      (data) => {
        console.log('success');
        this.isPosting = false;
        const notification: Notification = {
          from: this.currentId,
          type: 'comment',
          title: 'New comment',
          body: comment.content,
          user_id: this.order.dispatcher,
          source_id: this.order.id,
          date_created: new Date
        }
        return this.notificationProvider.createNotification(notification);
      }
    ).then((response) => {
      if (response) {
        this.socket.emit('send_notification', this.order.dispatcher);
      }
    }).catch((error) => {
      console.log(error);
      this.isPosting = false;
    });
  }

  addSocketListener() {
    this.socket.on('connect', (res) => {
      this.socket.emit('connect_user', this.currentId);
    });
  }

  removeSocketListener() {
    this.socket.removeListener('connect');
  }

}
