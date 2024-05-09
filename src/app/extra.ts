import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { UtilsService } from './utils.service';
import { fabric } from 'fabric'
import {
      BASICSHAPELIST,
      editorTabs,
      CUSTOM_ATTRIBUTES,
      SUBCATEGORY_LIST,
      adblockDetectDefaults,
      ERROR_TIMEOUT,
      add_image_tab_index,
      FILTERMATRIX,
      layer_image_validation,
      blendMode
} from '../app/app.constant';
import { MatSliderChange, ProgressSpinnerMode } from '@angular/material';

// import { DataService } from '../data.service';


declare const adblockDetect: any;
declare let FontFace: any;
declare const fabric: any;
declare const THREE: any;
var removeFromArray = fabric.util.removeFromArray;
var custom_attributes: any[] = CUSTOM_ATTRIBUTES;
let single_catagory_list: any = [];
SUBCATEGORY_LIST.forEach((element: any) => {
      element.subcat_list.forEach((item: any) => {
            single_catagory_list.push(item);
      });
});

// adblockDetect.defaults = adblockDetectDefaults;


fabric.Canvas.prototype.getObjectByAttr = function (attr, value) {
      var objectList = [], index,
            // objects = this.getObjects();
            objects = this.toJSON(CUSTOM_ATTRIBUTES).objects;

      for (var i = 0, len = this.size(); i < len; i++) {
            if (objects[i][attr] && objects[i][attr] === value) {
                  objectList.push(objects[i]);
                  index = i;
            }
      }
      return { object: objectList, objectIndex: index };
};



fabric.crossOrigin = "anonymous";

fabric.Object.prototype.toObject = (function (toObject) {
      return function (propertiesToInclude) {
            propertiesToInclude = (propertiesToInclude || []).concat(
                  CUSTOM_ATTRIBUTES
            );
            return toObject.apply(this, [propertiesToInclude]);
      };
})(fabric.Object.prototype.toObject);


// custon function for hide show in fabric js
fabric.Object.prototype.hide = function () {
      this.set({
            opacity: 0,
            selectable: false,
            visible: false
      });
};

fabric.Object.prototype.show = function () {
      this.set({
            opacity: 1,
            selectable: true,
            visible: true
      });
};


// Define a custom Saturate filter
fabric.Image.filters.Saturate = fabric.util.createClass(fabric.Image.filters.BaseFilter, {
      type: 'Saturate',

      /**
       * Constructor
       * @param {Object} [options] Options object
       */
      initialize: function (options) {
            options = options || {};
            this.saturate = typeof options.saturate !== 'undefined' ? options.saturate : 1; // Default value is 1 (no change)
      },

      /**
       * Apply the filter to the input image data
       * @param {ImageData} imageData Input image data
       */
      applyTo2d: function (options) {
            var imageData = options.imageData;
            var data = imageData.data;
            var len = data.length;
            var adjust = this.saturate;
            var i, max;

            for (i = 0; i < len; i += 4) {
                  max = Math.max(data[i], data[i + 1], data[i + 2]);
                  if (max !== 0) {
                        data[i] += (max - data[i]) * adjust;
                        data[i + 1] += (max - data[i + 1]) * adjust;
                        data[i + 2] += (max - data[i + 2]) * adjust;
                  }
            }

            options.imageData = imageData;
      }
});

fabric.Image.filters.BlendColor.prototype.toObject = function () {
      return fabric.util.object.extend(this.callSuper('toObject'), {
            color: this.color,
            image: this.image,
            mode: this.mode,
            alpha: this.alpha
      });
}

@Component({
      selector: 'app-root',
      templateUrl: './app.component.html',
      styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, OnDestroy {
      @HostListener('document:keydown', ['$event'])

      handleDeleteKeyEvent(event: KeyboardEvent) {
            if (event.key === 'Delete') {
                  this.removeSelected();
            }
      }
      // [x: string]: any;
      setValueforfilter = 0.01;
      title = 'photoadking_editor';
      designName: any = "Untitled Design";
      canvas_container = "calc(100% - 668px)";
      right_width = "240px";
      canvas: any;
      // canvas: fabric.Canvas;
      zoomLevel: any = 100;
      zoomSize: any = 0;
      zoomHeightRef: any = 600;
      zoomWidthRef: any = 1050;
      displayHeight: any = 600;
      displayWidth: any = 1050;
      gridsGroup: any;
      gridH: any;
      gridV: any;
      processKeys: any;
      activeTab: any = {};
      stickers_search_query: any = "";
      tmp_stickers_search_query: any = "";
      templates_search_query: any = "";
      search_message: any = "";
      tmp_templates_search_query: any = "";
      txturs_bg_response: any = {};
      txturs_bg_pg_count: number = 1;
      txturs_bg_itm_pr_pg: number = 50;
      stickers_pg_count: number = 1;
      isTextList: any = false;
      texts_response: any = {};
      texts_pg_count: number = 1;
      texts_itm_pr_pg: number = 50;
      backgroundCatalog_list: any = [];
      templates_pg_count: number = 1;
      stock_photo_search_query: any = "";
      bg_stock_photo_search_query: any = "";
      userUploadList: any = [];
      isUserUploadList: any = false;
      userUpload_bg_pg_count: number = 1;
      userUpload_bg_itm_pr_pg: number = 50;
      userUploadResponse: any = {};
      custom_attributes: any = CUSTOM_ATTRIBUTES;
      isCatalogLoader: any = false;
      formatPainterClipboard: any = {};
      isLastElement: any = false;
      isLocked: any = false;
      selectedObjDeg: any = 0;
      isGridShown: any = true;
      isBgImg: any = false;
      _hexval: any;
      public context: any;
      public Blank_Canvas: any;
      public ORIGINAL_CANVAS: any;
      public filterEditor: boolean = false;
      public selected: any;
      public isImgSelected: boolean = false;
      public isZoom: boolean = false;
      public imageWidth: any;
      public imageHeight: any;

      mode: ProgressSpinnerMode = 'determinate';
      blendMode: any[] = blendMode;
      isFocused: boolean = false;
      isEyeDropperEnable: boolean = false;
      colorPickerCallback: any;
      public props: any = {
            userBackgroundImg: '',
            userSticker: '',
            userFont: '',
            canvasFill: '#ffffff',
            textWidth: 5,
            downloadtype: 'JPG',
            isGradient: false,
            isTextGradient: false,
            gradientMode: 'linear',
            textGradientMode: 'linear',
            gradientDrawMode: false,
            depthColor: '#6692DD', // 3d text
            fontColor: '#000000',  // 3d text
            canvasImage: '',
            drawTextString: '',
            id: null,
            opacity: null,
            fill: null,
            fontSize: null,
            lineHeight: null,
            charSpacing: null,
            fontWeight: null,
            fontStyle: null,
            textAlign: null,
            fontFamily: null,
            TextDecoration: '',
            curvedText: '',
            cornerSize: 10,
            strokeSize: 0.01,
            // strokeType: DashType[0].strokeDashArray,
            strokeColor: '#000000',
            textBgColor: '#000000',
            shadowColor: '#000000',
            shadowBlur: 10,
            shadowOffsetX: 5,
            shadowOffsetY: 5,
            brightness: 0,
            contrast: 0,
            saturation: 0,
            tint: '#ffffff',
            tintOpacity: 0,
            blur: 0,
            sepia: false,
            grayscale: false,
            invert: false,
            blackWhite: false,
            brownie: false,
            vintage: false,
            kodachrome: false,
            technicolor: false,
            blendColor: '#ffffff',
            blendMode: 'add',
            blendAlpha: 1,
            gradient: 0,
            scaleMode: 'Scale Crop',
            iscanvasBackground: false,
            backgroundHeight: 600,
            backgroundWidth: 1050
      };

      isObjectMoving: any = false;
      isObjectScaling: any = false;
      isObjectRotating: any = true; //For check object is rotate or not
      offsetX: any;
      offsetY: any;
      canvasObjectList: any = [];
      dateString = Date.now();
      isLayerTabActivated: any = false;

      dragData: any = {};
      isDraging: any = false;
      isReplaceMode: any = false;
      isOver: any = false;
      removable_attribute_list: any = ['isFromServer', 'uniqueName', 'isModified', 'json', 'uploadFrom', 'ctop', 'cleft', 'cheight', 'cwidth', 'stockphotodetail', 'ischanged', 'stockPhotoItem', 'original_src', 'exclusiveName', 'isTransparent', 'isCroped'];
      layerSelected: any;

      stock_photo_response: any = {};
      stock_photo_pg_count: number = 1;
      stock_photo_itm_pr_pg: number = 200;
      canvasModified: any = false;
      bg_search_query: any = "";
      tmp_bg_search_query: any = "";
      _config = {
            canvasState: [],
            currentStateIndex: -1,
            undoStatus: false,
            redoStatus: false,
            disableUndo: true,
            disableRedo: true,
            undoFinishedStatus: 1,
            redoFinishedStatus: 1
      };
      isStockPhotoList: any = false;

      public size: any = {
            width: 1050,
            height: 600
      };

      public selectedObjPos: any = {
            top: null,
            left: null
      };
      public selectedObjSize: any = {
            height: null,
            width: null
      };
      whatEleWidth: number = 0;
      whatEleHeight: number = 0;
      whatEleScale: number = 1;

      isUploadable: any = false;
      isSavedInHistory: any = false;
      stock_photo_list: any = [
            {
                  "id": 8595521,
                  "pageURL": "https://pixabay.com/photos/forsythia-flowers-branch-8595521/",
                  "type": "photo",
                  "tags": "forsythia, flowers, branch",
                  "previewURL": "https://cdn.pixabay.com/photo/2024/02/25/10/11/forsythia-8595521_150.jpg",
                  "previewWidth": 112,
                  "previewHeight": 150,
                  "webformatURL": "https://pixabay.com/get/g35a87af49ce631ba70a21633e0e87cf11397970962cda3fc445add155e9fea5fcec7907d3e204694f07d876078b08e92_640.jpg",
                  "webformatWidth": 480,
                  "webformatHeight": 640,
                  "largeImageURL": "https://pixabay.com/get/ge57255758cdc346d229b35b5190554004012f0780eff7560762afe928927fd914fe5b16884d40b31ec604da406831cd8dcb4bdebf4e424afdfbc726a98140e71_1280.jpg",
                  "imageWidth": 3024,
                  "imageHeight": 4032,
                  "imageSize": 970371,
                  "views": 63984,
                  "downloads": 52214,
                  "collections": 204,
                  "likes": 1045,
                  "comments": 45,
                  "user_id": 10328767,
                  "user": "Mylene2401",
                  "userImageURL": "https://cdn.pixabay.com/user/2020/08/02/06-54-24-533_250x250.jpeg"
            },
            {
                  "id": 8689111,
                  "pageURL": "https://pixabay.com/illustrations/sunrise-sea-ocean-nature-bird-8689111/",
                  "type": "illustration",
                  "tags": "sunrise, sea, ocean",
                  "previewURL": "https://cdn.pixabay.com/photo/2024/04/11/04/01/sunrise-8689111_150.png",
                  "previewWidth": 100,
                  "previewHeight": 150,
                  "webformatURL": "https://pixabay.com/get/g7fa5ec427b7bf5f386956bc324ae193b4984794ac291df0642a3259d7449addcf3f58c3eb03b4fb0ddc79f3d64bc23ce_640.png",
                  "webformatWidth": 426,
                  "webformatHeight": 640,
                  "largeImageURL": "https://pixabay.com/get/g6802bdf092d3e58d93aea8a1804d4f70dcd0a9bce5ed823d1caa4d5ee6b8feeef4b55a727b181934d6b3c2048174e9c9d11a584a15eeb66ccc5004cd527140ed_1280.png",
                  "imageWidth": 6179,
                  "imageHeight": 9273,
                  "imageSize": 2337751,
                  "views": 133,
                  "downloads": 109,
                  "collections": 16,
                  "likes": 33,
                  "comments": 10,
                  "user_id": 13452116,
                  "user": "Syaibatulhamdi",
                  "userImageURL": "https://cdn.pixabay.com/user/2023/08/17/09-25-12-704_250x250.jpg"
            },
            {
                  "id": 8693258,
                  "pageURL": "https://pixabay.com/illustrations/ai-generated-woman-sunflowers-8693258/",
                  "type": "illustration",
                  "tags": "ai generated, woman, sunflowers",
                  "previewURL": "https://cdn.pixabay.com/photo/2024/04/13/05/56/ai-generated-8693258_150.jpg",
                  "previewWidth": 86,
                  "previewHeight": 150,
                  "webformatURL": "https://pixabay.com/get/gdb8f599685515c3135c19cd62e94a657bef8a6a2eeb9f242f9837bcd73f2c78173971d03bae09270f1b6d84ca0eec011_640.jpg",
                  "webformatWidth": 365,
                  "webformatHeight": 640,
                  "largeImageURL": "https://pixabay.com/get/g150c6dde188f22ea064c38c22a5c83e9ad64590083752120089e3bbd8fcc09af381930772df73a06d680a5029b3928978482ab2fa1bc37d084541a050c9178e6_1280.jpg",
                  "imageWidth": 2310,
                  "imageHeight": 4052,
                  "imageSize": 1874788,
                  "views": 143,
                  "downloads": 98,
                  "collections": 5,
                  "likes": 43,
                  "comments": 0,
                  "user_id": 10327513,
                  "user": "NickyPe",
                  "userImageURL": "https://cdn.pixabay.com/user/2024/02/05/16-05-14-742_250x250.jpg"
            },
            {
                  "id": 8693552,
                  "pageURL": "https://pixabay.com/illustrations/blossoms-white-tree-blossoms-bloom-8693552/",
                  "type": "illustration",
                  "tags": "blossoms, white, tree blossoms",
                  "previewURL": "https://cdn.pixabay.com/photo/2024/04/13/09/05/blossoms-8693552_150.jpg",
                  "previewWidth": 150,
                  "previewHeight": 100,
                  "webformatURL": "https://pixabay.com/get/g8616a95a0151e34a98252db91f53a3213a181541953736e01b7241a5680731a0b4fdfbcdfb9035e3bf9d46fcdc904ab0_640.jpg",
                  "webformatWidth": 640,
                  "webformatHeight": 427,
                  "largeImageURL": "https://pixabay.com/get/gb939ce1d4ce5da2cc3afda0dbb0607eb584f5df5213fd4de28021aad8aea37c9481f65db4a504cf16d2df117ef67a03938baa916713c671152a6e63ec744b67d_1280.jpg",
                  "imageWidth": 6240,
                  "imageHeight": 4160,
                  "imageSize": 4290115,
                  "views": 30,
                  "downloads": 15,
                  "collections": 3,
                  "likes": 45,
                  "comments": 0,
                  "user_id": 10327513,
                  "user": "NickyPe",
                  "userImageURL": "https://cdn.pixabay.com/user/2024/02/05/16-05-14-742_250x250.jpg"
            },
            {
                  "id": 8693260,
                  "pageURL": "https://pixabay.com/illustrations/ai-generated-woman-sunflowers-8693260/",
                  "type": "illustration",
                  "tags": "ai generated, woman, sunflowers",
                  "previewURL": "https://cdn.pixabay.com/photo/2024/04/13/05/58/ai-generated-8693260_150.jpg",
                  "previewWidth": 150,
                  "previewHeight": 85,
                  "webformatURL": "https://pixabay.com/get/ge65cfe0680c35f8c984b5cc43d82a9245da30bea0f04082a3e0222a63971f73058b08dbc804b606bf103548d02d31780_640.jpg",
                  "webformatWidth": 640,
                  "webformatHeight": 362,
                  "largeImageURL": "https://pixabay.com/get/g5a8462df0fcf0e137077c8a963f9a2c3dbbf0c8877fb4bf256bde00b63416b67542687605a8dac1b18377457c180ced95760ac9ae0fbb03251afd56c757a9476_1280.jpg",
                  "imageWidth": 4084,
                  "imageHeight": 2310,
                  "imageSize": 1964301,
                  "views": 154,
                  "downloads": 123,
                  "collections": 4,
                  "likes": 43,
                  "comments": 0,
                  "user_id": 10327513,
                  "user": "NickyPe",
                  "userImageURL": "https://cdn.pixabay.com/user/2024/02/05/16-05-14-742_250x250.jpg"
            }
      ];

      collection_search_query: any = "";
      tmp_collection_search_query: any = "";
      // threedCategory_List: any = threedCategory;
      // sel_threedcategory: any = this.threedCategory_List[0].sub_category_id;
      threedContent_List: any = [];
      threed_pg_count: any = 1;
      threed_itm_pr_pg: any = 60;
      // gradientCollection: any = GRADIENT_COLORS;
      // custom_attributes: any = custom_attributes;
      cloneObjId: number = 0;
      IsPropActive: boolean = true;
      is_layer_active: boolean = false;
      is_page_active: boolean = false;

      stickerCatalog_List: any = ['Flowchart', 'Line', 'Circle', '3D', 'Shield', 'Rectangle', 'Star', 'Heart', 'Oval', 'Square', 'Triangle', 'Stamp Border', 'SemiCircle', 'Arrow'];
      tabs: any[] = editorTabs;
      basicShapesList: any = BASICSHAPELIST;

      fontSearchString: any = "";
      left_width = "425px";
      left_pan_icon = "./assets/icons/pan_left.png";
      // right_width = "240px";
      right_pan_icon = "./assets/icons/pan_right.png";
      // canvas_container = "calc(100% - 665px)";
      backgroundStockPhoto: any;
      active_tool: any = "default";
      stockPhotos: any = true;
      premiumService: any;
      login_response: any;
      collection_bg_list: any;
      imageEditor: boolean;
      isInputFocus: boolean;
      referenceTextObj: any;
      isFormatPainterEnable: any = false;
      is_resize_chart = false;
      isSavedSuccessfulShow: any = false;
      imgWidth: any;
      imgHeight: any;
      clonedObject: any = undefined; // Here we store the clone object
      rangeMoveTimeout: any;
      counterInterval: any = undefined;
      groupVal: number = 0;
      isDocumentDragging: any = false;
      stickerColor: any = '#ffffff';
      isSubEditorOpen: boolean = false;
      stickerIdArray: any = [];
      public shapeEditor: boolean = false;
      isReplaceSame: any = false;
      isCloneGroup: boolean = false;
      prevSelected: any = undefined //This variable user for track the prev selected record;


      constructor(private sanitizer: DomSanitizer, public utils: UtilsService) {
            this.tabs = this.tabs.map(tab => ({
                  ...tab,
                  sanitizedIconSvg: this.sanitizeHtml(tab.iconSvg)
            }));

            this.processKeys = function (e) {

            }
      }
      ngOnDestroy(): void {
            throw new Error('Method not implemented.');
      }



      toggleLeftSide() {
            if (window.innerWidth <= 1340) {
                  if (this.left_width == "75px") {
                        this.left_width = "350px";
                        this.left_pan_icon = "./assets/icons/pan_left.png";
                        this.canvas_container = "calc(100% - 590px)";
                        if (this.right_width == '240px') {
                              this.canvas_container = "calc(100% - 590px)";
                        }
                        else if (this.right_width == '0px') {
                              this.canvas_container = "calc(100% - 350px)";
                        }
                  }
            }
            else {
                  if (this.left_width == "75px") {
                        this.left_width = "425px";
                        this.left_pan_icon = "./assets/icons/pan_left.png";
                        this.canvas_container = "calc(100% - 665px)";
                        if (this.right_width == '240px') {
                              this.canvas_container = "calc(100% - 665px)";
                        }
                        else if (this.right_width == '0px') {
                              this.canvas_container = "calc(100% - 425px)";
                        }
                  }
            }
      }
      showReplaceImageHint() {
            this.isReplaceMode = !this.isReplaceMode;
            this.isReplaceMode == true ? this.navTab(this.tabs[add_image_tab_index], add_image_tab_index) : null;
            // console.log(this.isReplaceMode,"D")
      }

      ngOnInit(): void {
            this.canvas = new fabric.Canvas('canvas');
            let hoveredObject: any;
            let that = this;
            this.canvas.on({
                  'object:moving': (e) => {
                        // Sticky line for center points used for grids
                        this.isObjectMoving = true;
                        var hSnapZone = 15;
                        var hObjectMiddle = e.target.left + e.target.width / 2;
                        if (hObjectMiddle > this.zoomWidthRef / 2 - hSnapZone &&
                              hObjectMiddle < this.zoomWidthRef / 2 + hSnapZone) {
                              e.target.set({
                                    left: this.zoomWidthRef / 2 - e.target.width / 2,
                              }).setCoords();
                        }
                        var vSnapZone = 15;
                        var vObjectMiddle = e.target.top + e.target.height / 2;
                        if (vObjectMiddle > this.zoomHeightRef / 2 - vSnapZone &&
                              vObjectMiddle < this.zoomHeightRef / 2 + vSnapZone) {
                              e.target.set({
                                    top: this.zoomHeightRef / 2 - e.target.height / 2,
                              }).setCoords();
                        }

                        if (e.target.customSourceType == 'frame_json') {
                              e.target.lockMovementX = true;
                              e.target.lockMovementY = true;
                              e.target.lockScalingX = true;
                              e.target.lockScalingY = true;
                              e.target.hasControls = false;
                              e.target.selectable = false;
                              e.target.evented = false;

                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                        }
                  },
                  'object:scaling': (e) => {
                        let activeObject = this.canvas.getActiveObject();
                        // console.log(e,"scalling")
                        // var scaledObject = e.target;
                        // this.isObjectScaling = true;
                        // this.applySelectionOnObj();
                        this.selectedObjSize.width = Math.round(activeObject.width * activeObject.scaleX);
                        this.selectedObjSize.height = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
                        this.selectedObjDeg = Math.round(activeObject.angle);
                        this.selectedObjPos.left = Math.round(activeObject.left);
                        this.selectedObjPos.top = Math.round(activeObject.top);

                        this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
                        this.whatEleHeight = activeObject.height;
                        this.whatEleWidth = activeObject.width;
                  },
                  'object:rotating': (e) => {
                        if (this.selected) {
                              this.isObjectRotating = false;
                              this.selectedObjDeg = Math.round(e.target.angle);
                              switch (Math.round(e.target.angle)) {
                                    case 0:
                                    case 45:
                                    case 90:
                                    case 135:
                                    case 180:
                                    case 225:
                                    case 270:
                                    case 315:
                                    case 360:
                                          this.setRotationSelStyle();
                                          break;
                                    default:
                                          this.setRotationDefStyle();
                                          break;
                              }
                        }
                  },
                  'object:modified': (e) => {
                        if (this.selected) {
                              this.selected.left = this.selectedObjPos.left = this.draggingPositionCheckandSet(Math.round(this.selected.left), this.zoomWidthRef);
                              this.selected.top = this.selectedObjPos.top = this.draggingPositionCheckandSet(Math.round(this.selected.top), this.zoomHeightRef);
                        }

                        if (this.canvas.getObjects().length > 0 || (typeof this.canvas.backgroundImage != 'undefined' && this.canvas.backgroundImage != null && this.canvas.backgroundImage != '')) {
                              this.isZoom = true;
                        }
                        else {
                              this.isZoom = false;
                              this.zoomLevel = 100;
                        }

                        this.canvasModified = true;
                        this._config.disableUndo = false;
                        this._config.disableRedo = false;
                        this.updateCanvasState();
                        //this.renderStackObjects(); function is not call when object is moving,scaling or rotating
                        if (!this.isObjectMoving && !this.isObjectScaling && this.isObjectRotating) {
                              this.renderStackObjects();
                        }
                        //This if change status of isObjectRotating if this variable value is false; 
                        if (!this.isObjectRotating) {
                              this.isObjectRotating = true;
                        }
                        // this.renderStackObjects();
                        // when modified, saved button is hide and save button display
                        this.isSavedSuccessfulShow = false;

                  },
                  'mouse:down': (e) => {
                  },
                  'mouse:up': (e) => {
                        // call fucntion when object moving end
                        if (this.isObjectMoving) {
                              this.isObjectMoving = false;
                              if (this.selectedObjPos && this.selected) {
                                    this.selectedObjPos.top = Math.round(this.selected.top);
                                    this.selectedObjPos.left = Math.round(this.selected.left);
                              }
                        }
                        if (this.isObjectScaling) {
                              this.isObjectScaling = false;
                              if (this.selectedObjPos && this.selected) {
                                    this.selectedObjPos.top = Math.round(this.selected.top);
                                    this.selectedObjPos.left = Math.round(this.selected.left);
                              }
                              // if (this.selected && this.selected.type == 'path-group') {
                              //     var width = Math.round(this.selected.width * this.selected.scaleX);
                              //     var height = Math.round(this.selected.height * this.selected.scaleY);
                              //     this.selected.scaleToWidth(width);
                              //     this.selected.scaleToHeight(height);
                              //     // this.selected.setScaleX(1);
                              //     // this.selected.setScaleY(1);
                              //     this.canvas.renderAll();
                              // }
                              // else {
                              if (this.selected.type == 'group') {
                                    this.selected.forEachObject((element, index) => {
                                          switch (element.type) {
                                                case 'image':
                                                      element.set({
                                                            width: Math.round(element.width * this.selected.scaleX),
                                                            height: Math.round(element.height * this.selected.scaleY),
                                                            top: Math.round(element.top * this.selected.scaleY),
                                                            left: Math.round(element.left * this.selected.scaleX),
                                                            scaleX: 1,
                                                            scaleY: 1
                                                      })
                                                      break;
                                                default:
                                                      if (element.type !== "group") {
                                                            if (element.ctop && element.cleft && element.cheight && element.cwidth) {
                                                                  element.width = Math.round(element.width * element.scaleX);
                                                                  element.height = Math.round(element.height * element.scaleY);
                                                                  element.setScaleX(1);
                                                                  element.setScaleY(1);
                                                            }
                                                      }
                                                      break;
                                          }
                                    });
                                    var originalTop = this.selected.top;
                                    var originalLeft = this.selected.left;
                                    this.selected.setScaleX(1);
                                    this.selected.setScaleY(1);
                                    this.selected.addWithUpdate();
                                    this.selected.set({
                                          top: originalTop,
                                          left: originalLeft
                                    })
                                    this.selected.addWithUpdate();
                                    this.canvas.renderAll();
                              }
                        }
                  },
                  'mouse:move': (e) => {
                        // this.removeGrids();
                        if (this.isEyeDropperEnable) {
                              // console.log('mouse move');
                              // var mouse = this.canvas.getPointer(e.e);
                              var x = e.e.pageX - this.offsetX;
                              var y = e.e.pageY - this.offsetY;
                              var px = this.context.getImageData(x, y, 1, 1);
                              var data_array = px.data;
                              // var pixelColor = "rgba(" + data_array[0] + "," + data_array[1] + "," + data_array[2] + "," + data_array[3] + ")";
                              // var dColor = data_array[2] + 256 * data_array[1] + 65536 * data_array[0];
                              var r = data_array[0].toString(16);
                              var g = data_array[1].toString(16);
                              var b = data_array[2].toString(16);
                              // var a = data_array[3].toString(16);
                              r.length == 1 ? r = 0 + r : null;
                              g.length == 1 ? g = 0 + g : null;
                              b.length == 1 ? b = 0 + b : null;
                              // a.length == 1 ? a = a + a : null;
                              // this._hexval = ('#' + r + g + b + a);
                              this._hexval = ('#' + r + g + b);
                              if (this.colorPickerCallback) {
                                    this.colorPickerCallback(this._hexval);
                              }
                        }
                  },
                  'selection:created': (e) => {
                        this.selected = e.selected[0];
                        this.selected.setCoords();
                        var activeObject = this.canvas.getActiveObject();
                        this.selected = activeObject
                        this.applySelectionOnObj();
                        this.isImgSelected = true;

                        if (activeObject) {
                              // this.canvas.deactivateAllWithDispatch().renderAll();
                              this.canvas.renderAll.bind(this.canvas);
                        }

                        if (this.isFormatPainterEnable == true) {
                              if (this.selected.type == 'image') {
                                    this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
                                    // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas))
                                    // this.canvas.getActiveObject().filters = [this.formatPainterClipboard.properties.filter];
                                    this.canvas.getActiveObject().applyFilters();
                                    this.canvas.renderAll()
                                    this.canvasModified = true;
                                    this._config.disableUndo = false;
                                    this._config.disableRedo = false;
                                    this.updateCanvasState();
                                    this.renderStackObjects();
                                    this.isFormatPainterEnable = false;
                                    this.formatPainterClipboard = {};
                              } else {
                                    this.isFormatPainterEnable = false;
                                    this.formatPainterClipboard = {};
                              }

                        }
                        this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
                        this.whatEleHeight = activeObject.height;
                        this.whatEleWidth = activeObject.width;

                  },
                  'mouse:over': async (e) => {
                        this.isOver = true;
                        this.timeoutStop();
                        if (e.target) {
                              if (this.canvas && this.canvas.backgroundImage && this.canvas.backgroundImage.src) {
                                    this.props.canvasImage = this.canvas.backgroundImage.src;
                              }
                              if (this.canvas && this.canvas.backgroundImage && this.canvas.backgroundImage.stockphotodetail) {
                                    this.backgroundStockPhoto = this.canvas.backgroundImage.stockphotodetail;
                              }
                              if (this.canvas && this.canvas.backgroundImage && this.canvas.backgroundImage.scaleMode) {
                                    this.props.scaleMode = this.canvas.backgroundImage.scaleMode;
                              }
                              if (this.canvas && this.canvas.backgroundImage) {

                                    this.isBgImg = true;
                              }
                              else {
                                    this.isBgImg = false;
                              }
                              hoveredObject = e.target;
                              //change cursor on hover object
                              switch (hoveredObject.type) {
                                    case 'image':
                                          //When drag image to object for replace image then object like qrcode,barcode and chart is not replaced
                                          if (!hoveredObject.toolType) {

                                                if (this.formatPainterClipboard && this.formatPainterClipboard.type == 'image') {
                                                      hoveredObject.set({
                                                            hoverCursor: "url('https://photoadking.com/app/assets/icons/format-painter.png'), auto"
                                                      })
                                                }
                                                else {
                                                      hoveredObject.hoverCursor = 'move';
                                                }
                                          }
                                          else {
                                                hoveredObject.hoverCursor = 'move';
                                                that.dragData = {};
                                                this.isDraging = false;
                                          }
                                          break;
                                    default:
                                          hoveredObject.hoverCursor = 'move';
                                          that.dragData = {};
                                          this.isDraging = false;
                              }
                        }
                        else {
                              return;
                        }
                  },
                  'mouse:out': (e) => {
                        this.isOver = false;
                  },
                  'object:selected': (e) => {
                        this.isImgSelected = true;
                        this.groupVal = 0;
                        this.selected = e.target;
                        //This if else is user for set layer selected in layer panel

                        if (!this.selected.id) {

                              this.layerSelected = JSON.parse(JSON.stringify(this.selected.toJSON(custom_attributes)));
                              // if(this.layerSelected.type == "i-text"){
                              //     this.prevSelected = this .layerSelected.id;
                              // } }
                        } else {

                              this.layerSelected = JSON.parse(JSON.stringify(this.selected));
                              // if(this.layerSelected.type == "i-text"){
                              //     this.prevSelected = this .layerSelected.id;
                              // }
                        }
                        if (this.isReplaceSame) {
                              this.isReplaceSame = false;
                        } else {
                              this.isReplaceMode = false;
                        }
                        this.isInputFocus = false;

                        if (this.isFormatPainterEnable == true) {
                              if (this.selected.type == 'image') {
                                    this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
                                    // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas))
                                    // this.canvas.getActiveObject().filters = [this.formatPainterClipboard.properties.filter];
                                    this.canvas.getActiveObject().applyFilters();
                                    this.canvas.renderAll()
                                    this.canvasModified = true;
                                    this._config.disableUndo = false;
                                    this._config.disableRedo = false;
                                    this.updateCanvasState();
                                    this.renderStackObjects();
                                    this.isFormatPainterEnable = false;
                                    this.formatPainterClipboard = {};
                              } else {
                                    this.isFormatPainterEnable = false;
                                    this.formatPainterClipboard = {};
                              }

                        }
                        this.referenceTextObj = this.canvas.getActiveObject();
                        /* this.toggleRightPan(); */
                        this.applySelectionOnObj();
                        if (e.target.customSourceType == 'frame_json') {
                              e.target.lockMovementX = true;
                              e.target.lockMovementY = true;
                              e.target.lockScalingX = true;
                              e.target.lockScalingY = true;
                              e.target.hasControls = false;
                              e.target.selectable = false;
                              e.target.evented = false;

                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              this.canvas.deactivateAllWithDispatch().renderAll();
                        }



                        if (this.is_page_active) {
                              this.IsPropActive = true;
                              this.is_page_active = false;
                              this.is_layer_active = false;
                        }
                        let groupObject = this.canvas._objects.find(x => x._objects);

                  },
                  'object:added': (e) => {
                        // if (this.canvasModified) {
                        //     /* this.updateCanvasState(); */
                        // }
                        // when modified, saved button is hide and save button is display
                        // this.isSavedSuccessfulShow = false;
                        // this.editSlide();
                  },
                  'selection:updated': (e) => {
                        let activeObject = this.canvas.getActiveObject();
                        this.selected = activeObject;
                        this.isImgSelected = true;
                        // this.selectedObjSize.width = activeObject.width * ((activeObject.width < activeObject.height) ? activeObject.scaleX : (activeObject.height < activeObject.width) ? activeObject.scaleY : 1);
                        // this.selectedObjSize.height = activeObject.height * activeObject.scaleY;
                        // // this.selected = activeObject;
                        // this.imageWidth = activeObject.width * activeObject.scaleY;
                        // this.imageHeight = activeObject.height * activeObject.scaleY;
                        // console.log(activeObject.width,activeObject.height,this.imageWidth,this.imageHeight)
                        this.selectedObjSize.width = Math.round(activeObject.width * activeObject.scaleX);
                        this.selectedObjSize.height = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
                        this.selectedObjDeg = Math.round(activeObject.angle);
                        this.selectedObjPos.left = Math.round(activeObject.left);
                        this.selectedObjPos.top = Math.round(activeObject.top);
                        this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
                        this.whatEleHeight = activeObject.height;
                        this.whatEleWidth = activeObject.width;
                        if (this.isFormatPainterEnable == true) {
                              if (this.selected.type == 'image') {
                                    this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
                                    // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas))
                                    // this.canvas.getActiveObject().filters = [this.formatPainterClipboard.properties.filter];
                                    this.canvas.getActiveObject().applyFilters();
                                    this.canvas.renderAll()
                                    this.canvasModified = true;
                                    this._config.disableUndo = false;
                                    this._config.disableRedo = false;
                                    this.updateCanvasState();
                                    this.renderStackObjects();
                                    this.isFormatPainterEnable = false;
                                    this.formatPainterClipboard = {};
                              } else {
                                    this.isFormatPainterEnable = false;
                                    this.formatPainterClipboard = {};
                              }

                        }
                  },
                  'selection:cleared': (e) => {
                        this.isImgSelected = false;
                  },
                  'mousedblclick': (e) => {
                  },
                  'mouse:dblclick': function (event) {
                        // Your double-click event handling logic here
                  }
            });
      }

      horizontalAlignment(type) {
            let group = this.canvas.getActiveObject();
            if (this.canvas.getActiveObject() && this.canvas.getActiveObject()._objects) {
                  group = this.canvas.getActiveObject();
            }
            var groupWidth = group.width, objects = group._objects, i = 0, corners, tl, offsetX;
            switch (type) {
                  case 'left':
                        for (i = 0; i < objects.length; i++) {
                              // corners = objects[i].getCornerPoints(objects[i].getCenterPoint());
                              corners = objects[i].oCoords;
                              tl = corners.tl.x;
                              var minX = Math.min(tl, corners.tr.x, corners.bl.x, corners.br.x);
                              offsetX = (minX < tl) ? (tl - minX) : 0;
                              objects[i].set('left', -groupWidth / 2 + offsetX);
                        }
                        this.canvas.renderAll();
                        break;
                  case 'right':
                        for (i = 0; i < objects.length; i++) {
                              // corners = objects[i].getCornerPoints(objects[i].getCenterPoint());
                              corners = objects[i].oCoords;
                              tl = corners.tl.x;
                              var maxX = Math.max(tl, corners.tr.x, corners.bl.x, corners.br.x);
                              offsetX = (maxX > tl) ? (maxX - tl) : 0;
                              objects[i].set('left', (groupWidth / 2 - offsetX));
                        }
                        this.canvas.renderAll();
                        break;
                  case 'center':
                        for (i = 0; i < objects.length; i++) {
                              // corners = objects[i].getCornerPoints({
                              //     x: 0,
                              //     y: objects[i].top
                              // });
                              // objects[i].set('left', corners.tl.x);
                              var objectCenterLeft = (objects[i].width * objects[i].scaleX) / 2;
                              objects[i].set('left', -objectCenterLeft);
                        }
                        this.canvas.renderAll();
                        break;
                  default:
                        return;
            }
            this.canvas.fire('object:modified', {
                  target: this
            });
      }

      verticalAlignment(type) {
            let group = this.canvas.getActiveObject();
            if (this.canvas.getActiveObject() && this.canvas.getActiveObject()._objects) {
                  group = this.canvas.getActiveObject();
            }
            var groupHeight = group.height, objects = group._objects, i = 0, corners, tl, offsetY;
            switch (type) {
                  case 'top':
                        for (i = 0; i < objects.length; i++) {
                              // corners = objects[i].getCornerPoints(objects[i].getCenterPoint());
                              corners = objects[i].oCoords;
                              tl = corners.tl.y;
                              var minY = Math.min(tl, corners.tr.y, corners.bl.y, corners.br.y);
                              offsetY = (minY < tl) ? (tl - minY) : 0;
                              objects[i].set('top', -groupHeight / 2 + offsetY);
                        }
                        this.canvas.renderAll();
                        break;
                  case 'bottom':
                        for (i = 0; i < objects.length; i++) {
                              // corners = objects[i].getCornerPoints(objects[i].getCenterPoint());
                              corners = objects[i].oCoords;
                              tl = corners.tl.y;
                              var maxY = Math.max(tl, corners.tr.y, corners.bl.y, corners.br.y);
                              offsetY = (maxY > tl) ? (maxY - tl) : 0;
                              objects[i].set('top', (groupHeight / 2 - offsetY));
                        }
                        this.canvas.renderAll();
                        break;
                  case 'center':
                        for (i = 0; i < objects.length; i++) {
                              // corners = objects[i].getCornerPoints({
                              //     x: objects[i].left,
                              //     y: 0
                              // });
                              // objects[i].set('top', corners.tl.y);
                              var objectCenterLeft = (objects[i].width * objects[i].scaleX) / 2;
                              objects[i].set('top', -objectCenterLeft);
                        }
                        this.canvas.renderAll();
                        break;
                  default:
                        return;
            }
            this.canvas.fire('object:modified', {
                  target: this
            });
      }

      applySelectionOnObj() {
            this.setRotationDefStyle();
            this.selectedObjPos.top = Math.round(this.selected.top);
            this.selectedObjPos.left = Math.round(this.selected.left);
            this.selectedObjSize.width = Math.round(this.selected.width * this.selected.scaleX);
            this.selectedObjSize.height = Math.round(this.selected.height * this.selected.scaleY);
            if (Math.round(this.selected.angle) < 0) {
                  this.selectedObjDeg = 360 + Math.round(this.selected.angle);
            }
            else {
                  this.selectedObjDeg = Math.round(this.selected.angle);
            }
            if (this.selected.isLocked) {
                  this.selected.lockMovementX = true;
                  this.selected.lockMovementY = true;
                  this.selected.lockScalingX = true;
                  this.selected.lockScalingY = true;
                  this.selected.lockUniScaling = true;
                  this.selected.lockRotation = true;
                  this.selected.hasControls = false;
                  this.selected.hasRotatingPoint = false;
            }
            else {
                  this.selected.lockMovementX = false;
                  this.selected.lockMovementY = false;
                  this.selected.lockScalingX = false;
                  this.selected.lockScalingY = false;
                  this.selected.lockUniScaling = false;
                  this.selected.lockRotation = false;
                  this.selected.hasControls = true;
                  this.selected.hasRotatingPoint = true;
                  this.selected.snapAngle = 45;
                  this.selected.snapThreshold = 7;
            }
            this.resetPanels();
            if (this.selected.type !== 'group' && this.selected) {
                  this.getId();
                  this.getOpacity();
                  switch (this.selected.type) {
                        case 'image':
                              /*  this.selected.set({
                                   buttonText: "Replace Image",
                                   hasButton: true,
                                   buttonWidth: 100
                               })
                               this.selected.setControlsVisibility({
                                   mb: true
                               }); */
                              this.canvas.renderAll();
                              if (!this.selected.toolType) {
                                    if (this.stickerIdArray.indexOf(this.selected.id) != -1) {
                                          this.shapeEditor = true;
                                          if (typeof this.selected.filters[0] != 'undefined')
                                                this.stickerColor = this.selected.filters[this.selected.filters.length - 1].color;
                                          else
                                                this.stickerColor = '#ffffff'
                                    }
                                    else {
                                          this.shapeEditor = false;
                                          this.filterEditor = true;
                                          this.getfilter();
                                          // this.getfilter('brightness');
                                          // this.getfilter('contrast');
                                          // this.getfilter('saturation');
                                          // this.getfilter('tint');
                                          // this.getfilter('blur');
                                          // this.getfilter('sepia');
                                          // this.getfilter('sepia2');
                                          // this.getfilter('grayscale');
                                          // this.getfilter('invert');
                                          // this.getfilter('blackwhite');
                                          // this.getfilter('brownie');
                                          // this.getfilter('vintage');
                                          // this.getfilter('emboss');
                                          // this.getfilter('kodachrome');
                                          // this.getfilter('technicolor');
                                          // this.getfilter('blend');
                                          // this.getfilter('gradient');
                                    }
                              }
                              break;
                  }
            }
            if (this.selected && this.selected.toObject().type == 'group') {
                  this.selected.setControlsVisibility({
                        mt: false,
                        mb: false,
                        ml: false,
                        mr: false
                  });
            }
      }



      getId() {
            this.props.id = this.canvas.getActiveObject().toObject().id;
      }

      resetPanels() {
            this.imageEditor = false;
            this.filterEditor = false;
      }
      navTab(tab, i) {
            if (this.activeTab.tabId != 2) {
                  this.stickers_search_query = "";
                  this.tmp_stickers_search_query = "";
            }
            if (this.activeTab.tabId != 1) {
                  this.templates_search_query = "";
                  this.tmp_templates_search_query = "";
            }
            this.txturs_bg_pg_count = 1;
            this.stickers_pg_count = 1;
            this.texts_pg_count = 1;
            this.templates_pg_count = 1;
            this.userUpload_bg_pg_count = 1;
            this.threed_pg_count = 1;
            this.toggleLeftSide();
            // this.edit_qr_status = false;
            // this.edit_barcode_status = false;
            // this.edit_chart_status = false;
            this.active_tool = "default";
            // this.toggleLeftPan();
            for (let j = 0; j < this.tabs.length; j++) {
                  if (i == j) {
                        this.tabs[j].selected_nav = "active";
                  }
                  else {
                        this.tabs[j].selected_nav = "";
                  }
            }
            switch (tab.tabId) {
                  case 5:
                        if (this.activeTab.tabId != tab.tabId) {
                              this.isReplaceMode = false;
                              this.activeTab = tab;
                              // this.activeAddImage();
                        }
                        break;
            }
      }

      disableEyeDropper() {
            this.unlockCanvas();
            this.isEyeDropperEnable = false;
            this.colorPickerCallback = null;
      }


      unlockCanvas() {
            this.canvas.selection = true;
            this.canvas.getObjects().forEach(element => {
                  element.selectable = true;
                  element.evented = true;
            });
            this.canvas.renderAll();
      }

      activeAddImage() {
            this.stock_photo_search_query = "";
            // this.getStockPhotos("");
            this.stockPhotos = false;
            // this.activateAddImageSubTab('stockPhotos');
      }
      sanitizeHtml(html: string): SafeHtml {
            return this.sanitizer.bypassSecurityTrustHtml(html);
      }



      draging(src, uploadFrom: any = '', data: any = {}) {
            // e.dataTransfer.setData("text", src);
            this.dragData['img'] = src;
            this.dragData['uploadFrom'] = uploadFrom;
            this.dragData['data'] = data;
            this.isDraging = true;
      }

      dragEnd() {
            // !this.isOver ? this.isDraging = false : null;
            setTimeout(() => {
                  if (this.isOver == false) {
                        this.isDraging = false;
                        this.dragData = {};
                  }
            }, 50);
      }

      handleDragLeave(e) {
            this.isOver = false;
      }

      handleDragEnter() {
            this.isOver = true;
      }


      //Block "Add Stickers"
      getImgPolaroid(image_details, uploadfrom = '', st: any = {}, stickerFrom: string = '') {

            if (st.is_free == 0) {
            }
            else {
                  var id, that = this, scale, selectedObjSize;
                  if (uploadfrom == 'stockphotos') {
                        if (this.getTotalObjects() >= 18) {
                              return;
                        }
                  }
                  // if (this.selected && (!this.canvas.getActiveObject().json && !this.canvas.getActiveObject().toObject(custom_attributes).json)) {
                  if (this.isReplaceMode == true && this.selected && this.selected.type == "image" && !this.selected.toolType) {
                        var options = this.canvas.getActiveObject().toObject(custom_attributes);
                        var targetObject = that.canvas.getActiveObject();
                        delete options.filters;
                        options.crossOrigin = true;
                        this.removable_attribute_list.forEach(element => {
                              targetObject.hasOwnProperty(element) ? delete targetObject[element] : null;
                              options.hasOwnProperty(element) ? delete options[element] : null;
                        });
                        const lockStatus = (targetObject.lockMovementX == true && targetObject.lockMovementY == true);
                        this.setSource(image_details, options).then(res => {
                              var customAttribute = {}
                              if (uploadfrom == 'stockphotos' && st.id) {
                                    var uniquenm = that.generateUniqueNameForStockImage(st.id, 'jpg');
                                    if (options.customSourceType == 'frame_image_sticker_json') {
                                          customAttribute = {
                                                'customSourceType': "frame_image_sticker_json",
                                                'uploadFrom': uploadfrom,
                                                'ischanged': true,
                                                'uniqueName': uniquenm,
                                                'stockPhotoItem': st,
                                                'isLocked': lockStatus,
                                                'element_type': stickerFrom || uploadfrom
                                          }
                                    } else {
                                          customAttribute = {
                                                'customSourceType': "sticker_json",
                                                'uploadFrom': uploadfrom,
                                                'ischanged': true,
                                                'uniqueName': uniquenm,
                                                'stockPhotoItem': st,
                                                'isLocked': lockStatus,
                                                'element_type': stickerFrom || uploadfrom
                                          }
                                    }
                              }
                              else {
                                    if (options.customSourceType == 'frame_image_sticker_json') {
                                          customAttribute = {
                                                'customSourceType': "frame_image_sticker_json",
                                                'uploadFrom': uploadfrom,
                                                'isLocked': lockStatus,
                                                'element_type': stickerFrom || uploadfrom
                                          }
                                    } else {
                                          customAttribute = {
                                                'customSourceType': "sticker_json",
                                                'uploadFrom': uploadfrom,
                                                'isLocked': lockStatus,
                                                'element_type': stickerFrom || uploadfrom
                                          }
                                    }
                              }
                              targetObject.toObject = (function (toObject) {
                                    return function () {
                                          return fabric.util.object.extend(toObject.call(this), customAttribute);
                                    };
                              })(targetObject.toObject);
                              targetObject.isLocked = lockStatus;
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects('update');
                              this.canvas.renderAll.bind(this.canvas);
                              // this.openReplaceHint();
                        })
                  }
                  else {
                        // add image as sticker
                        fabric.util.loadImage(image_details, function (imgObj: { height: number; width: number; }) {
                              if (imgObj == null) {
                                    return;
                              }

                              // Calculate scale factor to resize the image
                              // let scale = that.utils.getObjectMaxSize(imgObj.height, imgObj.width, that.zoomHeightRef, that.zoomWidthRef);

                              // // Update width and height of the image
                              // imgObj.width *= scale;
                              // imgObj.height *= scale;
                              let scale = that.utils.getObjectMaxSize(imgObj.height, imgObj.width, that.zoomHeightRef, that.zoomWidthRef);
                              // imgObj.height = imgObj.height * scale;
                              // imgObj.width = imgObj.width * scale;
                              that.imageWidth = imgObj.width * scale;
                              that.imageHeight = imgObj.height * scale;
                              that.whatEleWidth = imgObj.width;
                              that.whatEleHeight = imgObj.height;
                              that.whatEleScale = scale;
                              // Create Fabric.js image object
                              // var image = new fabric.Image(imgObj);
                              // image.crossOrigin = "anonymous";
                              // // Apply the scale to the image
                              // var image = new fabric.Image(imgObj, {
                              //     // scaleX: scale,
                              //     // scaleY: scale,
                              //     originX: 'center',
                              //     originY: 'center'
                              // });


                              // // Set the position of the image to be centered in the canvas
                              // image.set({
                              //     left: that.canvas.getWidth() / 2,
                              //     top: that.canvas.getHeight() / 2,
                              //     width:imgObj.width,
                              //     height:imgObj.height
                              // });
                              var image = new fabric.Image(imgObj);
                              image.crossOrigin = "anonymous";
                              image.scaleX = scale;
                              image.scaleY = scale;
                              // image.height = 360;
                              // image.width = 270;
                              image.set({
                                    // left: that.utils.getCenterCoord(imgObj.width, that.zoomWidthRef),
                                    // top: that.utils.getCenterCoord(imgObj.height, that.zoomHeightRef),
                                    left: that.canvas.width / 2 - (imgObj.width * scale / 2),
                                    top: that.canvas.height / 2 - (imgObj.height * scale / 2),
                                    angle: 0,
                                    padding: 0,
                                    // cornersize: 10,
                                    hasRotatingPoint: true,
                                    peloas: 12,
                                    isLocked: false,
                                    cornerSize: 15,
                                    cornerColor: '#00C3F9',
                                    cornerStyle: 'circle',
                                    centeredScaling: false,
                                    centeredRotation: true,
                                    transparentCorners: false,
                              });




                              // Add custom attributes to the image object
                              var customAttribute = {
                                    'customSourceType': "sticker_json",
                                    'uploadFrom': uploadfrom,
                                    'isLocked': false,
                                    'element_type': stickerFrom || uploadfrom
                              };
                              if (uploadfrom == 'stockphotos' && st.id) {
                                    var uniquenm = that.generateUniqueNameForStockImage(st.id, 'jpg');
                                    customAttribute['ischanged'] = true;
                                    customAttribute['uniqueName'] = uniquenm;
                                    customAttribute['stockPhotoItem'] = st;
                              }
                              image.toObject = (function (toObject) {
                                    return function () {
                                          return fabric.util.object.extend(toObject.call(this), customAttribute);
                                    };
                              })(image.toObject);

                              // Generate random ID for the image
                              // var id = that.randomId();
                              // that.extend(image, id);

                              // Add image to canvas after a delay
                              setTimeout(() => {
                                    that.canvas.add(image);
                                    that.canvas.setActiveObject(image);
                                    that.isImgSelected = true;
                                    that.canvas.renderAll();
                                    // that.canvasModified = true;
                                    // that._config.disableUndo = false;
                                    // that._config.disableRedo = false;
                                    // that.updateCanvasState();
                                    // that.renderStackObjects('add');
                                    // console.log(image,"image")
                              }, 500);
                        }, null, { crossOrigin: 'anonymous' });

                        return id;

                  }
            }
      }

      selectItemAfterAdded(obj, isclone: boolean = false) {
            if (obj) {
                  this.canvas.discardActiveObject().renderAll();
                  this.canvas.setActiveObject(obj);
                  if (isclone && this.clonedObject) {
                        //Here we reset top and left according to current selected object og cloneobject so nect paste is add according to it.
                        let activeObject = this.canvas.getActiveObject();
                        this.clonedObject.top = activeObject.top;
                        this.clonedObject.left = activeObject.left;
                        this.clonedObject.id = activeObject.id;
                  }
            }
      }


      disableReplaceMode() {
            this.isReplaceMode = false;
      }

      imageToDataUri(img, width, height) {
            var canvas = document.createElement('canvas'),
                  ctx = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
            return canvas.toDataURL();
      }

      async renderStackObjects(rerender_Type: any = 'all', param: any = "") {
            let that = this;
            switch (rerender_Type) {
                  case 'all':
                        //in this case we make blob for all images 
                        let canvas_objs = this.canvas.toJSON(custom_attributes);
                        if (canvas_objs.objects.length > 0) {
                              let groupObj = canvas_objs.objects.find(x => x.objects);
                              if (groupObj && groupObj.objects) {
                                    canvas_objs.objects.pop();
                                    canvas_objs.objects.push(...groupObj.objects);
                              }
                        }
                        this.canvasObjectList = canvas_objs.objects;
                        this.canvasObjectList = this.canvasObjectList.reverse();
                        this.dateString = Date.now();
                        if (this.isLayerTabActivated == true) {

                              for (var i = 0; i <= this.canvasObjectList.length - 1; i++) {
                                    this.canvas.getObjects().forEach((o) => {
                                          if (o.toJSON(custom_attributes).id == this.canvasObjectList[i].id && o.isLocked) {
                                                this.canvasObjectList[i].isLocked = true;
                                          }
                                    })
                                    // this.canvasObjectList.forEach(async element => {
                                    if (this.canvasObjectList[i].type == 'image' && this.canvasObjectList[i].src) {
                                          if (this.canvasObjectList[i].src.search('blob:') == -1) {
                                                // this.canvasObjectList[i].src += '?v' + Date.now();
                                                // this.canvasObjectList[i].src = await that.sanitizer.bypassSecurityTrustResourceUrl(this.canvasObjectList[i].src + '?v' + Date.now());
                                                // this.canvasObjectList[i]['safeUrl'] = await this.sanitizer.bypassSecurityTrustResourceUrl(this.canvasObjectList[i].src + '?v' + Date.now());
                                                await this.assignBase64(that.canvasObjectList[i]).then(result => {
                                                      that.canvasObjectList[i]['base'] = result;
                                                })
                                                // var tmpimage = new Image();
                                                // tmpimage.crossOrigin = "anonymous";
                                                // tmpimage.onload = async function () {
                                                //     that.canvasObjectList[i]['base'] = await that.imageToDataUri(tmpimage, 20, 20);
                                                // };
                                                // tmpimage.src = this.canvasObjectList[i].src;

                                          }
                                          else {
                                                // this.canvasObjectList[i]['safeUrl'] = await this.sanitizer.bypassSecurityTrustResourceUrl(this.canvasObjectList[i].src);
                                                that.canvasObjectList[i]['base'] = await this.sanitizer.bypassSecurityTrustResourceUrl(this.canvasObjectList[i].src);
                                          }
                                    }
                                    // });
                              }
                        }
                        break;
                  case 'add':
                        //in this case we make blob for those images which are newly added; 
                        let addedObject = this.canvas._objects[this.canvas._objects.length - 1].toJSON(custom_attributes);
                        this.canvasObjectList.unshift(addedObject);
                        let index = 0;
                        if (this.isLayerTabActivated == true) {
                              if (!addedObject.toolType) {
                                    if (this.canvasObjectList[index].type == 'image' && this.canvasObjectList[index].src) {
                                          if (this.canvasObjectList[index].src.search('blob:') == -1) {
                                                await this.assignBase64(that.canvasObjectList[index]).then(result => {
                                                      that.canvasObjectList[index]['base'] = result;
                                                })
                                          }
                                          else {
                                                that.canvasObjectList[index]['base'] = await this.sanitizer.bypassSecurityTrustResourceUrl(this.canvasObjectList[index].src);
                                          }
                                    }
                                    // else{
                                    //     this.layerSelected = this.canvasObjectList[index];
                                    // }
                              }
                        }
                        // else{
                        //     this.layerSelected = this.canvasObjectList[index];
                        // }
                        break;
                  case 'update':
                        //in this case we make blob for those images which are newly updated;
                        if (this.layerSelected && this.isLayerTabActivated == true) {
                              let editedObject = this.canvasObjectList.filter(elem => elem.id == this.layerSelected.id)[0];
                              let addedObject = this.getElementById(this.layerSelected.id).toJSON(custom_attributes);
                              switch (this.layerSelected.type) {
                                    case 'i-text':
                                          editedObject.text = this.getElementById(this.layerSelected.id).text;
                                          break;
                                    case 'image':
                                          if (addedObject.src.search('blob:') == -1) {
                                                await this.assignBase64(addedObject).then(result => {
                                                      editedObject['base'] = result;
                                                })
                                          }
                                          else {
                                                editedObject['base'] = await this.sanitizer.bypassSecurityTrustResourceUrl(addedObject.src);
                                          }
                              }
                        }
                        break;
                  case 'replaceUpdate':
                        if (this.layerSelected && this.isLayerTabActivated == true) {
                              let addedObject = this.getElementById(this.layerSelected.id).toJSON(custom_attributes);

                              this.canvasObjectList.forEach((x, index) => {
                                    if (x.id == addedObject.id) {
                                          this.canvasObjectList[index] = JSON.parse(JSON.stringify(addedObject));
                                    }
                              });
                        }
                        break;
                  case 'delete':
                        //Here we remove single object from canvas object list which is select for delete;
                        if (this.isLayerTabActivated == true) {
                              let deltedIndex = this.canvasObjectList.findIndex((elem) => elem.id == this.layerSelected.id);
                              this.canvasObjectList.splice(deltedIndex, 1);
                        }
                        break;
                  case 'set_bg':
                        //Here we add background at end of the canvas object list if user select any texture for background
                        let bg_object = JSON.parse(JSON.stringify(this.canvas.toJSON().objects[0]));
                        let existObject = this.canvasObjectList[this.canvasObjectList.length - 1];
                        if (bg_object.id == "pattern") {
                              if (existObject && existObject.id == "pattern") {
                                    this.canvasObjectList[this.canvasObjectList.length - 1] = bg_object;
                              }
                              else {
                                    this.canvasObjectList.push(bg_object);
                              }
                        }
                        else {
                              this.canvasObjectList.push(bg_object);
                        }
                        break;
                  case 'remove_bg':
                        //Here we remove background at end of the canvas object list if user select any new image or color for background
                        let existObjectn = this.canvasObjectList[this.canvasObjectList.length - 1];
                        if (existObjectn && existObjectn.id == "pattern") {
                              this.canvasObjectList.splice(this.canvasObjectList.length - 1, 1);
                        }
                        break;
                  case 'toggle':
                        //Here we toggle hide and show of specific object from layer which come for hide and show
                        let toggleIndex = this.canvasObjectList.findIndex(elem => elem.id == this.layerSelected.id);
                        if (param == "false") {
                              this.canvasObjectList[toggleIndex].visible = false;
                        }
                        else {
                              this.canvasObjectList[toggleIndex].visible = true;
                        }
                        break;
                  case 'clone':
                        if (this.isLayerTabActivated == true) {
                              let cloneObj = this.canvas._objects[this.canvas._objects.length - 1].toJSON(custom_attributes);
                              this.canvasObjectList.unshift(cloneObj);
                              if (cloneObj.type == "image" && !cloneObj.toolType) {
                                    let oldBase = this.canvasObjectList.find(elem => elem.id == this.cloneObjId && elem.type == "image" && !elem.toolType).base;
                                    if (oldBase) {
                                          that.canvasObjectList[0]['base'] = oldBase;
                                    }
                                    else {
                                          if (this.canvasObjectList[0].src.search('blob:') == -1) {
                                                await this.assignBase64(that.canvasObjectList[0]).then(result => {
                                                      that.canvasObjectList[0]['base'] = result;
                                                })
                                          }
                                          else {
                                                that.canvasObjectList[0]['base'] = await this.sanitizer.bypassSecurityTrustResourceUrl(this.canvasObjectList[0].src);
                                          }
                                    }
                              }
                        }
            }

            // let tmp = this.canvas.toJSON(custom_attributes);
            // if (this.canvasObjectList.length <= 0 && (typeof this.canvas.backgroundImage == 'undefined' || this.canvas.backgroundImage == null || this.canvas.backgroundImage == '')) {
            //     this.isZoom = false;
            //     this.zoomLevel = 100;
            // }
            // else {
            //     this.isZoom = true;
            // }
      }
      // assign Base64
      assignBase64(object): Promise<any> {
            let that = this;
            return new Promise((resolve) => {
                  var image = new Image()
                  image.crossOrigin = "anonymous";
                  image.onload = function () {
                        if (image.width > image.height) {
                              var width = layer_image_validation.width as number;
                              var height = Math.floor((image.height * width) / image.width);
                              if (height > layer_image_validation.height) {
                                    // check that after calculate hegiht, if it is > then max height then again calculate height
                                    height = layer_image_validation.height;
                                    width = Math.floor((image.width * height) / image.height);
                              }
                              resolve(that.imageToDataUri(image, width, height));
                        }
                        else if (image.width < image.height) {
                              var height = layer_image_validation.height as number;
                              var width = Math.floor((image.width * height) / image.height) + 4 as number;
                              if (width > layer_image_validation.width) {
                                    // check that after calculate width, if it is > then max width then again calculate width
                                    width = layer_image_validation.width;
                                    height = Math.floor((image.height * width) / image.width);
                              }
                              resolve(that.imageToDataUri(image, width, height));
                        }
                        else {
                              resolve(that.imageToDataUri(image, 20, 20));
                        }
                  }
                  image.src = object.src;
            })
      }

      updateCanvasState() {
            if (this.clonedObject && this.selected) {
                  //Here we reset top and left according to current selected object og cloneobject so nect paste is add according to it.
                  const copyObject = JSON.parse(JSON.stringify(this.clonedObject));
                  if (copyObject.type == 'group') {
                        this.clonedObject.top = this.selected.top;
                        this.clonedObject.left = this.selected.left;
                  }
                  else {
                        if (copyObject.id == this.selected.id) {
                              this.clonedObject.top = this.selected.top;
                              this.clonedObject.left = this.selected.left;
                        }
                  }
            }
            if ((this._config.undoStatus == false && this._config.redoStatus == false)) {
                  fabric.Object.NUM_FRACTION_DIGITS = 10;
                  var jsonData = this.canvas.toJSON(custom_attributes);

                  var canvasAsJson = JSON.stringify(jsonData);

                  if (this._config.currentStateIndex < this._config.canvasState.length - 1) {
                        var indexToBeInserted = this._config.currentStateIndex + 1;
                        this._config.canvasState[indexToBeInserted] = canvasAsJson;
                        var numberOfElementsToRetain = indexToBeInserted + 1;
                        this._config.canvasState = this._config.canvasState.splice(0, numberOfElementsToRetain);
                        this.isUploadable = true;
                  } else {
                        this._config.canvasState.push(canvasAsJson);
                        if (this.isSavedInHistory == true)
                              this.isUploadable = false;
                  }
                  this._config.currentStateIndex = this._config.canvasState.length - 1;
                  if ((this._config.currentStateIndex == this._config.canvasState.length - 1) && this._config.currentStateIndex != -1) {
                        this._config.disableRedo = true;
                  }
            }
      }

      extend(obj, id) {
            obj.toObject = (function (toObject) {
                  return function () {
                        return fabric.util.object.extend(toObject.call(this), {
                              id: id
                        });
                  };
            })(obj.toObject);
      }

      randomId() {
            return Math.floor(Math.random() * 999999) + 1;
      }

      setSource(url, options): Promise<void> { // Specify return type as Promise<void>
            var that = this;

            return new Promise<void>(async (resolve) => { // Specify Promise<void> explicitly
                  this.setFrameStickerCords(url, options).then(res => {
                        // setTimeout(async () => {
                        that.canvas.getActiveObject().setSrc(url, async () => {
                              await that.canvas.renderAll();
                              // await that.renderStackObjects('update');
                              resolve(); // No arguments passed to resolve()
                        }, options);
                        // }, 100);
                  });
            });
      }



      setFrameStickerCords(url, options): Promise<any> {
            let that = this;

            return new Promise<void>(async (resolve) => {
                  if ((this.isReplaceMode == true || this.isOver == true)) {
                        let scale, selectedObjSize;
                        // options.width = this.selectedObjSize.width;
                        // options.height = this.selectedObjSize.height
                        // that.selectedObjSize.width = Math.round(options.width);
                        // that.selectedObjSize.height = Math.round(options.height);
                        let activeobject = that.canvas.getActiveObject();
                        fabric.util.loadImage(url, function (imgObj) {
                              if (imgObj.width == null || imgObj.height == null) {
                                    // imgObj.width = options.width;
                                    // imgObj.height = options.height;
                                    resolve();
                              }

                              if (imgObj.width != null && imgObj.height != null) {
                                    imgObj.width = activeobject.width;
                                    imgObj.height = activeobject.height;
                                    // imgObj.scaleX = (activeobject.width > activeobject.height) ? activeobject.scaleX : activeobject.scaleY ;
                                    // imgObj.scaleY = (activeobject.width > activeobject.height) ? activeobject.scaleX : activeobject.scaleY ;
                                    that.canvasModified = true;
                                    that._config.disableUndo = false;
                                    that._config.disableRedo = false;
                                    that.updateCanvasState();
                                    that.renderStackObjects('update');
                                    that.canvas.renderAll.bind(that.canvas);

                                    // resolve();
                              }
                              // if (imgObj.width != null && imgObj.height != null) {
                              //     selectedObjSize = { height: options.height, width: options.width }
                              //     // that.changeObjectSize(selectedObjSize)
                              //     if (options.width <= options.height) {
                              //     //     if (options.height <= imgObj.height) {
                              //     //         scale = options.height / imgObj.height;
                              //     //         options.width = imgObj.width * scale;
                              //     //         that.selectedObjSize.width = Math.round(options.width);
                              //     //         // // this.renderStoreObjModifications();
                              //     //         selectedObjSize = { height: options.height, width: options.width }

                              //     //     } else if (options.height > imgObj.height) {
                              //     //         scale = options.height / imgObj.height;
                              //     //         options.width = imgObj.width * scale;
                              //     //         that.selectedObjSize.width = Math.round(options.width);
                              //     //         selectedObjSize = { height: options.height, width: options.width }
                              //     //         that.changeObjectSize(selectedObjSize)
                              //     //     }
                              //     // } else if (options.width > options.height) {
                              //     //     if (this.selectedObjSize.width <= imgObj.width) {
                              //     //         scale = this.selectedObjSize.width / imgObj.width;
                              //     //         options.height = imgObj.height * scale;
                              //     //         that.selectedObjSize.height = Math.round(options.height);
                              //     //         selectedObjSize = { height: options.height, width: options.width }
                              //     //         that.changeObjectSize(selectedObjSize)

                              //     //     } else if (this.selectedObjSize.width > imgObj.width) {
                              //     //         scale = this.selectedObjSize.width / imgObj.width;
                              //     //         options.height = imgObj.height * scale;
                              //     //         that.selectedObjSize.height = Math.round(options.height);
                              //     //         selectedObjSize = { height: options.height, width: options.width }
                              //     //         that.changeObjectSize(selectedObjSize)

                              //     //     }
                              //     }
                              //     resolve();
                              // }

                              // that.selectedObjSize.width = Math.round(options.width);
                              // that.selectedObjSize.height = Math.round(options.height);
                        }, null, { crossOrigin: 'anonymous' });
                  } else {
                        resolve();
                  }
            });
      }

      generateUniqueNameForStockImage(image_id, type) {
            var name = 'stock_photos_id_' + image_id + '.' + type;
            return name;
      }

      getTotalObjects() {
            const temp_canvas = this.canvas.toJSON(this.custom_attributes);
            let counter = 0;
            // for (let i = 0; i < temp_canvas.objects.length; i++) {
            //     const element = temp_canvas.objects[i];
            //     if (element.type == 'image') {
            //         if (this.utils.hasFollowingProperty(element, ['json', 'uniqueName', 'isModified'])) {
            //             counter++;
            //             console.log("3")
            //         } else if (this.utils.hasFollowingProperty(element, ['uploadFrom']) && element.uploadFrom == 'stockphotos') {
            //             counter++;
            //             console.log("1")
            //         } else if (this.utils.hasFollowingProperty(element, ['exclusiveName', 'isTransparent', 'isModified'])) {
            //             counter++;
            //             console.log("2")
            //         }
            //     }
            // }
            return counter;
      }

      onEnterKeyPressed() {
            // Call removeSelected() function when Enter key is pressed
            this.removeSelected();
      }

      removeSelected() {
            // Get the active object or active group
            const activeObject = this.canvas.getActiveObject();
            const activeObjects = this.canvas.getActiveObjects();

            // Function to handle removal and state updates
            const finalizeRemoval = () => {
                  this.canvas.remove(...activeObjects); // Remove all selected objects
                  this.canvas.discardActiveObject(); // Clear the selection
                  this.canvas.renderAll();
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects('delete');
            };

            // Determine if the selected object(s) can be removed
            if (activeObject) {
                  const sourceType = activeObject.customSourceType;
                  if (sourceType === "frame_image_sticker_json" || sourceType === "frame_json") {
                        const errorMessage = sourceType === "frame_image_sticker_json" ?
                              "You can't delete this image but you can replace it." : "You can't delete this image";
                        this.utils.showError(errorMessage, false, 4000);
                        return false;
                  } else {
                        finalizeRemoval();
                  }
            } else if (activeObjects.length) { // Check if there is a multi-selection
                  if (activeObjects.some(obj => ["frame_image_sticker_json", "frame_json"].includes(obj.customSourceType))) {
                        this.utils.showError("One or more selected items cannot be deleted.", false, 4000);
                        return false;
                  } else {
                        finalizeRemoval();
                  }
            }
      }

      async clone() {
            const activeObject = this.canvas.getActiveObject();
            const activeGroup = this.canvas.getActiveObjects();

            // if (activeObject && activeGroup.length === 0) {
            // Clone single active object
            activeObject.clone((cloned) => {
                  cloned.set({
                        left: cloned.left + 10,
                        top: cloned.top + 10,
                        centeredScaling: false,
                        centeredRotation: true,
                        cornerSize: 15,
                        cornerColor: '#00C3F9',
                        cornerStyle: 'circle',
                        transparentCorners: false
                  }).setCoords();

                  this.canvas.add(cloned);
                  this.canvas.discardActiveObject();
                  this.canvas.setActiveObject(cloned);
                  this.canvas.requestRenderAll();
            });
            // } else if (activeGroup.length) {
            //     // Clone group of active objects
            //     const clones = [];
            //     activeGroup.forEach(obj => {
            //         obj.clone((cloned) => {
            //             cloned.set({
            //                 left: obj.left + 10,
            //                 top: obj.top + 10,
            //                 centeredScaling: false,
            //                 centeredRotation: true,
            //                 cornerSize: 15,
            //                 cornerColor: '#00C3F9',
            //                 cornerStyle: 'circle',
            //                 transparentCorners: false
            //             }).setCoords();

            //             this.canvas.add(cloned);
            //             clones.push(cloned);
            //             if (clones.length === activeGroup.length) {
            //                 // Optionally re-group cloned objects
            //                 const newGroup = new fabric.Group(clones, {
            //                     cornerColor: '#00C3F9',
            //                     cornerStyle: 'circle',
            //                     cornerSize: 15,
            //                     transparentCorners: false
            //                 });
            //                 this.canvas.add(newGroup);
            //                 this.canvas.setActiveObject(newGroup);
            //             }
            //         });
            //     });

            //     this.canvas.discardActiveObject();
            //     this.canvas.requestRenderAll();
            // }
      }


      //     async clone() {
      //         const activeObject = this.canvas.getActiveObject();
      //         const activeGroup = this.canvas.getActiveObjects();
      //         if (activeObject && activeGroup.length<=1) {        
      //             activeObject.clone((cloned) => {
      //                 cloned.set({
      //                 left: cloned.left + 10,
      //                 top: cloned.top + 10,
      //                 centeredScaling: false,
      //                 centeredRotation: true,
      //                 cornerSize: 15,
      //                 cornerColor: '#00C3F9',
      //                 cornerStyle: 'circle',
      //                 transparentCorners: false
      //             }).setCoords();

      //             this.canvas.add(cloned);
      //             this.canvas.discardActiveObject();
      //             this.canvas.setActiveObject(cloned);
      //             this.canvas.requestRenderAll();
      //         });


      //     }else if(activeGroup.length) {
      //         activeGroup.forEach(obj => {
      //             obj.clone((cloned) => {
      //                 cloned.set({
      //                     left: cloned.left + 10,
      //                     top: cloned.top + 10,
      //                     centeredScaling: false,
      //                     centeredRotation: true,
      //                     cornerSize: 15,
      //                     cornerColor: '#00C3F9',
      //                     cornerStyle: 'circle',
      //                     transparentCorners: false
      //                 }).setCoords();

      //                 this.canvas.add(cloned);
      //             });
      //         });

      //         this.canvas.discardActiveObject();
      //         this.canvas.requestRenderAll();
      //     }

      // }


      renderStoreObjModifications(type: any = 'all') {
            let that = this;
            that.canvas.renderAll();
            if (that.selected)
                  that.selected.setCoords();
            //Here we check if any 3d object is added then if will execute and make blob only for that 3D Object
            if (type == "3d") {
                  that.renderStackObjects('add');
            }
            else {
                  if (type != "move") {
                        that.renderStackObjects();
                  }
            }
            that.canvasModified = true;
            that._config.disableUndo = false;
            that._config.disableRedo = false;
            that.updateCanvasState();
      }
      draggingPositionCheckandSet(positionVal: number, max: number) {
            if (positionVal > 0) {
                  if (positionVal >= (max * 3)) {
                        return (max * 3);
                  }
                  else {
                        return positionVal;
                  }
            }
            else {
                  if (positionVal <= -(max * 3)) {
                        return -(max * 3);
                  }
                  else {
                        return positionVal;
                  }
            }
      }
      moveObject(updateType: 'add' | 'remove', type: 'normal' | 'move' = 'normal', max: number, moveType: 'top' | 'left', multiplyer: number = 1) {

            if (this.selected) {
                  this.selected[moveType] = this.draggingPositionCheckandSet(this.selected[moveType], max);
                  let movementDelta = 5 * multiplyer;
                  switch (updateType) {
                        case 'add':
                              if (!this.selected.isLocked) {
                                    if ((this.selected[moveType] + movementDelta) >= (max * 3)) {
                                          if (this.selected[moveType] != (max * 3)) {
                                                this.selected[moveType] = (max * 3);
                                                this.selectedObjPos[moveType] = Math.round(this.selected[moveType]);
                                          }
                                    }
                                    else {
                                          this.selected[moveType] += movementDelta;
                                          this.selectedObjPos[moveType] = Math.round(this.selected[moveType]);
                                    }
                              }
                              break;
                        case 'remove':
                              if (!this.selected.isLocked) {
                                    if ((this.selected[moveType] - movementDelta) <= -(max * 3)) {
                                          if (this.selected[moveType] != -(max * 3)) {
                                                this.selected[moveType] = -(max * 3);
                                                this.selectedObjPos[moveType] = Math.round(this.selected[moveType]);
                                          }
                                    }
                                    else {
                                          this.selected[moveType] -= movementDelta;
                                          this.selectedObjPos[moveType] = Math.round(this.selected[moveType]);
                                    }
                              }
                              break;
                  }
                  this.renderStoreObjModifications(type == 'normal' ? 'all' : 'move');
            }
      }

      continousIncDecPosOrSize(type) {
            switch (type) {
                  case 'leftAdd':
                        this.selectedObjPos.left = this.selectedObjPos.left + 1;
                        this.changePosition(this.selectedObjPos, this.zoomWidthRef, 'left');
                        break;
                  case 'leftRemove':
                        this.selectedObjPos.left = this.selectedObjPos.left - 1;
                        this.changePosition(this.selectedObjPos, this.zoomWidthRef, 'left');
                        break;
                  case 'topAdd':
                        this.selectedObjPos.top = this.selectedObjPos.top + 1;
                        this.changePosition(this.selectedObjPos, this.zoomHeightRef, 'top');
                        break;
                  case 'topRemove':
                        this.selectedObjPos.top = this.selectedObjPos.top - 1;
                        this.changePosition(this.selectedObjPos, this.zoomHeightRef, 'top');
                        break;
                  case 'widthRemove':
                        this.selectedObjSize.width = this.decreaseValue(this.selectedObjSize.width, 1, 10);
                        this.changeObjSize(this.selectedObjSize, 'widthRemove', 10, 10000, false);
                        break;
                  case 'widthAdd':
                        this.selectedObjSize.width = this.increaseValue(this.selectedObjSize.width, 1);
                        this.changeObjSize(this.selectedObjSize, 'widthAdd', 10, 10000, false);
                        break;
                  case 'heightRemove':
                        this.selectedObjSize.height = this.decreaseValue(this.selectedObjSize.height, 1, 10);
                        this.changeObjSize(this.selectedObjSize, 'heightRemove', 10, 10000, false);
                        break;
                  case 'heightAdd':
                        this.selectedObjSize.height = this.increaseValue(this.selectedObjSize.height, 1);
                        this.changeObjSize(this.selectedObjSize, 'heightAdd', 10, 10000, false);
                        break;
            }
            this.counterInterval = setTimeout(() => {
                  this.continousIncDecPosOrSize(type);
            }, 150);
      }

      // format painter
      enableFormatPainter() {
            if (this.isFormatPainterEnable) {
                  this.isFormatPainterEnable = false;
                  this.formatPainterClipboard = {};
            }
            else {
                  if (this.canvas.getActiveObject()) {
                        this.isFormatPainterEnable = true;
                        this.copyStylestoClipboard();
                  }
                  else {
                        this.utils.showError('Please select any object', true, 5000);
                        this.isFormatPainterEnable = false;
                        this.formatPainterClipboard = {};
                  }
            }
      }

      copyStylestoClipboard() {
            if (this.selected && this.selected.type == "image") {
                  this.formatPainterClipboard.properties = {
                        filters: this.selected.filters,
                        opacity: this.selected.opacity,
                        hoverCursor: 'move'
                  }
                  this.formatPainterClipboard.objectId = this.selected.id || this.canvas.getActiveObject().toObject().id;
                  this.formatPainterClipboard.type = 'image';
            }
      }
      addSizeHistory(currentVal, keyName, keyType: string = 'normal') {
            const lastValue = this.getLastHistoryOfObject(keyName, keyType);
            if (currentVal != lastValue) {
                  if (this.selected)
                        this.selected.setCoords();
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            } else {
                  return;
            }
      }
      changePosition(selectedObjPos, type, p0: string) {
            this.canvas.getActiveObject().set('left', selectedObjPos.left);
            this.canvas.getActiveObject().set('top', selectedObjPos.top);

            this.canvas.renderAll();
      }

      changeObjectSize(selectedObjSize) {
            if (this.selected) {
                  if (selectedObjSize.width >= 10 && selectedObjSize.height >= 10) {
                        // // this.
                        // this.canvas.getActiveObject().set('width', selectedObjSize.width);
                        // this.canvas.getActiveObject().set('height', selectedObjSize.height);
                        // this.imageWidth = selectedObjSize.width;
                        // this.imageHeight = selectedObjSize.height;
                        // console.log(this.canvas.getActiveObject(),"this.imageHeight")
                        // this.selected.scaleX = 1;
                        // this.selected.scaleY = 1;
                        this.selected.setCoords();
                  }
            }
      }

      changeObjSize(selectedObjSize, type, min, max, event) {
            if (this.selected) {
                  switch (type) {

                        case "widthRemove":
                              this.selectedObjSize.width = this.selectedObjSize.width - 1;
                              this.selected.scaleX = ((this.selectedObjSize.width / this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
                              break;

                        case "widthAdd":
                              this.selectedObjSize.width = this.selectedObjSize.width + 1;
                              this.selected.scaleX = ((this.selectedObjSize.width / this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
                              break;

                        case "heightAdd":
                              this.selectedObjSize.height = this.selectedObjSize.height + 1;
                              this.selected.scaleY = ((this.selectedObjSize.height / this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
                              break;

                        case "heightRemove":
                              this.selectedObjSize.height = this.selectedObjSize.height - 1;
                              this.selected.scaleY = ((this.selectedObjSize.height / this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
                              break;

                        case 'width':
                              this.selectedObjSize.width = parseInt(event.target.value);
                              this.selected.scaleX = ((this.selectedObjSize.width / this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
                              break;

                        case 'height':
                              this.selectedObjSize.height = parseInt(event.target.value);
                              this.selected.scaleY = ((this.selectedObjSize.height / this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
                              break;
                  }

                  this.canvas.renderAll();
            }
      }

      removeTrailZero(event) {
            if (event.target.value) { event.target.value = Math.round(event.target.value) };
      }



      addHistory(currentVal, keyName, keyType: string = 'normal', isIgnoreCheck: boolean = false) {
            if (isIgnoreCheck) {
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            }
            else {
                  const lastValue = this.getLastHistoryOfObject(keyName, keyType);
                  if (currentVal != lastValue) {
                        if (this.selected && this.selected._objects) {
                              this.groupVal = currentVal;
                        }
                        this.canvasModified = true;
                        this._config.disableUndo = false;
                        this._config.disableRedo = false;
                        this.updateCanvasState();
                        this.renderStackObjects();
                  } else {
                        return;
                  }
            }
      }
      getLastHistoryOfObject(keyName, keyType) {
            if (this.selected && this.selected._objects) {
                  return this.groupVal;
            }
            else {
                  const length = this._config.canvasState.length - 1;
                  this.selected == null ? this.selected = this.canvas.getActiveObject() : '';
                  const curObjectId = this.selected.toJSON(custom_attributes).id;
                  // const object = JSON.parse(this._config.canvasState[length]).objects.find(x => x.id == curObjectId);

                  // if (keyType == 'shadow') {
                  //     if (object) {
                  //         return object.shadow[keyName];
                  //     } else {
                  //         return;
                  //     }
                  // }
                  // else {
                  //     if (object) {
                  //         return object[keyName];
                  //     } else {
                  //         return;
                  //     }
                  // }
            }
      }

      // toggle grids
      toggleGrids() {
            this.isGridShown = !this.isGridShown;
      }

      //Rotate functions
      rotateLeft() {
            if (this.selectedObjDeg >= 360) {
                  this.selected.rotate(Math.round(this.selectedObjDeg) - 1);
                  this.selectedObjDeg = this.selected.angle;
                  this.canvas.renderAll();
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            }
            else if (this.selectedObjDeg > 0) {
                  this.selected.rotate(Math.round(this.selected.angle) - 1);
                  this.selectedObjDeg = this.selected.angle;
                  this.canvas.renderAll();
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            }
            else if (this.selectedObjDeg <= 0) {
                  this.selectedObjDeg = 0;
            }
      }

      rotateRight() {
            this.selected.rotate(Math.round(this.selected.angle) + 1);
            this.selectedObjDeg = this.selected.angle;
            this.selected.setCoords();
            this.canvas.renderAll();
            this.canvasModified = true;
            this._config.disableUndo = false;
            this._config.disableRedo = false;
            this.updateCanvasState();
            this.renderStackObjects();
      }

      // refreshRotate(selectedObjDeg, undefined: any, p0: boolean, p1: boolean) {
      //     this.applySelectionOnObj()
      //     console.log(selectedObjDeg, undefined, p0, p1,"select")
      //     if (selectedObjDeg >= 360) {
      //         this.selectedObjDeg = 360;
      //         this.selected.rotate(Math.round(selectedObjDeg));
      //         this.selectedObjDeg = this.selected.angle;
      //         this.selected.setCoords();
      //         this.canvas.renderAll();
      //         this.canvasModified = true;
      //         this._config.disableUndo = false;
      //         this._config.disableRedo = false;
      //         this.updateCanvasState();
      //         this.renderStackObjects();
      //     }
      //     else if (selectedObjDeg >= 0) {
      //         this.selected.rotate(Math.round(selectedObjDeg));
      //         this.selectedObjDeg = this.selected.angle;
      //         this.selected.setCoords();
      //         this.canvas.renderAll();
      //         this.canvasModified = true;
      //         this._config.disableUndo = false;
      //         this._config.disableRedo = false;
      //         this.updateCanvasState();
      //         this.renderStackObjects();
      //     }
      //     else {
      //         this.selectedObjDeg = 0;
      //     }
      // }

      refreshRotate(event: MatSliderChange) {
            const selectedObjDeg = event.value;
            // Your existing logic here, using selectedObjDeg as the value from the slider
            if (selectedObjDeg >= 360) {
                  // Your logic when the value is 360 or more
                  this.selectedObjDeg = 360;
                  this.selected.rotate(Math.round(selectedObjDeg));
                  this.selectedObjDeg = this.selected.angle;
                  this.selected.setCoords();
                  this.canvas.renderAll();
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            } else if (selectedObjDeg >= 0) {
                  // Your logic when the value is between 0 and 359
                  this.selected.rotate(Math.round(selectedObjDeg));
                  this.selectedObjDeg = this.selected.angle;
                  this.selected.setCoords();
                  this.canvas.renderAll();
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            } else {
                  // Any fallback logic if needed
                  this.selectedObjDeg = 0;
            }
      }

      compareArray(arr1, arr2) {
            var issame = true;
            if (arr1 && arr2) {
                  if (arr1.length == arr2.length) {
                        arr1.forEach((element, index) => {
                              if (element.toFixed(5) != arr2[index].toFixed(5)) {
                                    issame = false;
                              }
                        });
                  }
                  else {
                        return false;
                  }
                  return issame;
            }
            else {
            }
      }

      rotateObjAfterAdded(object, angle) {
            object.rotate(angle);
            object.setCoords();
      }


      getAllObjs() {
            let canvas_objs = this.canvas.toJSON(custom_attributes);
            return canvas_objs.objects;
            /* return canvas_objs.objects = canvas_objs.objects.filter(function (obj) {
                return obj.type !== 'group';
            }); */
      }

      flip(type) {
            switch (type) {
                  case 'y':
                        this.canvas.getActiveObject().flipX = this.canvas.getActiveObject().flipX ? false : true;
                        this.canvas.renderAll();
                        this.canvasModified = true;
                        this._config.disableUndo = false;
                        this._config.disableRedo = false;
                        this.renderStackObjects();
                        this.updateCanvasState();
                        break;
                  case 'x':
                        this.canvas.getActiveObject().flipY = this.canvas.getActiveObject().flipY ? false : true;
                        this.canvas.renderAll();
                        this.canvasModified = true;
                        this._config.disableUndo = false;
                        this._config.disableRedo = false;
                        this.renderStackObjects();
                        this.updateCanvasState();
                        break;
            }
      }


      increaseValue(tmp, step) {
            // tmp = Math.round(parseInt(tmp));
            // step = Math.round(parseInt(step));
            var temp: Number = Number(tmp) + Number(step);
            temp = Number(temp.toFixed(2));
            return Number(temp);
      }


      colorPickerChangeFunction(functionName, element) {
            setTimeout(() => {
                  if (!this.isDocumentDragging) {
                        switch (functionName) {
                              case 'setPathFill':
                                    this[functionName](element, true);
                                    break;
                              case 'setCanvasFill':
                                    this[functionName]();
                                    break;
                              case 'setFilter':
                                    if (element == "blend") {
                                          this[functionName](element, [this.props.blendColor, this.props.blendMode, this.props.blendAlpha], 1);
                                    }
                                    break;
                              case 'setQrCodeColor':
                                    this[functionName]();
                                    break;
                              case 'generateBarcode':
                                    this[functionName](element);
                                    break;
                              case 'addChartSettings':
                                    this[functionName]();
                                    break;
                              case 'addNewChartSettings':
                                    this[functionName]();
                                    break;
                              case 'setStrokeColor':
                                    this[functionName](this.props.strokeColor, true);
                                    break;
                              case 'setFill':
                                    this[functionName](this.props.fill, true);
                                    break;
                              case 'setTextBackgroundColor':
                                    this[functionName](this.props.textBgColor, true);
                                    break;
                        }
                  }
            }, 0);
      }
      setStickerColor() {
            var filter = new fabric.Image.filters.Tint({
                  color: this.stickerColor,
                  opacity: 0.8
            });
            this.canvas.getActiveObject().filters = [];
            this.canvas.getActiveObject().filters.push(filter);
            this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
            // this.canvas.renderAll();
            this.canvas.renderAll.bind(this.canvas);
            this.canvasModified = true;
            this._config.disableUndo = false;
            this._config.disableRedo = false;
            this.updateCanvasState();
            // let json = this.canvas.toJSON(custom_attributes);
            // this.canvas.loadFromJSON(json, this.canvas.renderAll.bind(this.canvas));
      }



      // filter Function is used in color picker from card but not in use for now
      setTint(color) {
            this.props.tint = color;
            var filter = new fabric.Image.filters.Tint({
                  color: this.props.tint,
                  opacity: this.props.tintOpacity
            });
            this.isExist('Tint', filter);
            this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
      }

      setBlend(color) {
            this.props.blendColor = color;
            var filter = new fabric.Image.filters.Blend({
                  color: this.props.blendColor,
                  mode: this.props.blendMode,
                  alpha: this.props.blendAlpha
            });
            this.isExist('Blend', filter);
            this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
      }

      decreaseValue(tmp, step, limit) {
            var temp = tmp;
            if (tmp >= limit) {
                  // tmp = Math.round(parseInt(tmp));
                  // step = Math.round(parseInt(step));
                  temp = tmp - step;
                  // temp = temp.toFixed(2);
            }
            return temp;
      }

      decreaseStripeValue(tmp, step, limit) {
            var temp: Number = tmp;
            if (tmp >= limit) {
                  // tmp = Math.round(parseInt(tmp));
                  // step = Math.round(parseInt(step));
                  temp = Number(tmp) - Number(step);
                  temp = Number(temp.toFixed(2));
            }
            return Number(temp);
      }

      increaseStripeValue(tmp, step) {
            // tmp = Number(tmp).toFixed(2);
            // step = Number(step).toFixed(2);
            var temp: Number = Number(tmp) + Number(step);
            temp = Number(temp.toFixed(2));
            return Number(temp);
      }

      applyFilterToElement(filter) {
            filter.forEach(element => {
                  if (element.type) {
                        switch (element.type) {
                              case 'Brightness':
                                    this.setFilter('brightness', element.brightness, 1);
                                    break;
                              case 'Contrast':
                                    this.setFilter('contrast', element.contrast, 1);
                                    break;
                              case 'Saturate': this.setFilter('saturation', element.saturate, 1);
                                    break;
                              // case 'Tint':
                              //     this.setFilter('tint', element.color, element.opacity);
                              //     break;
                              case 'StackBlur':
                                    this.setFilter('blur', element.radius, 1);
                                    break;
                              case 'Sepia':
                                    this.props.sepia = true;
                                    this.setFilter('sepia', this.props.sepia, 1);
                                    break;
                              case 'Grayscale':
                                    this.props.grayscale = true;
                                    this.setFilter('grayscale', this.props.grayscale, 1);
                                    break;
                              case 'Invert':
                                    this.props.invert = true;
                                    this.setFilter('invert', this.props.invert, 1);
                                    break;
                              case 'GradientTransparency':
                                    this.setFilter('gradient', element.threshold, 1);
                                    break;
                              case 'ColorMatrix':
                                    let matrix: any = element.matrix;
                                    if (this.compareArray(matrix, FILTERMATRIX.BlackNWhite)) {
                                          this.props.blackWhite = true;
                                          this.setFilter('blackwhite', this.props.blackWhite, 1)
                                    }
                                    if (this.compareArray(matrix, FILTERMATRIX.Brownie)) {
                                          this.props.brownie = true;
                                          this.setFilter('brownie', this.props.brownie, 1)
                                    }
                                    if (this.compareArray(matrix, FILTERMATRIX.Vintage)) {
                                          this.props.vintage = true;
                                          this.setFilter('vintage', this.props.vintage, 1);
                                    }
                                    if (this.compareArray(matrix, FILTERMATRIX.kodachrome)) {
                                          this.props.kodachrome = true;
                                          this.setFilter('kodachrome', this.props.kodachrome, 1);
                                    }
                                    if (this.compareArray(matrix, FILTERMATRIX.Technicolor)) {
                                          this.props.technicolor = true;
                                          this.setFilter('technicolor', this.props.technicolor, 1);
                                    }
                                    break;
                              case 'Convolute':
                                    let tmp: any = element.matrix;
                                    if (this.compareArray(tmp, FILTERMATRIX.Emboss)) {
                                          this.props.emboss = true;
                                          this.setFilter('emboss', this.props.emboss, 1);
                                    }
                                    break;
                        }
                  } else if (element.mode) {
                        this.setFilter('blend', [element.color, element.mode, element.alpha], 1);
                  }
            });
      }
      // Global actions for element
      resetFilter() {
            var activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.filters && activeObject.filters.length > 0) {
                  activeObject.filters = []; // Clear all filters
                  activeObject.applyFilters(); // Apply filters once
                  this.canvas.renderAll(); // Render the canvas

                  // Additional logic after resetting filters
                  this.getfilter(); // Optionally, update filter information
                  this.canvasModified = true;
                  this._config.disableUndo = false;
                  this._config.disableRedo = false;
                  this.updateCanvasState();
                  this.renderStackObjects();
            }
      }


      checkScroolBarInEdirtorTab() {
            var div = document.getElementById('editorRightTab');
            var vs = div.scrollHeight > div.clientHeight;
            return vs;
      }

      timeoutStop() {
            this.counterInterval ? clearTimeout(this.counterInterval) : '';
      }

      continousIncrement(propetyType, max, step, propName, isProp: boolean = false) {
            if (isProp) {
                  if (this.props[propetyType] != max) {
                        this.props[propetyType] = Number(this.props[propetyType]) + step;
                        this.callFunctionAsPerProperty(propName, propetyType);
                  }
            }
            else {
                  if (this[propetyType] != max) {
                        this[propetyType] = Number(this[propetyType]) + step;
                        this.callFunctionAsPerProperty(propName, propetyType);
                  }
            }
            this.counterInterval = setTimeout(() => {
                  this.continousIncrement(propetyType, max, step, propName, isProp)
            }, 150);
      }

      continousDecrement(propetyType, min, step, propName, isProp: boolean = false) {
            if (isProp) {
                  if (this.props[propetyType] != min) {
                        this.props[propetyType] = Number(this.props[propetyType]) - step;
                        this.callFunctionAsPerProperty(propName, propetyType);
                  }
            }
            else {
                  if (this[propetyType] != min) {
                        this[propetyType] = Number(this[propetyType]) - step;
                        this.callFunctionAsPerProperty(propName, propetyType);
                  }
            }
            this.counterInterval = setTimeout(() => {
                  this.continousDecrement(propetyType, min, step, propName, isProp)
            }, 150);
      }

      callFunctionAsPerProperty(propType, propValue: any = '') {
            switch (propType) {
                  case "positionLeft":
                        this.changePosition(this.selectedObjPos, this.zoomWidthRef, 'left');
                        break;
                  case "positionTop":
                        this.changePosition(this.selectedObjPos, this.zoomHeightRef, 'top');
                        break;
                  case "rotateLeft":
                  case "rotateRight":
                        this.refreshRotate(this.selectedObjDeg);
                        break;
                  case "opacity":
                        this.setOpacity(this.props.opacity, this.props.opacity, false, true, true);
                        break;
                  case "filter":
                        if (propValue == "blendAlpha") {
                              this.setFilter('blend', [this.props.blendColor, this.props.blendMode, this.props.blendAlpha], 1);
                        } else if (propValue == "tintOpacity") {
                              this.setFilter('tint', this.props.tint, this.props.tintOpacity);
                        } else {
                              this.setFilter(propValue, this.props[propValue], 1);
                        }
                        break;
            }
      }

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

      hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                  const k = (n + h / 30) % 12;
                  const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                  return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
            };
            return `#${f(0)}${f(8)}${f(4)}`;
      }

      setFilter(filtertype, value, filterOpacity) {
            switch (filtertype) {
                  case 'brightness':
                        // var allFilter: any = this.canvas.getActiveObject().filters;
                        if (value == null) {
                              this.getfilter();
                              value = this.props[filtertype];
                        }

                        var filter = new fabric.Image.filters.Brightness({
                              brightness: value / 100
                        });
                        this.isExist('Brightness', filter);
                        // this.canvas.getActiveObject().filters[0] = filter;
                        if (this.rangeMoveTimeout) {
                              clearTimeout(this.rangeMoveTimeout);
                        }
                        this.rangeMoveTimeout = setTimeout(() => {
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this.updateCanvasState();
                              this.renderStackObjects();
                        }, 500);
                        // this.canvas.getActiveObject().applyFilters();
                        break;
                  case 'contrast':
                        if (value == null) {
                              this.getfilter();
                              value = this.props[filtertype];
                        }

                        var filter = new fabric.Image.filters.Contrast({
                              contrast: value / 100
                        });
                        // var tmp = true;

                        this.isExist('Contrast', filter);
                        // this.canvas.getActiveObject().filters[1] = filter;
                        if (this.rangeMoveTimeout) {
                              clearTimeout(this.rangeMoveTimeout);
                        }
                        this.rangeMoveTimeout = setTimeout(() => {
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              // this.canvas.renderAll();
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                        }, 500);
                        break;
                  case 'saturation':
                        var activeObject = this.canvas.getActiveObject();
                        var filter = new fabric.Image.filters.Saturation({
                              saturation: value / 100
                        });
                        this.isExist('saturation', filter);
                        activeObject.filters = [filter]; // Set the filters array
                        activeObject.applyFilters(); // Apply the filters
                        this.canvas.renderAll();
                        this.canvas.renderAll();
                        this.canvasModified = true;
                        this._config.disableUndo = false;
                        this._config.disableRedo = false;
                        this.updateCanvasState();
                        this.renderStackObjects();
                        break;
                  // case 'tint':
                  //     if (value == null) {
                  //         this.getfilter();
                  //     }
                  //     else {
                  //         this.props.tintOpacity = Math.round(filterOpacity);
                  //     }
                  //     this.props.tintOpacity = this.props.tintOpacity

                  //     var filter = new fabric.Image.filters.BlendColor({
                  //         color: this.hslToHex(this.props.tintOpacity * 3.6, 100, 50),
                  //         mode: 'tint',
                  //         alpha: this.props.tintOpacity == 0 ? 0 : (31 / 100)
                  //       });

                  //     this.isExist('Tint', filter);
                  //     // this.canvas.getActiveObject().filters[3] = filter;
                  //     if (this.rangeMoveTimeout) {
                  //         clearTimeout(this.rangeMoveTimeout);
                  //     }
                  //     this.rangeMoveTimeout = setTimeout(() => {
                  //         // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                  //         // this.canvas.getActiveObject().filters = [filter];
                  //         this.canvas.getActiveObject().applyFilters();
                  //         this.canvas.renderAll();
                  //         this.canvasModified = true;
                  //         this._config.disableUndo = false;
                  //         this._config.disableRedo = false;
                  //         this.updateCanvasState();
                  //         this.renderStackObjects();
                  //     }, 500);
                  //     break;

                  case 'blur':
                        if (value == null) {
                              this.getfilter();
                              value = this.props[filtertype];
                        }
                        // var filter = new fabric.Image.filters.StackBlur({ 
                        //     radius: this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0) 
                        // });

                        var filter = new fabric.Image.filters.Blur({
                              blur: value / 100
                        });
                        this.isExist('StackBlur', filter);
                        // this.canvas.getActiveObject().filters[4] = filter;
                        if (this.rangeMoveTimeout) {
                              clearTimeout(this.rangeMoveTimeout);
                        }
                        this.rangeMoveTimeout = setTimeout(() => {
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                        }, 500);
                        break;
                  case 'sepia':
                        if (value) {
                              var filter = new fabric.Image.filters.Sepia();
                              this.isExist('Sepia', filter);
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 5);
                        }
                        else {
                              this.removeEffect('Sepia');
                        }
                        break;
                  case 'grayscale':
                        if (value) {
                              var filter = new fabric.Image.filters.Grayscale();
                              this.isExist('Grayscale', filter);
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 7);
                        }
                        else {
                              this.removeEffect('Grayscale');
                        }
                        break;
                  case 'invert':
                        if (value) {
                              var filter = new fabric.Image.filters.Invert();
                              this.isExist('Invert', filter);
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 8);
                        }
                        else {
                              this.removeEffect('Invert');
                        }
                        break;
                  case 'blackwhite':
                        if (value) {
                              var filter = new fabric.Image.filters.ColorMatrix({
                                    matrix: FILTERMATRIX.BlackNWhite
                              });
                              this.isExist('ColorMatrix', filter, 'blackwhite');
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              // this.canvas.renderAll();
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 9);
                        }
                        else {
                              this.removeEffect('ColorMatrix', 'blackwhite');
                        }
                        break;
                  case 'brownie':
                        if (value) {
                              var filter = new fabric.Image.filters.ColorMatrix({
                                    matrix: FILTERMATRIX.Brownie
                              });
                              this.isExist('ColorMatrix', filter, 'brownie');
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              // this.canvas.renderAll();
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 10);
                        }
                        else {
                              this.removeEffect('ColorMatrix', 'brownie');
                        }
                        break;
                  case 'vintage':
                        if (value) {
                              var filter = new fabric.Image.filters.ColorMatrix({
                                    matrix: FILTERMATRIX.Vintage
                              });
                              this.isExist('ColorMatrix', filter, 'vintage');
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              // this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 11);
                        }
                        else {
                              this.removeEffect('ColorMatrix', 'vintage');
                        }
                        break;
                  case 'emboss':
                        if (value) {
                              var filter = new fabric.Image.filters.Convolute({
                                    matrix: FILTERMATRIX.Emboss
                              });
                              // this.applyEffect(filter, 12);
                              this.isExist('Convolute', filter, 'emboss');
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              // this.canvas.renderAll();
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                        }
                        else {
                              this.removeEffect('Convolute', 'emboss');
                        }
                        break;
                  case 'kodachrome':
                        if (value) {
                              var filter = new fabric.Image.filters.ColorMatrix({
                                    matrix: FILTERMATRIX.kodachrome
                              });
                              this.isExist('ColorMatrix', filter, 'kodachrome');
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              // this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 13);
                        }
                        else {
                              this.removeEffect('ColorMatrix', 'kodachrome');
                        }
                        break;
                  case 'technicolor':
                        if (value) {
                              var filter = new fabric.Image.filters.ColorMatrix({
                                    matrix: FILTERMATRIX.Technicolor
                              });
                              this.isExist('ColorMatrix', filter, 'technicolor');
                              // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                              // this.canvas.renderAll();
                              this.canvas.getActiveObject().filters = [filter];
                              this.canvas.getActiveObject().applyFilters();
                              this.canvas.renderAll();
                              this.canvasModified = true;
                              this._config.disableUndo = false;
                              this._config.disableRedo = false;
                              this.updateCanvasState();
                              this.renderStackObjects();
                              // this.applyEffect(filter, 14);
                        }
                        else {
                              this.removeEffect('ColorMatrix', 'technicolor');
                        }
                        break;
                  case 'blend':
                        setTimeout(() => {
                              this.disableEyeDropper();
                              if (value) {
                                    if (value[2] == null) {
                                          this.getfilter();
                                    }
                                    else {
                                          this.props[filtertype] = Math.round(value[2]);
                                    }
                                    this.props[filtertype] = this.checkLimitBeforeApplyForInputSlider(this.props[filtertype], 100, 1);
                                    var filter = new fabric.Image.filters.BlendColor({
                                          color: this.props.blendColor,
                                          mode: value[1],
                                          alpha: this.props[filtertype] / 100
                                    });
                                    // // blend filter patch is used for apply filter while re edit card
                                    this.isExist('Blend', filter);
                                    if (this.rangeMoveTimeout) {
                                          clearTimeout(this.rangeMoveTimeout);
                                    }
                                    this.rangeMoveTimeout = setTimeout(() => {
                                          this.canvas.getActiveObject().filters = [filter];
                                          this.canvas.getActiveObject().applyFilters();
                                          this.canvas.renderAll();
                                          // this.canvas.renderAll();
                                          this.canvasModified = true;
                                          this._config.disableUndo = false;
                                          this._config.disableRedo = false;
                                          this.updateCanvasState();
                                          this.renderStackObjects();
                                    }, 500);
                              }
                              else {
                                    this.removeEffect('Blend');
                              }
                        }, 1);
                        break;
                  case 'gradient':
                        if (value || value == null) {
                              if (value == null) {
                                    this.getfilter();
                              }
                              else {
                                    this.props[filtertype] = Math.round(value);
                              }
                              this.props[filtertype] = this.checkLimitBeforeApplyForInputSlider(this.props[filtertype], 100, -100);
                              let filter = new fabric.Image.filters.GradientTransparency({
                                    threshold: this.props[filtertype]
                              });
                              this.isExist('GradientTransparency', filter);
                              if (this.rangeMoveTimeout) {
                                    clearTimeout(this.rangeMoveTimeout);
                              }
                              this.rangeMoveTimeout = setTimeout(() => {
                                    this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
                                    this.canvas.renderAll();
                                    this.canvasModified = true;
                                    this._config.disableUndo = false;
                                    this._config.disableRedo = false;
                                    this.updateCanvasState();
                                    this.renderStackObjects();
                              }, 500);
                              // this.applyEffect(filter, 16);
                        }
                        else {
                              this.removeEffect('GradientTransparency');
                        }
                        break;
            }
            // console.clear();

      }


      // async isExist(type, filter, matrixType = '') {
      //     var tmp = true;
      //     // remove below if condition and it's content for apply multple filter effect on image
      //     if (type == "Sepia" || type == "Grayscale" || type == "Invert" || type == "ColorMatrix" || type == "Convolute") {
      //         this.removeEffect('Sepia', '', false);
      //         this.removeEffect('Grayscale', '', false);
      //         this.removeEffect('Invert', '', false);
      //         this.removeEffect('Convolute', 'emboss', false);
      //         this.removeEffect('ColorMatrix', 'blackwhite', false);
      //         this.removeEffect('ColorMatrix', 'brownie', false);
      //         this.removeEffect('ColorMatrix', 'vintage', false);
      //         this.removeEffect('ColorMatrix', 'kodachrome', false);
      //         this.removeEffect('ColorMatrix', 'technicolor', false);
      //     }
      //     // remove upper if block for apply multiple effect and remove getfilter() method called at bottom of function.
      //     const activeObject = this.canvas.getActiveObject();
      //     if (activeObject !== null) {
      //       // Access the filters property
      //       var allFilter: any = activeObject.filters;
      //       // Continue your code here
      //     } else {
      //       console.error("Active object is null");
      //     }

      //     allFilter.forEach((element, i) => {
      //         if (element.__proto__.type == type && element.__proto__.type != 'ColorMatrix') {
      //             this.canvas.getActiveObject().filters[i] = filter;
      //             tmp = false;
      //         }
      //         else if (element.__proto__.type == 'ColorMatrix' && type == 'ColorMatrix') {
      //             if (this.compareArray(element.matrix, FILTERMATRIX.BlackNWhite) && matrixType == 'blackwhite') {
      //                 this.props.blackWhite = true;
      //                 this.canvas.getActiveObject().filters[i] = filter;
      //                 tmp = false;
      //                 // this.setFilter('blackwhite', this.props.blackWhite, 1)
      //             }
      //             if (this.compareArray(element.matrix, FILTERMATRIX.Brownie) && matrixType == 'brownie') {
      //                 this.props.brownie = true;
      //                 this.canvas.getActiveObject().filters[i] = filter;
      //                 tmp = false;
      //             }
      //             if (this.compareArray(element.matrix, FILTERMATRIX.Vintage) && matrixType == 'vintage') {
      //                 this.props.vintage = true;
      //                 this.canvas.getActiveObject().filters[i] = filter;
      //                 tmp = false;
      //             }
      //             if (this.compareArray(element.matrix, FILTERMATRIX.kodachrome) && matrixType == 'kodachrome') {
      //                 this.props.kodachrome = true;
      //                 this.canvas.getActiveObject().filters[i] = filter;
      //                 tmp = false;
      //             }
      //             if (this.compareArray(element.matrix, FILTERMATRIX.Technicolor) && matrixType == 'technicolor') {
      //                 this.props.technicolor = true;
      //                 this.canvas.getActiveObject().filters[i] = filter;
      //                 tmp = false;
      //             }
      //         }
      //         else if (element.__proto__.type == 'Convolute' && type == 'Convolute') {
      //             if (this.compareArray(element.matrix, FILTERMATRIX.Emboss) && matrixType == 'emboss') {
      //                 this.props.emboss = true;
      //                 this.canvas.getActiveObject().filters[i] = filter;
      //                 tmp = false;
      //             }
      //         }
      //     });
      //     if (tmp) {
      //         this.canvas.getActiveObject().filters.push(filter);
      //     }
      //     this.getfilter();   // remove this for apply multple filter effect on image 
      // }

      async isExist(type, filter, matrixType = '') {
            // console.log(type, filter,"type, filter")

            var tmp = true;
            // remove below if condition and it's content for apply multple filter effect on image
            if (type == "Sepia" || type == "Sepia2" || type == "Grayscale" || type == "Invert" || type == "ColorMatrix" || type == "Convolute") {
                  this.removeEffect('Sepia', '', false);
                  this.removeEffect('Sepia2', '', false);
                  this.removeEffect('Grayscale', '', false);
                  this.removeEffect('Invert', '', false);
                  this.removeEffect('Convolute', 'emboss', false);
                  this.removeEffect('ColorMatrix', 'blackwhite', false);
                  this.removeEffect('ColorMatrix', 'brownie', false);
                  this.removeEffect('ColorMatrix', 'vintage', false);
                  this.removeEffect('ColorMatrix', 'kodachrome', false);
                  this.removeEffect('ColorMatrix', 'technicolor', false);
            }
            // remove upper if block for apply multiple effect and remove getfilter() method called at bottom of function.
            var allFilter: any = this.canvas.getActiveObject().filters;
            console.log(allFilter, "allFilter")

            allFilter.forEach((element, i) => {
                  console.log(element.__proto__.type, type, "element.__proto__.type[i]")

                  if (element.__proto__.type == type && element.__proto__.type != 'ColorMatrix') {
                        console.log(this.canvas.getActiveObject().filters[i], "this.canvas.getActiveObject().filters[i]")
                        this.canvas.getActiveObject().filters[i] = filter;
                        tmp = false;
                  }
                  else if (element.__proto__.type == 'ColorMatrix' && type == 'ColorMatrix') {
                        if (this.compareArray(element.matrix, FILTERMATRIX.BlackNWhite) && matrixType == 'blackwhite') {
                              this.props.blackWhite = true;
                              this.canvas.getActiveObject().filters[i] = filter;
                              tmp = false;
                              // this.setFilter('blackwhite', this.props.blackWhite, 1)
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.Brownie) && matrixType == 'brownie') {
                              this.props.brownie = true;
                              this.canvas.getActiveObject().filters[i] = filter;
                              tmp = false;
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.Vintage) && matrixType == 'vintage') {
                              this.props.vintage = true;
                              this.canvas.getActiveObject().filters[i] = filter;
                              tmp = false;
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.kodachrome) && matrixType == 'kodachrome') {
                              this.props.kodachrome = true;
                              this.canvas.getActiveObject().filters[i] = filter;
                              tmp = false;
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.Technicolor) && matrixType == 'technicolor') {
                              this.props.technicolor = true;
                              this.canvas.getActiveObject().filters[i] = filter;
                              tmp = false;
                        }
                  }
                  else if (element.__proto__.type == 'Convolute' && type == 'Convolute') {
                        if (this.compareArray(element.matrix, FILTERMATRIX.Emboss) && matrixType == 'emboss') {
                              this.props.emboss = true;
                              this.canvas.getActiveObject().filters[i] = filter;
                              tmp = false;
                        }
                  }
            });
            if (tmp) {
                  this.canvas.getActiveObject().filters.push(filter);
            }
            this.getfilter();   // remove this for apply multple filter effect on image

      }


      removeEffect(type, matrixType = '', historyStatus = true) {
            var tmp = true;
            var allFilter: any = this.canvas.getActiveObject().filters;
            allFilter.forEach((element, i) => {
                  if (element.__proto__.type == type && element.__proto__.type != 'ColorMatrix') {
                        delete this.canvas.getActiveObject().filters[i];
                        tmp = false;
                        this.reArrangeFilter(i, allFilter, historyStatus);
                  }
                  else if (element.__proto__.type == 'ColorMatrix' && type == 'ColorMatrix') {
                        if (this.compareArray(element.matrix, FILTERMATRIX.BlackNWhite) && matrixType == 'blackwhite') {
                              this.props.blackWhite = false;
                              delete this.canvas.getActiveObject().filters[i];
                              tmp = false;
                              this.reArrangeFilter(i, allFilter, historyStatus);
                              // this.setFilter('blackwhite', this.props.blackWhite, 1)
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.Brownie) && matrixType == 'brownie') {
                              this.props.brownie = false;
                              delete this.canvas.getActiveObject().filters[i];
                              tmp = false;
                              this.reArrangeFilter(i, allFilter, historyStatus);
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.Vintage) && matrixType == 'vintage') {
                              this.props.vintage = false;
                              delete this.canvas.getActiveObject().filters[i];
                              tmp = false;
                              this.reArrangeFilter(i, allFilter, historyStatus);
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.kodachrome) && matrixType == 'kodachrome') {
                              this.props.kodachrome = false;
                              delete this.canvas.getActiveObject().filters[i];
                              tmp = false;
                              this.reArrangeFilter(i, allFilter, historyStatus);
                        }
                        if (this.compareArray(element.matrix, FILTERMATRIX.Technicolor) && matrixType == 'technicolor') {
                              this.props.technicolor = false;
                              delete this.canvas.getActiveObject().filters[i];
                              tmp = false;
                              this.reArrangeFilter(i, allFilter, historyStatus);
                        }
                  }
                  else if (element.__proto__.type == 'Convolute' && type == 'Convolute') {
                        if (this.compareArray(element.matrix, FILTERMATRIX.Emboss) && matrixType == 'emboss') {
                              this.props.blackWhite = false;
                              delete this.canvas.getActiveObject().filters[i];
                              tmp = false;
                              this.reArrangeFilter(i, allFilter, historyStatus);
                              // this.setFilter('blackwhite', this.props.blackWhite, 1)
                        }
                  }
            });
            // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
            // this.canvas.renderAll();
            // // this.renderStackObjects();
            // this.canvasModified = true;
            // this._config.disableUndo = false;
            // this._config.disableRedo = false;
            // this.updateCanvasState();
            // delete this.canvas.getActiveObject().filters[index];
            // this.canvas.getActiveObject().applyFilters(this.canvas.renderAll.bind(this.canvas));
            // this.canvas.renderAll();
            // this.canvasModified = true;
            // this._config.disableUndo = false;
            // this._config.disableRedo = false;
            // this.updateCanvasState();
      }


      getOpacity() {
            this.props.opacity = this.getActiveStyle('opacity', null) * 100;
      }

      getActiveStyle(styleName, object) {
            object = object || this.canvas.getActiveObject();
            if (!object) return '';
            return (object.getSelectionStyles && object.isEditing)
                  ? (object.getSelectionStyles()[styleName] || '')
                  : (object[styleName] || '');
      }


      setOpacity(opacity: any, event: any, p0: boolean, p1: boolean, p2: boolean) {
            console.log(opacity, event, p0, p1, p2, "p1");
            this.setActiveStyle('opacity', ((event.value) ? event.value : (event.target.value) ? parseInt(event.target.value) : event) / 100, null);
            this.props.opacity = (event.value) ? event.value : event;
            this.canvasModified = true;
            this.updateCanvasState();
            this.canvas.renderAll();  // for curved text rendering.
      }

      setActiveStyle(styleName, value, object) {
            object = object || this.canvas.getActiveObject();
            if (!object) return;
            if (object.setSelectionStyles && object.isEditing) {
                  let style = {};
                  style[styleName] = value;
                  object.setSelectionStyles(style);
                  object.setCoords();
            }
            else {
                  object.set(styleName, value);
            }
            object.setCoords();
            this.canvas.renderAll();
      }

      //   setOpacity(opacity: any, event: any, p0: boolean, p1: boolean, p2: boolean) {
      //     //     this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
      //     //     this.canvasModified = true;
      //     //     this.updateCanvasState();
      // //     this.canvas.renderAll();  // for curved text rendering.
      // //   }

      // //   setActiveStyle(styleName, value, object) {
      //     //     object = object || this.canvas.getActiveObject();
      // //     if (!object) return;
      // //     if (object.setSelectionStyles && object.isEditing) {
      // //       let style = {};
      // //       style[styleName] = value;
      // //       object.setSelectionStyles(style);
      // //       object.setCoords();
      // //     }
      // //     else {
      //     //       object.set(styleName, value);
      //     //     }
      //     //     object.setCoords();
      //     let activeObject = this.canvas.getActiveObject();
      //     console.log(activeObject, "p1");
      //     activeObject.set('opacity',event.value);
      //     this.props.opacity = event.value;
      //     this.canvasModified = true;
      //     this.updateCanvasState();
      //     this.canvas.renderAll(); 
      //   }

      getfilter() {
            // this.resetFilter();
            this.props.brightness = 0;
            this.props.contrast = 0;
            this.props.saturation = 0;
            this.props.tint = '#ffffff';
            this.props.blur = 0;
            this.props.sepia = false;
            this.props.sepia2 = false;
            this.props.grayscale = false;
            this.props.invert = false;
            this.props.blackWhite = false;
            this.props.brownie = false;
            this.props.vintage = false;
            this.props.emboss = false;
            this.props.kodachrome = false;
            this.props.technicolor = false;
            this.props.blendColor = '#ffffff';
            this.props.blendMode = 'add';
            this.props.blendAlpha = 1;
            this.props.gradient = 0;
            this.props.tintOpacity = 0;
            if (this.canvas.getActiveObject().filters) {
                  this.canvas.getActiveObject().filters.forEach(element => {
                        switch (element.__proto__.type) {
                              case 'Brightness':
                                    this.props.brightness = (element.brightness * 100).toFixed(0);
                                    break;
                              case 'Contrast':
                                    this.props.contrast = (element.contrast * 100).toFixed(0);
                                    break;
                              case 'Saturation':
                                    this.props.saturation = (element.saturation * 100).toFixed(0);
                                    break;
                              // case 'Tint':
                              //     this.props.tint = element.color;
                              //     this.props.tintOpacity = (element.opacity * 100).toFixed(0);;
                              //     break;
                              case 'Blur':
                                    this.props.blur = (element.blur * 100).toFixed(0);
                                    break;
                              case 'Sepia':
                                    this.props.sepia = true;
                                    break;
                              case 'Grayscale':
                                    this.props.grayscale = true;
                                    break;
                              case 'Invert':
                                    this.props.invert = true;
                                    break;
                              case 'ColorMatrix':
                                    if (this.compareArray(element.matrix, FILTERMATRIX.BlackNWhite))
                                          this.props.blackWhite = true;
                                    if (this.compareArray(element.matrix, FILTERMATRIX.Brownie))
                                          this.props.brownie = true;
                                    if (this.compareArray(element.matrix, FILTERMATRIX.Vintage))
                                          this.props.vintage = true;
                                    if (this.compareArray(element.matrix, FILTERMATRIX.kodachrome))
                                          this.props.kodachrome = true;
                                    if (this.compareArray(element.matrix, FILTERMATRIX.Technicolor))
                                          this.props.technicolor = true;
                                    break;
                              case 'Convolute':
                                    if (this.compareArray(element.matrix, FILTERMATRIX.Emboss))
                                          this.props.emboss = true;
                                    break;
                              case 'GradientTransparency':
                                    this.props.gradient = element.threshold;
                                    break;
                              case 'BlendColor':
                                    console.log(element.color, element.mode, (element.alpha * 100).toFixed(), "BlendColor")
                                    this.props.blendColor = element.color;
                                    this.props.blendMode = element.mode;
                                    this.props.blendAlpha = (element.alpha * 100).toFixed();
                                    break;
                        }
                  });
            }
      }


      setRotationDefStyle() {
            this.selected.borderColor = '#00c3f9';
            this.selected.cornerColor = '#00c3f9';
            this.selected.cornerStrokeColor = '#ffffff';
            this.selected.cornerStyle = 'circle';
            this.selected.minScaleLimit = 0;
            this.selected.lockScalingFlip = true;
            // this.selected.selectionDashArray = [5, 0];
            // this.selected.borderDashArray = [5, 5];
            // this.selected.cornerDashArray = [2, 0];
            this.selected.borderScaleFactor = 1;
            this.selected.cornerSize = 15;
      }

      reArrangeFilter(starting: number, array: any[], historyStatus: boolean) {
            var activeObject = this.canvas.getActiveObject();
            if (activeObject && activeObject.filters) {
                  activeObject.filters = []; // Clear existing filters
                  for (let j = 0; j < array.length; j++) {
                        if (j !== starting) {
                              activeObject.filters.push(array[j]); // Add filters except the one at 'starting'
                        }
                  }
                  activeObject.applyFilters(); // Apply filters once after updating the array
                  this.canvas.renderAll(); // Render the canvas

                  // Additional logic after rearranging filters
                  if (historyStatus) {
                        this.canvasModified = true;
                        this._config.disableUndo = false;
                        this._config.disableRedo = false;
                        this.updateCanvasState();
                  }
                  this.renderStackObjects();
            }
      }

      getElementById(id) {
            var object = null, objects = this.canvas.getObjects();
            // var object = null, objects, tmp = this.canvas.toJSON(custom_attributes);
            // objects = tmp.objects;
            for (let i = 0; i < objects.length; i++) {
                  // console.log('object processed', objects[i]);
                  if ((objects[i].id && objects[i].id === id) || (objects[i].toObject().id && objects[i].toObject().id === id)) {
                        object = objects[i];
                        break;
                  }
            }
            return object;
      }


      setRotationSelStyle() {
            this.selected.borderColor = '#00c3f9';
            this.selected.cornerColor = '#00c3f9';
            this.selected.cornerStrokeColor = '#ffffff';
            this.selected.cornerStyle = 'circle';
            this.selected.minScaleLimit = 0;
            this.selected.lockScalingFlip = true;
            // this.selected.selectionDashArray = [5, 0];
            // this.selected.borderDashArray = [5, 5];
            // this.selected.cornerDashArray = [2, 0];
            this.selected.borderScaleFactor = 1;
            this.selected.cornerSize = 15;
      }

      cropingStart() {
            var activeObject = this.canvas.getActiveObject();

            console.log(activeObject, "activeObject")

            var centerX = activeObject.left + activeObject.width * activeObject.scaleX / 2;
            var centerY = activeObject.top + activeObject.height * activeObject.scaleY / 2;

            var clipRect = new fabric.Rect({
                  left: centerX,
                  top: centerY,
                  width: activeObject.width * activeObject.scaleX / 2,
                  height: activeObject.height * activeObject.scaleY / 2,
                  originX: 'center',
                  originY: 'center',
                  fill: 'rgba(255, 255, 255, 0.2)',
                  strokeWidth: 0.5,
                  hasBorders: true,
                  hasControls: true,
                  selectable: true,
                  evented: true,
                  opacity: 1,
                  lockRotation: true,
                  visible: true,
                  lockMovementX: true,  // Disable horizontal movement
                  lockMovementY: true,  // Disable vertical movement
                  lockScalingX: false,   // Allow horizontal scaling
                  lockScalingY: false    // Allow vertical scaling    
            });

            this.canvas.clipRect = clipRect;
            this.canvas.add(clipRect);
            this.canvas.setActiveObject(clipRect);
            this.canvas.requestRenderAll();
      }



      // cropingStart() {
      //     var activeObject = this.canvas.getActiveObject();
      //     if (!activeObject) {
      //         console.log('No object selected.');
      //         return;
      //     }

      //     // Set the original object to not be interactive while cropping
      //     activeObject.selectable = false;
      //     activeObject.evented = false;

      //     var centerX = activeObject.left + activeObject.width * activeObject.scaleX / 2;
      //     var centerY = activeObject.top + activeObject.height * activeObject.scaleY / 2;

      //     var clipRect = new fabric.Rect({
      //         left: centerX,
      //         top: centerY,
      //         width: activeObject.width * activeObject.scaleX / 2,
      //         height: activeObject.height * activeObject.scaleY / 2,
      //         originX: 'center',
      //         originY: 'center',
      //         fill: 'rgba(255, 255, 255, 0.2)',
      //         strokeWidth: 0.5,
      //         hasBorders: true,
      //         hasControls: true,
      //         selectable: true,
      //         evented: true,
      //         opacity: 1,
      //         lockRotation: true,
      //         visible: true
      //     });

      //     this.canvas.add(clipRect);
      //     this.canvas.setActiveObject(clipRect);
      //     // this.canvas.requestRenderAll();


      //     // clipRect.on('moving', () => {
      //     //     // Ensure the clipRect stays within the bounds of the activeObject
      //     //     var rectBounds = {
      //     //         left: activeObject.left + (clipRect.getScaledWidth() / 2),
      //     //         top: activeObject.top + (clipRect.getScaledHeight() / 2),
      //     //         right: activeObject.left + activeObject.getScaledWidth() - (clipRect.getScaledWidth() / 2),
      //     //         bottom: activeObject.top + activeObject.getScaledHeight() - (clipRect.getScaledHeight() / 2)
      //     //     };
      //     //     clipRect.set({
      //     //         left: Math.min(Math.max(clipRect.left, rectBounds.left), rectBounds.right),
      //     //         top: Math.min(Math.max(clipRect.top, rectBounds.top), rectBounds.bottom)
      //     //     });
      //     //     clipRect.setCoords();
      //     // });

      //     // clipRect.on('deselected', () => {
      //     //     // When clipRect is not selected, make the original object interactive again
      //     //     activeObject.selectable = true;
      //     //     activeObject.evented = true;
      //     // });
      // }



      // clipRect.on('modified', () => {
      // });

      // clipRect.on('scaling', function () {
      //     let image_p_width = (activeObject.width * activeObject.scaleX) - ((activeObject.width * activeObject.scaleX) - clipRect.getScaledWidth());
      //     let image_p_height = (activeObject.height * activeObject.scaleY) - ((activeObject.height * activeObject.scaleY) - clipRect.getScaledHeight());

      //     // if(activeObject.width * activeObject.scaleX <= image_p_width){
      //     //     let newX = activeObject.left + (activeObject.width * activeObject.scaleX / 2);
      //     //     let newY = activeObject.top + (activeObject.height * activeObject.scaleY / 2);

      //     //     // Update clipRect properties
      //     //     clipRect.set({
      //     //         left: newX,
      //     //         top: newY,
      //     //         width: activeObject.width * activeObject.scaleX,
      //     //         scaleX: 1,
      //     //         scaleY: 1,
      //     //     });
      //     // }else if(activeObject.height * activeObject.scaleY <= image_p_height){
      //     //     let newX = activeObject.left + (activeObject.width * activeObject.scaleX / 2);
      //     //     let newY = activeObject.top + (activeObject.height * activeObject.scaleY / 2);

      //     //     // Update clipRect properties
      //     //     clipRect.set({
      //     //         left: newX,
      //     //         top: newY,
      //     //         height: activeObject.height * activeObject.scaleY,
      //     //         scaleX: 1,
      //     //         scaleY: 1,
      //     //     });

      //     // }
      //     // // Update canvas
      //     // this.canvas.renderAll();
      // })


      // clipRect.on('moving', () => {
      //     var rectBounds = {
      //         left: activeObject.left + (clipRect.getScaledWidth() / 2),
      //         top: activeObject.top + (clipRect.getScaledHeight() / 2),
      //         right: activeObject.left + activeObject.getScaledWidth() - (clipRect.getScaledWidth() / 2),
      //         bottom: activeObject.top + activeObject.getScaledHeight() - (clipRect.getScaledHeight() / 2)
      //     };
      //     clipRect.set({
      //         left: Math.min(Math.max(clipRect.left, rectBounds.left), rectBounds.right),
      //         top: Math.min(Math.max(clipRect.top, rectBounds.top), rectBounds.bottom)
      //     });
      //     clipRect.setCoords();
      // });

      // clipRect.on('mousedown', () => {
      //     clipRect.set('visible', true);
      //     this.canvas.renderAll();
      // });

      // clipRect.on('mouseup', () => {
      //     clipRect.set('visible', true);
      //     this.canvas.setActiveObject(clipRect);
      //     this.canvas.renderAll();
      // });



      changeValue() {
            if (this.designName) {
                  this.designName = this.designName.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            }
            if (this.templates_search_query) {
                  this.templates_search_query = this.templates_search_query.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            }
            if (this.stickers_search_query) {
                  this.stickers_search_query = this.stickers_search_query.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            }
            if (this.bg_search_query) {
                  this.bg_search_query = this.bg_search_query.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            }
            if (this.bg_stock_photo_search_query) {
                  this.bg_stock_photo_search_query = this.bg_stock_photo_search_query.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            } ``
            if (this.stock_photo_search_query) {
                  this.stock_photo_search_query = this.stock_photo_search_query.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            }
            if (this.collection_search_query) {
                  this.collection_search_query = this.collection_search_query.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '');
            }
      }
}
