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
}
