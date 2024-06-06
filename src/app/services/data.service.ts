import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { HOST } from '../app.constant';

@Injectable()
export class DataService {

  constructor(public http: HttpClient, private router: Router) { }

  postData(q, object, headers) {
    
    return this.http.post(HOST.API_URL + q, object, headers)
  }

  blobToFile(theBlob, fileName) {
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  getLocalStorageData(key) {
    let localStorageData = localStorage.getItem(key);
    if (localStorageData) {
      // encryption changes needed  : need to make check for id otherwoise error will occure
      var re_localStorageData = JSON.parse(localStorageData);
      return re_localStorageData;
    }
    else {
      return "";
    }
  }
}
