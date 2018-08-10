import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Driver } from '../../models/driver';
import { DatePipe } from '../../../node_modules/@angular/common';
import { ObservableProvider } from '../observable/observable';
import { Notification } from '../../models/notification';

/*
  Generated class for the DriverProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DriverProvider {
  public db: any;
  id: string;
  warnings: Notification[] = [];

  constructor(public http: HttpClient, private observableProvider: ObservableProvider) {
    this.id = localStorage.getItem('id');
    console.log('Hello DriverProvider Provider');
    this.observableProvider.db$.subscribe(
      data => {
        if (data) {
          this.db = data;
        }
      }
    );

  }
  fetchDriverById(): Promise<Driver> {
    const query = { id: this.id, is_deleted: 0 };
    return this.db.collection('drivers').find(query).limit(1).execute().then((data) => {
      const drivers = data.map((driver: Driver) => {
        if (driver.cdl_exp) {
          if (this.betweenDays(new Date(driver.cdl_exp)) <= 30) {
            this.notifyCDLExpiration(driver);
          }
        }
        if (driver.last_drug_test) {
          if (this.betweenDays(new Date(driver.last_drug_test)) <= 30) {
            this.notifyDrugTestExpiration(driver);
          }
        }
        if (driver.physical_exp) {
          if (this.betweenDays(new Date(driver.physical_exp)) <= 30) {
            this.notifyPhysicalExpiration(driver);
          }
        }
        delete driver['_id'];
        return driver;
      });
      this.observableProvider.warnings = this.warnings;
      return drivers;
    });
  }

  private notifyCDLExpiration(driver: Driver) {
  const cdlDate = driver.cdl_exp ? (new DatePipe('en').transform(driver.cdl_exp, 'longDate')) : '';
  const notification: Notification = {
    from: '',
    type: 'CDL',
    title: 'CDL Expiration',
    body: 'Driver ' + driver.first_name + ' ' + driver.last_name + ' CDL is about to expire on ' + cdlDate + '.',
    user_id: this.id,
    source_id: '',
    date_created: new Date,
    seen: false
  };

  this.warnings.push(notification);
  return true;
}

private notifyDrugTestExpiration(driver: Driver) {
  const drug = driver.last_drug_test ? (new DatePipe('en').transform(driver.last_drug_test, 'longDate')) : '';
  const notification: Notification = {
    from: '',
    type: 'drug_test',
    title: 'Drug Test Expiration',
    body: 'Driver ' + driver.first_name + ' ' + driver.last_name + ' drug certificate is about to expire on ' + drug + '.',
    user_id: this.id,
    source_id: '',
    date_created: new Date,
    seen: false
  };
  // const response = await this.notificationService.createNotification(notification).then(
  //     (data) => {
  //         return data;
  //     }
  // );
  this.warnings.push(notification);
  return true;
}

private notifyPhysicalExpiration(driver: Driver) {
  const phy = driver.physical_exp ? (new DatePipe('en').transform(driver.physical_exp, 'longDate')) : '';
  const notification: Notification = {
    from: '',
    type: 'physical',
    title: 'Physical Expiration',
    body: 'Driver ' + driver.first_name + ' ' + driver.last_name + ' physical is about to expire on ' + phy + '.',
    user_id: this.id,
    source_id: '',
    date_created: new Date,
    seen: false
  };
  // const response = await this.notificationService.createNotification(notification).then(
  //     (data) => {
  //         return data;
  //     }
  // );
  this.warnings.push(notification);
  return true;
}

betweenDays(date) {
  const diff = Math.abs(date.getTime() - (new Date).getTime());
  return diff / (1000 * 60 * 60 * 24);
}

}
