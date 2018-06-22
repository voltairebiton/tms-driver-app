import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController, MenuController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ObservableProvider } from '../../providers/observable/observable';
import { getLocaleNumberSymbol } from '@angular/common';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;

  isSuccess: boolean;
  isFailed: boolean;

  constructor(
    public navCtrl: NavController,
    public menu: MenuController,
    public navParams: NavParams,
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private observableProvider: ObservableProvider
  ) {
    this.loginForm = this.fb.group({
      'email': ['', Validators.required],
      'password': ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    const authId = this.observableProvider.client$.authedId();
    // this.observableProvider.stitchLogout();
    if (authId) {
      this.navCtrl.setRoot('HomePage');
    } else {
      const email = localStorage.getItem('email');
      const password = localStorage.getItem('password');
      if(email && password) {
        this.loginForm.controls['email'].setValue(email);
        this.loginForm.controls['password'].setValue(password);
        this.login();
      }
    }
  }

  ionViewDidEnter() {
    this.menu.swipeEnable(false);
  }

  ionViewWillLeave() {
    this.menu.swipeEnable(true);
   }

  login() {
    const loader = this.loadingCtrl.create({
      content: "Please wait..."
    });
    loader.present();
    this.isFailed = false;
    this.isSuccess = false;
    this.observableProvider.stitchLogin(this.loginForm.value).then(
      (response) => {
        loader.dismiss();
        if (response.success) {
          localStorage.setItem('email', this.loginForm.value.email);
          localStorage.setItem('password', this.loginForm.value.password);
          localStorage.setItem('id', response.data.id);
          this.navCtrl.setRoot('HomePage');
        } else {
          const alert = this.alertCtrl.create({
            title: 'Login failed!',
            subTitle: response.error,
            buttons: ['OK']
          });
          alert.present();
        }
      }
    ).catch((err) => {
        loader.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Something went wrong!',
          subTitle: err,
          buttons: ['OK']
        });
        alert.present();
    });

  }

}
