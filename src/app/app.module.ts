import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { HttpClientModule } from '@angular/common/http';
import { ObservableProvider } from '../providers/observable/observable';
import { OrderProvider } from '../providers/order/order';
import { PoiProvider } from '../providers/poi/poi';
import { ClientProvider } from '../providers/client/client';
import { EquipmentProvider } from '../providers/equipment/equipment';
import { TitleCasePipe } from '@angular/common';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
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
    TitleCasePipe
  ]
})
export class AppModule {}
