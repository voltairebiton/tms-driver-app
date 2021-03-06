import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as stitch from 'mongodb-stitch';
import { Response } from '../../models/response';
import { Poi } from '../../models/poi';
import { Equipment } from '../../models/equipment';
import { Client } from '../../models/client';
import { User } from '../../models/model';
import { Notification } from '../../models/notification';

/*
  Generated class for the ObservableProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
declare var stitch;

@Injectable()
export class ObservableProvider {
  public client: any;
  public db: any;
  
  private _client: BehaviorSubject<any> = new BehaviorSubject(null);
  private _db: BehaviorSubject<any> = new BehaviorSubject(null);
  private _pois: BehaviorSubject<any> = new BehaviorSubject(null);
  private _equipments: BehaviorSubject<Equipment[]> = new BehaviorSubject(null);
  private _clients: BehaviorSubject<Client[]> = new BehaviorSubject(null);
  private _users: BehaviorSubject<User[]> = new BehaviorSubject(null);
  private _warnings: BehaviorSubject<Notification[]> = new BehaviorSubject(null);

  constructor(public http: HttpClient) {
  }

  get db$() {
    return this._db.asObservable();
  }
  get client$() {
    return this._client.getValue();
  }

  get authedId() {
    return this._client.getValue().authedId();
  }

  get pois$() {
    return this._pois.asObservable();
  }

  set pois(value: Poi[]) {
    this._pois.next(value);
  }

  get equipments$() {
    return this._equipments.asObservable();
  }

  set equipments(value: Equipment[]) {
    this._equipments.next(value);
  }

  get clients$() {
    return this._clients.asObservable();
  }

  set clients(value: Client[]) {
    this._clients.next(value);
  }

  get users$() {
    return this._users.asObservable();
  }

  set users(value: User[]) {
    this._users.next(value);
  }

  get warnings$() {
    return this._warnings.asObservable();
  }

  set warnings(value: Notification[]) {
    this._warnings.next(value);
  }

  initStitch() {
    // let appId = 'sample-app-ovmyj';
    // let stitchClientPromise = StitchClientFactory.create('tms-yybbm');
    console.log(stitch);
    // let stitchClient = new StitchClient(appId);
    this._client.next(new stitch.StitchClient('tms-yybbm'));
    this.db = this._client.getValue().service('mongodb', 'mongodb-atlas').db('tms');
    this._db.next(this.db);
  }

  async stitchLogin(credentials): Promise<Response> {
    let response: Response = {
      success:false,
      data: [],
      error: ''
    };
    await this.client$.login(credentials.email, credentials.password).then(() =>
      this.db.collection('users').find({email: credentials.email}).execute()
    ).then((data) => {
      if (data[0].type.toLowerCase() == 'dispatcher') {
        response.error = 'You do not have access to this app';
      } else if(data[0].type.toLowerCase() == 'driver') {
        response.data = data[0];
        return this.db.collection('drivers').find({id: data[0].id}).execute();
      } else {
        response.data = data[0];
        return [{enable: true}];
      }
      
    }).then((data) => {
      if (!data[0].enable) {
        response.error = 'Your account is disabled. Contact your company for assistance';
        response.data = [];
      } else {
        const devices = response.data.devices;
        const token = localStorage.getItem('token');
        if (!devices.find(device => device == token)){
          devices.push(token);
          response.data.devices = devices;
        } 
        console.log(response.data);
        return this.db.collection('users').updateOne({id: response.data.id}, response.data );
      }
    }).then(() => {
      response.success = true;
    }).catch((err) => {
      console.log('connect err', err);
      response.success = false;
      response.error = 'Check your email and password and try again.'
    });
    console.log(response);
    return response;
  }

  stitchLogout() {
    this.client$.logout().then(() => {
      console.log('successfully logged out stitch');
      return false;
    }).catch((err) => {
      console.log('connect err', err);
      return false;
    });
  }
}
