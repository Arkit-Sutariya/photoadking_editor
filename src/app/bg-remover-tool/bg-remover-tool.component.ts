import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AppComponent } from '../app.component';
import { UtilsService } from '../services/utils.service';
import { DataService } from '../services/data.service';
import { fabric } from 'fabric';
import { NgbModal, NgbActiveModal, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ATTRIBUTES, KEYCODES, maxFileSize, upload_limit_exceed } from '../app.constant';
import { PremiumService } from '../services/premium.service';
var custom_attributes: any[] = CUSTOM_ATTRIBUTES;

@Component({
  selector: 'app-bg-remover-tool',
  templateUrl: './bg-remover-tool.component.html',
  styleUrls: ['./bg-remover-tool.component.css']
})
// export class BgRemoverToolComponent implements OnInit, OnDestroy{

//   src: any = null;
//   canvas: any;
//   tmpCanvas: any;
//   canvasElement: any;
//   mainImage: any
//   offsetX: any;
//   offsetY: any;
//   ctx: any;
//   imageHeight: any;
//   imageWidth: any;
//   zoomLevel: any = 1;
//   isDark: boolean = false;
//   is_image: boolean = false;
//   tmp: any = false;
//   tmpCircle: any;
//   timeout: any;
//   file_data;
//   canvas_img;
//   tmp_file;
//   down_base64;
//   is_response: boolean = false;
//   allowedExtensions = /(\.jpg|\.jpeg|\.png)(\?.*)?$/i;
//   canvasList: any = [];
//   i_width; i_height;
//   is_process = true;
//   user_free = false;
//   is_dialog_close = true;
//   is_bgremove = false;

//   // canvas zoom step size
//   stepSize: number = 0.05;
//   maxsize: number = 2;

//   // color intensity variable
//   colorIntensity: any = 15;
//   prevColorIntensity: number = 15;
//   floodColorIntensity: any = 50;
//   prevFloodColorIntensity: number = 50;
//   Rmin: any;
//   Rmax: any;
//   Gmin: any;
//   Gmax: any;
//   Bmin: any;
//   Bmax: any;

//   fRmin: any;
//   fGmin: any;
//   fBmin: any;
//   fRmax: any;
//   fGmax: any;
//   fBmax: any;

//   // image data and pixel information variable
//   imgData: any;
//   pix: any;

//   // mouse position variables
//   mPointer: any;
//   mEraser: any;
//   cursorCanvas: any;
//   cursorRadius: any = 40;
//   prevCursorRadius: number = 40;

//   // variable for remover type:
//   isAuto: boolean = false;
//   isEraser: boolean = false;
//   isFlood: boolean = false;
//   isNone: boolean = true;

//   // variable for event detection
//   isErasing: boolean = false;

//   // gc  for window resizer
//   windowResizeRef: any;
//   KeyRef: any;

//   //For Undo Redo
//   _config = {
//     canvasState: [],
//     currentStateIndex: -1,
//     undoStatus: false,
//     redoStatus: false,
//     disableUndo: true,
//     disableRedo: true,
//     undoFinishedStatus: 1,
//     redoFinishedStatus: 1
//   };

//   // for zoom
//   isFitToScreen: any = true;
//   isZoomMenuItemClicked: any = false;
//   is_payment_done: boolean = false;

//   counterInterval: any = undefined;
//   request_data = {
//     "is_human": "1",
//     "platform": "3",
//     "app_id": "1",
//     "is_debug": "1",
//     "is_editor": "1"
//   }
//   login_response: any;
//   download_url:any;

//   ngOnDestroy(): void {
//     $(window).unbind('resize', this.windowResizeRef);
//     document.removeEventListener("keydown", this.KeyRef, false);
//   }

//   constructor(public dialogRef: MatDialogRef<AppComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public utils: UtilsService, public dialog: MatDialog, public dataService: DataService) {
//     this.KeyRef = this.shortCuts.bind(this);
//     document.addEventListener("keydown", this.KeyRef, false);
//   }

//   ngOnInit(): void {

//     this.is_dialog_close = false;
//     if (this.data) {
//       let that = this;
//       that.is_process = false;
//       that.is_image = true;

//       this.src = this.data;
//       if (this.src.search('blob:') != -1) {
//         let img = new Image();
//         img.src = this.data;
//         img.onload = function () {
//           var canvas = document.createElement("canvas")
//           var context = canvas.getContext("2d")
//           canvas.width = img.width;
//           canvas.height = img.height;
//           context?.drawImage(img, 0, 0) // i assume that img.src is your blob url
//           var dataurl = canvas.toDataURL('image/png');
//           var blob = that.dataURLtoBlob(dataurl);
//           let file = that.dataService.blobToFile(blob, 'tmp.png');
//           let editor_file: any = [];
//           editor_file.push(file);
//           that.uploadImgOncanvas(editor_file);
//         }

//       }
//       else {
//         this.convertUrlToFile(this.src).then(async (response) => {
//           let editor_file: any = [];
//           editor_file.push(response.file);
//           that.uploadImgOncanvas(editor_file);
//         });
//       }
//     }
//     var login_response = this.dataService.getLocalStorageData('l_r');
//     this.user_free = true;

//   }

//   dataURLtoBlob(dataurl) {

//     let parts = dataurl.split(','), mime = parts[0].match(/:(.*?);/)[1]
//     if (parts[0].indexOf('base64') !== -1) {
//       let bstr = atob(parts[1]), n = bstr.length, u8arr = new Uint8Array(n)
//       while (n--) {
//         u8arr[n] = bstr.charCodeAt(n)
//       }
//       return new Blob([u8arr], { type: mime })
//     } 
//     else {
//       let raw = decodeURIComponent(parts[1]);
//       return new Blob([raw], { type: mime });
//     }
//   }

//   uploadImgOncanvas(file) {

//     let that = this;
//     this.file_data = file[0];
//     var filePath = file[0].name;
//     let img_path = URL.createObjectURL(file[0]);
//     let image = new Image();
//     image.src = img_path;
//     image.onload = function () {
//       that.i_width = image.width;
//       that.i_height = image.height;

//       if (!that.allowedExtensions.exec(filePath)) {
//         // that.utils.hideLoader();
//         // that.utils.showError('Currently only JPG ,JPEG ,PNG are supported', false, 5000);
//       }
//       else if ((file[0].size) > 5000000) {
//         that.process(file[0], function (compress_url, url) {
//           let compress_file: any = [];
//           compress_file.push(compress_url);
//           if (compress_url.size > 5000000) {
//             // that.utils.hideLoader();
//             // that.utils.showError('This file exceeds the maximum upload size of 5 MB', false, 5000);
//           }
//           else {

//             that.is_image = true;
//             that.is_process = false;
//             img_path = window.URL.createObjectURL(new Blob(compress_file, { type: "application/zip" }));
//             that.src = img_path;
//             that.prepareRemover(img_path);
//           }

//         });
//       }
//       else {
//         that.src = img_path;
//         that.is_process = false;
//         that.is_image = true;
//         that.prepareRemover(img_path)
//       }

//     }
//   }

//   prepareRemover(image_url) {
//     var that = this;
//     if (this.isCanvasBlank('removerCanvas') == true) {
//       this.canvas = new fabric.Canvas('removerCanvas', {
//         backgroundColor: '',
//         hoverCursor: 'pointer',
//         selection: true,
//         selectionBorderColor: '#00c3f9',
//         selectionColor: 'rgba(0, 195, 249, 0.2)',
//         preserveObjectStacking: true,
//         originX: 'center',
//         originY: 'center',
//         renderOnAddRemove: false,

//       });
//     }

//     this.tmpCanvas = $('#removerCanvas').offset();
//     this.offsetX = this.tmpCanvas.left;
//     this.offsetY = this.tmpCanvas.top;
//     var that = this;
//     var image = new Image();
//     image.crossOrigin = 'anonymous';

//     image.onload = function () {
//       let max = 2000;
//       if (image.height > image.width && image.height > max) {
//         // portrait iamge
//         let scalefactor = max / image.height;
//         that.canvas.setHeight(Math.round(image.height * scalefactor));
//         that.canvas.setWidth(Math.round(image.width * scalefactor));
//         that.imageHeight = Math.round(image.height * scalefactor);
//         that.imageWidth = Math.round(image.width * scalefactor);
//       }
//       else if (image.width >= image.height && image.width > 3000) {
//         // landscape image
//         let scalefactor = max / image.width;
//         that.canvas.setHeight(Math.round(image.height * scalefactor));
//         that.canvas.setWidth(Math.round(image.width * scalefactor));
//         that.imageHeight = Math.round(image.height * scalefactor);
//         that.imageWidth = Math.round(image.width * scalefactor);
//       } 
//       else {
//         that.canvas.setHeight(image.height);
//         that.canvas.setWidth(image.width);
//         that.imageHeight = image.height;
//         that.imageWidth = image.width;
//       }
//     }
//   }

//   isCanvasBlank(ids) {
//     const blank = document.createElement('canvas');
//     var canvas2 = <HTMLCanvasElement>document.getElementById(ids);
//     var w = canvas2.width;
//     var h = canvas2.height;
//     blank.width = w;
//     blank.height = h;
//     return canvas2.toDataURL() === blank.toDataURL();
//   }

//   convertUrlToFile(url): Promise<any> {
//     var filename = url.substring(url.lastIndexOf('/') + 1);
//     return new Promise(async (resolve) => {
//       let that = this;
//       fetch(url)
//         .then(response => response.blob())
//         .then(blob => new File([blob], filename, {
//           type: blob.type
//         }))
//         .then(file => {
//           resolve({ 'file': file });
//         })
//         .catch(err => {
//           console.log(err);
//         })
//     });

//   }

//   process(cfile, callback) {
//     const file = cfile;
//     if (!file) return;

//     const reader = new FileReader();

//     reader.readAsDataURL(file);

//     reader.onload = function (event) {
//       const csv = reader.result;
//       const imgElement = document.createElement("img");
//       imgElement.src = reader.result!.toString();

//       imgElement.onload = function (e) {
//         try {
//           var quality = 25,
//             output_format = 'jpeg';
//           let srcEncoded = '';
//           let that = this;
//           srcEncoded = compress(imgElement, quality, output_format).src;
//           let canvas2 = document.createElement('canvas');
//           let image = new Image();
//           image.src = srcEncoded;
//           image.onload = function () {

//             fetch(srcEncoded)
//               .then(response => response.blob())
//               .then(blob => new File([blob], cfile.name, {
//                 type: blob.type
//               }))
//               .then(file => {
//                 callback(file, srcEncoded);
//               })
//               .catch(err => {
//                 console.log(err);
//               })
//           }
//         }
//         catch (err) {
//           console.log(err);

//         };

//         imgElement.onerror = function (err) {
//           console.log(err);
//         }
//       };
//     }
//   }

//   shortCuts(e) {}

//   /************ Main menu ************/
//   undo() {
//   }

//   redo() {
//   }

//   resetCanvas() {
//   }

//   resetZoom() {
//   }

//   setZoom(zoomlevel, mode) {
//   }

//   setZoomFromOption(lvl) {
//     this.zoomLevel = lvl;
//     this.setZoom(lvl, '');
//     this.isFitToScreen = false;
//     this.isZoomMenuItemClicked = true;
//   }

//   fitToScreen() {
//     this.resetZoom();
//     this.resizeCanvas();
//     this.isFitToScreen = true;
//     this.isZoomMenuItemClicked = true;
//   }

//   resizeCanvas() {
//   }

//   SaveToUpload() {
//   }

//   download() {
//   }

//   Save() {
//   }

//   close(res) {
//     if(this.canvasElement!= null)
//     {
//       this.canvas.clear();
//     }
//     $('.new-cs-overlay').remove();
//     $('.c-img-btn').remove();
//     this.is_dialog_close = true;
//     this.dialogRef.close({ res: false, is_payment_done: this.is_payment_done });
//   }

//   /************ upload image on canvas **************/
//   fileChange(event) {
//     let that = this;
//     if (event.target.files && event.target.files[0]) {
//       this.uploadImgOncanvas(event.target.files);
//     }
//   }

//   handleDragEnter(event) {
//     event.preventDefault();
//     event.stopPropagation();
//   }

//   drop(evt) {
//     evt.preventDefault();
//     evt.stopPropagation();
//     let files = evt.dataTransfer.files;
//     let valid_files: Array<File> = files;
//     if (this.src === null) {
//       this.uploadImgOncanvas(valid_files);
//     }

//   }

//   /**************** Apply different filters **********/
//   RemoveBg(tab_cls) {
//   }

//   selectEraserType(type) {
//   }

//   Upgrade() {
//   }

//   timeoutStop() {
//     clearTimeout(this.counterInterval);
//   }

//   continousIncrement(propetyType, max, step) {
//     if (this[propetyType] != max) {
//       this[propetyType] = Number(this[propetyType]) + step;
//       this.callFunctionAsPerProperty(propetyType);
//     }
//     this.counterInterval = setTimeout(() => {
//       this.continousIncrement(propetyType, max, step)
//     }, 150);
//   }

//   continousDecrement(propetyType, min, step) {
//     if (this[propetyType] != min) {
//       this[propetyType] = Number(this[propetyType]) - step;
//       this.callFunctionAsPerProperty(propetyType);
//     }
//     this.counterInterval = setTimeout(() => {
//       this.continousDecrement(propetyType, min, step)
//     }, 150);
//   }

//   callFunctionAsPerProperty(propType) {
//     switch (propType) {
//       // case "cursorRadius":
//       //   this.changeEraserSize(this.cursorRadius);
//       //   break;

//       // case "colorIntensity":
//       //   this.setColorIntencity(this.colorIntensity, 'auto');
//       //   break;

//       // case "floodColorIntensity":
//       //   this.setColorIntencity(this.floodColorIntensity, 'flood');
//       //   break;
//     }
//   }

//   removeTrailZero(event) {
//     if (event.target.value) { event.target.value = Math.round(event.target.value) };
//   }

//   changeEraserSize(size) {

//     if (size == null) {
//       size = this.prevCursorRadius;
//     }
//     size = this.checkLimitBeforeApplyForInputSlider(Math.round(size), 100, 0);
//     this.cursorRadius = size;
//     this.prevCursorRadius = size;
//     if (!this.tmp) {
//       this.tmpCircle = new fabric.Circle({
//         top: (this.canvas.getHeight() / 2) - (size / 2),
//         left: (this.canvas.getWidth() / 2) - (size / 2),
//         fill: 'rgba(255, 0, 0, 0.6)',
//         radius: size,
//         stroke: 'black',
//         evented: false,
//         selectable: false
//       })
//       this.canvas.add(this.tmpCircle);
//       this.canvas.renderAll();
//       this.tmp = true;
//     }
//     else {
//       this.tmpCircle.set({
//         radius: size,
//         top: (this.canvas.getHeight() / 2) - (size / 2),
//         left: (this.canvas.getWidth() / 2) - (size / 2),
//       });
//       this.canvas.renderAll();
//     }
//     var that = this;
//     clearTimeout(this.timeout);
//     this.timeout = setTimeout(() => {
//       if (that.tmpCircle) {
//         that.canvas.remove(that.tmpCircle)
//         that.tmp = false;
//       }
//     }, 200);
//     this.mEraser.set({ radius: size });
//     this.canvas.freeDrawingBrush.width = size * 2;
//   }

//   checkLimitBeforeApplyForInputSlider(currentVal: number, max: number, min: number) {
//     if (currentVal > min) {
//       if (currentVal > max) {
//         return max;
//       }
//       else {
//         return currentVal;
//       }
//     }
//     else {
//       if (currentVal < min) {
//         return min;
//       }
//       else {
//         return currentVal
//       }
//     }
//   }

//   setColorIntencity(intensity: number, type: string) {
//     if (type === 'auto') {
//       if (intensity == null) {
//         this.colorIntensity = this.prevColorIntensity
//       }
//       this.colorIntensity = this.checkLimitBeforeApplyForInputSlider(Math.round(this.colorIntensity), 100, 0);
//       this.prevColorIntensity = this.colorIntensity;
//     }
//     else {
//       if (intensity == null) {
//         this.floodColorIntensity = this.prevFloodColorIntensity
//       }
//       this.floodColorIntensity = this.checkLimitBeforeApplyForInputSlider(Math.round(this.floodColorIntensity), 100, 0);
//       this.prevFloodColorIntensity = this.floodColorIntensity;
//     }
//   }

// }
// function compress(source_img_obj, quality: number, output_format: string) {
//   var mime_type = "image/jpeg";

//   if (typeof output_format !== "undefined" && output_format == "png") {
//     mime_type = "image/png";
//   }

//   var cvs = document.createElement('canvas');
//   cvs.width = source_img_obj.naturalWidth;
//   cvs.height = source_img_obj.naturalHeight;
//   var ctx = cvs.getContext("2d")!.drawImage(source_img_obj, 0, 0);
//   var newImageData = cvs.toDataURL(mime_type, quality / 100);
//   var result_image_obj = new Image();
//   result_image_obj.src = newImageData;
//   return result_image_obj;
// }

export class BgRemoverToolComponent implements OnInit, OnDestroy {

  src: any = null;
  canvas: any;
  tmpCanvas: any;
  canvasElement: any;
  mainImage: any
  offsetX: any;
  offsetY: any;
  ctx: any;
  imageHeight: any;
  imageWidth: any;
  zoomLevel: any = 1;
  isDark: boolean = false;
  is_image: boolean = false;
  tmp: any = false;
  tmpCircle: any;
  timeout: any;
  file_data;
  canvas_img;
  tmp_file;
  down_base64;
  is_response: boolean = false;
  allowedExtensions = /(\.jpg|\.jpeg|\.png)(\?.*)?$/i;
  canvasList: any = [];
  i_width; i_height;
  is_process = true;
  user_free = false;
  is_dialog_close = true;
  is_bgremove = false;
  // canvas zoom step size
  stepSize: number = 0.05;
  maxsize: number = 2;

  // color intensity variable
  colorIntensity: any = 15;
  prevColorIntensity: number = 15; //Use to store previous color intensity
  floodColorIntensity: any = 50;
  prevFloodColorIntensity: number = 50 //Use to store previous color intensity;
  Rmin: any;
  Rmax: any;
  Gmin: any;
  Gmax: any;
  Bmin: any;
  Bmax: any;

  fRmin: any;
  fGmin: any;
  fBmin: any;
  fRmax: any;
  fGmax: any;
  fBmax: any;
  // image data and pixel information variable
  imgData: any;
  pix: any;
  // mouse position variables
  mPointer: any;
  mEraser: any;
  cursorCanvas: any;
  cursorRadius: any = 40;
  prevCursorRadius: number = 40; //Use to store previous color radius
  // variable for remover type:
  isAuto: boolean = false;
  isEraser: boolean = false;
  isFlood: boolean = false;
  isNone: boolean = true;

  // variable for event detection
  isErasing: boolean = false;

  // gc  for window resizer
  windowResizeRef: any
  KeyRef: any
  //For Undo Redo
  _config: any = {
    canvasState: [],
    currentStateIndex: -1,
    undoStatus: false,
    redoStatus: false,
    disableUndo: true,
    disableRedo: true,
    undoFinishedStatus: 1,
    redoFinishedStatus: 1
  };

  // for zoom
  isFitToScreen: any = true;
  isZoomMenuItemClicked: any = false;
  is_payment_done: boolean = false;

  counterInterval: any = undefined;
  request_data = {
    "is_human": "1",
    "platform": "3",
    "app_id": "1",
    "is_debug": "1",
    "is_editor": "1"
  }
  login_response: any;
  download_url: any;

  ngOnDestroy(): void {
    $(window).unbind('resize', this.windowResizeRef);
    document.removeEventListener("keydown", this.KeyRef, false);
  }

  constructor(public dialogRef: MatDialogRef<AppComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public utils: UtilsService, public dialog: MatDialog, public dataService: DataService, public premiumService: PremiumService) {
    this.KeyRef = this.shortCuts.bind(this);
    document.addEventListener("keydown", this.KeyRef, false);
    // this.utils.showLoader();
  }

  ngOnInit(): void {
    // this.src = this.data;
    // this.prepareRemover(this.src);
    this.is_dialog_close = false;
    if (this.data) {
      let that = this;
      that.is_process = false;
      that.is_image = true;
      // this.utils.showLoader();
      this.src = this.data;
      if (this.src.search('blob:') != -1) {
        let img = new Image();
        img.src = this.data;
        img.onload = function () {
          var canvas = document.createElement("canvas")
          var context = canvas.getContext("2d")
          canvas.width = img.width;
          canvas.height = img.height;
          context!.drawImage(img, 0, 0) // i assume that img.src is your blob url
          var dataurl = canvas.toDataURL('image/png');
          var blob = that.dataURLtoBlob(dataurl);
          let file = that.dataService.blobToFile(blob, 'tmp.png');
          let editor_file: any = [];
          editor_file.push(file);
          that.uploadImgOncanvas(editor_file);
        }

      }
      else {
        this.convertUrlToFile(this.src).then(async (response) => {
          let editor_file: any = [];
          editor_file.push(response.file);
          that.uploadImgOncanvas(editor_file);
        });
      }

      // this.prepareRemover(this.src);
    }
    var login_response = this.dataService.getLocalStorageData('l_r');
    if (login_response.user_detail.subscr_expiration_time && (login_response.user_detail.role_id != 2) && (login_response.user_detail.role_id != 3) && (login_response.user_detail.role_id != 4)) {
      this.user_free = false;
    }
    else {
      this.user_free = true;
    }
  }

  shortCuts(e) {
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === KEYCODES.PLUS || e.keyCode === KEYCODES.NUMPLUS)) {
      e.preventDefault();
      this.setZoom(this.zoomLevel, 'plus');
    }
    if ((e.ctrlKey || e.metaKey) && (e.keyCode === KEYCODES.MINUS || e.keyCode === KEYCODES.NUMMINUS)) {
      e.preventDefault();
      this.setZoom(this.zoomLevel, 'minus');
    }
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.keyCode === KEYCODES.Z) {
      e.preventDefault();
      if (!this._config.disableUndo) {
        this.undo();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.keyCode === KEYCODES.Y) {
      e.preventDefault();
      if (!this._config.disableRedo) {
        this.redo();
      }
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === KEYCODES.Z) {
      e.preventDefault();
      if (!this._config.disableRedo) {
        this.redo();
      }
    }
  }

  toggleBg() {
    this.isDark = !this.isDark;
  }
  isCanvasBlank(ids) {
    const blank = document.createElement('canvas');
    var canvas2 = <HTMLCanvasElement>document.getElementById(ids);
    var w = canvas2.width;
    var h = canvas2.height;
    blank.width = w;
    blank.height = h;
    return canvas2.toDataURL() === blank.toDataURL();
  }
  prepareRemover(image_url) {
    var that = this;
    if (this.isCanvasBlank('removerCanvas') == true) {
      this.canvas = new fabric.Canvas('removerCanvas', {
        backgroundColor: '',
        hoverCursor: 'pointer',
        selection: true,
        selectionBorderColor: '#00c3f9',
        selectionColor: 'rgba(0, 195, 249, 0.2)',
        preserveObjectStacking: true,
        originX: 'center',
        originY: 'center',
        renderOnAddRemove: false,

      });
    }

    this.tmpCanvas = $('#removerCanvas').offset();
    this.offsetX = this.tmpCanvas.left;
    this.offsetY = this.tmpCanvas.top;
    var that = this;
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function () {
      let max = 2000;
      if (image.height > image.width && image.height > max) {
        // portrait iamge
        let scalefactor = max / image.height;
        that.canvas.setHeight(Math.round(image.height * scalefactor));
        that.canvas.setWidth(Math.round(image.width * scalefactor));
        that.imageHeight = Math.round(image.height * scalefactor);
        that.imageWidth = Math.round(image.width * scalefactor);
      }
      else if (image.width >= image.height && image.width > 3000) {
        // landscape image
        let scalefactor = max / image.width;
        that.canvas.setHeight(Math.round(image.height * scalefactor));
        that.canvas.setWidth(Math.round(image.width * scalefactor));
        that.imageHeight = Math.round(image.height * scalefactor);
        that.imageWidth = Math.round(image.width * scalefactor);
      } else {
        that.canvas.setHeight(image.height);
        that.canvas.setWidth(image.width);
        that.imageHeight = image.height;
        that.imageWidth = image.width;

      }

      that.canvas.setBackgroundImage(image_url, function () {
        that.canvas.renderAll();
        that.resizeCanvas();
        that.canvasElement = document.getElementById('removerCanvas');
        that.ctx = that.canvasElement.getContext("2d");
        that._config = {
          canvasState: [],
          currentStateIndex: -1,
          undoStatus: false,
          redoStatus: false,
          disableUndo: true,
          disableRedo: true,
          undoFinishedStatus: 1,
          redoFinishedStatus: 1
        };
        that.updateCanvasState();
      }, {
        crossOrigin: 'anonymous',
        scaleX: that.canvas.width / image.width,
        scaleY: that.canvas.height / image.height,
      });
      that.is_response = true;
    };
    image.src = image_url;


    // below code is for reinitialize context and update offset then canvas move from their place.
    $(".aspectRatio").scroll(function () {
      that.reInitializeContext();
    });
    this.windowResizeRef = that.reInitializeContext.bind(this);
    $(window).bind('resize', this.windowResizeRef);
    // for custom cursor for eraser
    this.mEraser = new fabric.Circle({
      left: -10000,
      top: -10000,
      radius: this.cursorRadius,
      fill: 'rgba(255, 0, 0, 0.6)',
      stroke: "black",
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      objectCaching: true,
      strokeWidth: 2
    });

    this.canvas.on({
      'path:created': (e) => {
        e.path.set({
          selectable: false,
          evented: false,
          stroke: '#FF0000',
          globalCompositeOperation: 'destination-out',
          lockMovementX: true,
          lockMovementY: true,
          lockScalingX: true,
          lockScalingY: true,
          lockUniScaling: true,
          lockRotation: true,
        })
        that.canvas.sendBackwards(e.path);
        this.canvas.renderAll();
        this._config.disableUndo = false;
        this._config.disableRedo = false;
        this.updateCanvasState();
      },
      'object:selected': (e) => {
      },
      'mouse:move': (evt) => {
        var mouse = this.canvas.getPointer(evt.e);
        if (this.isEraser) {
          this.mEraser.set({ top: mouse.y, left: mouse.x }).setCoords();
          this.canvas.renderAll();
        }
        if ((this.isAuto || this.isFlood) && !this.isEraser && !this.isErasing) {
          var mouse = this.canvas.getPointer(evt.e);
          var x = evt.e.pageX - this.offsetX;
          var y = evt.e.pageY - this.offsetY;
          var p = this.ctx.getImageData(x, y, 1, 1).data;
          var radius = 5;
          var sample = this.ctx.getImageData(x - radius / 2, y - radius / 2, radius, radius)
          this.getDataUrlFromData(sample, radius, radius).then((result: any) => {
            $('#sample-container').css('background', 'url(' + result + ')');
            $('#sample-container').css('background-repeat', 'no-repeat');
            $('#sample-container').css('background-size', 'cover');
            $('#sample-container').css('position', 'fixed');
            var off = $('.aspectRatio').offset();
            var xPos = evt.e.pageX - off!.left;
            var yPos = evt.e.pageY - off!.top;
            $('#sample-container').css('left', xPos + 70);
            $('#sample-container').css('top', yPos);
          });
          // $('.control-container').css('background-color', 'rgba(' + p[0] + ',' + p[1] + ',' + p[2] + ',' + p[3] + ')');
        }
      },
      'mouse:over': () => {
        if ((this.isAuto || this.isFlood) && !this.isEraser && !this.isErasing) {
          $('#sample-container').css('display', 'block');
        }
        if (that.isEraser) {
          // that.mEraser.set({ top: -200, left: -200 }).setCoords();
          var isExist = false;
          this.canvas.forEachObject(element => {
            if (element.type == 'circle') {
              isExist = true
            }
          });
          if (!isExist) {
            this.canvas.discardActiveObject().renderAll();
            this.canvas.add(this.mEraser);
            that.canvas.renderAll();
          }
        }
      },
      'mouse:out': () => {
        // put circle off screen
        if (that.isEraser) {
          that.mEraser.set({ top: -200, left: -200 }).setCoords();
          that.canvas.renderAll();
        }
        if ((this.isAuto || this.isFlood) && !this.isEraser && !this.isErasing) {
          $('#sample-container').css('display', 'none');
        }
      },
      'mouse:up': (evt) => {
        // console.log(this.isAuto,this.isFlood);
        if (this.isErasing) {
          this.isErasing = false;
        }
        if (this.isAuto && !this.isEraser && !this.isErasing) {
          // var mouse = that.canvas.getPointer(evt.e);
          var x = evt.e.pageX - that.offsetX;
          var y = evt.e.pageY - that.offsetY;
          var p = this.ctx.getImageData(x, y, 1, 1).data;
          var color = {
            r: p[0],
            g: p[1],
            b: p[2],
            a: p[3]
          }
          var newColor = { r: 0, g: 0, b: 0, a: 0 };
          this.Rmin = color.r - this.colorIntensity;
          this.Rmax = color.r + this.colorIntensity;
          this.Gmin = color.g - this.colorIntensity;
          this.Gmax = color.g + this.colorIntensity;
          this.Bmin = color.b - this.colorIntensity;
          this.Bmax = color.b + this.colorIntensity;
          for (var i = 0; i < this.imgData.data.length; i += 4) {
            var r = this.imgData.data[i],
              g = this.imgData.data[i + 1],
              b = this.imgData.data[i + 2];
            if (r >= this.Rmin && r <= this.Rmax && g >= this.Gmin && g <= this.Gmax && b >= this.Bmin && b <= this.Bmax) {
              this.imgData.data[i] = newColor.r;
              this.imgData.data[i + 1] = newColor.g;
              this.imgData.data[i + 2] = newColor.b;
              this.imgData.data[i + 3] = newColor.a;
            }
          }
          // this.ctx.putImageData(this.imgData, 0, 0);
          this.getDataUrlFromData(this.imgData, this.canvas.getWidth(), this.canvas.getHeight()).then((result: any) => {
            this.canvas.setBackgroundImage(result, () => {
              this.canvas.renderAll.bind(this.canvas);
              this.canvas.renderAll();
              // this.canvasModified = true;
              this._config.disableUndo = false;
              this._config.disableRedo = false;
              this.updateCanvasState();
            }, {
              // crossOrigin: 'anonymous',
              width: this.canvas.getWidth() / this.zoomLevel,   // resize image in zoomout mode so set zoom level to maintain original viewport size
              height: this.canvas.getHeight() / this.zoomLevel
            });

            // alternating method ofr replace image

            // var img = new Image();
            // img.crossOrigin = 'anonymous';
            // img.onload = function () {
            //   that.canvas.remove(that.mainImage);
            //   that.mainImage = null;
            //   that.mainImage = new fabric.Image(img);
            //   that.mainImage.crossOrigin = 'anonymous';
            //   that.mainImage.set({
            //     left: 0,
            //     top: 0,
            //     height: img.height / that.zoomLevel,
            //     width: img.width / that.zoomLevel,
            //     padding: 0,
            //     hasControls: false,
            //     selectable: false,
            //     evented: false
            //   });
            //   that.canvas.add(that.mainImage);
            //   that.canvas.renderAll();
            // }
            // img.src = result
          });
        }
        if (this.isFlood && !this.isEraser && !this.isErasing) {
          // console.log(this.imgData,"-- imgData",this.canvas.getWidth(),this.canvas.getHeight());
          var x = evt.e.pageX - that.offsetX;
          var y = evt.e.pageY - that.offsetY;
          var newColor = { r: 0, g: 0, b: 0, a: 0 };
          this.floodFill(this.imgData, newColor, x, y);


          this.getDataUrlFromData(this.imgData, this.canvas.getWidth(), this.canvas.getHeight()).then((result: any) => {
            // console.log(result,"- result");

            this.canvas.setBackgroundImage(result, () => {
              this.canvas.renderAll();
              this._config.disableUndo = false;
              this._config.disableRedo = false;
              this.updateCanvasState();
            }, {
              width: this.canvas.getWidth() / this.zoomLevel,
              height: this.canvas.getHeight() / this.zoomLevel
            });
          });
        }
      },
      'mouse:down': (e) => {
        if (this.isEraser) {
          this.isErasing = true
        }
      }
    });
  }

  resetCanvas() {
    // let dialogRef = this.dialog.open(ClearConfirmationComponent, { disableClose: true, autoFocus: false, panelClass: 'clear-info-container' });
    // dialogRef.componentInstance.display_title = "Reset confirmation";
    // dialogRef.componentInstance.display_msg = "Your image will be reset, are you sure you want to reset?";
    // dialogRef.componentInstance.okText = "Reset";
    // dialogRef.componentInstance.cancelText = "Cancel";
    // dialogRef.componentInstance.color = "#db1436";
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res == true || res == undefined) {
    //     this.utils.showLoader();
    //     this.canvas.clear();
    //     // this.prepareRemover(this.src);
    //     this.tmpCanvas = $('#removerCanvas').offset();
    //     this.offsetX = this.tmpCanvas.left;
    //     this.offsetY = this.tmpCanvas.top;
    //     var that = this;
    //     var image = new Image();
    //     image.crossOrigin = 'anonymous';
    //     image.onload = function () {
    //       // that.canvas.setHeight(image.height);
    //       // that.canvas.setWidth(image.width);
    //       // that.imageHeight = image.height;
    //       // that.imageWidth = image.width;
    //       let max = 2000;
    //       if (image.height > image.width && image.height > max) {
    //         // portrait iamge
    //         let scalefactor = max / image.height;
    //         that.canvas.setHeight(Math.round(image.height * scalefactor));
    //         that.canvas.setWidth(Math.round(image.width * scalefactor));
    //         that.imageHeight = Math.round(image.height * scalefactor);
    //         that.imageWidth = Math.round(image.width * scalefactor);
    //         // that.canvas.width =that.canvas.width / that.zoomLevel;
    //         // that.canvas.height =that.canvas.height / that.zoomLevel;
    //       }
    //       else if (image.width >= image.height && image.width > 3000) {
    //         // landscape image
    //         let scalefactor = max / image.width;
    //         that.canvas.setHeight(Math.round(image.height * scalefactor));
    //         that.canvas.setWidth(Math.round(image.width * scalefactor));
    //         that.imageHeight = Math.round(image.height * scalefactor);
    //         that.imageWidth = Math.round(image.width * scalefactor);

    //       } else {
    //         that.canvas.setHeight(image.height);
    //         that.canvas.setWidth(image.width);
    //         that.imageHeight = image.height;
    //         that.imageWidth = image.width;

    //       }

    //       that.canvas.setBackgroundImage(that.src, function () {
    //         that.canvas.renderAll();
    //         that.zoomLevel = 1;
    //         that.setZoom(that.zoomLevel, '');
    //         that.resizeCanvas();
    //         that.canvasElement = document.getElementById('removerCanvas');
    //         that.ctx = that.canvasElement.getContext("2d");
    //         // that.ctx.imageSmoothingEnabled = true
    //         that._config = {
    //           canvasState: [],
    //           currentStateIndex: -1,
    //           undoStatus: false,
    //           redoStatus: false,
    //           disableUndo: true,
    //           disableRedo: true,
    //           undoFinishedStatus: 1,
    //           redoFinishedStatus: 1
    //         };
    //         that.updateCanvasState();
    //         that.reInitializeContext();
    //         that.utils.hideLoader();
    //         that.is_bgremove = false;
    //       }, { crossOrigin: 'anonymous' ,
    //       scaleY: that.canvas.height / image.height,
    //       scaleX: that.canvas.width / image.width,
    //     });

    //     };
    //     image.src = this.src;

    //   }
    // });
  }
  getDataUrlFromData(data, width, height): Promise<any> {
    return new Promise((resolve) => {
      var c = document.createElement('canvas');
      c.setAttribute('id', '_temp_canvas');
      c.width = width;
      c.height = height;
      try {
        c.getContext('2d')!.putImageData(data, 0, 0);
      } catch (error) {
        console.log('error', error);
      }
      resolve(c.toDataURL());
    });
  }

  /*
  * Purpose: For check the maximum and minumum limit of given value. 
  * Description: This method contains three parameter which are described below.
  * 
  * @params 
  *      currentVal: number = contain the current value and must be number (Required)
  *      max: number = conatin the maximum value and must be number (Required)
  *      max: number = conatin the minimum value and must be number (Required)
  * 
  * Return : This method return value within minimum or maximum criteria.   
  */
  checkLimitBeforeApplyForInputSlider(currentVal: number, max: number, min: number) {
    if (currentVal > min) {
      if (currentVal > max) {
        return max;
      }
      else {
        return currentVal;
      }
    }
    else {
      if (currentVal < min) {
        return min;
      }
      else {
        return currentVal
      }
    }
  }

  /*
  * Purpose: For check the maximum and minumum limit of intensity and set. 
  * Description: This method contains one parameter which are described below.
  * 
  * @params 
  *      intensity: number = contain the current value of intensity and must be number (Required)
  *      type: string = conatin the type of color intensity and must be string (Required)
  */
  setColorIntencity(intensity: number, type: string) {
    if (type === 'auto') {
      if (intensity == null) {
        this.colorIntensity = this.prevColorIntensity
      }
      this.colorIntensity = this.checkLimitBeforeApplyForInputSlider(Math.round(this.colorIntensity), 100, 0);
      this.prevColorIntensity = this.colorIntensity;
    }
    else {
      if (intensity == null) {
        this.floodColorIntensity = this.prevFloodColorIntensity
      }
      this.floodColorIntensity = this.checkLimitBeforeApplyForInputSlider(Math.round(this.floodColorIntensity), 100, 0);
      this.prevFloodColorIntensity = this.floodColorIntensity;
    }
  }
  changeEraserSize(size) {
    size = parseInt(size.target.value)

    if (size == null) {
      size = this.prevCursorRadius;
    }
    size = this.checkLimitBeforeApplyForInputSlider(Math.round(size), 100, 0);
    this.cursorRadius = size;
    this.prevCursorRadius = size;
    if (!this.tmp) {
      this.tmpCircle = new fabric.Circle({
        top: (this.canvas.getHeight() / 2) - (size / 2),
        left: (this.canvas.getWidth() / 2) - (size / 2),
        fill: 'rgba(255, 0, 0, 0.6)',
        radius: size,
        stroke: 'black',
        evented: false,
        selectable: false
      })
      this.canvas.add(this.tmpCircle);
      this.canvas.renderAll();
      this.tmp = true;
    }
    else {
      this.tmpCircle.set({
        radius: size,
        top: (this.canvas.getHeight() / 2) - (size / 2),
        left: (this.canvas.getWidth() / 2) - (size / 2),
      });
      this.canvas.renderAll();
    }
    var that = this;
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (that.tmpCircle) {
        that.canvas.remove(that.tmpCircle)
        that.tmp = false;
      }
    }, 200);
    this.mEraser.set({ radius: size });
    this.canvas.freeDrawingBrush.width = size * 2;
  }

  resizeCanvas() {
    var referenceMaxwidth = window.innerWidth - 400;
    var referenceMaxHeight = window.innerHeight - 170;

    while (this.canvas.width > referenceMaxwidth) {
      this.zoomLevel -= 0.01;
      this.zoomLevel = Number(this.zoomLevel.toFixed(2));

      this.canvas.setZoom(this.zoomLevel);
      this.canvas.setDimensions({
        width: this.imageWidth * this.zoomLevel,
        height: this.imageHeight * this.zoomLevel
      });
    }
    this.canvas.renderAll.bind(this.canvas);
    while (this.canvas.height > referenceMaxHeight) {
      this.zoomLevel -= 0.01;
      this.zoomLevel = Number(this.zoomLevel.toFixed(2));

      this.canvas.setZoom(this.zoomLevel);
      this.canvas.setDimensions({
        width: this.imageWidth * this.zoomLevel,
        height: this.imageHeight * this.zoomLevel
      });
    }
    this.canvas.renderAll.bind(this.canvas);
  }

  resetZoom() {
    this.canvas.setZoom(1);
    this.zoomLevel = 1;
    this.canvas.setDimensions({
      width: this.imageWidth,
      height: this.imageHeight
    });
    this.isFitToScreen = false;
    this.isZoomMenuItemClicked = true;
  }

  fitToScreen() {
    this.resetZoom();
    this.resizeCanvas();
    this.isFitToScreen = true;
    this.isZoomMenuItemClicked = true;
  }

  setZoomFromOption(lvl) {
    this.zoomLevel = lvl;
    this.setZoom(lvl, '');
    this.isFitToScreen = false;
    this.isZoomMenuItemClicked = true;
  }

  setZoom(zoomlevel, mode): Promise<void> {
    return new Promise((resolve) => {
      var that = this;
      switch (mode) {
        case 'minus':
          this.zoomLevel = this.zoomLevel - this.stepSize;
          this.zoomLevel = Number(this.zoomLevel.toFixed(2));
          if (this.zoomLevel <= 0.1) {
            this.zoomLevel = 0.1;
          }
          break;

        case 'plus':
          this.zoomLevel = this.zoomLevel + this.stepSize;
          this.zoomLevel = Number(this.zoomLevel.toFixed(2));
          if (this.zoomLevel >= this.maxsize) {
            this.zoomLevel = this.maxsize;
          }
          break;

        case '':
          this.zoomLevel = zoomlevel;
          break;

      }
      this.canvas.setZoom(this.zoomLevel);
      this.canvas.setDimensions({
        width: this.imageWidth * this.zoomLevel,
        height: this.imageHeight * this.zoomLevel
      });
      this.canvas.renderAll.bind(this.canvas);

      // below code is for context position when canvas zoom
      setTimeout(() => {
        that.reInitializeContext();
        resolve();
      }, 1000);
    });
  }

  selectEraserType(type) {
    let that = this;
    this.tmpCanvas = $('#removerCanvas').offset();
    this.offsetX = this.tmpCanvas.left;
    this.offsetY = this.tmpCanvas.top;
    switch (type) {
      case 'auto':
        if (that.isAuto === true) {
          that.isAuto = false;
          this.canvas.defaultCursor = 'none';
          $('.right-bar-body').css('outline', 'none');
        }
        else if (that.isAuto === false) {
          $('.auto-body').css('outline', '2px solid  #72B1FE');
          $('.erase-body').css('outline', 'none');
          $('.flood-body').css('outline', 'none');
          that.isAuto = true;
          this.isEraser = false;
          this.isFlood = false;
          // this.utils.showLoader();
          this.resetZoom();
          // this.isAuto = true;
          this.ctx.globalCompositeOperation = 'source-atop';
          this.canvas.remove(this.mEraser);
          this.canvas.set({
            defaultCursor: 'crosshair'
          })
          this.canvas.isDrawingMode = false;
          // this.imgData = this.ctx.getImageData(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
          /* this.getDataUrlFromData(this.imgData, this.canvas.getWidth() * this.zoomLevel, this.canvas.getHeight() * this.zoomLevel).then(results => {
          }) */
          // this.pix = this.imgData.data;
          setTimeout(() => {
            this.reInitializeContext();
            // this.utils.hideLoader();
          }, 1000);
          // var newCanvas = document.createElement('canvas');
          // newCanvas.setAttribute('id', 'abc');
          // newCanvas.height = 1000;
          // newCanvas.width = 1000;
          // var c = newCanvas.getContext('2d');
          // c.imageSmoothingEnabled = true;
          // c.putImageData(this.imgData, 0, 0);
        }
        break;

      case 'eraser':
        if (that.isEraser === true) {
          that.isEraser = false;
          $('.right-bar-body').css('outline', 'none');
        }
        else if (that.isEraser === false) {
          $('.erase-body').css('outline', '2px solid  #72B1FE');
          $('.auto-body').css('outline', 'none');
          $('.flood-body').css('outline', 'none');
          this.isAuto = false;
          this.isFlood = false;
          that.isEraser = true;
          this.canvas.isDrawingMode = true;
          this.canvas.freeDrawingCursor = 'none';
          this.canvas.defaultCursor = 'none';
          this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
          this.canvas.freeDrawingBrush.width = this.cursorRadius * 2;
          this.canvas.freeDrawingBrush.color = 'rgba(255, 0, 0, 0.6)';
          this.ctx.globalCompositeOperation = 'destination-out';
          // this.isEraser = true;
          this.canvas.discardActiveObject().renderAll();
          this.canvas.add(this.mEraser);
          this.canvas.renderAll();
        }
        break;

      case 'flood':
        if (that.isFlood === true) {
          that.isFlood = false;
          this.canvas.defaultCursor = 'none';
          $('.right-bar-body').css('outline', 'none');
        }
        else if (that.isFlood === false) {
          $('.flood-body').css('outline', '2px solid  #72B1FE');
          $('.erase-body').css('outline', 'none');
          $('.auto-body').css('outline', 'none');
          that.isFlood = true;
          this.isAuto = false;
          this.isEraser = false;

          // this.utils.showLoader();
          this.resetZoom();
          // this.isFlood = true;
          this.ctx.globalCompositeOperation = 'source-atop';
          this.canvas.remove(this.mEraser);
          this.canvas.set({
            defaultCursor: 'crosshair'
          })
          this.canvas.isDrawingMode = false;
          // this.imgData = this.ctx.getImageData(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
          // this.pix = this.imgData.data;
          setTimeout(() => {
            this.reInitializeContext();
            // this.utils.hideLoader();
          }, 1000);
        }
        break;

      case '':
        this.isNone = true;
        this.ctx.globalCompositeOperation = 'source-atop';
        this.canvas.remove(this.mEraser);
        this.canvas.set({
          defaultCursor: 'default'
        })
        this.canvas.isDrawingMode = false;
        break;
    }
  }

  download() {
    this.isEraser = false;
    this.isAuto = false;
    this.isFlood = false;

    var login_response = this.dataService.getLocalStorageData('l_r');
    
    if (login_response.user_detail.subscr_expiration_time && login_response.user_detail.role_id != 2 && login_response.user_detail.role_id != 3 && login_response.user_detail.role_id != 4 || (this._config.disableUndo == true || this.is_bgremove == false)) {
      // this.utils.showLoader();
      try {
        let that = this;
        let Blank_Canvas;
        this.selectEraserType('');
        var base64 = this.canvas.toDataURL({ format: 'png', multiplier: 1 / this.zoomLevel });
        this.removeTransparentBg(base64).then(async (results: any) => {
          if (that.isCanvasBlank('removerCanvas') == false) {
            // this.resizeImage(results.base64).then(async (results: any) => {
            let image = new Image();
            image.src = results.base64;
            image.onload = function () {
              if (typeof base64 != 'undefined' && base64 !== null && base64 != '') {
                var link = document.createElement('a');
                link.download = 'PhotoAdKing-BGremove.png';
                link.href = results.base64;
                link.click();
                // that.utils.hideLoader();
                $('.mat-button-focus-overlay').css('opacity', '0');
                $('.right-bar-body').css('outline', 'none');
              }
              else {
                // that.utils.hideLoader();
              }
            }
            // this.dialogRef.close({ res: true, base64: results.base64, is_payment_done: this.is_payment_done });
            // this.utils.hideLoader();
            // })
            // });
          }
          else {
            // this.utils.showError("Blank image can't be download",false,5000);
            $('.mat-button-focus-overlay').css('opacity', '0');
            $('.right-bar-body').css('outline', 'none');
            // this.utils.hideLoader();
          }
        });
        // });
      } catch (e) {
        console.log(e);
        // this.utils.hideLoader();
      }
    }
    else {
      let that = this;
      // this.utils.paymentTrackingGA('open_pro_dialog', 'save_to_upload_from_bg_remover', 'Background remover');
      this.premiumService.showPaymentDialog({ isOnlyPro: true, is_limit_exceeded: true, message: "Subscribe with PRO Plan to use this Feature.", title: 'Tools Access', content: "Subscribe with PRO Plan to use this Feature." }, function () {
        // that.utils.paymentTrackingGA('close_pro_dialog_auto', 'save_to_upload_from_bg_remover', 'Background remover');
        // that.utils.paymentTrackingGA('payment_success', 'save_to_upload_from_bg_remover', 'Background remover');
        that.is_payment_done = true;
        that.user_free = false;
        that.download();
      }, function () {
        // that.utils.paymentTrackingGA('close_pro_dialog_user', 'save_to_upload_from_bg_remover', 'Background remover');
        // that.utils.hideLoader();
      }, 'save_to_upload_from_bg_remover');
    }
  }
  Save() {
    this.isEraser = false;
    this.isAuto = false;
    this.isFlood = false;
    var login_response = this.dataService.getLocalStorageData('l_r');
    // Ask for payment to user if user is free/monthly starter/monthly pro and user have applied object/human bgremove tool.
    if (login_response.user_detail.subscr_expiration_time && login_response.user_detail.role_id != 2 && login_response.user_detail.role_id != 3 && login_response.user_detail.role_id != 4 || (this._config.disableUndo == true || this.is_bgremove == false)) {
      // this.utils.showLoader();
      try {
        this.selectEraserType('');
        var base64 = this.canvas.toDataURL({ format: 'png', multiplier: 1 / this.zoomLevel });
        this.removeTransparentBgForSave(base64).then(async (results: any) => {
          $('.mat-button-focus-overlay').css('opacity', '0');
          if (typeof results.base64 != 'undefined' && results.base64 !== null && results.base64 != '')
            this.dialogRef.close({ res: true, base64: base64, is_payment_done: this.is_payment_done });

        });
      } catch (e) {
        // this.utils.hideLoader();
      }
    }
    else {
      let that = this;
      // this.utils.paymentTrackingGA('open_pro_dialog', 'save_to_upload_from_bg_remover', 'Background remover');
      this.premiumService.showPaymentDialog({ isOnlyPro: true, is_limit_exceeded: true, message: "Subscribe with PRO Plan to use this Feature.", title: 'Tools Access', content: "Subscribe with PRO Plan to use this Feature." }, function () {
        // that.utils.paymentTrackingGA('close_pro_dialog_auto', 'save_to_upload_from_bg_remover', 'Background remover');
        // that.utils.paymentTrackingGA('payment_success', 'save_to_upload_from_bg_remover', 'Background remover');
        that.is_payment_done = true;
        that.user_free = false;
        that.Save();
      }, function () {
        // that.utils.paymentTrackingGA('close_pro_dialog_user', 'save_to_upload_from_bg_remover', 'Background remover');
        // that.utils.hideLoader();

      }, 'save_to_upload_from_bg_remover');
      $('.mat-button-focus-overlay').css('opacity', '0');
    }
  }

  SaveToUpload() {
    let that = this;
    var login_response = this.dataService.getLocalStorageData('l_r');
    // Ask for payment to user if user is free/monthly starter/monthly pro and user have applied object/human bgremove tool.
    if (login_response.user_detail.subscr_expiration_time && login_response.user_detail.role_id != 2 && login_response.user_detail.role_id != 3 && login_response.user_detail.role_id != 4 || (that._config.disableUndo == true || this.is_bgremove == false)) {
      // this.utils.showLoader();
      var base64 = this.canvas.toDataURL({ format: 'png', multiplier: 1 / this.zoomLevel });
      this.removeTransparentBgForSave(base64).then(async (results: any) => {
        // this.resizeImage(results.base64).then(async (results: any) => {
        if (typeof results.base64 == 'undefined' || results.base64 == null || results.base64 == "") {
          // this.utils.hideLoader();
          return;
        }
        else {


          // var base64 = results.base64;
          var blob = that.dataURLtoBlob(base64);
          var file = that.dataService.blobToFile(blob, 'tmp.png');
          var formdata = new FormData();
          formdata.append('file[]', file, 'untitled.png');
          that.uploadImageIntoServerForReuse(formdata);
        }
      }).catch(err => {
        console.log(err);
      })

    } else {
     
      let that = this;
      // this.utils.paymentTrackingGA('open_pro_dialog', 'save_to_upload_from_bg_remover', 'Background remover');
      this.premiumService.showPaymentDialog({ isOnlyPro: true, is_limit_exceeded: true, message: "Subscribe with PRO Plan to use this Feature.", title: 'Tools Access', content: "Subscribe with PRO Plan to use this Feature." }, function () {
        
        that.is_payment_done = true;
        that.user_free = false;
        that.SaveToUpload();
      }, function () {
        
      }, 'save_to_upload_from_bg_remover');
      $('.mat-button-focus-overlay').css('opacity', '0');
    }
  }

  uploadImageIntoServerForReuse(formdata) {
    this.dataService.postData('uploadImageByUser', formdata, {
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('ut')
      }
    }).subscribe((results: any) => {
      if (results.code == 200) {
        
        $('.mat-button-focus-overlay').css('opacity', '0');
      }
      else if (results.code == 432) {
        
        let that = this;
        // this.utils.paymentTrackingGA('open_pro_dialog', 'save_to_upload_from_bg_remover', 'Background remover');
        this.premiumService.showPaymentDialog({ isOnlyPro: true, is_limit_exceeded: true, message: results.message, title: upload_limit_exceed.title, content: results.message }, function () {
          
          that.is_payment_done = true;
          that.uploadImageIntoServerForReuse(formdata);
        }, function () {
          
        }, 'save_to_upload_from_bg_remover');
      }
      else if (results.code == 201) {
        $('.mat-button-focus-overlay').css('opacity', '0');
        
      }
      else if (results.code == 417) {
        $('.mat-button-focus-overlay').css('opacity', '0');
        
      }
      else {
        $('.mat-button-focus-overlay').css('opacity', '0');
        
      }
    }, err => {
      $('.mat-button-focus-overlay').css('opacity', '0');
      
      console.log(err);
    })
  }

  resizeImage(base64): Promise<any> {
    return new Promise(async (resolve: any) => {
      if (typeof base64 == 'undefined' || base64 == null || base64 == "") {
        return resolve({ 'base64': base64 });
      }
      var cnv = await document.createElement('canvas');
      cnv.setAttribute('id', 'resize_canvas');
      var blob = this.dataURLtoBlob(base64);
      var blobUrl = URL.createObjectURL(blob);
      var img = new Image();
      var that = this;
      img.crossOrigin = 'anonymous';
      img.onload = async function () {
        cnv.width = that.i_width;
        cnv.height = that.i_height;
        var ctx = cnv.getContext('2d');
        // ctx.imageSmoothingEnabled = true;
        ctx!.drawImage(img, 0, 0, cnv.width, cnv.height);
        let imageSize = await that.utils.calculateImageSize(base64.split(',')[1], 'mb');
        if (imageSize >= maxFileSize) {
          while (imageSize > maxFileSize) {
            var max, scalefactor, cHeight = cnv.height, cWidth = cnv.width;
            if (cHeight > cWidth) {
              max = cHeight - 10;
              scalefactor = max / cHeight;
            }
            else if (cWidth >= cHeight) {
              max = cWidth - 10;
              scalefactor = max / cWidth;
            }
            cnv.height = Math.round(cHeight * scalefactor);
            cnv.width = Math.round(cWidth * scalefactor);
            var ctx = cnv.getContext('2d');
            // ctx.imageSmoothingEnabled = true;
            ctx!.drawImage(img, 0, 0, cnv.width, cnv.height);

            var data = await cnv.toDataURL('image/png');
            imageSize = await that.utils.calculateImageSize(data.split(',')[1], 'mb');
          }
          var finalData = await cnv.toDataURL('image/png');
          if (document.getElementById('resize_canvas')) {
            document.getElementById('resize_canvas')?.remove();
          }
          resolve({ base64: finalData })
        }
        else {
          if (document.getElementById('resize_canvas')) {
            document.getElementById('resize_canvas')?.remove();
          }
          resolve({ base64: base64 });
        }
      }
      img.onerror = async function () {
        if (document.getElementById('resize_canvas')) {
          document.getElementById('resize_canvas')?.remove();
        }
        resolve({ base64: base64 });
      }
      img.src = blobUrl;
    });
  }

  async removeTransparentBg(base64): Promise<any> {
    return new Promise(async (resolve) => {
      var cnv = await document.createElement('canvas');
      cnv.setAttribute('id', 'blank_canvas');
      var blob = this.dataURLtoBlob(base64);
      var blobUrl = URL.createObjectURL(blob);
      var img = new Image();
      var that = this;
      img.crossOrigin = 'anonymous';
      img.onload = async function () {
        // cnv.width = img.width;
        // cnv.height = img.height;
        cnv.width = that.i_width;
        cnv.height = that.i_height;
        var wrh = img.width / img.height;
        var newWidth = cnv.width;
        var newHeight = newWidth / wrh;
        if (newHeight > cnv.height) {
          newHeight = cnv.height;
          newWidth = newHeight * wrh;
        }
        var ctx = cnv.getContext('2d');
        ctx!.drawImage(img, 0, 0, newWidth, newHeight);
        var data = await that.trimCanvas(cnv);
        if (document.getElementById('blank_canvas')) {
          document.getElementById('blank_canvas')?.remove();
        }
        if (data == '') {
          resolve({ 'base64': '' })
        }
        else {
          resolve({ 'base64': cnv.toDataURL() });
        }
      }
      img.src = blobUrl;
    });
  }
  async removeTransparentBgForSave(base64): Promise<any> {
    return new Promise(async (resolve) => {
      var cnv = await document.createElement('canvas');
      cnv.setAttribute('id', 'blank_canvas');
      var blob = this.dataURLtoBlob(base64);
      var blobUrl = URL.createObjectURL(blob);
      var img = new Image();
      var that = this;
      img.crossOrigin = 'anonymous';
      img.onload = async function () {
        cnv.width = img.width;
        cnv.height = img.height;
        var ctx = cnv.getContext('2d');
        // ctx.imageSmoothingEnabled = true;
        ctx!.drawImage(img, 0, 0);
        var data = await that.trimCanvas(cnv);
        if (document.getElementById('blank_canvas')) {
          document.getElementById('blank_canvas')?.remove();
        }
        resolve({ 'base64': data });
      }
      img.src = blobUrl;
    });
  }

  async trimCanvas(c) {
    var ctx = c.getContext('2d'),
      copy = await document.createElement('canvas').getContext('2d'),
      pixels = await ctx.getImageData(0, 0, c.width, c.height),
      l = pixels.data.length,
      i, bound = {
        top: null,
        left: null,
        right: null,
        bottom: null
      }, x, y;
    for (i = 0; i < l; i += 4) {
      if (pixels.data[i + 3] !== 0) {
        x = (i / 4) % c.width;
        y = ~~((i / 4) / c.width);

        if (bound.top === null) {
          bound.top = y;
        }

        if (bound.left === null) {
          bound.left = x;
        } else if (x < bound.left) {
          bound.left = x;
        }

        if (bound.right === null) {
          bound.right = x;
        } else if (bound.right < x) {
          bound.right = x;
        }

        if (bound.bottom === null) {
          bound.bottom = y;
        } else if (bound.bottom < y) {
          bound.bottom = y;
        }
      }
    }
    // below condition is true thwn image is not fully transparent. if user erase whole image then below bounds are null
    if (bound && bound.left !== null && bound.top !== null && bound.right !== null && bound.bottom !== null) {
      var trimHeight = bound.bottom - bound.top,
        trimWidth = bound.right - bound.left,
        trimmed = await ctx.getImageData(bound.left, bound.top, trimWidth, trimHeight);
      copy!.canvas.width = trimWidth;
      copy!.canvas.height = trimHeight;
      await copy!.putImageData(trimmed, 0, 0);
      return copy!.canvas.toDataURL();
    } else {
      // this.utils.showError("Blank Image can't be saved", '', 3000);
      return '';
    }
  }

  reInitializeContext() {
    this.tmpCanvas = $('#removerCanvas').offset();
    this.offsetX = this.tmpCanvas.left;
    this.offsetY = this.tmpCanvas.top;
    this.canvasElement = document.getElementById('removerCanvas');
    this.ctx = this.canvasElement.getContext("2d");
    // this.ctx.imageSmoothingEnabled = true;
    this.imgData = this.ctx.getImageData(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
    this.pix = this.imgData.data;
  }

  //Convert base64 img to Blob
  dataURLtoBlob(dataurl) {
    // ,mime = 'image/jpeg'
    let parts = dataurl.split(','), mime = parts[0].match(/:(.*?);/)[1]
    if (parts[0].indexOf('base64') !== -1) {
      let bstr = atob(parts[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    } else {
      let raw = decodeURIComponent(parts[1]);
      return new Blob([raw], { type: mime });
    }
  }

  // flood fill algorithm functions

  getColorAtPixel(imageData, x, y) {
    const { width, data } = imageData
    return {
      r: data[4 * (width * y + x) + 0],
      g: data[4 * (width * y + x) + 1],
      b: data[4 * (width * y + x) + 2],
      a: data[4 * (width * y + x) + 3]
    }
  }

  setColorAtPixel(imageData, color, x, y) {
    const { width, data } = imageData
    data[4 * (width * y + x) + 0] = color.r & 0xff
    data[4 * (width * y + x) + 1] = color.g & 0xff
    data[4 * (width * y + x) + 2] = color.b & 0xff
    data[4 * (width * y + x) + 3] = color.a & 0xff
  }

  // not in use
  colorMatch(a, c) {
    var r = a.r;
    var g = a.g;
    var b = a.b;
    this.fRmin = c.r - this.floodColorIntensity;
    this.fRmax = c.r + this.floodColorIntensity;
    this.fGmin = c.g - this.floodColorIntensity;
    this.fGmax = c.g + this.floodColorIntensity;
    this.fBmin = c.b - this.floodColorIntensity;
    this.fBmax = c.b + this.floodColorIntensity;
    return r >= this.fRmin && r <= this.fRmax && g >= this.fGmin && g <= this.fGmax && b >= this.fBmin && b <= this.fBmax
  }

  floodFill(imageData, newColor, x, y) {
    try {
      x = Math.round(x);
      y = Math.round(y);
      const { width, height, data } = imageData
      const stack: any = []
      const baseColor = this.getColorAtPixel(imageData, x, y);
      let operator = { x, y }

      // Check if base color and new color are the same
      // if (this.colorMatch(baseColor, newColor)) {
      if (this.ColourDistance(baseColor, newColor, true)) {
        return
      }

      // Add the clicked location to stack
      stack.push({ x: operator.x, y: operator.y })

      while (stack.length) {
        operator = stack.pop()
        let contiguousDown = true // Vertical is assumed to be true
        let contiguousUp = true // Vertical is assumed to be true
        let contiguousLeft = false
        let contiguousRight = false

        // Move to top most contiguousDown pixel
        while (contiguousUp && operator.y >= 0) {
          operator.y--
          // contiguousUp = this.colorMatch(this.getColorAtPixel(imageData, operator.x, operator.y), baseColor);
          contiguousUp = this.ColourDistance(this.getColorAtPixel(imageData, operator.x, operator.y), baseColor);
        }

        // Move downward
        while (contiguousDown && operator.y < height) {
          this.setColorAtPixel(imageData, newColor, operator.x, operator.y)

          // Check left
          // if (operator.x - 1 >= 0 && this.colorMatch(this.getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
          if (operator.x - 1 >= 0 && this.ColourDistance(this.getColorAtPixel(imageData, operator.x - 1, operator.y), baseColor)) {
            if (!contiguousLeft) {
              contiguousLeft = true
              stack.push({ x: operator.x - 1, y: operator.y })
            }
          } else {
            contiguousLeft = false
          }

          // Check right
          // if (operator.x + 1 < width && this.colorMatch(this.getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
          if (operator.x + 1 < width && this.ColourDistance(this.getColorAtPixel(imageData, operator.x + 1, operator.y), baseColor)) {
            if (!contiguousRight) {
              stack.push({ x: operator.x + 1, y: operator.y })
              contiguousRight = true
            }
          } else {
            contiguousRight = false
          }

          operator.y++
          // contiguousDown = this.colorMatch(this.getColorAtPixel(imageData, operator.x, operator.y), baseColor)
          contiguousDown = this.ColourDistance(this.getColorAtPixel(imageData, operator.x, operator.y), baseColor)
        }
      }
    } catch (error) {
      console.log('error', error);
    }
  }

  ColourDistance(c1, c2, match = false) {
    if (match == true) {
      if (c1.r <= 15 && c1.g <= 15 && c1.b <= 15) {
        if (c1.a == c2.a) {
          return true;
        }
        else {
          c2.r = 255;
          c2.g = 255;
          c2.b = 255;
          c2.a = 0;
        }
      }
    }
    else {
      /* if (c1.r == c2.r && c1.g == c2.g && c1.b == c2.b) {
        if (c1.a == c2.a) {
          return true;
        }
        else {
          c2.r = 255;
          c2.g = 255;
          c2.b = 255;
          c2.a = 0;
        }
      } */
    }
    let rmean = (c1.r + c2.r) / 2;
    let r = c1.r - c2.r;
    let g = c1.g - c2.g;
    let b = c1.b - c2.b;
    let weightR = 2 + rmean / 256;
    let weightG = 4.0;
    let weightB = 2 + (255 - rmean) / 256;
    let distance = Math.sqrt(weightR * r * r + weightG * g * g + weightB * b * b)
    return distance <= this.floodColorIntensity;
  }
  // undo redo functions

  updateCanvasState() {
    if ((this._config.undoStatus == false && this._config.redoStatus == false)) {
      var jsonData = this.canvas.toJSON(custom_attributes);
      jsonData.objects = jsonData.objects.filter(function (obj) {
        return obj.type !== 'circle';
      });
      var canvasAsJson = JSON.stringify(jsonData);
      if (this._config.currentStateIndex < this._config.canvasState.length - 1) {
        var indexToBeInserted = this._config.currentStateIndex + 1;
        this._config.canvasState[indexToBeInserted] = canvasAsJson;
        var numberOfElementsToRetain = indexToBeInserted + 1;
        this._config.canvasState = this._config.canvasState.splice(0, numberOfElementsToRetain);
      } else {
        this._config.canvasState.push(canvasAsJson);
      }
      this._config.currentStateIndex = this._config.canvasState.length - 1;
      if ((this._config.currentStateIndex == this._config.canvasState.length - 1) && this._config.currentStateIndex != -1) {
        this._config.disableRedo = true;
      }
      /* this.utils.hideLoader(); */
    }
    else {
      /* this.utils.hideLoader(); */
    }
  }

  undo() {
    let that = this;
    // that.utils.hideLoader();
    if (that._config.undoFinishedStatus) {
      // this.utils.showLoader();
      if (that._config.currentStateIndex == -1) {
        that._config.undoStatus = false;
        // that.utils.hideLoader();
      }
      else {
        if (that._config.canvasState.length >= 1) {
          that._config.undoFinishedStatus = 0;
          if (that._config.currentStateIndex != 0) {
            that._config.undoStatus = true;
            let currentInx = JSON.parse(that._config.canvasState[that._config.currentStateIndex - 1]);
            // if (that.ORIGINAL_CANVAS && that.ORIGINAL_CANVAS.overlayImage) {
            //   currentInx.overlayImage = that.ORIGINAL_CANVAS.overlayImage;
            // }

            // that.canvas.setWidth()
            // that._config.canvasState[that._config.currentStateIndex - 1] = JSON.stringify(currentInx);
            that.canvas.loadFromJSON(that._config.canvasState[that._config.currentStateIndex - 1], function () {
              var jsonData = JSON.parse(that._config.canvasState[that._config.currentStateIndex - 1]);
              // if(jsonData.backgroundImage.width != that.i_width || jsonData.backgroundImage.height != that.i_height){
              let max = 2000;
              if (jsonData.backgroundImage.height > jsonData.backgroundImage.width && jsonData.backgroundImage.height > max) {
                // portrait iamge
                let scalefactor = max / jsonData.backgroundImage.height;
                that.canvas.setHeight(Math.round(jsonData.backgroundImage.height * scalefactor));
                that.canvas.setWidth(Math.round(jsonData.backgroundImage.width * scalefactor));
                that.imageHeight = Math.round(jsonData.backgroundImage.height * scalefactor);
                that.imageWidth = Math.round(jsonData.backgroundImage.width * scalefactor);
                that.canvas.width = that.canvas.width / that.zoomLevel;
                that.canvas.height = that.canvas.height / that.zoomLevel;
              }
              else if (jsonData.backgroundImage.width >= jsonData.backgroundImage.height && jsonData.backgroundImage.width > 3000) {
                // landscape jsonData.backgroundImage
                let scalefactor = max / jsonData.backgroundImage.width;
                that.canvas.setHeight(Math.round(jsonData.backgroundImage.height * scalefactor));
                that.canvas.setWidth(Math.round(jsonData.backgroundImage.width * scalefactor));
                that.imageHeight = Math.round(jsonData.backgroundImage.height * scalefactor);
                that.imageWidth = Math.round(jsonData.backgroundImage.width * scalefactor);
                that.canvas.width = that.canvas.width / that.zoomLevel;
                that.canvas.height = that.canvas.height / that.zoomLevel;
              } else {
                that.canvas.setHeight(jsonData.backgroundImage.height);
                that.canvas.setWidth(jsonData.backgroundImage.width);
                that.imageHeight = jsonData.backgroundImage.height;
                that.imageWidth = jsonData.backgroundImage.width;
                that.canvas.width = that.canvas.width / that.zoomLevel;
                that.canvas.height = that.canvas.height / that.zoomLevel;
              }
              // }

              that.canvas.set({
                scaleY: that.canvas.height / jsonData.backgroundImage.height,
                scaleX: that.canvas.width / jsonData.backgroundImage.width,

              });

              that.canvas.forEachObject(function (o, i) {
                o.lockMovementX = true;
                o.lockMovementY = true;
                o.lockScalingX = false;
                o.lockScalingY = false;
                o.lockUniScaling = true;
                o.lockRotation = true;
                // o.hasControls = false;
                // o.hasRotatingPoint = false;
                o.selectable = false;
                o.evented = false;
              });

              that.canvas.renderAll();
              that.canvas.setZoom(that.zoomLevel);
              that.canvas.setDimensions({
                width: that.imageWidth * that.zoomLevel,
                height: that.imageHeight * that.zoomLevel
              });
              // that.resizeCanvas();
              that.reInitializeContext();
              that._config.undoStatus = false;
              that._config.currentStateIndex -= 1;
              that._config.disableUndo = false;
              if (that._config.currentStateIndex !== that._config.canvasState.length - 1) {
                that._config.disableRedo = false;
              }
              if (that._config.currentStateIndex == 0) {
                that._config.disableUndo = true;
              }
              that._config.undoFinishedStatus = 1;
              // that.renderStackObjects();
              // that.utils.hideLoader();
            });
          }
          else if (that._config.currentStateIndex == 0) {
            that.canvas.clear();
            // that.isZoom = false;
            // that.zoomLevel = 1;
            that._config.undoFinishedStatus = 1;
            that._config.disableUndo = true;
            that._config.disableRedo = false;
            that._config.currentStateIndex -= 1;
            // that.utils.hideLoader();
          }
          else {
            // that.utils.hideLoader();
          }
        }
        else {
          // that.utils.hideLoader();
        }
      }
    }
  }

  redo() {
    let that = this;
    // that.utils.hideLoader();
    if (that._config.redoFinishedStatus) {
      // this.utils.showLoader();
      if ((that._config.currentStateIndex == that._config.canvasState.length - 1) && that._config.currentStateIndex != -1) {
        that._config.disableRedo = true;
        // that.utils.hideLoader();
      } else {
        if (that._config.canvasState.length > that._config.currentStateIndex && that._config.canvasState.length != 0) {
          that._config.redoFinishedStatus = 0;
          that._config.redoStatus = true;
          let currentInx = JSON.parse(that._config.canvasState[that._config.currentStateIndex + 1]);
          // if (that.ORIGINAL_CANVAS && that.ORIGINAL_CANVAS.overlayImage) {
          //   currentInx.overlayImage = that.ORIGINAL_CANVAS.overlayImage;
          // }
          // that._config.canvasState[that._config.currentStateIndex + 1] = JSON.stringify(currentInx);
          that.canvas.loadFromJSON(that._config.canvasState[that._config.currentStateIndex + 1], function () {
            var jsonData = JSON.parse(that._config.canvasState[that._config.currentStateIndex + 1]);
            if (jsonData.backgroundImage.width != that.i_width || jsonData.backgroundImage.height != that.i_height) {
              let max = 2000;
              if (jsonData.backgroundImage.height > jsonData.backgroundImage.width && jsonData.backgroundImage.height > max) {
                // portrait iamge
                let scalefactor = max / jsonData.backgroundImage.height;
                that.canvas.setHeight(Math.round(jsonData.backgroundImage.height * scalefactor));
                that.canvas.setWidth(Math.round(jsonData.backgroundImage.width * scalefactor));
                that.imageHeight = Math.round(jsonData.backgroundImage.height * scalefactor);
                that.imageWidth = Math.round(jsonData.backgroundImage.width * scalefactor);
                that.canvas.width = that.canvas.width / that.zoomLevel;
                that.canvas.height = that.canvas.height / that.zoomLevel;
              }
              else if (jsonData.backgroundImage.width >= jsonData.backgroundImage.height && jsonData.backgroundImage.width > 3000) {
                // landscape jsonData.backgroundImage
                let scalefactor = max / jsonData.backgroundImage.width;
                that.canvas.setHeight(Math.round(jsonData.backgroundImage.height * scalefactor));
                that.canvas.setWidth(Math.round(jsonData.backgroundImage.width * scalefactor));
                that.imageHeight = Math.round(jsonData.backgroundImage.height * scalefactor);
                that.imageWidth = Math.round(jsonData.backgroundImage.width * scalefactor);
                that.canvas.width = that.canvas.width / that.zoomLevel;
                that.canvas.height = that.canvas.height / that.zoomLevel;
              } else {
                that.canvas.setHeight(jsonData.backgroundImage.height);
                that.canvas.setWidth(jsonData.backgroundImage.width);
                that.imageHeight = jsonData.backgroundImage.height;
                that.imageWidth = jsonData.backgroundImage.width;
                that.canvas.width = that.canvas.width / that.zoomLevel;
                that.canvas.height = that.canvas.height / that.zoomLevel;
              }
            }
            that.canvas.set({

              scaleY: that.canvas.height / jsonData.backgroundImage.height,
              scaleX: that.canvas.width / jsonData.backgroundImage.width,

            });
            that.canvas.forEachObject(function (o, i) {
              o.lockMovementX = true;
              o.lockMovementY = true;
              o.lockScalingX = true;
              o.lockScalingY = true;
              o.lockUniScaling = true;
              o.lockRotation = true;
              // o.hasControls = false;
              // o.hasRotatingPoint = false;
              o.selectable = false;
              o.evented = false;
            });

            that.canvas.renderAll();

            that.canvas.setZoom(that.zoomLevel);
            that.canvas.setDimensions({
              width: that.imageWidth * that.zoomLevel,
              height: that.imageHeight * that.zoomLevel
            });
            //  that.resizeCanvas();
            that.reInitializeContext();
            that._config.redoStatus = false;
            that._config.currentStateIndex += 1;
            if (that._config.currentStateIndex != -1) {
              that._config.disableUndo = false;
            }
            that._config.redoFinishedStatus = 1;
            if ((that._config.currentStateIndex == that._config.canvasState.length - 1) && that._config.currentStateIndex != -1) {
              that._config.disableRedo = true;
            }
            // that.utils.hideLoader();
          });
        }
        else {
          // that.utils.hideLoader();
        }
      }
    }
  }


  close(res) {
    if (this.canvasElement != null) {
      this.canvas.clear();
    }
    $('.new-cs-overlay').remove();
    $('.c-img-btn').remove();
    this.is_dialog_close = true;
    this.dialogRef.close({ res: false, is_payment_done: this.is_payment_done });
  }

  removeTrailZero(event) {
    if (event.target.value) { event.target.value = Math.round(event.target.value) };
  }

  continousIncrement(propetyType, max, step) {
    if (this[propetyType] != max) {
      this[propetyType] = Number(this[propetyType]) + step;
      this.callFunctionAsPerProperty(propetyType);
    }
    this.counterInterval = setTimeout(() => {
      this.continousIncrement(propetyType, max, step)
    }, 150);
  }

  continousDecrement(propetyType, min, step) {
    if (this[propetyType] != min) {
      this[propetyType] = Number(this[propetyType]) - step;
      this.callFunctionAsPerProperty(propetyType);
    }
    this.counterInterval = setTimeout(() => {
      this.continousDecrement(propetyType, min, step)
    }, 150);
  }

  callFunctionAsPerProperty(propType) {
    switch (propType) {
      case "cursorRadius":
        this.changeEraserSize(this.cursorRadius);
        break;
      case "colorIntensity":
        this.setColorIntencity(this.colorIntensity, 'auto');
        break;
      case "floodColorIntensity":
        this.setColorIntencity(this.floodColorIntensity, 'flood');
        break;
    }
  }

  timeoutStop() {
    clearTimeout(this.counterInterval);
  }
  blobUrlToFile = (blobUrl: string): Promise<File> => new Promise((resolve) => {
    fetch(blobUrl).then((res) => {
      res.blob().then((blob) => {
        const fileName = blobUrl.substring(blobUrl.lastIndexOf('/') + 1)
        // please change the file.extension with something more meaningful
        // or create a utility function to parse from URL
        const file = new File([blob], fileName, { type: blob.type });
        resolve(file)
      })
    })
  });
  convertBase64(url): Promise<any> {
    return new Promise(async (resolve) => {
      let image = new Image();
      image.crossOrigin = 'anonymous';
      image.onload = function () {

        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        let dataURL;
        canvas.height = image.height;
        canvas.width = image.width;
        ctx!.drawImage(image, 0, 0);
        dataURL = canvas.toDataURL();
        resolve({ 'base64': dataURL })

        // callback(dataURL);
      }
      image.src = url;
    });
  }
  // getBase64FromUrl = async (url) => {
  //   const data = await fetch(url);
  //   const blob = await data.blob();
  //   return new Promise((resolve) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(blob);
  //     reader.onloadend = () => {
  //       const base64data = reader.result;
  //       resolve(base64data);
  //     }
  //   });

  // }
  fileUpload = (formData) => {
    const that = this;
    $.ajax({
      headers: { 'api-key': '6a2b65c9-d0ca-40c2-99ae-817c53f1496f', 'Authorization': 'Bearer' + localStorage.getItem("ut") },
      url: 'https://backgroundremover.site/public/api/backgroundRemoval',
      data: formData,
      processData: false,
      contentType: false,
      type: 'POST',
      success: function (data) {
        let result = JSON.parse(JSON.stringify(data));
        let r_url = result.data.img_url;
        try {

          if (result.code == 200) {
            $(".c-btn").animate({
              "width": 100 + '%'
            }, {
              duration: 2500,
            });
            $(".c-btn-text").text("Removing Background");
            setTimeout(() => {
              let image = new Image();

              image.onload = function () {
                if (that.is_dialog_close == false) {
                  that.convertBase64(r_url + "?not-from-cache-please").then(async (response) => {
                    // that.getBase64FromUrl(result.data.img_url).then((base64) => {
                    let max = 2000;
                    if (image.height > image.width && image.height > max) {
                      let scalefactor = max / image.height;
                      that.canvas.setHeight(Math.round(image.height * scalefactor));
                      that.canvas.setWidth(Math.round(image.width * scalefactor));
                      that.imageHeight = Math.round(image.height * scalefactor);
                      that.imageWidth = Math.round(image.width * scalefactor);
                      // that.canvas.width =that.canvas.width / that.zoomLevel;
                      // that.canvas.height =that.canvas.height / that.zoomLevel;
                    }
                    else if (image.width >= image.height && image.width > 3000) {
                      // landscape image
                      let scalefactor = max / image.width;
                      that.canvas.setHeight(Math.round(image.height * scalefactor));
                      that.canvas.setWidth(Math.round(image.width * scalefactor));
                      that.imageHeight = Math.round(image.height * scalefactor);
                      that.imageWidth = Math.round(image.width * scalefactor);
                      // that.canvas.width =that.canvas.width / that.zoomLevel;
                      // that.canvas.height =that.canvas.height / that.zoomLevel;
                    } else {
                      that.canvas.setHeight(image.height);
                      that.canvas.setWidth(image.width);
                      that.imageHeight = image.height;
                      that.imageWidth = image.width;
                      // that.canvas.width =that.canvas.width / that.zoomLevel;
                      // that.canvas.height =that.canvas.height / that.zoomLevel;

                    }
                    // that.removeTransparentBg(base64).then(async (results: any) => {
                    //   that.resizeImage(results.base64).then(async (results: any) => {
                    that.canvas.setBackgroundImage(response.base64, function () {
                      that.canvas.renderAll.bind(that.canvas);
                      that.canvas.renderAll();
                      // that.utils.hideLoader();
                      that.resizeCanvas();
                      that.canvasElement = document.getElementById('removerCanvas');
                      if (that.is_dialog_close == false) {
                        that.ctx = that.canvasElement.getContext("2d");

                        // that.ctx.imageSmoothingEnabled = true;

                        that._config.disableUndo = false;
                        that._config.disableRedo = false;
                        that.updateCanvasState();
                        // that.utils.showSuccess(result.message, false, 5000);
                        that.is_response = true;
                        $('.new-cs-overlay').remove();
                        $('.c-img-btn').remove();
                        $('.right-bar-body').css('outline', 'none');
                        that.is_bgremove = true;
                        that.is_process = false;
                      }
                    }, {
                      // crossOrigin: 'anonymous',
                      scaleX: that.canvas.width / image.width,
                      scaleY: that.canvas.height / image.height,
                      // scaleX: 1,
                      // scaleY: 1,
                    });
                    // that.canvas.set({
                    //   scaleY: that.canvas.height / image.height,
                    //   scaleX: that.canvas.width / image.width,

                    //      });
                    // })
                  })
                  // that.getBase64FromUrl(result.data.img_url).then((base64) => {
                  //   let res_base64: any = new Image();
                  //   res_base64.src = base64;
                  //   res_base64.onload = function () {
                  //     let max = 2000;
                  //     // if (image.height > image.width && image.height > max) {
                  //     //   let scalefactor = max / image.height;
                  //     //   that.canvas.setHeight(Math.round(image.height * scalefactor));
                  //     //   that.canvas.setWidth(Math.round(image.width * scalefactor));
                  //     //   that.imageHeight = Math.round(image.height * scalefactor);
                  //     //   that.imageWidth = Math.round(image.width * scalefactor);
                  //     // }
                  //     // else if (image.width >= image.height && image.width > 3000) {

                  //     // //   // landscape image
                  //     //   // let scalefactor = max / image.width;
                  //     //   // that.canvas.setHeight(Math.round(image.height * scalefactor));
                  //     //   // that.canvas.setWidth(Math.round(image.width * scalefactor));
                  //     //   // that.imageHeight = Math.round(image.height * scalefactor);
                  //     //   // that.imageWidth = Math.round(image.width * scalefactor);
                  //     // } else {

                  //       that.canvas.setHeight(image.height);
                  //       that.canvas.setWidth(image.width);
                  //       that.imageHeight = image.height;
                  //       that.imageWidth = image.width;

                  //     // }
                  //     // that.removeTransparentBg(base64).then(async (results: any) => {
                  //     //   that.resizeImage(results.base64).then(async (results: any) => {
                  //     that.canvas.setBackgroundImage(base64, function () {
                  //       that.canvas.renderAll.bind(that.canvas);
                  //       that.canvas.renderAll();
                  //       // that.utils.hideLoader();
                  //       that.resizeCanvas();
                  //       that.canvasElement = document.getElementById('removerCanvas');
                  //       that.ctx = that.canvasElement.getContext("2d");
                  //       // that.ctx.imageSmoothingEnabled = true;

                  //       that._config.disableUndo = false;
                  //       that._config.disableRedo = false;
                  //       that.updateCanvasState();
                  //       that.utils.showSuccess(result.message, false, 5000);
                  //       that.is_response = true;
                  //       $('.new-cs-overlay').remove();
                  //       $('.c-img-btn').remove();
                  //       that.is_process = false;

                  //     }, {
                  //       crossOrigin: 'anonymous',
                  //       // scaleX: that.canvas.width / image.width,
                  //       // scaleY: that.canvas.height / image.height,
                  //       scaleX: 1,
                  //       scaleY: 1,
                  //     });
                  //   }
                  // })
                }
              }
              image.src = r_url;
            }, 5000);
          }
          else {
            console.log("err");
            // that.utils.showError(result.message, false, 5000);
            that.is_response = true;
            that.is_process = false;
          }

        }
        catch (err) {
          console.log(err);
          that.is_response = true;
          that.is_process = false;
          // that.utils.showError(ERROR.SERVER_INTERNET_ERR, true, ERROR_TIMEOUT.LONG);
        }

      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        if (XMLHttpRequest.readyState == 0) {
          that.is_response = true;
          that.is_process = false;
          that._config.disableUndo = false;
          that._config.disableRedo = false;
          // that.utils.showError(ERROR.SERVER_INTERNET_ERR, true, ERROR_TIMEOUT.LONG);
          console.log(textStatus, errorThrown);
        }
      }
    });
  }
  ResizecanavsImg(file): Promise<any> {
    return new Promise(async (resolve) => {
      let that = this;
      this.process(file, function (compress_url, url) {
        resolve({ 'file': compress_url });
      });
    });
  }

  RemoveBg(tab_cls) {
    let that = this;
    this.canvas.defaultCursor = 'none';
    this.isAuto = false;
    this.isEraser = false;
    this.isFlood = false;
    that._config.disableUndo = true;
    that._config.disableRedo = true;
    $('.' + tab_cls).css('outline', '2px solid  #72B1FE');
    $('.erase-body').css('outline', 'none');
    $('.auto-body').css('outline', 'none');
    $('.flood-body').css('outline', 'none');
    // var login_response = this.dataService.getLocalStorageData('l_r');
    // if (login_response.user_detail.subscr_expiration_time && this.utils.compareDateWithCurrentDate(login_response.user_detail.subscr_expiration_time) == -1 && login_response.user_detail.role_id != 2) {
    let new_cs_overlay = `
    <div class="new-cs-overlay"  style="height: 100%;width: ${this.canvas.width}px;position: absolute;left: 0;top: 0;background: linear-gradient(0deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4));" *ngIf="is_response == false">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          style="margin: auto; display: block; shape-rendering: auto;transform: translate(-50%, -50%);left: 50%;position: absolute;top: 50%;"
          width="48px" height="48px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <circle cx="50" cy="50" fill="none" stroke="#ffffff" stroke-width="6" r="35"
            stroke-dasharray="164.93361431346415 56.97787143782138">
            <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s"
              values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform>
          </circle>
        </svg>
      </div>
    `;
    $('.canvas-container').append(new_cs_overlay);
    let btn = '';
    btn += `
<button class="c-img-btn" style="pointer-events:none!important;padding: 0;width: 300px;overflow: hidden;height: 50px;border: 6px solid #FFFFFF;font-family: Montserrat, sans-serif;color: #ffffff;border-radius: 63px;background-color: #0069FF;box-shadow: 0px 0px 16px rgba(0, 0, 0, 0.25);position: absolute;bottom: -58px;left: 50%;transform: translate(-50%, -50%);"><div class="position-relative c-btn" style="white-space: nowrap;background-color:#3387ff;height: 100%;width:0%;line-height: 2.2;z-indez:1;"></div>
<span class="position-relative c-img-text" style="z-index:2;top:-30px !important"><span class="c-btn-text">Scanning</span> 
<svg style="display: inline-flex;position: inherit;top: 7px" class="corner-del-icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"><path _ngcontent-c8="" d="M328 256c0 39.8-32.2 72-72 72s-72-32.2-72-72 32.2-72 72-72 72 32.2 72 72zm104-72c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72zm-352 0c-39.8 0-72 32.2-72 72s32.2 72 72 72 72-32.2 72-72-32.2-72-72-72z" fill="#FFFFFF"></path></svg></span></button>
`;
    $('.canvas-container').append(btn);
    this.is_response = false;
    this.is_process = true;
    $(".c-btn").animate({
      "width": 50 + '%'
    }, {
      duration: 5000,
    });

    let formData = new FormData();
    try {
      let that = this;
      var base64 = this.canvas.toDataURL({ format: 'png', multiplier: 1 / this.zoomLevel });
      this.removeTransparentBg(base64).then(async (results: any) => {
        // this.resizeImage(results.base64).then(async (results: any) => {
        if (typeof results.base64 == 'undefined' || results.base64 == null || results.base64 == "") {

          return this.is_response = true;;
        }
        else {
          var base64 = results.base64;
          var blob = this.dataURLtoBlob(base64);
          var file = this.dataService.blobToFile(blob, 'tmp.png');
          if (file.size > 5000000) {
            that.ResizecanavsImg(file).then(async (response: any) => {
              if (response.file.size > 5000000) {
                this.is_response = true;
                // this.is_process = false;
                that._config.disableUndo = false;
                that._config.disableRedo = false;
                // that.utils.showError('This file exceeds the maximum upload size of 5 MB', false, 5000);
              }
              else {
                that.tmp_file = response.file;
                formData.append('image', that.tmp_file, 'tmp.png');
                if (tab_cls == 'remove-bg-object') {
                  this.request_data.is_human = '0';
                }
                else if (tab_cls == 'remove-bg-human') {
                  this.request_data.is_human = '1';
                }
                formData.append('request_data', JSON.stringify(this.request_data));
                this.fileUpload(formData);
              }
            })

          }
          else {
            that.tmp_file = file;
            formData.append('image', that.tmp_file, 'tmp.png');
            if (tab_cls == 'remove-bg-object') {
              this.request_data.is_human = '0';
            }
            else if (tab_cls == 'remove-bg-human') {
              this.request_data.is_human = '1';
            }
            formData.append('request_data', JSON.stringify(this.request_data));
            this.fileUpload(formData);
          }
        }


      });

      // }
      // });
      // });
      // });
    }
    catch (err) {
      console.log(err);
    }

  }

  process(cfile, callback) {
    const file = cfile;
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function (event) {
      const csv = reader.result;
      const imgElement = document.createElement("img");
      imgElement.src = reader.result!.toString();

      imgElement.onload = function (e) {
        try {
          var quality = 25,
            output_format = 'jpeg';
          let srcEncoded = '';
          let that = this;
          srcEncoded = compress(imgElement, quality, output_format).src;
          let canvas2 = document.createElement('canvas');
          let image = new Image();
          image.src = srcEncoded;
          image.onload = function () {
            // canvas2.width = image.width;
            // canvas2.height = image.height;
            // const ctx = canvas2.getContext('2d');
            // ctx.drawImage(image, 0, 0, canvas2.width, canvas2.height);
            // srcEncoded = canvas2.toDataURL("image/png",).replace("image/png", "image/octet-stream");
            fetch(srcEncoded)
              .then(response => response.blob())
              .then(blob => new File([blob], cfile.name, {
                type: blob.type
              }))
              .then(file => {
                callback(file, srcEncoded);
              })
              .catch(err => {
                console.log(err);
              })
          }
        }
        catch (err) {
          console.log(err);

        };

        imgElement.onerror = function (err) {
          console.log(err);
        }
      };
    }
  }


  fileChange(event) {
    let that = this;
    if (event.target.files && event.target.files[0]) {
      this.uploadImgOncanvas(event.target.files);
    }
  }
  Upgrade() {
    let that = this;
    var login_response = this.dataService.getLocalStorageData('l_r');
    // if (login_response.user_detail.subscr_expiration_time && this.utils.compareDateWithCurrentDate(login_response.user_detail.subscr_expiration_time) == -1 && login_response.user_detail.role_id != 2 && login_response.user_detail.role_id != 3 && login_response.user_detail.role_id != 4) {
    //   return;
    // }
    // else {
    // let that = this;
    // this.utils.paymentTrackingGA('open_pro_dialog', 'save_to_upload_from_bg_remover', 'Background remover');
    this.premiumService.showPaymentDialog({ isOnlyPro: true, is_limit_exceeded: true, message: "Subscribe with PRO Plan to use this Feature.", title: 'Tools Access', content: "Subscribe with PRO Plan to use this Feature." }, function () {
      // that.utils.paymentTrackingGA('close_pro_dialog_auto', 'save_to_upload_from_bg_remover', 'Background remover');
      // that.utils.paymentTrackingGA('payment_success', 'save_to_upload_from_bg_remover', 'Background remover');
      that.is_payment_done = true;
      that.user_free = false;
      that.Upgrade();
    }, function () {
      // that.utils.paymentTrackingGA('close_pro_dialog_user', 'save_to_upload_from_bg_remover', 'Background remover');
      // that.utils.hideLoader();
    }, 'save_to_upload_from_bg_remover');
    // }

  }
  handleDragEnter(event) {
    event.preventDefault();
    event.stopPropagation();
  }
  drop(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    let files = evt.dataTransfer.files;
    let valid_files: Array<File> = files;
    if (this.src === null) {
      this.uploadImgOncanvas(valid_files);
    }

  }
  uploadImgOncanvas(file) {
    if (!this.data) {
      // this.utils.showLoader();
    }
    let that = this;
    this.file_data = file[0];
    var filePath = file[0].name;
    let img_path = URL.createObjectURL(file[0]);
    let image = new Image();
    image.src = img_path;
    image.onload = function () {
      that.i_width = image.width;
      that.i_height = image.height;

      if (!that.allowedExtensions.exec(filePath)) {
        // that.utils.hideLoader();
        // that.utils.showError('Currently only JPG ,JPEG ,PNG are supported', false, 5000);
      }
      else if ((file[0].size) > 5000000) {
        that.process(file[0], function (compress_url, url) {
          let compress_file: any = [];
          compress_file.push(compress_url);
          if (compress_url.size > 5000000) {
            // that.utils.hideLoader();
            // that.utils.showError('This file exceeds the maximum upload size of 5 MB', false, 5000);
          }
          else {

            that.is_image = true;
            that.is_process = false;
            // img_path = window.URL.createObjectURL(compress_file);
            img_path = window.URL.createObjectURL(new Blob(compress_file, { type: "application/zip" }));
            that.src = img_path;
            that.prepareRemover(img_path);
          }

        });
      }
      else {
        that.src = img_path;
        that.is_process = false;
        that.is_image = true;
        that.prepareRemover(img_path)
      }


    }
  }
  convertUrlToFile(url): Promise<any> {
    var filename = url.substring(url.lastIndexOf('/') + 1);
    return new Promise(async (resolve) => {
      let that = this;
      fetch(url)
        .then(response => response.blob())
        .then(blob => new File([blob], filename, {
          type: blob.type
        }))
        .then(file => {
          resolve({ 'file': file });
        })
        .catch(err => {
          console.log(err);
        })
    });
    // }
  }

}
function compress(source_img_obj, quality: number, output_format: string) {
  var mime_type = "image/jpeg";
  if (typeof output_format !== "undefined" && output_format == "png") {
    mime_type = "image/png";
  }


  var cvs = document.createElement('canvas');
  cvs.width = source_img_obj.naturalWidth;
  cvs.height = source_img_obj.naturalHeight;
  var ctx = cvs.getContext("2d")!.drawImage(source_img_obj, 0, 0);
  var newImageData = cvs.toDataURL(mime_type, quality / 100);
  var result_image_obj = new Image();
  result_image_obj.src = newImageData;
  return result_image_obj;
  // }
  // }
}