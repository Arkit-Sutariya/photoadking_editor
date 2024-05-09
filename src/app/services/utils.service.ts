import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(private router: Router) { }

  getCenterCoord(objSize, sizeType, isApply: boolean = true) {
    if (isApply) {
      return (Math.round(sizeType / 2) - Math.round(objSize / 2));
    }
    else {
      return (Math.round(sizeType / 2));
    }
  }

  getObjectMaxSize(obj_height: number, obj_width: number, can_height: number, can_width: number) {
    let width = obj_width;
    let height = obj_height;
    // object should added in maximum of canvas's 60% area
    let maxImageWidth = can_width * 60 / 100;
    let maxImageHeight = can_height * 60 / 100;
    let scale = Math.min(maxImageHeight / height, maxImageWidth / width);
    return scale;
  }
  
}
