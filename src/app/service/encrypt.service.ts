import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { JSEncrypt } from 'jsencrypt'

@Injectable({
  providedIn: 'root'
})
export class EncryptService {

  _encryptor = new JSEncrypt();
  constructor() { }

  encrypt(plainText) {

    this._encryptor.setPublicKey(environment.publicKey);
    return this._encryptor.encrypt(plainText);

  }
}
