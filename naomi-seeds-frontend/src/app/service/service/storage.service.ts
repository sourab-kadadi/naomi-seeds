import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  private _storage: Storage | null = null;

  constructor(private storage: Storage) {
    this.init();
  }


  async init() {
    const storage = await this.storage.create();
    this._storage = storage;
  }

  public set(key: string, value: any) {
    this._storage?.set(key, value);
  }

  public async get(key: string) {
    return this._storage?.get(key);
  }

  public async clear(key: string) {
    return this._storage?.remove(key);
  }


  async getTokenData() {
    const helper = new JwtHelperService();
    const token = this.storage.get('token').then(res => helper.decodeToken(res));   
    return token;
  }


  async getPermissionsData() {
    const permissionsData = this.storage.get('serializedPermissionsData').then();   
    return permissionsData;
  }


  // async tokenDataExtract() {
  //   this.getTokenData().then((value) => {

  //   });
  // }




//trial
  // async tokenData() {
  //   const helper = new JwtHelperService();
  //   const token =this.storage.get('token').then(res => helper.decodeToken(res));
  //   const dataToken = new Promise((resolve, reject) => {
  //     resolve(token)
  //   }); 
  //   // dataToken.then((value) => {

  //   // })
  //   console.log(dataToken)
  //   return dataToken;

  //   // this.storage.get('token').then(res => helper.decodeToken(res));
  //   // const user = token.then(result => {
  //   //   return result;
  //   // });
  //   // console.log(user)
  //   // return user;
  // }

















  async getRole() {
    const roleAs = await this.getTokenData().then(res => {
      return res.roles[0];
    });
    return roleAs;
  }


}


