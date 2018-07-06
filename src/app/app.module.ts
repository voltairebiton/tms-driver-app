import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ObservableProvider } from '../providers/observable/observable';
import { OrderProvider } from '../providers/order/order';
import { PoiProvider } from '../providers/poi/poi';
import { ClientProvider } from '../providers/client/client';
import { EquipmentProvider } from '../providers/equipment/equipment';
import { TitleCasePipe } from '@angular/common';
import { LoginPageModule } from '../pages/login/login.module';
import { UserProvider } from '../providers/user/user';
import { Push } from '@ionic-native/push';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NotificationProvider } from '../providers/notification/notification';
const config: SocketIoConfig = { url: 'https://com-tms-5-1.herokuapp.com', options: {} };
@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    LoginPageModule,
    SocketIoModule.forRoot(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ObservableProvider,
    OrderProvider,
    PoiProvider,
    ClientProvider,
    EquipmentProvider,
    UserProvider,
    TitleCasePipe,
    Push,
    NotificationProvider
  ]
})
export class AppModule {}
