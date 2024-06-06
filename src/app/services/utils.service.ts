import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { fabric } from 'fabric';
import { CUSTOM_ATTRIBUTES } from '../app.constant';

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
  
  calculateImageSize(base64String, sizeType: any = 'kb') {
    let padding, inBytes, base64StringLength, size: any;
    if (base64String.endsWith("==")) padding = 2;
    else if (base64String.endsWith("=")) padding = 1;
    else padding = 0;

    base64StringLength = base64String.length;
    inBytes = (base64StringLength / 4) * 3 - padding;
    switch (sizeType) {
      case 'byte':
        size = inBytes;
        break;
      case 'kb':
        let kbytes = inBytes / 1024;
        size = kbytes;
        break;
      case 'mb':
        let kb = inBytes / 1024;
        let mb = kb / 1024;
        size = mb;
        break;
      case 'gb':
        let kbit = inBytes / 1024;
        let mbit = kbit / 1024;
        let gbit = mbit / 1024;
        size = gbit;
        break;
      default:
        let kilobytes = inBytes / 1024;
        size = kilobytes;
        break;
    }
    return size;
  }
  
  /******************* PAK Live image cropping logic to convert in Base64 *****************/
  async cropImage(src: any, t: any, l: any, h: any, w: any): Promise<any> {
    return new Promise(async (resolve) => {
      if (src) {
        var tmpCanvas = document.createElement('canvas');
        tmpCanvas.setAttribute('id', 'dummy_canvas');
        tmpCanvas.style.display = 'none';

        var ctx, copy_canvas = document.createElement('canvas').getContext('2d');
        var image = new Image();
        image.crossOrigin = 'anonymous';
        image.onload = async function () {
          tmpCanvas.height = image.height;
          tmpCanvas.width = image.width;
          ctx = await tmpCanvas.getContext('2d');
          ctx.drawImage(image, 0, 0);
          var croppedImg = await ctx.getImageData(l, t, w, h);
          copy_canvas!.canvas.width = w;
          copy_canvas!.canvas.height = h;
          await copy_canvas!.putImageData(croppedImg, 0, 0);
          if (document.getElementById('dummy_canvas')) {
            document.getElementById('dummy_canvas')!.remove();
          }
          setTimeout(() => {
            resolve({ 'base64': copy_canvas!.canvas.toDataURL() });
          }, 500);
        }
        image.src = src;
      }
    });
  }

  pushCustomAttribute(obj, data): Promise<any> {
    return new Promise((resolve) => {
      var all_custom_attr = {};
      var selected = obj;
      CUSTOM_ATTRIBUTES.forEach(item => {
        if (selected.hasOwnProperty(item)) {
          // console.log(item);
          all_custom_attr[item] = selected[item]
        }
      })
      data.forEach(element => {
        all_custom_attr[element.key] = element.value
      });
      // console.log('all custom attr', all_custom_attr);
      resolve(all_custom_attr);
    })
  }

}
