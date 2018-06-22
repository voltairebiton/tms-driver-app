import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ObservableProvider } from '../../providers/observable/observable';
import { User } from '../../models/model';

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
  comments: any = [];
  users: User[] = [];
  currentId =  localStorage.getItem('id');
  constructor(public navCtrl: NavController, public navParams: NavParams, private observableProvider: ObservableProvider,
    private viewCtrl: ViewController) {
    this.comments = this.navParams.data.comments;
    this.observableProvider.users$.subscribe(
      data => {
        if (data) {
          this.users = data;
        }
      }
    );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
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
}
