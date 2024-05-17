import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { BASICSHAPELIST, COLORS, CUSTOM_ATTRIBUTES, ERROR, FILTERMATRIX, GRADIENT_COLORS, HOST, SHADOW_THEME, StickerType, TEXT_DEFAULT_GRADIENT_COLORS, TEXT_STATIC_COLORS, background_tab_index, blendMode, editorTabs, layer_image_validation, transparentColor } from '../app/app.constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';
import { DataService } from './services/data.service';
import { UtilsService } from './services/utils.service';
import { ImageCropper, FabricCropListener } from './../assets/js/cropping.js';

var custom_attributes: any[] = CUSTOM_ATTRIBUTES;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('stickerTab', { read: ElementRef }) public stickerTab!: ElementRef<any>;
  @ViewChild('backgroundsTab', { read: ElementRef }) public backgroundsTab!: ElementRef<any>;

  public title = 'Flyers, Business Cards, Logo Maker, Resume Templates, Cover Letter';
  public designName: any = "Untitled Design";
  public canvas_container = "calc(100% - 665px)";
  public right_width = "240px";
  // public canvas: any;
  canvas!: fabric.Canvas;
  public zoomHeightRef: any = 672;
  public zoomWidthRef: any = 546;
  public displayHeight: any = 672;
  public displayWidth: any = 546;
  public gridsGroup: any;
  public gridH: any;
  public gridV: any;
  public processKeys: any;
  public selected: boolean = false;
  isBasicTabActive:boolean = true;
  public IsPropActive: boolean = true;
  public is_layer_active: boolean = false;
  public is_page_active: boolean = false;
  public counterInterval: any = undefined;
  public selectedObjPos: any = {
    top: null,
    left: null
  }; 
  public selectedObjSize: any = {
    height: null,
    width: null
  };

  selectedObjDeg: any = 0;
  panelOpenState = false;
  activeStrokeWidth: number = 0;
  activeBorderRadius: number = 0;
  shadowBlur:number = 0;
  shadowColor:string = '#000000ff';
  offSetX:number = 0;
  offSetY:number = 0;
  fillColor: string = '#0f1934ff';
  strokeColor: string = 'ffffffff';
  elementWidth:number = 0;
  elementHeight:number = 0;
  whatEleWidth:number = 0;
  whatEleHeight:number = 0;
  whatEleScale:number = 1;
  isCircle:boolean = false;
  isRect:boolean = false;
  isLine:boolean = false;
  isSvgEle:boolean = false;
  isSvgSticker:boolean = false;
  isFormatPainterEnable:boolean = false;
  rangeMoveTimeout: any;
  formatPainterClipboard: any = {};
  isLocked:any = false;
  canvasObjectList:any = [];
  canvasreveseobjectListe:any = [];
  layerSelected:any;
  isReplaceMode:any = false;
  isReplaceShow:boolean = false;
  isReplaceSame: any = false;
  removable_attribute_list: any = ['isFromServer', 'uniqueName', 'isModified', 'json', 'uploadFrom', 'ctop', 'cleft', 'cheight', 'cwidth', 'stockphotodetail', 'ischanged', 'stockPhotoItem', 'original_src', 'exclusiveName', 'isTransparent', 'isCroped'];
  color:string = '#0f1934ff';
  isGroup:boolean = false;
  public copiedObject: any;
  isFromInput:boolean = false;
  activeTabID:number = 1;
  // stickerCatalog_List: any = ['Flowchart', 'Line', 'Circle', '3D', 'Shield', 'Rectangle', 'Star', 'Heart', 'Oval', 'Square', 'Triangle', 'Stamp Border', 'SemiCircle', 'Arrow'];
  stickerCatalog_List: any = [];
  stickerContent_List: any = [];
  uniqueArray: any = [];
  referenceArray: any = [];
  stkr_catalog_id: any;
  shape: any = true;
  stickers: any = false;
  buttons: any = false;
  stockPhotos: any = true;
  collection: any = false;
  myPhotos: any = false;
  public tabs: any[] = editorTabs;
  public basicShapesList: any = BASICSHAPELIST;
  textStaticCollection: any = TEXT_STATIC_COLORS;
  shadow_theme_collection: any = SHADOW_THEME;
  blendMode: any[] = blendMode;
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
    opacity: 100,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontDiff: null,
    fontPosition: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: '',
    curvedText: '',
    cornerSize: 10,
    strokeSize: 0,
    strokeColor: '#000000',
    textBgColor: '#FFFFFF',
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
    sepia2: false,
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
  shapes: any = [{
    src: './assets/masks/1.png',
    svg: './assets/svgs/37.svg'
  },
  {
    src: './assets/masks/2.png',
    svg: './assets/svgs/38.svg'
  },
  {
    src: './assets/masks/3.png',
    svg: './assets/svgs/39.svg'
  },
  {
    src: './assets/masks/4.png',
    svg: './assets/svgs/40.svg'
  },
  {
    src: './assets/masks/5.png',
    svg: './assets/svgs/41.svg'
  },
  {
    src: './assets/masks/6.png',
    svg: './assets/svgs/42.svg'
  }];
  public exclusiveFilters = ['sepia', 'grayscale', 'invert', 'blackWhite', 'brownie', 'vintage', 'emboss', 'kodachrome', 'technicolor'];
  public cumulativeFilters = ['brightness', 'contrast', 'blur', 'saturation', 'blendColor'];

  stock_photo_search_query: any = "";
  bg_stock_photo_search_query: any = "";
  isStockPhotoList: any = false;
  stock_photo_list: any = [];
  stock_photo_response: any = {};
  stock_photo_pg_count: number = 1;
  stock_photo_itm_pr_pg: number = 200;
  
  getClippathtop: any = 300;
  getClippathleft: any = 525;
  getClippathwidth: any = 150;
  getClippathheight: any = 150;
  whatLastLeft: any;
  whatLastTop: any;
  whatLastBottom: any;
  whatLastRight: any;
  whatLastWidth: any;
  whatLastHeight: any;
  whatLeftDiff: number = 0;
  whatTopDiff: number = 0;

  public isCropingEnable: boolean = false;
  public currentImg: fabric.Image | null = null;
  public selectionRect: any;
  public cropEleScaleX: any;
  public cropEleScaleY: any;
  public newclipWidth: any;
  public newclipHeight: any;
  public oldclipWidth: any;
  public oldclipHeight: any;
  listener!: FabricCropListener;
  isCropping: boolean = false;
  activeObjectonCanvas!: fabric.Object;
  bgCropImage: fabric.Object;
  snapAngles: number[] = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  snapThreshold: number = 5;

  bg_sub_tab_shown: any = true;
  txturs_bg_pg_count: number = 1;
  bgcolor: any = true;
  gradient: any = false;
  textures: any = false;
  images: any = false;
  bgMyPhotos: any = false;
  bgStockPhotos: any = false;
  bgSetting: any = false;
  isBgImg: any = false;
  bg_search_query: any = "";
  tmp_bg_search_query: any = "";
  activeTab: any = {};
  backgroundCatalog_list: any = [];
  bg_catalog_id: any;
  txturs_bg_list: any = [];
  login_response: any = {};
  isTextureList: boolean = false;
  backgroundStockPhoto: any;
  stockPhotoList: Array<any> = [];
  custom_background_tab_index: any = background_tab_index;
  scaleOption: any = [
    {
      value: 'Exact Fit',
      display_value: 'Exact Fit'
    },
    {
      value: 'Maintain Aspect',
      display_value: 'Maintain Aspect'
    },
    {
      value: 'No Scale',
      display_value: 'No Scale'
    },
    {
      value: 'Scale Crop',
      display_value: 'Scale Crop'
    }
  ];
  custom_attributes: any = custom_attributes;

  colors: any = COLORS;
  public gradientMode: any = 'linear';
  public isTextGradient: any = true;
  public linearMode: any = 'tl';
  public radialMode: any = 'mm';
  gradientArray: any = [
    { color: '#F00809', offset: 0, },
    { color: '#F008B7', offset: 100, }
  ];
  textGradientArray: any = [
    { color: '#F00809', offset: 0, },
    { color: '#F008B7', offset: 1, }
  ];
  public isInputFocus = true;
  coords: any = {}
  radialCoords: any = {};
  textDefaultGradientCollection: any = TEXT_DEFAULT_GRADIENT_COLORS;
  gradientCollection: any = GRADIENT_COLORS;
  whatLastBg: any;

  ngOnDestroy() {
    document.removeEventListener("keydown", this.processKeys, false);
    document.removeEventListener('mousedown', this.handleGlobalMouseDown);
  }

  constructor(private sanitizer: DomSanitizer, private dataService: DataService, public utils: UtilsService) {
      
    this.tabs = this.tabs.map(tab => ({
      ...tab,
      sanitizedIconSvg: this.sanitizeHtml(tab.iconSvg)
    }));

    this.processKeys = (e) => {
      
      if (e.keyCode == 46) {
        const activeObject = this.canvas.getActiveObject();
        const activeGroup = this.canvas.getActiveObjects();

        if (activeObject && !this.isGroup) {
          
          this.canvas.remove(activeObject);
        }
        else if (activeObject && this.isGroup) {
          const objects = activeObject.getObjects().slice();
          this.canvas.discardActiveObject();
      
          objects.forEach(obj => {
            this.canvas.remove(obj);
            const index = this.canvasObjectList.findIndex(listObj => listObj.id === obj.id);
            if (index !== -1) {
              this.canvasObjectList.splice(index, 1);
            }
          });
          this.canvas.requestRenderAll();
        }
        
        this.selected = false;
        const index = this.canvasObjectList.findIndex(obj => obj.id === this.layerSelected.id);
        
        if (index !== -1) {
          this.canvasObjectList.splice(index, 1);

        }
        this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
        this.isReplaceShow = false;
      }

      if(e.ctrlKey && e.key == 'c') {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
          activeObject.clone((cloned) => {
            
            this.copiedObject = cloned;
          });
        }

      }
      else if(e.ctrlKey && e.key == 'v') {
        const activeObject = this.canvas.getActiveObject();
        if (this.copiedObject) {

          this.copiedObject.clone((clonedObj) => {

            this.canvas.discardActiveObject();
            clonedObj.set({
              left: clonedObj.left + 10,
              top: clonedObj.top + 10,
              evented: true,
              borderColor: '#00C3F9',
              id: this.generateUniqueId(),
              centeredScaling: false,
              centeredRotation: true,
              cornerSize: 15,
              cornerColor: '#00C3F9',
              cornerStyle: 'circle',
              transparentCorners: false,
            });

            if (clonedObj.type === 'activeSelection') {
              
              clonedObj.canvas = this.canvas;
              clonedObj.forEachObject((obj,index) => {
                obj.id = this.generateUniqueId();
                obj.cornerSize = 15,
                obj.cornerColor = '#00C3F9',
                obj.cornerStyle = 'circle',
                obj.transparentCorners = false,
                obj.excludeFromExport = false,
                obj.clipTo = null,
                obj.element_type = activeObject._objects[index].element_type;

                if(activeObject._objects[index].isCroped) {
                  obj.cwidth = activeObject._objects[index].cwidth;
                  obj.cheight = activeObject._objects[index].cheight;
                  obj.cleft = activeObject._objects[index].cleft;
                  obj.ctop = activeObject._objects[index].ctop;
                  obj.isCroped = activeObject._objects[index].isCroped;
                  obj._cropSource = activeObject._objects[index]._cropSource;
                }
                
                this.canvas.add(obj);
                this.canvasObjectList.push(obj.toJSON(['class','id','isLocked','element_type']));
              });
              clonedObj.setCoords();
            } 
            else {
              
              clonedObj.element_type = activeObject.element_type;
              clonedObj.class = activeObject.class;
              clonedObj.isLocked = activeObject.isLocked;

              if(activeObject.element_type == "shapeSticker") {

                clonedObj._objects.forEach((subObj, index) => {
                  if (activeObject._objects && activeObject._objects[index]) {
                    subObj.set({
                      id: activeObject._objects[index].id,
                    });
                  }
                });
              }

              if(activeObject.isCroped) {
                clonedObj.cwidth = activeObject.cwidth;
                clonedObj.cheight = activeObject.cheight;
                clonedObj.cleft = activeObject.left;
                clonedObj.ctop = activeObject.top;
                clonedObj.isCroped = activeObject.isCroped;
                clonedObj._cropSource = activeObject._cropSource;
              }

              this.canvas.add(clonedObj);
              this.canvasObjectList.push(clonedObj.toJSON(['class','id','isLocked','element_type']));
            }

            this.canvas.setActiveObject(clonedObj);
            this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
            this.canvas.requestRenderAll();
          });
        }

      }

      if(e.key == 'ArrowLeft' && !this.isFromInput) {
        var activeObject = this.canvas.getActiveObject();
        this.selectedObjPos.left = parseInt(activeObject.left) - 1;
        activeObject.set('left',this.selectedObjPos.left);
        this.canvas.renderAll();
      }
      if(e.key == 'ArrowRight' && !this.isFromInput) {
        var activeObject = this.canvas.getActiveObject();
        this.selectedObjPos.left = parseInt(activeObject.left) + 1;
        activeObject.set('left',this.selectedObjPos.left);
        this.canvas.renderAll();
      }
      if(e.key == 'ArrowUp' && !this.isFromInput) {
        var activeObject = this.canvas.getActiveObject();
        this.selectedObjPos.top = parseInt(activeObject.top) - 1;
        activeObject.set('top',this.selectedObjPos.top);
        this.canvas.renderAll();
      }
      if(e.key == 'ArrowDown' && !this.isFromInput) {
        var activeObject = this.canvas.getActiveObject();
        this.selectedObjPos.top = parseInt(activeObject.top) + 1;
        activeObject.set('top',this.selectedObjPos.top);
        this.canvas.renderAll();
      }
    };

    document.addEventListener("keydown", this.processKeys, false);
  }

  ngOnInit(): void {
    this.canvas = new fabric.Canvas('canvas');
    // this.listener = new FabricCropListener(this.canvas);
    let hoveredObject: any;
    localStorage.setItem('ut','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM4ODgsImlzcyI6Imh0dHBzOi8vdGVzdC5waG90b2Fka2luZy5jb20vYXBpL3B1YmxpYy9hcGkvZG9Mb2dpbkZvclVzZXIiLCJpYXQiOjE3MTU3NzA1MTYsImV4cCI6MTcxNjM3NTMxNiwibmJmIjoxNzE1NzcwNTE2LCJqdGkiOiJhNEtKU3NYbUh2RmJvSmNFIn0.PRONN0KGZcf-d9ROy5wESO1Q2c66mn7lXgkAmnInKSQ')
    
    this.canvas.on({
      'selection:created': (e) => {
        
        const activeObject = this.canvas.getActiveObject();
        this.layerSelected = activeObject;
        this.selected = true;
        this.uniqueArray = [];
        this.referenceArray = [];
        // this.isGroup = (activeObject._objects && this.isBasicTabActive) ? true : false;
        this.isCircle = (activeObject.type === "circle") ? true : false;
        this.isRect = (activeObject.type === "rect") ? true : false;
        this.isLine = (activeObject.type === "line") ? true : false;
        this.isSvgEle = (activeObject.element_type === 'shapeSticker') ? true : false;
        this.isSvgSticker = (activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.type === 'image') ? true : false;
        
        if(activeObject._objects && !activeObject.element_type) {
          this.isGroup = true;
        }
        else {
          this.isGroup = false;
        }

        this.elementWidth = Math.round(activeObject.width * activeObject.scaleX);
        this.elementHeight = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
        this.selectedObjDeg = Math.round(activeObject.angle);
        this.selectedObjPos.left = Math.round(activeObject.left);
        this.selectedObjPos.top = Math.round(activeObject.top);
        this.activeBorderRadius = (activeObject.rx) ? activeObject.rx : 0;
        this.isReplaceShow = (activeObject._objects) ? false : false;
        this.layerSelected = activeObject;
        
        this.changeToolTipPosition(activeObject);
        
        if(activeObject.element_type === 'shapeSticker') {
          
          this.applySelectionOnObj();
          this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
          this.whatEleHeight = activeObject.height;
          this.whatEleWidth = activeObject.width;
        }

        if (this.isFormatPainterEnable == true) {
          if (activeObject.type == 'image') {

            this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
            this.canvas.getActiveObject().applyFilters();
            this.canvas.renderAll()
            
            this.isFormatPainterEnable = false;
            this.formatPainterClipboard = {};
          }
          else {
            this.isFormatPainterEnable = false;
            this.formatPainterClipboard = {};
          }
        }

        if (this.isReplaceSame) {
          this.isReplaceSame = false;
        } 
        else {
          this.isReplaceMode = false;
        }

        // this.isReplaceMode = false;
        if(activeObject.type == 'image') {
          const filters = activeObject.filters || [];
          
          filters.forEach(filter => {
            
            if (filter.type === 'Brightness') {
              this.props.brightness = (filter.brightness * 100).toFixed(0);
            } 
            else if (filter.type === 'Contrast') {
              this.props.contrast = (filter.contrast * 100).toFixed(0);
            } 
            else if (filter.type === 'Saturation') {
              this.props.saturation = (filter.saturation * 100).toFixed(0);
            } 
            else if (filter.type === 'Tint') {
              this.props.tint = filter.color;
            } 
            else if (filter.type === 'Blur') {
              this.props.blur = (filter.blur * 100).toFixed(0);
            } 
            else if (filter.type === 'BlendColor') {
              this.props.blendColor = filter.color;
              this.props.blendMode = filter.mode;
              this.props.blendAlpha = (filter.alpha * 100).toFixed(0);
            }

            switch (filter.__proto__.type) {
              
              case 'Sepia':
                this.props.sepia = true;
                this.props.grayscale = false;
                this.props.invert = false;
                this.props.blackWhite = false;
                this.props.brownie = false;
                this.props.vintage = false;
                this.props.emboss = false;
                this.props.kodachrome = false;
                this.props.technicolor = false;
                break;

              case 'Sepia2':
                this.props.sepia2 = true;
                break;

              case 'Grayscale':
                this.props.grayscale = true;
                this.props.sepia = false;
                this.props.invert = false;
                this.props.blackWhite = false;
                this.props.brownie = false;
                this.props.vintage = false;
                this.props.emboss = false;
                this.props.kodachrome = false;
                this.props.technicolor = false;
                break;

              case 'Invert':
                this.props.invert = true;
                this.props.sepia = false;
                this.props.grayscale = false;
                this.props.blackWhite = false;
                this.props.brownie = false;
                this.props.vintage = false;
                this.props.emboss = false;
                this.props.kodachrome = false;
                this.props.technicolor = false;
                break;
                
              case 'ColorMatrix':
                if (this.compareArray(filter.matrix, FILTERMATRIX.BlackNWhite))
                  this.props.blackWhite = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.Brownie))
                  this.props.brownie = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.Vintage))
                  this.props.vintage = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.kodachrome))
                  this.props.kodachrome = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.Technicolor))
                  this.props.technicolor = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                break;

              case 'Convolute':
                if (this.compareArray(filter.matrix, FILTERMATRIX.Emboss))
                  this.props.emboss = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;
                break;
              
            }
            
          });
        }

        if(!activeObject.clipPath) {
          this.getClippathwidth = activeObject.width * activeObject.scaleX;
          this.getClippathheight = activeObject.height * activeObject.scaleY;
          this.getClippathleft = activeObject.left;
          this.getClippathtop = activeObject.top;
        }
      },
      'selection:updated': (e) => {
        
        const activeObject = this.canvas.getActiveObject();
        this.layerSelected = activeObject;
        this.selected = true;
        this.isCircle = (activeObject.type === "circle") ? true : false;
        this.isRect = (activeObject.type === "rect") ? true : false;
        this.isLine = (activeObject.type === "line") ? true : false;
        this.isSvgEle = (activeObject.element_type === 'shapeSticker') ? true : false;
        this.isSvgSticker = (activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') ? true : false;

        if(activeObject._objects && !activeObject.element_type) {
          this.isGroup = true;
        }
        else {
          this.isGroup = false;
        }

        this.elementWidth = Math.round(activeObject.width * activeObject.scaleX);
        this.elementHeight = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
        this.selectedObjDeg = Math.round(activeObject.angle);
        this.selectedObjPos.left = Math.round(activeObject.left);
        this.selectedObjPos.top = Math.round(activeObject.top);
        this.activeBorderRadius = (activeObject.rx) ? activeObject.rx : 0;
        this.isReplaceShow = (activeObject._objects) ? false : false;
        this.layerSelected = activeObject;
        this.changeToolTipPosition(activeObject);

        if(activeObject.element_type === 'shapeSticker') {
          this.applySelectionOnObj();
          this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
          this.whatEleHeight = activeObject.height;
          this.whatEleWidth = activeObject.width;
        }

        if (this.isFormatPainterEnable == true) {
          if (activeObject.type == 'image') {

            this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
            this.canvas.getActiveObject().applyFilters();
            this.canvas.renderAll()
            
            this.isFormatPainterEnable = false;
            this.formatPainterClipboard = {};
          }
          else {
            this.isFormatPainterEnable = false;
            this.formatPainterClipboard = {};
          }
        }

        if(activeObject.type == 'image') {
          const filters = activeObject.filters || [];

          filters.forEach(filter => {
            if (filter.type === 'Brightness') {
              this.props.brightness = (filter.brightness * 100).toFixed(0);
            } 
            else if (filter.type === 'Contrast') {
              this.props.contrast = (filter.contrast * 100).toFixed(0);
            } 
            else if (filter.type === 'Saturation') {
              this.props.saturation = (filter.saturation * 100).toFixed(0);
            } 
            else if (filter.type === 'Tint') {
              this.props.tint = filter.color;
            } 
            else if (filter.type === 'Blur') {
              this.props.blur = (filter.blur * 100).toFixed(0);
            } 
            else if (filter.type === 'BlendColor') {
              this.props.blendColor = filter.color;
              this.props.blendMode = filter.mode;
              this.props.blendAlpha = (filter.alpha * 100).toFixed(0);
            }

            switch (filter.__proto__.type) {
              
              case 'Sepia':
                this.props.sepia = true;
                this.props.grayscale = false;
                this.props.invert = false;
                this.props.blackWhite = false;
                this.props.brownie = false;
                this.props.vintage = false;
                this.props.emboss = false;
                this.props.kodachrome = false;
                this.props.technicolor = false;
                break;

              case 'Sepia2':
                this.props.sepia2 = true;
                break;

              case 'Grayscale':
                this.props.grayscale = true;
                this.props.sepia = false;
                this.props.invert = false;
                this.props.blackWhite = false;
                this.props.brownie = false;
                this.props.vintage = false;
                this.props.emboss = false;
                this.props.kodachrome = false;
                this.props.technicolor = false;
                break;

              case 'Invert':
                this.props.invert = true;
                this.props.sepia = false;
                this.props.grayscale = false;
                this.props.blackWhite = false;
                this.props.brownie = false;
                this.props.vintage = false;
                this.props.emboss = false;
                this.props.kodachrome = false;
                this.props.technicolor = false;
                break;
                
              case 'ColorMatrix':
                if (this.compareArray(filter.matrix, FILTERMATRIX.BlackNWhite))
                  this.props.blackWhite = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.Brownie))
                  this.props.brownie = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.Vintage))
                  this.props.vintage = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.kodachrome))
                  this.props.kodachrome = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.technicolor = false;

                if (this.compareArray(filter.matrix, FILTERMATRIX.Technicolor))
                  this.props.technicolor = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.emboss = false;
                  this.props.kodachrome = false;
                break;

              case 'Convolute':
                if (this.compareArray(filter.matrix, FILTERMATRIX.Emboss))
                  this.props.emboss = true;
                  this.props.sepia = false;
                  this.props.grayscale = false;
                  this.props.invert = false;
                  this.props.blackWhite = false;
                  this.props.brownie = false;
                  this.props.vintage = false;
                  this.props.kodachrome = false;
                  this.props.technicolor = false;
                break;
              
            }
          });
        }

        if(!activeObject.clipPath) {
          this.getClippathwidth = activeObject.width * activeObject.scaleX;
          this.getClippathheight = activeObject.height * activeObject.scaleY;
          this.getClippathleft = activeObject.left;
          this.getClippathtop = activeObject.top;
        }
      },
      'object:moving': (e) => {
        // Logic for set object in center while moving
        var hSnapZone = 15;
        var hObjectMiddle = e.target.left + (e.target.width * e.target.scaleX) / 2;
        if (hObjectMiddle > this.zoomWidthRef / 2 - hSnapZone && hObjectMiddle < this.zoomWidthRef / 2 + hSnapZone) {
          e.target.set({
            left: this.zoomWidthRef / 2 - (e.target.width * e.target.scaleX) / 2,
          }).setCoords();
        }
        var vSnapZone = 15;
        var vObjectMiddle = e.target.top + (e.target.height * e.target.scaleY) / 2;
        if (vObjectMiddle > this.zoomHeightRef / 2 - vSnapZone && vObjectMiddle < this.zoomHeightRef / 2 + vSnapZone) {
          e.target.set({
            top: this.zoomHeightRef / 2 - (e.target.height * e.target.scaleY) / 2,
          }).setCoords();
        }

        const activeObject = this.canvas.getActiveObject();
        this.currentImg = activeObject
        let activeObjectBottom = activeObject.top + (activeObject.height * activeObject.scaleY);
        let activeObjectRight = activeObject.left + (activeObject.width * activeObject.scaleX);
        
        if(activeObject.clipPath) {
          if( activeObject.clipPath && this.whatLastLeft > activeObject.left && this.whatLastTop > activeObject.top && this.whatLastBottom < activeObjectBottom && this.whatLastRight < activeObjectRight ){
            
            this.layerSelected = activeObject;
            this.selectedObjPos.left = Math.round(activeObject.left);
            this.selectedObjPos.top = Math.round(activeObject.top);
            this.elementWidth = Math.round(activeObject.width * activeObject.scaleX);
            this.elementHeight = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
            this.isReplaceShow = (activeObject._objects) ? false : false;
            
            // this.getClippathwidth = activeObject.width * activeObject.scaleX;
            // this.getClippathheight = activeObject.height * activeObject.scaleY;
            // this.getClippathleft = activeObject.left;
            // this.getClippathtop = activeObject.top;
          }
          else {
            
            if( this.whatLastLeft < activeObject.left && this.whatLastTop > activeObject.top && this.whatLastBottom < activeObjectBottom && this.whatLastRight < activeObjectRight ) {
              activeObject.set({ left: this.whatLastLeft, top: activeObject.top });
            }
            else if( this.whatLastTop < activeObject.top && this.whatLastLeft > activeObject.left && this.whatLastBottom < activeObjectBottom && this.whatLastRight < activeObjectRight ) {
              activeObject.set({ top: this.whatLastTop, left: activeObject.left});
            }
            else if( this.whatLastBottom > activeObjectBottom && this.whatLastRight < activeObjectRight && this.whatLastTop > activeObject.top && this.whatLastLeft > activeObject.left ) {
              activeObject.set({ top: this.whatLastTop - ((activeObject.height * activeObject.scaleY) - this.whatLastHeight)});
            }
            else if( this.whatLastBottom < activeObjectBottom && this.whatLastRight > activeObjectRight && this.whatLastTop > activeObject.top && this.whatLastLeft > activeObject.left ) {
              activeObject.set({ left: this.whatLastLeft - ((activeObject.width * activeObject.scaleX) - this.whatLastWidth)});
            }
            else if( this.whatLastTop < activeObject.top && this.whatLastLeft < activeObject.left && this.whatLastBottom < activeObjectBottom && this.whatLastRight < activeObjectRight ) {
              activeObject.set({ left: this.whatLastLeft, top: this.whatLastTop,});
            }
            else if( this.whatLastBottom > activeObjectBottom && this.whatLastRight > activeObjectRight && this.whatLastTop > activeObject.top && this.whatLastLeft > activeObject.left) {
              activeObject.set({ left: this.whatLastLeft - ((activeObject.width * activeObject.scaleX) - this.whatLastWidth),  top: this.whatLastTop - ((activeObject.height * activeObject.scaleY) - this.whatLastHeight)});
            }
            else if( this.whatLastTop < activeObject.top && this.whatLastLeft > activeObject.left && this.whatLastBottom < activeObjectBottom && this.whatLastRight > activeObjectRight ) {
              activeObject.set({ left: this.whatLastLeft - ((activeObject.width * activeObject.scaleX) - this.whatLastWidth), top: this.whatLastTop,});
            }
            else if( this.whatLastBottom > activeObjectBottom && this.whatLastRight < activeObjectRight && this.whatLastTop > activeObject.top && this.whatLastLeft < activeObject.left) {
              activeObject.set({ left: this.whatLastLeft,  top: this.whatLastTop - ((activeObject.height * activeObject.scaleY) - this.whatLastHeight)});
            } 
            this.canvas.renderAll();
            
            setTimeout(() => {
              this.selectedObjPos.left = Math.round(activeObject.left);
              this.selectedObjPos.top = Math.round(activeObject.top);
              this.elementWidth = Math.round(activeObject.width * activeObject.scaleX);
              this.elementHeight = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
              this.isReplaceShow = (activeObject._objects) ? false : false;
              // this.getClippathwidth = activeObject.width * activeObject.scaleX;
              // this.getClippathheight = activeObject.height * activeObject.scaleY;
              // this.getClippathleft = activeObject.left;
              // this.getClippathtop = activeObject.top;
            }, 1000);
          }
        }
        else {
          this.layerSelected = activeObject;
          
          this.selectedObjPos.left = Math.round(activeObject.left);
          this.selectedObjPos.top = Math.round(activeObject.top);
          this.elementWidth = Math.round(activeObject.width * activeObject.scaleX);
          this.elementHeight = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
          this.isReplaceShow = (activeObject._objects) ? false : false;
          
          this.getClippathwidth = activeObject.width * activeObject.scaleX;
          this.getClippathheight = activeObject.height * activeObject.scaleY;
          this.getClippathleft = activeObject.left;
          this.getClippathtop = activeObject.top;
        }
      },
      'object:scaled': (e) => {
        e.target.isScaling = false;  // Reset scaling flag after scaling is complete
      },
      'object:scaling': (e) => {
        const activeObject = this.canvas.getActiveObject();
        // this.cropEleScale = (activeObject.isCroped) ? activeObject.scaleX : 1;
        this.currentImg = activeObject;
        /************** Working code ******************/
        this.layerSelected = activeObject;
        var newWidth = Math.round(activeObject.width * activeObject.scaleX);
        var newHeight = (activeObject.type === 'line') ? activeObject.strokeWidth : Math.round(activeObject.height * activeObject.scaleY);
        
        this.elementWidth = newWidth;
        this.elementHeight = newHeight;

        this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
        this.whatEleHeight = activeObject.height;
        this.whatEleWidth = activeObject.width;
        this.selectedObjPos.left = Math.round(activeObject.left);
        this.selectedObjPos.top = Math.round(activeObject.top);
        this.isReplaceShow = (activeObject._objects) ? false : false;
        
        if(!activeObject.clipPath) {
          this.getClippathwidth = activeObject.width * activeObject.scaleX;
          this.getClippathheight = activeObject.height * activeObject.scaleY;
          this.getClippathleft = activeObject.left;
          this.getClippathtop = activeObject.top;
          // this.cropEleScale = activeObject.scaleX;
          this.newclipWidth = activeObject.width * activeObject.scaleX;
          this.newclipHeight = activeObject.height * activeObject.scaleY;
        }

        if(activeObject.type !== 'circle' && activeObject.element_type !== 'shapeSticker' && activeObject.element_type !== 'svgSticker' && activeObject.element_type !== 'stockphotos') {

          activeObject.set({
            noScaleCache: false,
            statefullCache: true
          })
          
          activeObject.width = newWidth;
          if(activeObject.type === 'line') {

            activeObject.strokeWidth = activeObject.strokeWidth;
          }
          else {
            activeObject.height = newHeight;
          }
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
          this.canvas.renderAll();
        }
        
      },
      'selection:cleared': (e) => {
        
        this.isReplaceShow = (this.isGroup) ? false : false;
        if (!this.isReplaceSame) {
          this.isReplaceMode = false;
        }
        this.selected = false;
        this.isGroup = false;

        if (this.isFormatPainterEnable == true) {
          this.isFormatPainterEnable = false;
          this.formatPainterClipboard = {};
        }
      },
      'object:rotating': (e) => {
        if (this.selected) {
          // Set near by angle while rotating object
          /* const activeObject = e.target;
          const currentAngle = activeObject.angle % 360;
          const closestAngle = this.getClosestAngle(currentAngle);
          if (Math.abs(closestAngle - currentAngle) <= this.snapThreshold) {
            console.log(closestAngle,"if");
            activeObject.angle = closestAngle;
            activeObject.setCoords();
          }
          else {
            console.log(Math.round(e.target.angle),"else");
            activeObject.angle = Math.round(e.target.angle);
            activeObject.setCoords();
          }
          this.canvas.requestRenderAll(); */

          // object rotating 
          this.selectedObjDeg = Math.round(e.target.angle);
          // switch (Math.round(e.target.angle)) {
          //   case 0:
          //   case 45:
          //   case 90:
          //   case 135:
          //   case 180:
          //   case 225:
          //   case 270:
          //   case 315:
          //   case 360:
          //     // this.setRotationSelStyle();
          //     break;
          //   default:
          //     // this.setRotationDefStyle();
          //     break;
          // }
          this.isReplaceShow = (this.isReplaceShow) ? false : false;
        }
      },
      'object:selected': (e) => {
        
        this.isReplaceShow = true;
        const activeObject = this.canvas.getActiveObject();
        
        if (this.isFormatPainterEnable == true) {
          if (activeObject.type == 'image') {

            this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
            this.canvas.getActiveObject().applyFilters();
            this.canvas.renderAll()
            
            this.isFormatPainterEnable = false;
            this.formatPainterClipboard = {};
          }
          else {
            this.isFormatPainterEnable = false;
            this.formatPainterClipboard = {};
          }
        }
        else {
          
          this.applySelectionOnObj();
        }
        // if (this.isReplaceSame) {
        //   this.isReplaceSame = false;
        // } 
        // else {
        //   this.isReplaceMode = false;
        // }
      },
      'mouse:down': (e) => {
        
        if(this.canvas.getActiveObject()) {
          
          this.drawGrid(15);
        }
        if(this.listener && this.isCropingEnable){
          
          this.listener.confirm();
          this.canvas.getActiveObject().set({
            cleft: this.listener.cropTarget.left,
            ctop: this.listener.cropTarget.top,
            cwidth: this.listener.cropTarget.width,
            cheight: this.listener.cropTarget.height,
            isCroped: true
          });

          // this.canvas.backgroundColor = (this.whatLastBg) ? this.whatLastBg : '#ffffff';
          // this.canvas.renderAll();
          // this.isCropingEnable = false;
        }
      },
      'mouse:up': (e) => {
        // this.isReplaceShow = true;
        const activeObject = this.canvas.getActiveObject();
        this.changeToolTipPosition(activeObject);
        this.removeGrids();
      },
      'mouse:over': async (e) => {
        if (e.target) {
          hoveredObject = e.target;
          switch (hoveredObject.type) {

            case 'image':
              if (!hoveredObject.toolType) {

                if (this.isFormatPainterEnable && this.formatPainterClipboard.type == 'image') {
                  hoveredObject.set({
                    hoverCursor: "url('./assets/icons/format-painter.png'), auto"
                  })
                }
                else {
                  hoveredObject.hoverCursor = 'move';
                }
              }
              else {
                hoveredObject.hoverCursor = 'move';
              }

              break;
          }

        }
      },
      'mouse:dblclick': (e) => {
        if(!this.listener){

          this.listener = new FabricCropListener(this.canvas);
        }
        
        this.isReplaceShow = false;
        this.isReplaceMode = false;
        
        if(this.canvas.getActiveObject() && e.target.type === 'image') {
          this.isCropingEnable = true;

          // const activeObject = this.canvas.getActiveObject();
          // const cropData = activeObject.toObject();
          // const sourceData = activeObject._cropSource || cropData;
          // const freeModeScaling = true;
          // this.listener.crop({
          //   src: activeObject.getSrc(),
          //   cropData,
          //   sourceData,
          //   freeModeScaling,
          // });
          // let cropSource = {left:activeObject.left,top:activeObject.top,height:0,width: 0,freeModeScaling: freeModeScaling}
          // if(!activeObject._cropSource){
          //   if(activeObject.height > activeObject.width) {
          //     cropSource.height = activeObject.width//activeObject.height
          //     cropSource.width = activeObject.width//(activeObject.height * 4)/5
          //   }
          //   else if(activeObject.width > activeObject.height) {
          //     cropSource.height = activeObject.height//(activeObject.width * 5)/4
          //     cropSource.width = activeObject.height//activeObject.width
          //   }
          // }
          // activeObject._cropSource = sourceData; //{left: activeObject.left, top: activeObject.top, height: activeObject.height * }
          // console.log(cropSource,"--cropSource");
          
          this.listener.crop();
          // this.whatLastBg = this.canvas.backgroundColor;
          // this.canvas.backgroundColor = '#969ca33d';
          // this.canvas.renderAll();
        }

        /*************** crop image ************/
        /* if (e.target && e.target.type === 'image' && !this.isCropingEnable) {
          
          this.isCropingEnable = true;
          const activeobject = this.canvas.getActiveObject();

          if(!e.target.isCroped) {
            this.cropEleScaleX = activeobject.scaleX;  
            this.cropEleScaleY = activeobject.scaleY;
          }

          if(activeobject.filters) {
            this.formatPainterClipboard.properties = {
              filters: activeobject.filters,
            }

            this.formatPainterClipboard.objectId = activeobject.id || this.canvas.getActiveObject().toObject().id;
            this.formatPainterClipboard.type = 'image';
          }
          
          if (this.currentImg) {
            this.applyCropToImage(this.currentImg,activeobject);
          }
        } */
      }
    });

    document.addEventListener('mousedown', this.handleGlobalMouseDown);
  }

  getClosestAngle(angle: number): number {
    return this.snapAngles.reduce((prev, curr) => {
      return (Math.abs(curr - angle) < Math.abs(prev - angle) ? curr : prev);
    });
  }
  /* setRotationSelStyle() {
    const activeObject = this.canvas.getActiveObject();
    activeObject.borderColor = '#00c3f9';
    activeObject.cornerColor = '#00c3f9';
    // activeObject.strokeWidth = 5;
    activeObject.cornerStrokeColor = '#ffffff';
    activeObject.cornerStyle = 'circle';
    activeObject.selectionDashArray = [];
    activeObject.borderDashArray = [];
    activeObject.cornerDashArray = [];
    this.canvas.renderAll();
  }
  setRotationDefStyle() {
    const activeObject = this.canvas.getActiveObject();
    activeObject.borderColor = '#00c3f9';
    activeObject.cornerColor = '#00c3f9';
    activeObject.editingBorderColor = '#00c3f9';
    activeObject.cornerStrokeColor = '#ffffff';
    activeObject.cornerStyle = 'circle';
    activeObject.minScaleLimit = 0;
    activeObject.lockScalingFlip = true;
    activeObject.selectionDashArray = [];
    activeObject.borderDashArray = [];
    activeObject.cornerDashArray = [];
    activeObject.borderScaleFactor = 1.5;
    activeObject.cornerSize = 15;
    this.canvas.renderAll();
  } */

  private handleGlobalMouseDown = (event: MouseEvent) => {
    
    if(this.isCropingEnable) {
      
      const canvasDomElement = this.canvas.nativeElement;
      this.listener.confirm();
    }
  }

  /********** Image cropping without library ***********/
  applyCropToImage(image,activeobject) {
    this.canvas.off('mouse:down');
    this.canvas.off('selection:updated');
    this.canvas.off('mouse:up');
    
    var backgroundImg = new fabric.Image(image.getElement(), {
      left: this.getClippathleft - this.whatLeftDiff,
      top: this.getClippathtop - this.whatTopDiff,
      scaleX: (activeobject.isCroped) ? ((this.cropEleScaleX * this.newclipWidth)/ this.oldclipWidth) : image.scaleX, //image.scaleX,
      scaleY: (activeobject.isCroped) ? ((this.cropEleScaleY * this.newclipHeight ) / this.oldclipHeight) : image.scaleY, //image.scaleY,
      opacity: 0.3,
      selectable: true,
      stroke: '#0069ff',
      strokeWidth: 8,
    });

    backgroundImg.setCoords();
    this.canvas.add(backgroundImg);
    this.canvas.renderAll();
    backgroundImg.set(this.formatPainterClipboard.properties);
    backgroundImg.applyFilters();
    this.canvas.renderAll();
    
    var index = this.canvas.getObjects().indexOf(image);
    backgroundImg.moveTo(index);

    const rect = new fabric.Rect({
      left: this.getClippathleft,
      top: this.getClippathtop,
      width: this.getClippathwidth,
      height: this.getClippathheight,
      cornerSize: 15,
      cornerColor: '#00C3F9',
      cornerStyle: 'circle',
      selectable: false,
      evented: true,
      absolutePositioned: true,
      type: 'crop',
      transparentCorners: false,
      centeredScaling: false,
      centeredRotation: true,
      lockScalingFlip: true,
      lockMovementX: true,
      lockMovementY: true,
      _controlsVisibility: {
        tl: true,
        tr: true,
        br: true,
        bl: true,
        ml: false,
        mt: false,
        mr: false,
        mb: false,
        mtr: false
      },
    });
    image.setCoords();
    rect.setCoords();

    if (!image.clipPath) {
      
      image.clipPath = rect;
      this.canvas.setActiveObject(image.clipPath);
    } 
    else {
      image.clipPath = null;
      rect.set({
        left: this.getClippathleft,
        top: this.getClippathtop,
      });
      image.set({
        left: this.getClippathleft - this.whatLeftDiff,
        top: this.getClippathtop - this.whatTopDiff,
        scaleX: ((this.cropEleScaleX * this.newclipWidth)/ this.oldclipWidth),//(this.cropEleScale * (this.newclipWidth / this.oldclipWidth)),
        scaleY: ((this.cropEleScaleY * this.newclipHeight ) / this.oldclipHeight), //(this.cropEleScale * (this.newclipHeight / this.oldclipHeight)),
      });
      rect.setCoords();
      image.setCoords();
      image.clipPath = rect;

      image.set(this.formatPainterClipboard.properties);
      image.applyFilters();
      this.canvas.renderAll();
      
      if(this.canvas.getActiveObject().isCroped){
        this.canvas.remove(this.canvas.getActiveObject())
        this.canvas.setActiveObject(image.clipPath);
        this.canvas.add(image);
        this.canvas.renderAll();
      }
      else{
        this.canvas.remove(this.canvas.getActiveObject())
        this.canvas.setActiveObject(image.clipPath);
      }
    }

    this.canvas.on({
      
      'mouse:down': (e) => {
        
        var pointer = this.canvas.getPointer(e.e);
        var posX = pointer.x;
        var posY = pointer.y;

        if(e.target && e.target.clipPath) {
          
          if(posX > rect.left && posY > rect.top && posX < (rect.left + rect.width) && posY < (rect.top + rect.height)) {
            this.canvas.setActiveObject(image.clipPath);
            this.canvas.renderAll();
          }
        }
        if (!e.target) {
          
          if (image.clipPath && this.isCropingEnable) {
            this.isCropingEnable = false;
            this.whatLeftDiff = rect.left - image.left;
            this.whatTopDiff = rect.top - image.top;
            const newRect = image.clipPath;
            // image.clipPath = null;

            // Create a new image instance from cropped area
            var croppedImg = new Image();
            croppedImg.src = this.canvas.toDataURL({
              left: newRect.left,
              top: newRect.top,
              width: newRect.width,
              height: newRect.height,
            });

            croppedImg.onload = () => {
              const newImage = new fabric.Image(croppedImg);
              newImage.left = newRect.left;
              newImage.top = newRect.top;
              newImage.isCroped = true;
              newImage.element_type = "stockphotos";
              newImage.cornerSize = 15;
              newImage.cornerColor = '#00C3F9';
              newImage.cornerStyle = 'circle';
              newImage.transparentCorners = false;
              newImage.setCoords();
              this.canvas.add(newImage);

              // Remove clip path and background image (optional)
              
              this.canvas.remove(backgroundImg);
              this.canvas.remove(image);
              this.canvas.renderAll();
            };

            this.oldclipWidth = rect.width;
            this.oldclipHeight = rect.height;
            /* const originalCanvas = this.canvas.toCanvasElement();
            const clipX = rect.left;
            const clipY = rect.top;
            const clipWidth = rect.width;
            const clipHeight = rect.height;
            
            const ctx = this.canvas.getContext('2d');
            ctx.drawImage(originalCanvas, clipX, clipY, clipWidth, clipHeight, 0, 0, clipWidth, clipHeight);
            const imageData = ctx.getImageData(0, 0, clipWidth, clipHeight);
            console.log(imageData,"-- imageData"); */
          }
        }

        this.canvas.renderAll();
      },
      'selection:updated': (e) => {
        
        if(e.selected[0].clipPath) {
          
          this.whatLastLeft = rect.left;
          this.whatLastTop = rect.top;
          this.whatLastBottom = rect.top + rect.height;
          this.whatLastRight = rect.left + rect.width;
          this.whatLastWidth = rect.width;
          this.whatLastHeight = rect.height;

          e.selected[0].setControlsVisibility({
            tl: true,
            tr: true,
            br: true,
            bl: true,
            ml: false,
            mt: false,
            mr: false,
            mb: false,
            mtr: false
          });

          this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
          this.canvas.backgroundColor = '#969ca33d';
          this.canvas.renderAll();
        }
      },
      'mouse:up': (e) => {

        image.set({
          lockScalingX: false,
          lockScalingY: false,
        });
        rect.set({
          lockScalingX: false,
          lockScalingY: false,
        })
        this.canvas.renderAll();
      },
    });

    image.on({
      'moving':  () => {
        
        backgroundImg.set({
          'left': image.left,
          'top': image.top
        });
        image.set({
          _controlsVisibility: {
            tl: true,
            tr: true,
            br: true,
            bl: true,
            ml: false,
            mt: false,
            mr: false,
            mb: false,
            mtr: false
          },
        });

        let activeObject = this.canvas.getActiveObject();
        
        if(activeObject.type == 'crop') {

          let imageRight = image.left + (image.width * image.scaleX);
          let imageBottom = image.top + (image.height * image.scaleY);
          let rectRight = rect.left + rect.width;
          let rectBottom = rect.top + rect.height;

          if(image.left > rect.left) {
            image.set({left: rect.left});
            backgroundImg.set({left: rect.left});
          }
          if(image.top > rect.top) {

            image.set({top: rect.top});
            backgroundImg.set({top: rect.top});
          }
          if(imageRight < rectRight) {
            image.set({left: rect.left - ((image.width * image.scaleX) - rect.width)});
            backgroundImg.set({left: rect.left - ((image.width * image.scaleX) - rect.width)});
          }
          if(imageBottom < rectBottom) {
            image.set({top: rect.top - ((image.height * image.scaleY) - rect.height)});
            backgroundImg.set({top: rect.top - ((image.height * image.scaleY) - rect.height)});
          }
          if(image.left > rect.left && image.top > rect.top) {
            image.set({left: rect.left,top: rect.top});
            backgroundImg.set({left: rect.left,top: rect.top});
          }
          if(image.top > rect.top && imageRight < rectRight) {
            image.set({left: imageRight - rect.width});
            backgroundImg.set({left: imageRight - rect.width});
          }
          if(imageRight < rectRight && imageBottom < rectBottom) {
            image.set({left: rect.left - ((image.width * image.scaleX) - rect.width), top: rect.top - ((image.height * image.scaleY) - rect.height)});
            backgroundImg.set({left: rect.left - ((image.width * image.scaleX) - rect.width), top: rect.top - ((image.height * image.scaleY) - rect.height)});
          }
          if(image.left > rect.left && imageBottom < rectBottom) {
            image.set({left: rect.left, top: rect.top - ((image.height * image.scaleY) - rect.height)});
            backgroundImg.set({left: rect.left, top: rect.top - ((image.height * image.scaleY) - rect.height)});
          }
          
          this.getClippathwidth = rect.width;
          this.getClippathheight = rect.height;
          this.getClippathleft = rect.left;
          this.getClippathtop = rect.top;
        }
        this.canvas.requestRenderAll();
      },
      'scaling': (e) => {
        
        backgroundImg.set({
          'left': image.left,
          'top': image.top,
          'height': image.height,
          'width': image.width,
          'scaleX': image.scaleX,
          'scaleY': image.scaleY,
        });

        const activeObject = this.canvas.getActiveObject();
        var obj = activeObject;
        let imageRight = image.left + (image.width * image.scaleX);
        let imageBottom = image.top + (image.height * image.scaleY);
        let rectRight = rect.left + rect.width;
        let rectBottom = rect.top + rect.height;
        
        /************ new logic ****************/
        if(obj.__corner == 'tl') {
          
          if(image.left > rect.left) {

            activeObject.set({
              left: rect.left, 
              lockScalingY: true, 
              // lockMovementY: true, 
              _controlsVisibility: {
                tl: false,
                tr: true,
                br: true,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(image.top > rect.top) {

            activeObject.set({
              top: rect.top, 
              lockScalingX: true, 
              // lockMovementX: true, 
              _controlsVisibility: {
                tl: false,
                tr: true,
                br: true,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(image.left > rect.left && image.top > rect.top) {

            activeObject.set({
              left: rect.left,
              top: rect.top,  
              _controlsVisibility: {
                tl: false,
                tr: false,
                br: true,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }
        }

        if(obj.__corner == 'tr') {

          if(image.top > rect.top) {

            activeObject.set({
              top: rect.top, 
              lockScalingX: true, 
              // lockMovementX: true, 
              _controlsVisibility: {
                tl: true,
                tr: false,
                br: true,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(imageRight < rectRight) {

            activeObject.set({
              left: rect.left - ((image.width * image.scaleX) - rect.width),//imageRight - rect.width, 
              lockScalingX: true, 
              // lockMovementX: true, 
              _controlsVisibility: {
                tl: true,
                tr: false,
                br: true,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(image.top > rect.top && imageRight < rectRight) {

            activeObject.set({
              left: imageRight - rect.width, 
              top: rect.top, 
              _controlsVisibility: {
                tl: true,
                tr: false,
                br: true,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }
        }

        if(obj.__corner == 'br') {
          
          if(imageRight < rectRight) {

            activeObject.set({
              left: rect.left - ((image.width * image.scaleX) - rect.width),//imageRight - rect.width, 
              lockScalingY: true, 
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: false,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(imageBottom < rectBottom) {

            activeObject.set({
              top: rect.top - ((image.height * image.scaleY) - rect.height),//imageBottom - rect.height, 
              lockScalingX: true, 
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: false,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(imageRight < rectRight && imageBottom < rectBottom) {

            activeObject.set({
              left: rect.left - ((image.width * image.scaleX) - rect.width),//imageRight - rect.width, 
              top: rect.top - ((image.height * image.scaleY) - rect.height),//imageBottom - rect.height,
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: false,
                bl: true,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }
        }

        if(obj.__corner == 'bl') {
          
          if(image.left > rect.left) {

            activeObject.set({
              left: rect.left, 
              lockScalingY: true, 
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: true,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(imageBottom < rectBottom) {

            activeObject.set({
              top: rect.top - ((image.height * image.scaleY) - rect.height),//imageBottom - rect.height, 
              lockScalingX: true, 
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: true,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }

          if(image.left > rect.left && imageBottom < rectBottom) {

            activeObject.set({
              left: rect.left, 
              top: rect.top - ((image.height * image.scaleY) - rect.height),//imageBottom - rect.height, 
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: true,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }
        }
        this.canvas.renderAll();
      },
      'scaled': (e) => {
        
        e.target.isScaling = false;
      },
    });

    rect.on({
      'moving': (e) => {
        console.log("clippath moving");
      },
      'scaling': (e) => {
        
        const activeObject = this.canvas.getActiveObject();
        var obj = activeObject;
        let imageRight = image.left + (image.width * image.scaleX);
        let imageBottom = image.top + (image.height * image.scaleY);
        let rectRight = rect.left + rect.width;
        let rectBottom = rect.top + rect.height;

        if(obj.__corner == 'tl') {
          
          if(image.left > rect.left) {

            activeObject.set({
              left: image.left, 
              lockScalingY: true, 
              // _controlsVisibility: {
              //   tl: false,
              //   tr: true,
              //   br: true,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }

          if(image.top > rect.top) {

            activeObject.set({
              top: image.top, 
              lockScalingX: true, 
              // _controlsVisibility: {
              //   tl: false,
              //   tr: true,
              //   br: true,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }

          if(image.left > rect.left && image.top > rect.top) {

            activeObject.set({
              left: image.left,
              top: image.top,  
              // _controlsVisibility: {
              //   tl: false,
              //   tr: false,
              //   br: true,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }
        }

        if(obj.__corner == 'tr') {
          
          if(image.top > rect.top) {

            activeObject.set({
              top: image.top, 
              lockScalingX: true, 
              // _controlsVisibility: {
              //   tl: true,
              //   tr: false,
              //   br: true,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }

          if(imageRight < rectRight) {

            activeObject.set({
              left: (image.left + (image.width * image.scaleX) - rect.width),
              lockScalingX: true, 
              // _controlsVisibility: {
              //   tl: true,
              //   tr: false,
              //   br: true,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }

          if(image.top > rect.top && imageRight < rectRight) {

            activeObject.set({
              left: (image.left + (image.width * image.scaleX) - rect.width),
              top: image.top, 
              // _controlsVisibility: {
              //   tl: true,
              //   tr: false,
              //   br: true,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }
        }

        if(obj.__corner == 'br') {
          
          if(imageRight < rectRight) {

            activeObject.set({
              left: (image.left + (image.width * image.scaleX) - rect.width),
              lockScalingY: true, 
              // _controlsVisibility: {
              //   tl: true,
              //   tr: true,
              //   br: false,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }

          if(imageBottom < rectBottom) {

            activeObject.set({
              top: (image.top + (image.height * image.scaleY) - rect.height),
              lockScalingX: true, 
              // _controlsVisibility: {
              //   tl: true,
              //   tr: true,
              //   br: false,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }

          if(imageRight < rectRight && imageBottom < rectBottom) {

            activeObject.set({
              left: (image.left + (image.width * image.scaleX) - rect.width),
              top: (image.top + (image.height * image.scaleY) - rect.height),
              // _controlsVisibility: {
              //   tl: true,
              //   tr: true,
              //   br: false,
              //   bl: true,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
            });
          }
        }

        if(obj.__corner == 'bl') {
          
          if(image.left > rect.left) {
            
            activeObject.set({
              left: image.left, 
              lockScalingY: true, 
              strokeUniform: false,
            });
          }

          if(imageBottom < rectBottom) {
            
            activeObject.set({
              top: (image.top + (image.height * image.scaleY) - rect.height),
              lockScalingX: true, 
              strokeUniform: false,
            });
          }

          if(image.left > rect.left && imageBottom < rectBottom) {
            
            activeObject.set({
              left: image.left, 
              top: (image.top + (image.height * image.scaleY) - rect.height),
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: true,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
            });
          }
        }
        
        this.canvas.renderAll();
      },
      'scaled': (e) => {
        console.log("scaled");
      }
    })

    this.canvas.renderAll();
  }

  // Svg Element color array
  applySelectionOnObj() {
    
    let activeObject = this.canvas.getActiveObject();
    if (activeObject.element_type === 'shapeSticker') {

      this.uniqueArray = [];
      this.referenceArray = [];
      this.makeSetOfColor();
    }
  }
  makeSetOfColor() {
    let activegroup = this.canvas.getActiveObject();
    this.uniqueArray = [];
    let tmparray: string[] = []; 
    var stringConstructor = "test".constructor;
    
    if(!activegroup._objects) {
      tmparray = [];
      this.referenceArray.push({ 'color': activegroup.fill, 'id': activegroup.id })
      this.uniqueArray.push({ 'color': activegroup.fill, 'id': activegroup.id });
    }
    else if(activegroup._objects) {

      activegroup._objects.forEach(path => {
        tmparray = [];
        this.uniqueArray.forEach(element => {
          tmparray.push(element.id);
        });
        
        if (path.fill != '' && path.fill != null && tmparray.indexOf(path.id) == -1 && path.fill.constructor === stringConstructor) {
          this.referenceArray.push({ 'clr': path.fill, 'id': path.id });
          this.uniqueArray.push({ 'color': path.fill, 'id': path.id });
        }
        
      });
    } 
    
  }

  private handleDoubleClick(options: fabric.IEvent): void {
    // You might want to add a check to ensure the double click is on the image
    const pointer = this.canvas.getPointer(options.e);
    const croppingRect = new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      fill: 'rgba(255,255,255,0.5)',
      width: 200,
      height: 200,
      cornerSize: 10,
      transparentCorners: false,
      hasRotatingPoint: false
    });

    // Remove any existing cropping rectangles before adding a new one
    // this.removeCroppingRect();

    this.canvas.add(croppingRect);
    this.canvas.setActiveObject(croppingRect);
    this.canvas.renderAll();
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  tabActive(tab_details) {
    this.activeTabID = tab_details.tabId;
    this.activeStickers();
  }

  activeRhtTab(type) {
    switch (type) {

      case 'prop':
        this.IsPropActive = true;
        this.is_layer_active = false;
        this.is_page_active = false;
        break;

      case 'layer':
        this.IsPropActive = false;
        this.is_layer_active = true;
        this.is_page_active = false;
        break;

      case 'page':
        this.IsPropActive = false;
        this.is_layer_active = false;
        this.is_page_active = true;
        break;
    }
  }
  activateAddImageSubTab(key) {
    switch (key) {
      case 'stockPhotos':

        this.stockPhotos = true;
        this.collection = false;
        this.myPhotos = false;
        this.activeStickers();
        break;

      case 'myPhotos':

        this.myPhotos = true;
        this.collection = false;
        this.stockPhotos = false;
        break;

      case 'collection':

        this.myPhotos = false;
        this.collection = true;
        this.stockPhotos = false;
        break;

    }
  }

  saveJson() {
    console.log(this.canvas.toJSON(['isCroped','cwidth','cheight','ctop','cleft']));
  }
  
  // Add shape into canvas
  addBasicShape(shape) {

    var option = {};
    option['objectCaching'] = false;
    option['element_type'] = "basicShape";
    
    let scale;
    this.activeStrokeWidth = (shape.strokeWidth) ? shape.strokeWidth : 0;
    this.activeBorderRadius = (shape.radius) ? shape.radius : (shape.rx) ? shape.rx : 0;
    
    switch (shape.type) {

      case 'Circle':
        this.elementHeight = shape.radius * 2;
        this.elementWidth = shape.radius * 2;
        if(this.isReplaceMode && this.selected) {
          let activeObject = this.canvas.getActiveObject();
          const activeObjectIndex = this.canvasObjectList.findIndex(obj => obj.id === activeObject.id);

          if (activeObjectIndex !== -1) {

            const circle = new fabric.Circle({
              fill: shape.fill,
              borderColor: '#00C3F9',
              centeredScaling: false,
              centeredRotation: true,
              stroke: shape.stroke,
              strokeDashArray: shape.strokeDashArray,
              strokeWidth: shape.strokeWidth,
              cornerSize: 15,
              cornerColor: '#00C3F9',
              cornerStyle: 'circle',
              transparentCorners: false,
              excludeFromExport: false,
              lockScalingFlip: true,
              clipTo: null,
              type: 'circle',
              shadow:{
                affectStroke: false,
                color: '#000000ff',
                offsetX: 0,
                offsetY: 0,
              },
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: true,
                bl: true,
                ml: true,
                mt: true,
                mr: true,
                mb: true,
                mtr: true
              },
              element_type:'basicShape'
            });
            
            circle.id = activeObject.id;
            circle.isLocked = activeObject.isLocked || false;
            circle.visible = activeObject.visible || false;
            // let i = this.removeSelectedElement(activeObject);
            
            circle.top = activeObject.top;
            circle.left = activeObject.left;
            circle.angle = activeObject.angle;
            circle.radius = activeObject.width / 2;
            circle.width = activeObject.width;
            circle.height = activeObject.height || activeObject.width;
            // this.extend(circle, activeObject.id);
            this.canvasObjectList[activeObjectIndex] = circle.toJSON(['id','isLocked']);
            // this.canvasObjectList = [...this.canvasObjectList].reverse();
            // this.canvas.insertAt(circle, i, false);
            this.canvas.remove(activeObject);
            // this.canvas.discardActiveObject();
            this.canvas.add(circle)
            this.layerSelected = circle;
            this.canvas.setActiveObject(circle);
            this.isReplaceMode = true;
            this.canvas.renderAll();
            this.isReplaceSame = true;
            // this.selectItemAfterAdded(circle);
            // this.canvas.renderAll();
          }
        }
        else {

          var centerX = this.canvas.width / 2;
          var centerY = this.canvas.height / 2;
  
          const circle = new fabric.Circle({
            left: centerX - shape.radius,
            top: centerY - shape.radius,
            radius: shape.radius,
            angle: 0,
            fill: shape.fill,
            id: this.generateUniqueId(),
            // Extra properties
            borderColor: '#00C3F9',
            // cornerColor: '#000000',
            centeredScaling: false,
            centeredRotation: true,
            // cornerDashArray: [10],
            cornerSize: 15,
            cornerColor: '#00C3F9',
            cornerStyle: 'circle',
            shadow:{
              affectStroke: false,
              color: '#000000ff',
              offsetX: 0,
              offsetY: 0,
            },
            // hoverCursor: 'default',
            // lockMovementY: true,
            // lockScalingX: true,
            lockScalingFlip: true,
            isLocked: false,
            visible: true,
            stroke: 'red',
            strokeDashArray: shape.strokeDashArray,
            clipTo: null,
            excludeFromExport: false,
            // strokeLineJoin: "round",
            // strokeMiterLimit: 8,
            strokeWidth: 20,
            // touchCornerSize: 50,
            transparentCorners: false,
            // strokeUniform: false,
            // paintFirst: 'fill',
            // selectionBackgroundColor: 'black',
            _controlsVisibility: {
              tl: true,
              tr: true,
              br: true,
              bl: true,
              ml: true,
              mt: true,
              mr: true,
              mb: true,
              mtr: true
            },
            type: 'circle',
            element_type:'basicShape'
          });
          this.canvasObjectList.push(circle.toJSON(['id','isLocked']));
          // this.canvasObjectList = [...this.canvasObjectList].reverse();
          this.canvas.setActiveObject(circle);
          this.layerSelected = circle;
          this.canvas.add(circle);
        }

        break;

      case 'Rect':

        if(this.isReplaceMode && this.selected) {
          let activeObject = this.canvas.getActiveObject();
          const activeObjectIndex = this.canvasObjectList.findIndex(obj => obj.id === activeObject.id);
        
          if (activeObjectIndex !== -1) {

            const rect = new fabric.Rect({
              fill: shape.fill,
              borderColor: '#00C3F9',
              centeredScaling: false,
              centeredRotation: true,
              stroke: shape.stroke,
              strokeDashArray: shape.strokeDashArray,
              strokeWidth: shape.strokeWidth,
              cornerSize: 15,
              cornerColor: '#00C3F9',
              cornerStyle: 'circle',
              transparentCorners: false,
              lockScalingFlip: true,
              rx: shape.rx,
              ry: shape.ry,
              shadow:{
                affectStroke: false,
                color: '#000000ff',
                offsetX: 0,
                offsetY: 0,
              },
              clipTo: null,
              excludeFromExport: false,
              _controlsVisibility: {
                tl: true,
                tr: true,
                br: true,
                bl: true,
                ml: true,
                mt: true,
                mr: true,
                mb: true,
                mtr: true
              },
              type: 'rect',
              element_type:'basicShape'
            });

            rect.width = activeObject.width || activeObject.radius*2;
            rect.height = activeObject.height || activeObject.radius*2;
            rect.top = activeObject.top;
            rect.left = activeObject.left;
            rect.angle = activeObject.angle;
            rect.id = activeObject.id;
            rect.isLocked = activeObject.isLocked || false;
            rect.visible = activeObject.visible || false;
            // let i = this.removeSelectedElement(activeObject);
            // this.canvas.insertAt(rect, i, false);
            // this.selectItemAfterAdded(rect);
            this.canvasObjectList[activeObjectIndex] = rect.toJSON(['id','isLocked']);
            // this.canvasObjectList = [...this.canvasObjectList].reverse();
            this.canvas.remove(activeObject);
            this.canvas.add(rect)
            this.layerSelected = rect;
            this.canvas.setActiveObject(rect);
            this.isReplaceMode = true;
            this.canvas.renderAll();
            this.isReplaceSame = true;
          }
        }
        else {

          this.elementWidth = 300;
          this.elementHeight = 300;
  
          const rect = new fabric.Rect({
            width: this.elementWidth,
            height: this.elementHeight,
            left: this.canvas.width/2 - this.elementWidth/2,
            top: this.canvas.height/2 - this.elementWidth/2,
            angle: 0,
            fill: shape.fill,
            id: this.generateUniqueId(),
            // Extra properties
            borderColor: '#00C3F9',
            // cornerColor: '#000000',
            centeredScaling: false,
            centeredRotation: true,
            // cornerDashArray: [10],
            cornerSize: 15,
            cornerColor: '#00C3F9',
            cornerStyle: 'circle',
            shadow:{
              affectStroke: false,
              color: '#000000ff',
              offsetX: 0,
              offsetY: 0,
            },
            // hoverCursor: 'default',
            // lockMovementY: true,
            // lockScalingX: true,
            lockScalingFlip: true,
            isLocked: false,
            visible: true,
            stroke: shape.stroke,
            strokeDashArray: shape.strokeDashArray,
            clipTo: null,
            excludeFromExport: false,
            // strokeLineJoin: "round",
            // strokeMiterLimit: 8,
            strokeWidth: shape.strokeWidth,
            // touchCornerSize: 50,
            transparentCorners: false,
            rx: shape.rx,
            ry: shape.ry,
            // strokeUniform: false,
            // selectionBackgroundColor: 'black',
            _controlsVisibility: {
              tl: true,
              tr: true,
              br: true,
              bl: true,
              ml: true,
              mt: true,
              mr: true,
              mb: true,
              mtr: true
            },
            type: 'rect',
            element_type:'basicShape',
          });
  
          this.canvasObjectList.push(rect.toJSON(['id','isLocked']));
          // this.canvasObjectList = [...this.canvasObjectList].reverse();
          this.canvas.setActiveObject(rect);
          this.layerSelected = rect;
          this.canvas.add(rect);
        }
        break;

      case 'Line':

        if(this.isReplaceMode && this.selected) {

          let activeObject = this.canvas.getActiveObject();
          const activeObjectIndex = this.canvasObjectList.findIndex(obj => obj.id === activeObject.id);
        
          if (activeObjectIndex !== -1) {
            const line = new fabric.Line(shape.coOrds, {
              borderColor: '#00C3F9',
              centeredScaling: false,
              centeredRotation: true,
              cornerSize: 15,
              cornerColor: '#00C3F9',
              cornerStyle: 'circle',
              stroke: shape.stroke,
              strokeDashArray: shape.strokeDashArray,
              strokeWidth: shape.strokeWidth,
              transparentCorners: false,
              lockScalingFlip: true,
              shadow:{
                affectStroke: false,
                color: '#000000ff',
                offsetX: 0,
                offsetY: 0,
              },
              clipTo: null,
              excludeFromExport: false,
              _controlsVisibility: {
                tl: false,
                tr: false,
                br: false,
                bl: false,
                ml: true,
                mt: false,
                mr: true,
                mb: false,
                mtr: true
              },
              type: 'line',
              element_type:'basicShape'
            });

            line.width = activeObject.width || activeObject.radius * 2;
            line.top = activeObject.top;
            line.left = activeObject.left;
            line.angle = activeObject.angle;
            line.id = activeObject.id;
            line.isLocked = activeObject.isLocked || false;
            line.visible = activeObject.visible || false;
            // let i = this.removeSelectedElement(activeObject);
            // this.canvas.insertAt(line, i, false);
            // this.selectItemAfterAdded(line);
            this.canvasObjectList[activeObjectIndex] = line.toJSON(['id','isLocked']);
            // this.canvasObjectList = [...this.canvasObjectList].reverse();
            this.canvas.remove(activeObject);
            this.canvas.add(line)
            this.layerSelected = line;
            this.canvas.setActiveObject(line);
            this.isReplaceMode = true;
            this.canvas.renderAll();
            this.isReplaceSame = true;
          }
        }
        else {

          const line = new fabric.Line(shape.coOrds, {
            left: this.canvas.width / 2 - 175,
            top: this.canvas.height / 2,
            borderColor: '#00C3F9',
            id: this.generateUniqueId(),
            // cornerColor: '#000000',
            centeredScaling: false,
            centeredRotation: true,
            // cornerDashArray: [10],
            shadow:{
              affectStroke: false,
              color: '#000000ff',
              offsetX: 0,
              offsetY: 0,
            },
            cornerSize: 15,
            lockScalingFlip: true,
            cornerColor: '#00C3F9',
            cornerStyle: 'circle',
            isLocked: false,
            visible: true,
            stroke: shape.stroke,
            strokeDashArray: shape.strokeDashArray,
            clipTo: null,
            excludeFromExport: false,
            // strokeLineJoin: "round",
            // strokeMiterLimit: 8,
            strokeWidth: shape.strokeWidth,
            transparentCorners: false,
            _controlsVisibility: {
              tl: false,
              tr: false,
              br: false,
              bl: false,
              ml: true,
              mt: false,
              mr: true,
              mb: false,
              mtr: true
            },
            type: 'line',
            element_type:'basicShape',
          });
          this.canvasObjectList.push(line.toJSON(['id','isLocked']));
          // this.canvasObjectList = [...this.canvasObjectList].reverse();
          this.canvas.setActiveObject(line);
          this.layerSelected = line;
          this.canvas.add(line);
        }
        break;
    }
    this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
  }
  generateUniqueId() {
    return Math.round(100000 + Math.random() * 900000);
  }
  removeSelectedElement(obj) {
    let i;
    this.canvas.getObjects().forEach((x, index) => {
      if (x.toObject().id == obj.id) {
        i = index;
      }
    });
    this.canvas._objects.splice(i, 1);
    this.canvas.renderAll();
    return i; 
  }

  extend(obj, id) {
    obj.toObject = (function (toObject) {
      return function () {
        return fabric.util.object.extend(toObject.call(), {
          id: id
        });
      };
    })(obj.toObject);
  }
 
  selectItemAfterAdded(obj, isclone: boolean = false) {
    if (obj) {
      // this.canvas.deactivateAllWithDispatch();
      this.canvas.discardActiveObject();
      this.layerSelected = obj;
      this.canvas.setActiveObject(obj);
      // this.isReplaceMode = false;
      this.canvas.renderAll();
    }
  }

  //Draw grids on object active
  drawGrid(grid_size) {
    this.zoomWidthRef = Number(this.zoomWidthRef);
    this.zoomHeightRef = Number(this.zoomHeightRef);
    let separateLines: fabric.Line[] = []; 
    let gridWidth = this.zoomWidthRef > this.zoomHeightRef ? this.zoomWidthRef : this.zoomHeightRef;
    this.gridH = new fabric.Line([
      this.zoomWidthRef / 2, 0,
      this.zoomWidthRef / 2, this.zoomHeightRef
    ], {
      stroke: 'rgba(255, 0, 0, 1)',
      selectable: false,
      evented: false,
      excludeFromExport: true
    });
    this.gridV = new fabric.Line([
      0, this.zoomHeightRef / 2,
      this.zoomWidthRef, this.zoomHeightRef / 2
    ], {
      stroke: 'rgba(255, 0, 0, 1)',
      selectable: false,
      evented: false,
      excludeFromExport: true
    });
    for (let i = 0; i < gridWidth / grid_size; i++) {
      let horizontalLine = new fabric.Line(
        [i * grid_size, 0, i * grid_size, gridWidth], {
        stroke: 'rgba(255, 0, 0, 0.3)',
        strokeWidth: 1,
        /* strokeDashArray: [3, 3], */
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        evented: false
      });
      let verticalLine = new fabric.Line(
        [0, i * grid_size, gridWidth, i * grid_size], {
        stroke: 'rgba(255, 0, 0, 0.3)',
        strokeWidth: 1,
        /* strokeDashArray: [3, 3], */
        selectable: false,
        lockMovementX: true,
        lockMovementY: true,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockUniScaling: true,
        evented: false
      });
      separateLines.push(horizontalLine);
      separateLines.push(verticalLine);
    }
    separateLines.push(this.gridH);
    separateLines.push(this.gridV);
    // add lines to group
    this.gridsGroup = new fabric.Group(separateLines, {
      selectable: false,
      lockMovementX: true,
      lockMovementY: true,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockUniScaling: true,
      evented: false,
      excludeFromExport: true
    });
    
    this.canvas.add(this.gridsGroup);
    this.gridsGroup.bringToFront();
  }

  //Remove Grids on mouse leave
  removeGrids() {
    this.canvas.remove(this.gridsGroup);
  }
  removeSelected() {
    let activeObject = this.canvas.getActiveObject();
    let activeGroup = this.canvas.getActiveGroup();

    if(activeGroup) {
      this.canvas.remove(activeGroup);
      this.canvas.renderAll();
    }
    else {
      this.canvas.remove(activeObject);
      this.canvas.renderAll();
    }
  }

  //Duplicate active object
  duplicateObject() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject && !this.isGroup) {
      
      activeObject.clone((cloned) => {
        cloned.set({
          left: cloned.left + 10,
          top: cloned.top + 10,
          // borderColor: '',
          id: this.generateUniqueId(),
          centeredScaling: false,
          centeredRotation: true,
          cornerSize: 15,
          cornerColor: '#00C3F9',
          cornerStyle: 'circle',
          isLocked: activeObject.isLocked,
          transparentCorners: false,
          element_type: activeObject.element_type,
        }).setCoords();
        
        if(activeObject.isCroped) {
          cloned.cwidth = activeObject.cwidth;
          cloned.cheight = activeObject.cheight;
          cloned.cleft = activeObject.cleft;
          cloned.ctop = activeObject.ctop;
          cloned._cropSource = activeObject._cropSource;
        }

        if(activeObject.element_type === 'shapeSticker') {
          cloned.class = activeObject.class,
          
          cloned._objects.forEach((subObj, index) => {
            if (activeObject._objects && activeObject._objects[index]) {
              subObj.set({
                id: activeObject._objects[index].id,
              });
            }
          });
        }

        if(activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          cloned.src = activeObject.src;
        }

        this.canvasObjectList.push(cloned.toJSON(['class','id','isLocked','element_type']));
        this.canvas.add(cloned);
        this.canvas.discardActiveObject();
        this.layerSelected = cloned;
        this.canvas.setActiveObject(cloned);
        this.canvas.requestRenderAll();

        // if(activeObject.element_type === 'shapeSticker') {
        //   this.applySelectionOnObj();
        //   this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
        //   this.whatEleHeight = activeObject.height;
        //   this.whatEleWidth = activeObject.width;
        // }
      });
      this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
    }
    else if(activeObject && this.isGroup) {
      
      activeObject.clone((cloned) => {
        this.canvas.discardActiveObject();
  
        cloned.top += 10;
        cloned.left += 10;
  
        if (cloned.type === 'activeSelection') {
          
          cloned.canvas = this.canvas;
          cloned.forEachObject((obj,index) => {
            obj.id = this.generateUniqueId();
            obj.cornerSize= 15,
            obj.cornerColor= '#00C3F9',
            obj.cornerStyle= 'circle',
            obj.transparentCorners= false,
            obj.excludeFromExport= false,
            obj.clipTo= null,
            // obj.shadow= {
            //   affectStroke: false,
            //   color: '#000000ff',
            //   offsetX: 0,
            //   offsetY: 0,
            // },
            // obj._controlsVisibility= {
            //     tl: false,
            //     tr: false,
            //     br: false,
            //     bl: false,
            //     ml: true,
            //     mt: false,
            //     mr: true,
            //     mb: false,
            //     mtr: true
            // },

            cloned._objects.forEach((subObj, index) => {
              if (activeObject._objects && activeObject._objects[index]) {
                obj.set({
                  class: activeObject._objects[index].class,
                  element_type: activeObject._objects[index].element_type,
                });
              }
            });
            
            obj.class = activeObject._objects[index].class;
            obj.element_type = activeObject._objects[index].element_type;

            if(activeObject._objects[index].isCroped) {
              obj.cwidth = activeObject._objects[index].cwidth;
              obj.cheight = activeObject._objects[index].cheight;
              obj.cleft = activeObject._objects[index].cleft;
              obj.ctop = activeObject._objects[index].ctop;
              obj.isCroped = activeObject._objects[index].isCroped;
              obj._cropSource = activeObject._objects[index]._cropSource;
            }
            
            this.canvas.add(obj);
            this.canvasObjectList.push(obj.toJSON(['class','id','element_type']));
            
          });
          
          if(activeObject.element_type === 'shapeSticker') {
            cloned.forEachObject((groupObj, groupIndex) => {
              groupObj._objects.forEach((subObj, subIndex) => {
                if (activeObject._objects[groupIndex]._objects && activeObject._objects[groupIndex]._objects[subIndex]) {
                  subObj.id = activeObject._objects[groupIndex]._objects[subIndex].id;
                }
              });
            });
          }

          cloned.setCoords();
        } 
        else {
          this.canvas.add(cloned);
        }
        
        this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
        this.canvas.setActiveObject(cloned);
        this.canvas.renderAll();
        
      });
    }
  }

  //Remove active object
  deleteObject() {
    const activeObject = this.canvas.getActiveObject();
    // const activeGroup = this.canvas.getActiveObjects();

    if (activeObject && !this.isGroup) {
      
      this.canvas.remove(activeObject);
      this.canvas.renderAll();
      this.selected = false;
      const index = this.canvasObjectList.findIndex(obj => obj.id === this.layerSelected.id);
        
      if (index !== -1) {
        this.canvasObjectList.splice(index, 1);
      }
      
    }
    else if (activeObject && this.isGroup) {
      const objects = activeObject.getObjects().slice();
      this.canvas.discardActiveObject();
  
      objects.forEach(obj => {
        this.canvas.remove(obj);
        const index = this.canvasObjectList.findIndex(listObj => listObj.id === obj.id);
        if (index !== -1) {
          this.canvasObjectList.splice(index, 1);
        }
      });
      this.canvas.requestRenderAll();
    }
    this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
    this.isReplaceShow = false;
  }

  //Object move
  continousIncDecPosOrSize(type) {

    this.selectedObjPos.left = Math.round(this.canvas.getActiveObject().left);
    this.selectedObjPos.top = Math.round(this.canvas.getActiveObject().top); 
    switch (type) {

      case 'leftRemove':
        this.selectedObjPos.left = this.selectedObjPos.left - 1;
        this.changePosition(this.selectedObjPos,'left');
        this.canvas.renderAll();
        break;

      case 'leftAdd':
        this.selectedObjPos.left = this.selectedObjPos.left + 1;
        this.changePosition(this.selectedObjPos,'left');
        this.canvas.renderAll();
        break;

      case 'topRemove':
        this.selectedObjPos.top = this.selectedObjPos.top - 1;
        this.changePosition(this.selectedObjPos,'top');
        this.canvas.renderAll();
        break;

      case 'topAdd':
        this.selectedObjPos.top = this.selectedObjPos.top + 1;
        this.changePosition(this.selectedObjPos,'top');
        this.canvas.renderAll();
        break;
    }

    this.counterInterval = setTimeout(() => {
      this.continousIncDecPosOrSize(type);
    }, 150);  
  }
  timeoutStop() {
    this.counterInterval ? clearTimeout(this.counterInterval) : '';
  }
  changePosition(selectedObjPos, type) {
    this.canvas.getActiveObject().set('left', selectedObjPos.left);
    this.canvas.getActiveObject().set('top', selectedObjPos.top);

    this.canvas.renderAll();
  }
  increaseInput(event,type) {
    let activeObject = this.canvas.getActiveObject();
    this.isFromInput = true;
    
    switch(type) {
      case 'vertical':
        this.selectedObjPos.left = parseInt(event.target.value);
        activeObject.set('left',parseInt(event.target.value));
        break;

      case 'horizontal':
        this.selectedObjPos.top = parseInt(event.target.value);
        activeObject.set('top', parseInt(event.target.value));
        break;

      case 'rotate':
        this.selectedObjDeg = parseInt(event.target.value);
        activeObject.set('angle',this.selectedObjDeg);
        break;

      case 'borderSize':
        this.activeStrokeWidth = parseInt(event.target.value);
        if(activeObject.type === 'line') {
          this.elementHeight = this.activeStrokeWidth;
        }
        activeObject.set('strokeWidth', this.activeStrokeWidth);
        break;

      case 'borderRadius':
        this.activeBorderRadius = parseInt(event.target.value);
        activeObject.set('rx', this.activeBorderRadius);
        activeObject.set('ry', this.activeBorderRadius);
        break;

      case 'shadowBlur':
        this.shadowBlur = parseInt(event.target.value);
        activeObject.set({
          shadow: {
            affectStroke: false,
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          }
        });
        break;

      case 'offsetX':
        this.offSetX = parseFloat(event.target.value);
        activeObject.set({
          shadow: {
            affectStroke: false,
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          }
        });
        break;

      case 'offsetY':
        this.offSetY = parseInt(event.target.value);
        activeObject.set({
          shadow: {
            affectStroke: false,
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          }
        });
        break;

      case 'width':
        if(activeObject.type === 'rect') {
          this.elementWidth = parseInt(event.target.value);
          activeObject.set({
            width: this.elementWidth,
            scaleX: 1
          });
        }
        else if(activeObject.type === 'circle') {
          this.elementWidth = parseInt(event.target.value);
          activeObject.set({
            scaleX: (this.elementWidth * 1.0008519837389847) / 300,
          });
        }
        else if(activeObject.type === 'line') {
          this.elementWidth = parseInt(event.target.value);
          activeObject.width = this.elementWidth;
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          this.elementWidth = parseInt(event.target.value);
          activeObject.scaleX = ((this.elementWidth/this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
          // this.whatEleWidth  = activeObject.width - 1;
          // let scale = this.utils.getObjectMaxSize(activeObject.height, this.whatEleWidth, this.zoomHeightRef, this.zoomWidthRef);
          
          // this.elementWidth = (activeObject.width * scale);
          // activeObject.width = this.whatEleWidth;
          // activeObject.height = (activeObject.height * activeObject.scaleY)
          // activeObject.scaleY = scale;
          
        }
        break;

      case 'height':
        if(activeObject.type === 'rect') {
          this.elementHeight = parseInt(event.target.value);
          activeObject.set({
            height: this.elementHeight,
            scaleX: 1
          });
        }
        else if(activeObject.type === 'circle') {
          this.elementHeight = parseInt(event.target.value);
          activeObject.set({
            scaleY: (this.elementHeight * 1.0008519837389847) / 300,
          });
        }
        else if(activeObject.type === 'line') {
          this.elementHeight = parseInt(event.target.value);
          this.activeStrokeWidth = this.elementHeight
          activeObject.set('strokeWidth',this.activeStrokeWidth);
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          this.elementHeight = parseInt(event.target.value);
          activeObject.scaleY = ((this.elementHeight/this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
          // this.whatEleWidth  = activeObject.width - 1;
          // let scale = this.utils.getObjectMaxSize(activeObject.height, this.whatEleWidth, this.zoomHeightRef, this.zoomWidthRef);
          
          // this.elementHeight = (activeObject.width * scale);
          // activeObject.width = this.whatEleWidth;
          // activeObject.height = (activeObject.height * activeObject.scaleY)
          // activeObject.scaleY = scale;
        }
        break;
    }
    activeObject.setCoords();
    this.canvas.requestRenderAll();
    
    this.getClippathwidth = activeObject.width * activeObject.scaleX;
    this.getClippathheight = activeObject.height * activeObject.scaleY;
    this.getClippathleft = activeObject.left;
    this.getClippathtop = activeObject.top;
    
  }

  // Set width and height of element
  setWidthofElement(type) {
    let activeObject = this.canvas.getActiveObject();
    // this.elementWidth = activeObject.width;
    // this.elementHeight = activeObject.height;
   
    switch(type) {
      case 'decWidth':  
        if(activeObject.type === 'rect') {

          this.elementWidth = this.elementWidth - 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle') {
          this.elementWidth = this.elementWidth - 1;
          // activeObject.width = this.elementWidth;
          activeObject.scaleX = ((this.elementWidth * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line') {
          this.elementWidth = activeObject.width - 1;
          activeObject.width = this.elementWidth;
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          this.elementWidth = this.elementWidth - 1;
          activeObject.scaleX = ((this.elementWidth/this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
          // this.whatEleWidth  = activeObject.width - 1;
          // let scale = this.utils.getObjectMaxSize(activeObject.height, this.whatEleWidth, this.zoomHeightRef, this.zoomWidthRef);
          
          // this.elementWidth = (activeObject.width * scale);
          // activeObject.width = this.whatEleWidth;
          // activeObject.height = (activeObject.height * activeObject.scaleY)
          // activeObject.scaleY = scale;
        }
        break;

      case 'incWidth':
        if(activeObject.type === 'rect') {
          this.elementWidth = this.elementWidth + 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle') {
          this.elementWidth = this.elementWidth + 1;
          // activeObject.width = this.elementWidth;
          activeObject.scaleX = ((this.elementWidth * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line') {
          this.elementWidth = activeObject.width + 1;
          activeObject.width = this.elementWidth;
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          this.elementWidth = this.elementWidth + 1;
          activeObject.scaleX = ((this.elementWidth/this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
          // this.whatEleWidth  = activeObject.width - 1;
          // let scale = this.utils.getObjectMaxSize(activeObject.height, this.whatEleWidth, this.zoomHeightRef, this.zoomWidthRef);
          
          // this.elementWidth = (activeObject.width * scale);
          // activeObject.width = this.whatEleWidth;
          // activeObject.height = (activeObject.height * activeObject.scaleY)
          // activeObject.scaleY = scale;
        }
        break;

      case 'decHeight':
        if(activeObject.type === 'rect') {
          this.elementHeight = this.elementHeight - 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle') {
          this.elementHeight = this.elementHeight - 1;
          // activeObject.height = this.elementHeight;
          activeObject.scaleY = ((this.elementHeight * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line' && this.activeStrokeWidth > 0) {
          this.elementHeight = activeObject.strokeWidth - 1;
          this.activeStrokeWidth = this.elementHeight
          activeObject.set('strokeWidth',this.activeStrokeWidth);
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          this.elementHeight = this.elementHeight - 1;
          activeObject.scaleY = ((this.elementHeight/this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
          // this.whatEleWidth  = activeObject.width - 1;
          // let scale = this.utils.getObjectMaxSize(activeObject.height, this.whatEleWidth, this.zoomHeightRef, this.zoomWidthRef);
          
          // this.elementHeight = (activeObject.width * scale);
          // activeObject.width = this.whatEleWidth;
          // activeObject.height = (activeObject.height * activeObject.scaleY)
          // activeObject.scaleY = scale;
        }
        break;

      case 'incHeight':
        if(activeObject.type === 'rect') {
          this.elementHeight = this.elementHeight + 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle') {
          this.elementHeight = this.elementHeight + 1;
          // activeObject.height = this.elementHeight;
          activeObject.scaleY = ((this.elementHeight * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line' && this.activeStrokeWidth < 50) {
          this.elementHeight = activeObject.strokeWidth + 1;
          this.activeStrokeWidth = this.elementHeight
          activeObject.set('strokeWidth',this.activeStrokeWidth);
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos') {
          this.elementHeight = this.elementHeight + 1;
          activeObject.scaleY = ((this.elementHeight/this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
          // this.whatEleWidth  = activeObject.width - 1;
          // let scale = this.utils.getObjectMaxSize(activeObject.height, this.whatEleWidth, this.zoomHeightRef, this.zoomWidthRef);
          
          // this.elementHeight = (activeObject.width * scale);
          // activeObject.width = this.whatEleWidth;
          // activeObject.height = (activeObject.height * activeObject.scaleY)
          // activeObject.scaleY = scale;
        }
        break;
    }
    activeObject.setCoords();
    this.canvas.requestRenderAll();
    
    this.getClippathwidth = activeObject.width * activeObject.scaleX;
    this.getClippathheight = activeObject.height * activeObject.scaleY;
    this.getClippathleft = activeObject.left;
    this.getClippathtop = activeObject.top;

    this.counterInterval = setTimeout(() => {
      this.setWidthofElement(type);
    }, 150);  
  }

  //Flip active object
  flip(type) {
    switch(type) {
      case 'y':
        this.canvas.getActiveObject().flipX = this.canvas.getActiveObject().flipX ? false : true;
        this.canvas.renderAll();
        break;

      case 'x':
        this.canvas.getActiveObject().flipY = this.canvas.getActiveObject().flipY ? false : true;
        this.canvas.renderAll();
        break;
    }
  }

  //Rotate active object
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
  callFunctionAsPerProperty(propType, propValue: any = '') {
    
    switch (propType) {

      case "rotateLeft":
        this.selectedObjDeg = (this.selectedObjDeg === 0) ? 0 : this.selectedObjDeg - 4;
        this.rotateObject(this.selectedObjDeg,'');
        break;

      case "rotateRight":
        this.selectedObjDeg = (this.selectedObjDeg >= 360) ? 360 : this.selectedObjDeg + 4;
        this.rotateObject(this.selectedObjDeg,'');
        break;

      case "opacity":
        this.setOpacity(this.props.opacity, undefined, false, true, true);
        break;

      case "filter":
        if (propValue == "blendAlpha") {
          this.setFilter('blend', [this.props.blendColor, this.props.blendMode, this.props.blendAlpha], 1,'');
        } 
        else if (propValue == "tintOpacity") {
          this.setFilter('tint', this.props.tint, this.props.tintOpacity,'');
        } 
        else {
          this.setFilter(propValue, this.props[propValue], 1,'');
        }
        break;
    }
  }

  /* rotateObject(value, event) {
    const activeObject = this.canvas.getActiveObject();
    if(event) {

      this.selectedObjDeg = event.target.value;
      activeObject.setOriginToCenter && activeObject.setOriginToCenter();
      this.canvas.getActiveObject().set('angle', event.target.value);
      activeObject.setCenterToOrigin && activeObject.setCenterToOrigin();
      this.canvas.renderAll();
    }
    else {
      activeObject.setOriginToCenter && activeObject.setOriginToCenter();
      this.canvas.getActiveObject().set('angle', value);
      activeObject.setCenterToOrigin && activeObject.setCenterToOrigin();
      this.canvas.renderAll();
    }
  } */
  
  rotateObject(value, event) {
    const activeObject = this.canvas.getActiveObject();
    this.isFromInput = true;
    if (!activeObject) return;
  
    this.selectedObjDeg = event ? parseFloat(event.target.value) : value;
  
    // Calculate the object's center points
    const center = activeObject.getCenterPoint();
  
    // Set the angle
    activeObject.angle = this.selectedObjDeg;
  
    // Move the object to the calculated center
    activeObject.setPositionByOrigin(center, 'center', 'center');
  
    // Update the canvas
    this.canvas.requestRenderAll();
  }
  
  // Change active object color
  setFill(text_color) {
    
    var activeObject = this.canvas.getActiveObject();
    this.fillColor = text_color;
    if (activeObject) {
      activeObject.set('fill', text_color);
      this.canvas.renderAll();
    }
  }

  // Set stroke color, width and radius
  setStrokeColor(stroke_color) {

    var activeObject = this.canvas.getActiveObject();
    this.strokeColor = stroke_color;
    if (activeObject) {
      activeObject.set('stroke', stroke_color);
      this.canvas.renderAll();
    }
  }
  setStroke(type) {

    let activeObject = this.canvas.getActiveObject();

    switch(type) {

      case 'decrease':
        if(this.activeStrokeWidth >= 0) {
    
          this.activeStrokeWidth = this.activeStrokeWidth - 1;
          activeObject.set('strokeWidth', this.activeStrokeWidth);
          if(activeObject.type === 'line') {
            this.elementHeight = this.activeStrokeWidth;
          }
          this.canvas.renderAll();  
        }

        break;

      case 'increase':
        if(this.activeStrokeWidth <= 50) {
      
          this.activeStrokeWidth = this.activeStrokeWidth + 1;
          activeObject.set('strokeWidth', this.activeStrokeWidth);
          if(activeObject.type === 'line') {
            this.elementHeight = this.activeStrokeWidth;
          }
          this.canvas.renderAll();  
        }

        break;
    }

    this.counterInterval = setTimeout(() => {
      this.setStroke(type);
    }, 150);
  }
  inputStroke(value, event) {
    
    this.activeStrokeWidth = parseInt(event.target.value);
    let activeObject = this.canvas.getActiveObject();

    if(activeObject) {
      
      this.canvas.getActiveObject().set('strokeWidth', this.activeStrokeWidth);
      if(activeObject.type === 'line') {
        this.elementHeight = this.activeStrokeWidth;
      }
      this.canvas.renderAll();
    }

  }
  setCornerSize(type) {
    
    let activeObject = this.canvas.getActiveObject();
    switch(type) {

      case 'decrease':
        if(this.activeBorderRadius >= 0) {
    
          this.activeBorderRadius = this.activeBorderRadius - 1;
          activeObject.set('rx', this.activeBorderRadius);
          activeObject.set('ry', this.activeBorderRadius);
          this.canvas.renderAll();  
        }

        break;

      case 'increase':
        if(this.activeBorderRadius <= 100) {
      
          this.activeBorderRadius = this.activeBorderRadius + 1;
          activeObject.set('rx', this.activeBorderRadius);
          activeObject.set('ry', this.activeBorderRadius);
          this.canvas.renderAll();  
        }

        break;
    }

    this.counterInterval = setTimeout(() => {
      this.setCornerSize(type);
    }, 150);
  }
  inputBorderRadius(value, event){
    
    this.activeBorderRadius = parseInt(event.target.value);
    let activeObject = this.canvas.getActiveObject();

    if(activeObject) {
      
      this.canvas.getActiveObject().set('rx', this.activeBorderRadius);
      this.canvas.getActiveObject().set('ry', this.activeBorderRadius);
      this.canvas.renderAll();
    }
  }
  removeStroke() {

    var activeObject = this.canvas.getActiveObject();
    this.strokeColor = '#ffffff00';
    if (activeObject) {
      activeObject.set('stroke', '#ffffff00');
      this.canvas.renderAll();
    }
  }

  // set shadow blur
  setShadowBlur(type) {
    
    let activeObject = this.canvas.getActiveObject();

    switch(type) {

      case 'decrease':
        if(this.shadowBlur > 0) {
    
          this.shadowBlur = this.shadowBlur - 1;
          this.canvas.getActiveObject().set({
            shadow: {
              affectStroke: false,
              color: this.shadowColor,
              blur: this.shadowBlur,
              offsetX: this.offSetX,
              offsetY: this.offSetY,
            },
            objectCaching: true,
            statefullCache: true
          });
          this.canvas.renderAll();  
        }

        break;

      case 'increase':
        if(this.shadowBlur < 100) {
      
          this.shadowBlur = this.shadowBlur + 1;
          this.canvas.getActiveObject().set({
            shadow: {
              affectStroke: false,
              color: this.shadowColor,
              blur: this.shadowBlur,
              offsetX: this.offSetX,
              offsetY: this.offSetY,
            },
            objectCaching: true,
            statefullCache: true
          });
          this.canvas.renderAll();  
        }

        break;
    }

    this.counterInterval = setTimeout(() => {
      this.setShadowBlur(type);
    }, 150);
  }
  inputShadowProp(type, value, event) {

    switch (type) {
      case 'shadowblur':
        this.shadowBlur = event.target.value;
        this.canvas.getActiveObject().set({
          shadow: {
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          },
          objectCaching: true,
          statefullCache: true
        });

        break;

      case 'offSetX':
        this.offSetX = event.target.value;
        this.canvas.getActiveObject().set({
          shadow: {
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          },
          objectCaching: true,
          statefullCache: true
        });
        break;

      case 'offSetY':
        this.offSetY = event.target.value;
        this.canvas.getActiveObject().set({
          shadow: {
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          },
          objectCaching: true,
          statefullCache: true
        });
        break;
    }
    this.canvas.renderAll();
  }
  setShadowColor(color){
    
    this.shadowColor = color;

    this.canvas.getActiveObject().set({
      shadow: {
        color: this.shadowColor,
        blur: this.shadowBlur,
        offsetX: this.offSetX,
        offsetY: this.offSetY,
      },
      objectCaching: true,
      statefullCache: true
    });
    this.canvas.renderAll();
  }
  setShadowOffset(type, value) {

    if(type == 'x'){
      switch(value) {

        case 'decrease':
        if(this.offSetX >= -50) {
    
          this.offSetX = this.offSetX - 1;
          this.canvas.getActiveObject().set({
            shadow: {
              color: this.shadowColor,
              blur: this.shadowBlur,
              offsetX: this.offSetX,
              offsetY: this.offSetY,
            },
            objectCaching: true,
            statefullCache: true
          });
          this.canvas.renderAll();  
        }

        break;

        case 'increase':
          if(this.offSetX <= 50) {
        
            this.offSetX = this.offSetX + 1;
            this.canvas.getActiveObject().set({
              shadow: {
                color: this.shadowColor,
                blur: this.shadowBlur,
                offsetX: this.offSetX,
                offsetY: this.offSetY,
              },
              objectCaching: true,
              statefullCache: true
            });
            this.canvas.renderAll();  
          }
          break;
      }
    }
    else if(type == 'y') {
      switch(value) {

        case 'decrease':
        if(this.offSetY > -50) {
    
          this.offSetY = this.offSetY - 1;
          this.canvas.getActiveObject().set({
            shadow: {
              color: this.shadowColor,
              blur: this.shadowBlur,
              offsetX: this.offSetX,
              offsetY: this.offSetY,
            },
            objectCaching: true,
            statefullCache: true
          });
          this.canvas.renderAll();  
        }

        break;

        case 'increase':
          if(this.offSetY < 50) {
        
            this.offSetY = this.offSetY + 1;
            this.canvas.getActiveObject().set({
              shadow: {
                color: this.shadowColor,
                blur: this.shadowBlur,
                offsetX: this.offSetX,
                offsetY: this.offSetY,
              },
              objectCaching: true,
              statefullCache: true
            });
            this.canvas.renderAll();  
          }
          break;
      }
    }

    this.counterInterval = setTimeout(() => {
      this.setShadowOffset(type,value);
    }, 150);
  }

  // set all color using color-picker
  setAllColor(color, type) {
    
    var activeObject = this.canvas.getActiveObject();
    switch(type) {
      case 'fill':
        this.fillColor = color;
        if (activeObject) {
          activeObject.set('fill', color);
        }
        break;

      case 'stroke':
        this.strokeColor = color;
        if (activeObject) {
          activeObject.set('stroke', color);
          this.canvas.renderAll();
        }
        break;

      case 'shadow':
        this.shadowColor = color;
        activeObject.set({
          shadow: {
            color: this.shadowColor,
            blur: this.shadowBlur,
            offsetX: this.offSetX,
            offsetY: this.offSetY,
          },
          objectCaching: true,
          statefullCache: true
        });
        break;

      case 'bgColor':
        this.props.canvasFill = color;
        this.canvas.backgroundColor = this.props.canvasFill;
        this.canvas.renderAll();
        break;

    }
    this.canvas.renderAll();
  }

  // De select selected object 
  deselectElement(event) {
    this.canvas.discardActiveObject();
    this.canvas.renderAll(); 
    
    if (this.isFormatPainterEnable == true) {
      this.isFormatPainterEnable = false;
      this.formatPainterClipboard = {};
    }
  }

  // Toggle lock in layer section
  toggleLock() {
    this.isLocked = !this.isLocked;
    this.lockObjects();
  }
  lockObjects() {
    let that = this;
    this.canvas.forEachObject(function (o, i) {
      if(that.isLocked) {
        o.lockMovementX = true;
        o.lockMovementY = true;
        o.lockScalingX = true;
        o.lockScalingY = true;
        o.lockUniScaling = true;
        o.lockRotation = true;
        o.hasControls = false;
        o.hasRotatingPoint = false;
        o.isLocked = that.isLocked;
      }
      else {
        o.lockMovementX = false;
        o.lockMovementY = false;
        o.lockScalingX = false;
        o.lockScalingY = false;
        o.lockUniScaling = false;
        o.lockRotation = false;
        o.hasControls = true;
        o.hasRotatingPoint = true;
        o.isLocked = that.isLocked;
      }
    });
    this.canvas.renderAll();

    this.canvasObjectList.forEach(element => {
      if(that.isLocked) {
        element.lockMovementX = true;
        element.lockMovementY = true;
        element.lockScalingX = true;
        element.lockScalingY = true;
        element.lockUniScaling = true;
        element.lockRotation = true;
        element.hasControls = false;
        element.hasRotatingPoint = false;
        element.isLocked = that.isLocked;
      }
      else {
        element.lockMovementX = false;
        element.lockMovementY = false;
        element.lockScalingX = false;
        element.lockScalingY = false;
        element.lockUniScaling = false;
        element.lockRotation = false;
        element.hasControls = true;
        element.hasRotatingPoint = true;
        element.isLocked = that.isLocked;
      }
    });
  }

  // Toggle visibility of object
  toggleLayer(item, visible){
    // this.layerSelected = this.canvas.getActiveObject();
    let object = this.getElementById(item.id);
    if (object) {
      
      if (visible) {
        object.visible = true;
        object.selectable = true;
        object.hasControls = true;
        object.hasBorders = true;
      } 
      else {
        object.visible = false;
        object.selectable = false;
        object.hasControls = false;
        object.hasBorders = false;
        this.canvas.discardActiveObject();
      }
      
      this.renderStackObjects("toggle", "" + visible);
      this.canvas.renderAll();
    }
  }
  getElementById(id): fabric.Object | null {
    var object = null, objects = this.canvas.getObjects();
    
    for (let i = 0; i < objects.length; i++) {
      if ((objects[i].id && objects[i].id === id) || (objects[i].toObject().id && objects[i].toObject().id === id)) {
        object = objects[i];
        break;
      }
    }
    
    return object;
  }
  async renderStackObjects(rerender_Type: any = 'all', param: any = "") {
    let that = this;
    switch (rerender_Type) {
      case 'toggle':
        let toggleIndex = this.canvasObjectList.findIndex(elem => elem.id == this.layerSelected.id);
        if (param == "false") {
          this.canvasObjectList[toggleIndex].visible = false;
        }
        else {
          this.canvasObjectList[toggleIndex].visible = true;
        }
        break;

      case 'add':
        let addedObject = this.canvas._objects[this.canvas._objects.length - 1].toJSON(custom_attributes);
        this.canvasObjectList.unshift(addedObject);
        let index = 0;
        if (this.is_layer_active == true) {
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
        this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
        break;
      
      case 'update':
        
        let editedObject = this.canvasObjectList.filter(elem => elem.id == this.layerSelected.id)[0];
        let addobject = this.getElementById(this.layerSelected.id).toJSON(custom_attributes);
          switch (this.layerSelected.type) {
            case 'image':
              if (addobject.src.search('blob:') == -1) {
                await this.assignBase64(addobject).then(result => {
                  editedObject['base'] = result;
                })
              }
              else {
                editedObject['base'] = await this.sanitizer.bypassSecurityTrustResourceUrl(addobject.src);
              }
          }
        this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
        const activeObject = this.canvas.getActiveObject();
 
        if (activeObject.type == 'image') {

          this.canvas.getActiveObject().set(this.formatPainterClipboard.properties);
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll()
          
          this.isFormatPainterEnable = false;
          this.formatPainterClipboard = {};
        }
        break;
    
    }
  }
  toggleLockSingle(element) {
    element.isLocked = !element.isLocked;

    this.canvas.forEachObject(function (o, i) {
      let obj;
      if (o.id == element.id) {
        if (element.isLocked) {
          o.lockMovementX = true;
          o.lockMovementY = true;
          o.lockScalingX = true;
          o.lockScalingY = true;
          o.lockUniScaling = true;
          o.lockRotation = true;
          o.hasControls = false;
          o.hasRotatingPoint = false;
          o.isLocked = element.isLocked;
        }
        else {
          o.lockMovementX = false;
          o.lockMovementY = false;
          o.lockScalingX = false;
          o.lockScalingY = false;
          o.lockUniScaling = false;
          o.lockRotation = false;
          o.hasControls = true;
          o.hasRotatingPoint = true;
          o.isLocked = element.isLocked;
        }
      }
    });
    this.canvas.renderAll();
  }

  // show replace tooltip
  changeToolTipPosition(e) {
    if (this.canvas.getActiveObject() && this.selected) {
      let menu;
      let toolTipCoords;
      $("#tmenu").hide();
      menu = $("#rmenu");
      toolTipCoords = document.getElementById('rmenu')?.getBoundingClientRect() as DOMRect;
      menu.show();
      let outsideRect = e.getBoundingRect();
      let canvasCoords = document.getElementsByClassName('upper-canvas')[0].getBoundingClientRect() as DOMRect;
      if (outsideRect.top + outsideRect.height > this.canvas.height) {
        menu.css({ "top": (canvasCoords.y + this.canvas.height) + 12, left: ((canvasCoords.x + outsideRect.left) + ((outsideRect.width / 2) - (menu.width() / 2))) });
      }
      else {
        menu.css({ "top": (canvasCoords.y + outsideRect.top) + (outsideRect.height + 20), left: ((canvasCoords.x + outsideRect.left) + ((outsideRect.width / 2) - (menu.width() / 2))) });
      }
    }
  }
  disableReplaceMode() {
    this.isReplaceMode = false;
  }
  horizontalAlignment(type) {
    let group; //= this.canvas.getActiveGroup();
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
          //   x: 0,
          //   y: objects[i].top
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
    let group; //= this.canvas.getActiveGroup();
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
          //   x: objects[i].left,
          //   y: 0
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

  trackById(index: number, item: any): any {
    return item.id;
  }
  activeFocusedObj(item) {
    
    let that = this;
    this.canvas.forEachObject(function (obj) {
      if (obj.id == item.id) {
      
        that.canvas.discardActiveObject().renderAll();
        obj.set({
          hasControls: true,
          hasBorders: true
        });
        obj.setCoords(); 
        that.canvas.setActiveObject(obj);
        that.layerSelected = obj;
        that.canvas.requestRenderAll(); 
        that.selected = obj;
      }
    });
  }

  // For SVG Element
  activateStickerSubTab(key, isOpenReplace: boolean = false) {
    switch (key) {
      case 'shapes':
        this.shape = true;
        this.stickers = false;
        this.buttons = false;
        this.isSvgEle = false;
        this.isSvgSticker = false;
        this.activeStickers();
        break;
      case 'stickers':
        this.shape = false;
        this.stickers = true;
        this.buttons = false;
        this.activeStickers();
        break;
      case 'buttons':
        this.shape = false;
        this.stickers = false;
        this.buttons = true;
        this.activeStickers();
        break;
    }
  }
  activeStickers() {

    let payLoad: any = {};
    this.stickerCatalog_List = [];
    if (this.shape) {

      payLoad = {
        "sub_category_id": HOST.STKR_SHAPE_SUB_CAT_ID,
        "catalog_id": 0,
        "page": 1,
        "item_count": 50,
      }
    }
    else if (this.stickers) {

      payLoad = {
        "sub_category_id": HOST.STKR_SUB_CAT_ID,
        "catalog_id": 0,
        "page": 1,
        "item_count": 50,
      }
    }
    else {

      payLoad = {
        "sub_category_id": HOST.STKR_BUTTON_SUB_CAT_ID,
        "catalog_id": 0,
        "page": 1,
        "item_count": 50,
      }
    }
    
    if(this.activeTabID === 2) {
      this.dataService.postData("getNormalCatalogsBySubCategoryId", payLoad, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("ut")
        }
      }).subscribe((res) => {
        this.stickerCatalog_List = res['data']['result']; 

        if(this.buttons || this.stickers) {
          
          this.stickerCatalogChanged(this.stickerCatalog_List[0], true);
        }
        else if(this.stickers) {

          this.stickerCatalogChanged(this.stickerCatalog_List[0],true);
        }
      });

      this.isBasicTabActive = true
    }
    else if(this.activeTabID === 5) {
      this.stock_photo_list = [
        {
          "id": 8747397,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-teddy-bear-adventure-8747397\/",
          "type": "illustration",
          "tags": "ai generated, teddy bear, adventure",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/08\/05\/00\/ai-generated-8747397_150.jpg",
          "previewWidth": 150,
          "previewHeight": 84,
          "webformatURL": "https:\/\/pixabay.com\/get\/g0b4b79c05e5c2b7d998e166a2acc9db32c2c3cd28a8cdcc38d2854288cdb25d3801c90ad264058bd2517c706dafb47e7_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 360,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gc93698f193c590e5fff10654b54f88054c5e46b2390ef06d20106ce2ee64161dbe75b3f3c566db0129b3033d393d163e2c779e295cfd4519f192693d4105c5f2_1280.jpg",
          "imageWidth": 3584,
          "imageHeight": 2016,
          "imageSize": 1345830,
          "views": 353,
          "downloads": 293,
          "collections": 2,
          "likes": 49,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
        },
        {
          "id": 8745937,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-man-hoodie-male-8745937\/",
          "type": "illustration",
          "tags": "ai generated, man, hoodie",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/07\/14\/07\/ai-generated-8745937_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/ga60a99ec6bf6734f3e2676cb4a162e44fc6a6428a25b0466dffdb463a03f4431082e1b70f772143f0489943b3a470a86_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g0ae08df285c3542debdc0acc9e7be2b5232852f5da135400a038e0449066c516527538a73dc76e674df56e12dc029731e98f2a52cef042f7d39fa24338629de9_1280.jpg",
          "imageWidth": 3344,
          "imageHeight": 5016,
          "imageSize": 2179227,
          "views": 655,
          "downloads": 525,
          "collections": 1,
          "likes": 56,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
        },
        {
          "id": 8748382,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/letter-writing-vintage-paper-text-8748382\/",
          "type": "illustration",
          "tags": "letter, writing, vintage",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/08\/13\/58\/letter-8748382_150.png",
          "previewWidth": 108,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/ga7cd4b01e9a879e8a793b9b3940f8c69d03740768021ee8d2f7eff928a85d86f8e02c7faff484d8d325266a7546a17a6_640.png",
          "webformatWidth": 459,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gb7a8559d0514c105ebe5bfab09cbdedfcc718269c3f29108ae7ff0289ccb16a7e10df535b1dd7e7de725bbc179736102218268f1e0bf39747ad015a814b78c96_1280.png",
          "imageWidth": 2445,
          "imageHeight": 3406,
          "imageSize": 2019389,
          "views": 553,
          "downloads": 480,
          "collections": 9,
          "likes": 41,
          "comments": 9,
          "user_id": 17475707,
          "user": "flutie8211",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2023\/05\/21\/19-38-51-804_250x250.jpg"
        },
        {
          "id": 8743490,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/marigold-flower-nature-bloom-8743490\/",
          "type": "illustration",
          "tags": "marigold, flower, nature",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/06\/15\/15\/marigold-8743490_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g68afe2d27643e933ed1101ef86e13763ad7201b0597e74c4b8c28b9388e9abb2ddeecc202c9f70995ad60bf6e31a3505_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g99ab2f7c59a694184e75445dce0a744e19e1a4f2c0a842708a90390d0eedc1a701228227b579b57c019e82443d25b497adb78c709f9b3deb8404f26f07297c1b_1280.jpg",
          "imageWidth": 3344,
          "imageHeight": 5016,
          "imageSize": 1946250,
          "views": 1037,
          "downloads": 945,
          "collections": 2,
          "likes": 69,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
        },
        {
          "id": 8747393,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-teddy-bear-adventure-8747393\/",
          "type": "illustration",
          "tags": "ai generated, teddy bear, adventure",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/08\/04\/58\/ai-generated-8747393_150.jpg",
          "previewWidth": 150,
          "previewHeight": 84,
          "webformatURL": "https:\/\/pixabay.com\/get\/g0ab514f9130abaccf837a8419281f3e60e6a32ad31ca3d66023384a343345ff0d53bc50ad032510c1174f3f219566cb8_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 360,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gb5a6cdd3b74763c2e6968c2d7e167c36ab351bedc8ba515aa53869b76b33a10bd2f5503a6a7040b45822e0851653b9ff5eb3f7ad223a62844ba17716c8afb0a6_1280.jpg",
          "imageWidth": 3584,
          "imageHeight": 2016,
          "imageSize": 2144436,
          "views": 278,
          "downloads": 217,
          "collections": 1,
          "likes": 47,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
        },
        {
          "id": 8754070,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/back-to-school-education-welcome-8754070\/",
          "type": "illustration",
          "tags": "back to school, education, welcome",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/11\/06\/37\/back-to-school-8754070_150.jpg",
          "previewWidth": 150,
          "previewHeight": 85,
          "webformatURL": "https:\/\/pixabay.com\/get\/gdc41a8b536322a4240d296608f77738973a48d288b7f407097b30f2cd428e8b91803cea6f176bd7367f4ad7b8778f7d6_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 362,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g84bfd826cfc28cc50bc29074413d466c8f40d6dc2252ddc473a01dc5f2adca9a67598c22c952886ea87751fb3db106f59eb4fd751254c7ad28ebe54b7a55f66f_1280.jpg",
          "imageWidth": 4084,
          "imageHeight": 2310,
          "imageSize": 1193919,
          "views": 118,
          "downloads": 69,
          "collections": 2,
          "likes": 26,
          "comments": 2,
          "user_id": 9301,
          "user": "geralt",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2022\/08\/25\/06-52-36-900_250x250.jpg"
        },
        {
          "id": 8741777,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-flower-poppy-bloom-8741777\/",
          "type": "illustration",
          "tags": "ai generated, flower, poppy",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/05\/19\/03\/ai-generated-8741777_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g1507dcd14d9689e11cdb35dd67985139d4dd07b3bdb064d702ce6b86d2ddacd9d39b5ec30b82e73f55c1db678dc86fa8_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g17069025ac094b32346fd8ca562d91dca3eb096b231568290bf3b669a0ff5392f0eb7f96c909134814fefaaf93bf99b7480f11491e92ff34b5e66c32b473ad03_1280.jpg",
          "imageWidth": 3344,
          "imageHeight": 5016,
          "imageSize": 1697645,
          "views": 1755,
          "downloads": 1512,
          "collections": 7,
          "likes": 78,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
        },
        {
          "id": 8741769,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-flower-hibiscus-petals-8741769\/",
          "type": "illustration",
          "tags": "ai generated, flower, hibiscus",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/05\/18\/55\/ai-generated-8741769_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/gfa40ada00ec94007f79856c6c86949a7b17a360801f08e588e72bd2e3eaa839c06d10626f2f896dc90653841ffebf61f_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gec17a9d0dd3145811151890d4fcef665ebf0d1e586e6b05d86021fb1a0468b88cbdf1abc23afbc6baba72ccd0ac9628021cbd04b73d2ef1c35556a20a4688aaf_1280.jpg",
          "imageWidth": 3344,
          "imageHeight": 5016,
          "imageSize": 2219910,
          "views": 2215,
          "downloads": 1807,
          "collections": 8,
          "likes": 77,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
        },
        {
          "id": 8747423,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-eye-computer-science-8747423\/",
          "type": "illustration",
          "tags": "ai generated, eye, computer",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/08\/05\/21\/ai-generated-8747423_150.jpg",
          "previewWidth": 85,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/gc2c383275d37b01d836d4152c96c54ac3a0577bb531ecf5577a46127442ca6d4c3068353c8d2752fd80c8230ee46276d_640.jpg",
          "webformatWidth": 362,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g1e1759c902ddd50f7bd937bb5cef10a131695edb49a5680dfb56af6453b131832d4f355c7a33d2b03964e1eee9f33aafad8e1841be0e48a14c77703a6a2366dc_1280.jpg",
          "imageWidth": 2310,
          "imageHeight": 4084,
          "imageSize": 2164846,
          "views": 500,
          "downloads": 416,
          "collections": 5,
          "likes": 43,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
        },
        {
          "id": 8751724,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/kingfisher-flight-wildlife-water-8751724\/",
          "type": "illustration",
          "tags": "kingfisher, flight, wildlife",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/09\/19\/53\/kingfisher-8751724_150.jpg",
          "previewWidth": 150,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/gd57e01cdeb45db54d54c4a15b0da6ebfdf75da954261d4c6cdbccf247ce1b2ea65b2f8318fe7f5e192592e34f19510f3_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g437609fb78288e3c32299471ac60bb65c80688507800d3db7717c485586518157b801665de721b9ae052f37c3f9d55bbc88f3ac8cec0b52c23cbf5b9728328a1_1280.jpg",
          "imageWidth": 4000,
          "imageHeight": 4000,
          "imageSize": 2986233,
          "views": 46,
          "downloads": 14,
          "collections": 0,
          "likes": 22,
          "comments": 6,
          "user_id": 32364022,
          "user": "beasternchen",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/16-15-30-223_250x250.jpg"
        },
        {
          "id": 8750426,
          "pageURL": "https:\/\/pixabay.com\/photos\/barnacle-goose-wild-goose-water-bird-8750426\/",
          "type": "photo",
          "tags": "barnacle goose, free wallpaper, free background",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/09\/10\/03\/barnacle-goose-8750426_150.jpg",
          "previewWidth": 150,
          "previewHeight": 84,
          "webformatURL": "https:\/\/pixabay.com\/get\/g4283b699a11ff6c4e964c9e25d55ce52a57b99e318db960d8e9acb1d48ddc58c52d88b64a3cfee68fe5eb5c0e2ef7228_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 360,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g6114dc10e755ab3ee3ea5b966f6bfaaf2703d29d963395152c5d8027dbd63551b2ceeb3a27f327d0bec8b8b8cd3bdd62c658de97512f6734b78beb651a682f53_1280.jpg",
          "imageWidth": 5509,
          "imageHeight": 3099,
          "imageSize": 4359102,
          "views": 946,
          "downloads": 869,
          "collections": 3,
          "likes": 42,
          "comments": 15,
          "user_id": 1425977,
          "user": "ChiemSeherin",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/16\/09-32-35-836_250x250.jpg"
        },
        {
          "id": 8750435,
          "pageURL": "https:\/\/pixabay.com\/photos\/raven-crow-carrion-crow-bird-8750435\/",
          "type": "photo",
          "tags": "raven, laptop wallpaper, crow",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/09\/10\/14\/raven-8750435_150.jpg",
          "previewWidth": 150,
          "previewHeight": 84,
          "webformatURL": "https:\/\/pixabay.com\/get\/g1b45f0242b00627ea6afedc8accc8825ddeca2dbe16df1019be2c04a2c050068aa95524e703d7a48efea346d40d785f3_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 360,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g869bd511edb4225f177abab3b8c0d8144b18499b2f53c03a72afe7359a9704d62365392a85ebd2bc08b03f6a6fb66c8e506eb8c0df2d4193e6ffc46c2621d3ff_1280.jpg",
          "imageWidth": 5176,
          "imageHeight": 2912,
          "imageSize": 3830775,
          "views": 634,
          "downloads": 569,
          "collections": 1,
          "likes": 34,
          "comments": 9,
          "user_id": 1425977,
          "user": "ChiemSeherin",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/16\/09-32-35-836_250x250.jpg"
        },
        {
          "id": 8745123,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-river-forest-trees-8745123\/",
          "type": "illustration",
          "tags": "ai generated, river, forest",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/07\/07\/49\/ai-generated-8745123_150.jpg",
          "previewWidth": 150,
          "previewHeight": 85,
          "webformatURL": "https:\/\/pixabay.com\/get\/g864c710df81e0710613c54993a667f0cea4de42152a823fe80053788a01575fc8cf872a094880cf83a3cadfd612c2ac4_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 362,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gb356a561be6d29cae9c003be4a56729ab9fc7f7169f010f34cee1e8bc400fb85f64bb0fb251a33a906602241defab8508b057bf83d534d38eba1f461a6201574_1280.jpg",
          "imageWidth": 4084,
          "imageHeight": 2310,
          "imageSize": 2706046,
          "views": 704,
          "downloads": 562,
          "collections": 3,
          "likes": 53,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
        },
        {
          "id": 8751314,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/grunge-texture-wall-concrete-8751314\/",
          "type": "illustration",
          "tags": "grunge, texture, wall",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/09\/15\/23\/grunge-8751314_150.jpg",
          "previewWidth": 150,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/gaf8ebde3779488a518265e699bff489bc7f0f4289aab37f5ca4f08ac92d74db7c9f152321607acde327916f9bf0e2791_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gcffa54d8e6d25c258087ed0de2c9668e653e43e9ec8ebc97fd28dd3fc1f480826cfb8a2e574775f499ad86c070a16f2fb81b01419239bbcc2bde7b446734ccaa_1280.jpg",
          "imageWidth": 4500,
          "imageHeight": 4500,
          "imageSize": 1040122,
          "views": 223,
          "downloads": 188,
          "collections": 6,
          "likes": 28,
          "comments": 2,
          "user_id": 17475707,
          "user": "flutie8211",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2023\/05\/21\/19-38-51-804_250x250.jpg"
        },
        {
          "id": 8743609,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/man-mystic-computer-science-head-8743609\/",
          "type": "illustration",
          "tags": "man, mystic, computer science",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/06\/15\/48\/man-8743609_150.jpg",
          "previewWidth": 150,
          "previewHeight": 85,
          "webformatURL": "https:\/\/pixabay.com\/get\/ge56942d1a173f9f98f3fa1f912054e5954a0d030bc325877cfd8fb121d7a9f8bf4e729f595a4c4d326f6c4c0f85fd721_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 362,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g88cd8f8af368ed21f076da3eee34767f475e6fc5e2501c32ccd027b5c4712633e5b643e7f92c2d66fb5cd69bb3cf5f7d07de038e822c0f81747e501700860f92_1280.jpg",
          "imageWidth": 4084,
          "imageHeight": 2310,
          "imageSize": 1491539,
          "views": 1185,
          "downloads": 1004,
          "collections": 3,
          "likes": 64,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
        },
      ]

      /* this.dataService.postData("getImagesFromPixabay", {
        "search_query": "",
        "page": 1,
        "item_count": 50
      }, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("ut")
        }
      }).subscribe((res) =>  {
        if (res['code'] == 200) {
          if (res['data'].result.hits) {
            this.stock_photo_list = res['data']['result']['hits'];
          }
          this.stock_photo_response = res['data'];
      } 
      }) */

      this.isStockPhotoList = false;
      // payLoad = {
      //   "search_query": "",
      //   "page": 1,
      //   "item_count": 50
      // }

      // this.dataService.postData("getImagesFromPixabay", payLoad ,{
      //   headers: {
      //     Authorization: "Bearer " + localStorage.getItem("ut")
      //   }
      // }).subscribe((res) => {

      //   if (res["code"] == 200) {
      //     if (res["data"].result.hits) {
      //       this.stock_photo_list = res['data']['result']["hits"];
      //     }
      //     this.stock_photo_response = res["data"];
      //     if (this.stock_photo_list && this.stock_photo_list.length <= 0) {
      //       this.isStockPhotoList = true;
      //     }
      //   } 
      // })  
    }
    else if(this.activeTabID === 4) {
      this.activeTab.tabId = 4;
    }
  }

  // Load sticker from database
  stickerCatalogChanged(catalog_detail, isOpenReplace: boolean = false) {
    let payLoad: any = {};
    if (this.shape) {

      payLoad = {
        "catalog_id": catalog_detail.catalog_id,
        "page": 1,
        "item_count": 500,
        "is_free": catalog_detail.is_free
      }
    }
    else if (this.stickers) {

      payLoad = {
        "catalog_id": catalog_detail.catalog_id,
        "page": 1,
        "item_count": 500,
        "is_free": catalog_detail.is_free
      }
    }
    else {

      payLoad = {
        "catalog_id": catalog_detail.catalog_id,
        "page": 1,
        "item_count": 1000,
        "is_free": catalog_detail.is_free
      }
    }
    
    this.stickerContent_List = catalog_detail;
    this.stickerContent_List.content_list = [];
    
    this.isSvgEle = true;
    this.stkr_catalog_id = catalog_detail.catalog_id;

    this.dataService.postData("getContentByCatalogId", payLoad, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((res: any) => {

      if (res.code == 200) {

        if (res.data.result && res.data.result.length > 0) {

          res.data.result.forEach(element => {
            
            this.stickerContent_List.content_list.push(element);
            this.stickerContent_List.is_next_page = res.data.is_next_page;
          });
        } 
      }
    })
  }
  selectSticker(sticker_details, sticker_type, stickerFrom: string = '') {
    if (sticker_type == StickerType.Image) {
      
      this.getImgPolaroid(sticker_details.original_img, 'server', {}, stickerFrom)
    }
    else if (sticker_type == StickerType.Svg) {
      this.addSvgShape(sticker_details.svg_image, stickerFrom);
    }
  }

  // Add SVG Element
  addSvgShape(svgName, stickerFrom: string = '') {
    var appended_url = svgName + '?v=' + new Date().getTime();
    
    fabric.loadSVGFromURL(appended_url, (objects, options) => {

      let colorArray = objects.map(x => x.fill);
      colorArray = colorArray.filter((x, i, a) => a.indexOf(x) == i);
      colorArray.forEach((color, index) => {
        let id = `A_${index}_`;
        objects.forEach((o) => {
          if (o.fill == color) {
            o.id = id;
          }
        });
      });

      var shape = fabric.util.groupSVGElements(objects, options);
      shape.set({
        left: 0,
        top: 0,
        angle: 0,
        padding: 0,
        hasRotatingPoint: true,
        peloas: 12,
        cornerSize: 15,
        cornerColor: '#00C3F9',
        cornerStyle: 'circle',
        centeredScaling: false,
        centeredRotation: true,
        transparentCorners: false,
        isLocked: false,
        visible: true,
        clipTo: null,
        lockScalingFlip: true,
        excludeFromExport: false,
        _controlsVisibility: {
          tl: true,
          tr: true,
          br: true,
          bl: true,
          ml: true,
          mt: true,
          mr: true,
          mb: true,
          mtr: true
        },
        id: this.generateUniqueId(),
        element_type: stickerFrom || 'SVGShape',
      });

      if (this.isReplaceMode == true) {
        let activeObject = this.canvas.getActiveObject();
        const activeObjectIndex = this.canvasObjectList.findIndex(obj => obj.id === activeObject.id);
        this.isReplaceSame = true;

        shape.height = activeObject.height;
        shape.width = activeObject.width;
        shape.scaleX = activeObject.scaleX;
        shape.scaleY = activeObject.scaleY;
        shape.left = activeObject.left;
        shape.top = activeObject.top;
        shape.flipX = activeObject.flipX;
        shape.flipY = activeObject.flipY;
        shape.isLocked = activeObject.isLocked || false;
        shape.angle = activeObject.angle;
        shape.id = activeObject.id;
        shape.class = svgName;
        
        setTimeout(() => {
          this.canvas.remove(activeObject);
          this.canvas.add(shape);
          this.layerSelected = shape;
          this.canvas.setActiveObject(shape);
          this.layerSelected = shape;
          this.canvas.renderAll();
          this.canvasObjectList[activeObjectIndex] = shape.toJSON(['id','class','isLocked','element_type']);
          this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
          this.whatEleScale = this.utils.getObjectMaxSize(activeObject.height, activeObject.width, this.zoomHeightRef, this.zoomWidthRef);
          this.whatEleHeight = activeObject.height;
          this.whatEleWidth = activeObject.width;
          // this.renderStackObjects('replaceUpdate');
        }, 500);
      }
      else {
        let scale = this.utils.getObjectMaxSize(shape.height, shape.width, this.zoomHeightRef, this.zoomWidthRef);
        shape.scaleToHeight(shape.height * scale);
        shape.scaleToWidth(shape.width * scale);
        
        shape.left = this.utils.getCenterCoord(shape.width * scale, this.zoomWidthRef);
        shape.top = this.utils.getCenterCoord(shape.height * scale, this.zoomHeightRef);
        shape.class = svgName;
        setTimeout(() => {
          this.canvas.add(shape);
          this.canvas.setActiveObject(shape);
          this.canvas.renderAll();
          this.layerSelected = shape
          this.canvasObjectList.push(shape.toJSON(['class','id','isLocked','element_type']));
          this.canvasreveseobjectListe = [...this.canvasObjectList].reverse();
          this.whatEleScale = this.utils.getObjectMaxSize(shape.height, shape.width, this.zoomHeightRef, this.zoomWidthRef);
          this.whatEleHeight = shape.height;
          this.whatEleWidth = shape.width;
        }, 500);
      }

    }, null, { crossOrigin: 'anonymous' });
  }

  // Add Image Element
  getImgPolaroid(image_details, uploadfrom = '', st: any = {}, stickerFrom: string = '') {
    var id, that = this;

    if (that.isReplaceMode == true) {
      var options = this.canvas.getActiveObject().toObject(custom_attributes);
      var targetObject = that.canvas.getActiveObject();
      this.isReplaceSame = true;

      fabric.util.loadImage(image_details,  (imgObj) => {
        let scale = that.utils.getObjectMaxSize(targetObject.height, targetObject.width, that.zoomHeightRef, that.zoomWidthRef);
        
        let scaleX = targetObject.scaleX * targetObject.width / imgObj.width;
        let scaleY = targetObject.scaleY * targetObject.height / imgObj.height;

        var image = new fabric.Image(imgObj);
        image.crossOrigin = "anonymous";

        image.set({
          left: targetObject.left,
          top: targetObject.top,
          angle: targetObject.angle,
          padding: 0,
          hasRotatingPoint: true,
          peloas: 12,
          isLocked: targetObject.isLocked,
          scaleX: scaleX,
          scaleY: scaleY,
          id: targetObject.id,
          cornerSize: 15,
          cornerColor: '#00C3F9',
          cornerStyle: 'circle',
          lockScalingFlip: true,
          clipTo: null,
          excludeFromExport: false,
          transparentCorners: false,
          'element_type': targetObject.element_type,
        });
        
        setTimeout(() => {
          this.canvas.remove(targetObject);
          that.canvas.add(image);
          this.canvas.setActiveObject(image);
          that.canvas.renderAll();
          // this.isReplaceMode = true;
          // this.isReplaceShow = true;
          this.isReplaceSame = true
          this.layerSelected = image;
          this.whatEleScale = this.utils.getObjectMaxSize(imgObj.height, imgObj.width, this.zoomHeightRef, this.zoomWidthRef);
          this.whatEleHeight = imgObj.height;
          this.whatEleWidth = imgObj.width;
          that.selectItemAfterAdded(image);
          that.renderStackObjects('update');
        }, 500);
      }, null, { crossOrigin: 'anonymous' });
      this.copyStylestoClipboard();
    }
    else {
      fabric.util.loadImage(image_details,  (imgObj) => {
        let scale = that.utils.getObjectMaxSize(imgObj.height, imgObj.width, that.zoomHeightRef, that.zoomWidthRef);
        // imgObj.height = imgObj.height * scale;
        // imgObj.width = imgObj.width * scale;
        
        var image = new fabric.Image(imgObj);
        image.crossOrigin = "anonymous";
        image.set({
          left: that.utils.getCenterCoord(imgObj.width * scale, that.zoomWidthRef),
          top: that.utils.getCenterCoord(imgObj.height * scale, that.zoomHeightRef),
          angle: 0,
          padding: 0,
          hasRotatingPoint: true,
          peloas: 12,
          isLocked: false,
          scaleX: scale,
          scaleY: scale,
          id: this.generateUniqueId(),
          cornerSize: 15,
          cornerColor: '#00C3F9',
          cornerStyle: 'circle',
          lockScalingFlip: true,
          clipTo: null,
          excludeFromExport: false,
          transparentCorners: false,
          'element_type': stickerFrom || uploadfrom,
        });

        var customAttribute = {}
        if (uploadfrom == 'stockphotos' && st.id) {
          var uniquenm = that.generateUniqueId();
          customAttribute = {
            'customSourceType': "sticker_json",
            'uploadFrom': uploadfrom,
            'ischanged': true,
            'uniqueName': uniquenm,
            'stockPhotoItem': st,
            'isLocked': false,
            'element_type': uploadfrom
          }
        }
        else {
          customAttribute = {
            'customSourceType': "sticker_json",
            'uploadFrom': uploadfrom,
            'isLocked': false,
            'element_type': stickerFrom || uploadfrom
          }
        }

        // image.toObject = ( (toObject) => {
        //   return  () => {
        //     return fabric.util.object.extend(toObject.call(this), customAttribute);
        //   };
        // })(image.toObject);

        id = that.generateUniqueId();
        // that.extend(image, id);

        setTimeout(() => {
          that.canvas.add(image);
          that.canvas.centerObject(image);
          this.isSvgEle = true;
          this.canvas.setActiveObject(image);
          this.currentImg = image;
          this.canvas.sendToBack(image);
          this.layerSelected = image;
          this.whatEleScale = this.utils.getObjectMaxSize(imgObj.height, imgObj.width, this.zoomHeightRef, this.zoomWidthRef);
          this.whatEleHeight = imgObj.height;
          this.whatEleWidth = imgObj.width;
          
          this.getClippathwidth = image.width * image.scaleX;
          this.getClippathheight = image.height * image.scaleY;
          this.getClippathleft = image.left;
          this.getClippathtop = image.top;
          that.canvas.renderAll();
          that.renderStackObjects('add');
        }, 500);

      }, null, { crossOrigin: 'anonymous' });
      return id;
    }
  }
  addAttribute(object, attrName, attrValue) {
    object.toObject = ( (toObject) => {
      return  () => {
        return fabric.util.object.extend(toObject.call(this), {
          [attrName]: attrValue
        });
      };
    })(object.toObject);
  }
  setPathFill(color, is_update: boolean = false) {
  
    let activegroup = this.canvas.getActiveObject();
    if(activegroup._objects) {
      activegroup._objects.forEach(path => {
        
        if (path.id == color.id) {
          path.set('fill',color.color);
          // path.setFill(color.color);
        }
      });
    }
    else if(!activegroup._objects) {
      activegroup.set('fill',color.color);
    }
    
    this.referenceArray.forEach((x) => { x.id == color.id ? x.color = color.color : ''; return; });
    this.canvas.renderAll();
  
  }
  generateUniqueNameForStockImage(image_id, type) {
    var name = 'stock_photos_id_' + image_id + '.' + type;
    return name;
  }
  setSource(url, options): Promise<void> {
    var that = this;

    return new Promise<void>(async (resolve) => { 
      this.setFrameStickerCords(url, options).then(res => {
        that.canvas.getActiveObject().setSrc(url, async () => {
          await that.canvas.renderAll();
          resolve();
        }, options);
      });
    });
  }
  setFrameStickerCords(url, options): Promise<any> {
    let that = this;

    return new Promise<void>(async (resolve) => {
      if (this.isReplaceMode == true) {
        let scale, selectedObjSize;
        let activeobject = that.canvas.getActiveObject();

        // fabric.util.loadImage(url, function (imgObj) {
        //   if (imgObj.width == null || imgObj.height == null) {
        //     resolve();
        //   }

        //   if (imgObj.width != null && imgObj.height != null) {
        //     imgObj.scaleToWidth(activeobject.width * activeobject.scaleX);
        //     imgObj.scaleToHeight(activeobject.height * activeobject.scaleY);
        //     // imgObj.width = activeobject.width;
        //     // imgObj.height = activeobject.height;
        //     // imgObj.scaleX = activeobject.scaleX;
        //     // imgObj.scaleY = activeobject.scaleY;
        //     // that.renderStackObjects('update');
        //     that.canvas.renderAll();
        //     resolve();
        //   }
          
        // }, null, { crossOrigin: 'anonymous' });

        fabric.Image.fromURL(url, function(fabricImgObj) {
          
          fabricImgObj.set({
            top: activeobject.top,
            left: activeobject.left,
            width: activeobject.height,
            height: activeobject.width,
            scaleX: activeobject.scaleX,
            scaleY: activeobject.scaleY
          });
          fabricImgObj.scaleToWidth(activeobject.height * activeobject.scaleX);
          fabricImgObj.scaleToHeight(activeobject.width * activeobject.scaleY);

          that.canvas.remove(activeobject);
          that.canvas.add(fabricImgObj);
          that.canvas.setActiveObject(fabricImgObj);
          that.canvas.renderAll();

          // that.renderStackObjects('update');

          resolve();
        });
      } 
      else {
        resolve();
      }
    });
  }

  // Format painter
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
    }
  }
  copyStylestoClipboard() {
    const activeObject = this.canvas.getActiveObject();

    this.formatPainterClipboard.properties = {
      filters: activeObject.filters,
      opacity: activeObject.opacity,
      hoverCursor: 'move'
    }

    this.formatPainterClipboard.objectId = activeObject.id || this.canvas.getActiveObject().toObject().id;
    this.formatPainterClipboard.type = 'image';
  }

  assignBase64(object): Promise<any> {
    let that = this;
    return new Promise((resolve) => {
      var image = new Image()
      image.crossOrigin = "anonymous";
      image.onload = function () {
        if (image.width > image.height) {

          var width = layer_image_validation.width;
          var height = Math.floor((image.height * width) / image.width);
          if (height > layer_image_validation.height) {
            
            height = layer_image_validation.height;
            width = Math.floor((image.width * height) / image.height);
          }
          resolve(that.imageToDataUri(image, width, height));
        }
        else if (image.width < image.height) {

          var height = layer_image_validation.height;
          var width = Math.floor((image.width * height) / image.height) + 4;
          if (width > layer_image_validation.width) {
            
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
  imageToDataUri(img, width, height) {
    var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');
    canvas.width = width;
    canvas.height = height;
    ctx!.drawImage(img, 0, 0, width, height);
    return canvas.toDataURL();
  }

  //Image Effects
  resetFilter() {
    if (this.canvas.getActiveObject() && this.canvas.getActiveObject().filters && this.canvas.getActiveObject().filters.length > 0) {
      this.canvas.getActiveObject().filters = [];
      this.canvas.getActiveObject().applyFilters();
      this.canvas.renderAll();
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
    }
  }
  setEffect(filtertype, value, filterOpacity,event) {
    this.isFromInput = true;

    switch (filtertype) {
      case 'sepia':
        if (value) {
          var filter = new fabric.Image.filters.Sepia();
          this.isExist('Sepia', filter);
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
        }
        else {
          this.removeEffect('Sepia');
        }
        break;

      case 'sepia2':
        if (value) {
          var filter = new fabric.Image.filters.Sepia2();
          this.isExist('Sepia2', filter);
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
        }
        else {
          this.removeEffect('Sepia2');
        }
        break;

      case 'grayscale':
        if (value) {
          var filter = new fabric.Image.filters.Grayscale();
          this.isExist('Grayscale', filter);
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
        }
        else {
          this.removeEffect('Grayscale');
        }
        break;

      case 'invert':
        if (value) {
          var filter = new fabric.Image.filters.Invert();
          this.isExist('Invert', filter);
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
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
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
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
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
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
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
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
          this.isExist('Convolute', filter, 'emboss');
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
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
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
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
          this.canvas.getActiveObject().applyFilters();
          this.canvas.renderAll();
          this.renderStackObjects();
          // this.applyEffect(filter, 14);
        }
        else {
          this.removeEffect('ColorMatrix', 'technicolor');
        }
        break;

    }
  }
  async isExist(type, filter, matrixType = '') {
    var tmp = true;
    
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
    
    var allFilter: any = this.canvas.getActiveObject().filters;
    allFilter.forEach((element, i) => {
      if (element.__proto__.type == type && element.__proto__.type != 'ColorMatrix') {
        this.canvas.getActiveObject().filters[i] = filter;
        tmp = false;
      }
      else if (element.__proto__.type == 'ColorMatrix' && type == 'ColorMatrix') {
        if (this.compareArray(element.matrix, FILTERMATRIX.BlackNWhite) && matrixType == 'blackwhite') {
          
          this.props.blackWhite = true;
          this.canvas.getActiveObject().filters[i] = filter;
          tmp = false;
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
    
    this.getEffect();
  }
  getEffect() {
    
    // this.props.brightness = 0;
    // this.props.contrast = 0;
    // this.props.saturation = 0;
    // this.props.tint = '#ffffff';
    // this.props.blur = 0;
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
    // this.props.blendColor = '#ffffff';
    // this.props.blendMode = 'add';
    // this.props.blendAlpha = 1;
    // this.props.gradient = 0;
    // this.props.tintOpacity = 0;
    
    if (this.canvas.getActiveObject().filters) {
      this.canvas.getActiveObject().filters.forEach(element => {
        
        switch (element.__proto__.type) {
          // case 'Brightness':
            
          //   this.props.brightness = (element.brightness * 100).toFixed(0);
          //   break;

          // case 'Contrast':

          //   this.props.contrast = (element.contrast * 100).toFixed(0);
          //   break;

          // case 'Saturation':

          //   this.props.saturation = (element.saturation * 100).toFixed(0);
          //   break;

          // case 'Tint':
          //   this.props.tint = element.color;
          //   let hue = Math.round(this.hexToHsl(element.color) / 3.6);
          //   if (hue == 0 && element.opacity != 0) {
          //     hue = 100;
          //   }
          //   this.props.tintOpacity = hue;
          //   break;
          
          // case 'Blur':

          //   this.props.blur = (element.blur * 100).toFixed(0);
          //   break;
          
          case 'Sepia':
            this.props.sepia = true;
            break;
          
          case 'Sepia2':
            this.props.sepia2 = true;
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
          
          // case 'BlendColor':
            
          //   this.props.blendColor = element.color;
          //   this.props.blendMode = element.mode;
          //   this.props.blendAlpha = (element.alpha * 100).toFixed();
          //   break;
        
        }
      });
    }
  }

  //Image Filter
  // setFilter(filterType, value, filterOpacity, event) {
  //   this.isFromInput = true;

  //   if (value == null) {
  //     this.getfilter();
  //     value = this.props[filterType];
  //   }

  //   if(filterType == 'blend') {
      
  //     value = (event) ? [this.props.blendColor, this.props.blendMode, parseInt(event.target.value)] : value;
  //     let filter = this.createFilter(filterType, value);
  //     this.updateFiltersArray(filterType,filter);
  //   }
  //   else {

  //     value = (event) ? parseInt(event.target.value) : value;
  //     let filter = this.createFilter(filterType, value / 100);
  //     this.updateFiltersArray(filterType,filter);
  //   }
    

  //   if (this.rangeMoveTimeout) {
  //     clearTimeout(this.rangeMoveTimeout);
  //   }

  //   this.rangeMoveTimeout = setTimeout(() => {
  //     this.canvas.getActiveObject().applyFilters();
  //     this.canvas.renderAll();
  //     this.renderStackObjects();
  //   }, 500);
  // }
  // createFilter(filterType, value) {
  //   switch (filterType) {
  //     case 'brightness':
  //       this.props.brightness = (value * 100).toFixed(0);
  //       return new fabric.Image.filters.Brightness({ brightness: value });

  //     case 'contrast':
  //       this.props.contrast = (value * 100).toFixed(0);
  //       return new fabric.Image.filters.Contrast({ contrast: value });

  //     case 'blur':
  //       this.props.blur = (value * 100).toFixed(0);
  //       return new fabric.Image.filters.Blur({ blur: value });

  //     case 'saturation':
  //       this.props.saturation = (value * 100).toFixed(0);
  //       return new fabric.Image.filters.Saturation({ saturation: value });

  //     // case 'sepia':
  //     //   return new fabric.Image.filters.Sepia();

  //     // case 'grayscale':
  //     //   return new fabric.Image.filters.Grayscale();

  //     // case 'invert':
  //     //   return new fabric.Image.filters.Invert();

  //     // case 'blackWhite':
  //     //   return new fabric.Image.filters.ColorMatrix({
  //     //     matrix: FILTERMATRIX.BlackNWhite
  //     //   });

  //     // case 'brownie':
  //     //   return new fabric.Image.filters.ColorMatrix({
  //     //     matrix: FILTERMATRIX.Brownie
  //     //   });

  //     // case 'vintage':
  //     //   return new fabric.Image.filters.ColorMatrix({
  //     //     matrix: FILTERMATRIX.Vintage
  //     //   });

  //     // case 'emboss':
  //     //   return new fabric.Image.filters.Convolute({
  //     //     matrix: FILTERMATRIX.Emboss
  //     //   });

  //     // case 'kodachrome':

  //     //   return new fabric.Image.filters.ColorMatrix({
  //     //       matrix: FILTERMATRIX.kodachrome
  //     //   });

  //     // case 'technicolor':

  //     //   return new fabric.Image.filters.ColorMatrix({
  //     //     matrix: FILTERMATRIX.Technicolor
  //     //   });

  //     case 'blend':

  //       this.props.blendColor = value[0];
  //       this.props.blendMode = value[1];
  //       this.props.blendAlpha = value[2];
        
  //       return new fabric.Image.filters.BlendColor({
  //         color: this.props.blendColor, 
  //         mode: value[1],
  //         alpha: (this.props.blendAlpha / 100)
  //       });
      
  //     default:
  //       throw new Error("Unsupported filter type: " + filterType);
  //   }
  // }
  // updateFiltersArray(filterType, newFilter) {
  //   let filters = this.canvas.getActiveObject().filters || [];
  //   let existingFilterIndex = filters.findIndex(f => f.type === filterType);

  //   if (this.exclusiveFilters.includes(filterType)) {
      
  //     filters = filters.filter(f => !this.exclusiveFilters.includes(f.type) || f.type === filterType);

  //     if (existingFilterIndex !== -1) {
  //       filters[existingFilterIndex] = newFilter;
  //     } 
  //     else {
  //       filters.push(newFilter);
  //     }
  //   } 
  //   else {
      
  //     if (existingFilterIndex !== -1) {
  //       filters[existingFilterIndex] = newFilter;
  //     } 
  //     else {
  //       filters.push(newFilter);
  //     }
  //   }

  //   this.canvas.getActiveObject().filters = filters;
  // }
  // getfilter() {
  //   let activeObject = this.canvas.getActiveObject();
  //   if (activeObject.filters) {
      
  //     activeObject.filters.forEach(filter => {
  //       let filterType = filter.type.toLowerCase();
  //       let value = filter[filterType] * 100;
  //       this.props[filterType] = value.toFixed(0);
  //     });
  //   }
  // }

  setFilter(filterType, value, filterOpacity, event) {
    this.isFromInput = true;
    let image = this.canvas.getActiveObject();

    if(filterType == 'blend') {
      value = (event) ? [this.props.blendColor, this.props.blendMode, parseInt(event.target.value)] : value;
    }
    else {
      value = (event) ? parseInt(event.target.value) : value;
    }

    if (image instanceof fabric.Image) {

      const filterIndex = {
        'brightness': fabric.Image.filters.Brightness,
        'contrast': fabric.Image.filters.Contrast,
        'saturation': fabric.Image.filters.Saturation,
        'blur': fabric.Image.filters.Blur,
        'blend': fabric.Image.filters.BlendColor,
      };

      function updateOrAddFilter(image, filterType, options) {

        const FilterConstructor = filterIndex[filterType];
        const existingFilter = image.filters.find(f => f instanceof FilterConstructor);

        if (existingFilter) {
          for (let prop in options) {
            existingFilter[prop] = options[prop];
          }
        }
        else {
          const newFilter = new FilterConstructor(options);
          image.filters.push(newFilter);
        }
      }

      switch (filterType) {
        case 'brightness':
          updateOrAddFilter(image, 'brightness', { brightness: value / 100 });
          this.props.brightness = value;
          break;

        case 'contrast':
          updateOrAddFilter(image, 'contrast', { contrast: value / 100 });
          this.props.contrast = value;
          break;

        case 'saturation':
          updateOrAddFilter(image, 'saturation', { saturation: value / 100 });
          this.props.saturation = value;
          break;

        case 'blur':
          updateOrAddFilter(image, 'blur', { blur: value / 100 });
          this.props.blur = value;
          break;
      
        case 'blend':
          updateOrAddFilter(image, 'blend', {color: value[0], mode: value[1],alpha: (value[2] / 100)})
          this.props.blendColor = value[0];
          this.props.blendMode = value[1];
          this.props.blendAlpha = value[2];
      }

      image.applyFilters();
      this.canvas.renderAll();
    }

  }

  public stickerScrollLeft(): void {
    this.stickerTab.nativeElement.scrollLeft -= 100;
  }
  public stickerScrollRight(): void {
    this.stickerTab.nativeElement.scrollLeft += 100;
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
  removeTrailZero(event) {
    if (event.target.value) { event.target.value = Math.round(event.target.value) };
  }

  hexToHsl(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    var r = parseInt(result![1], 16);
    var g = parseInt(result![2], 16);
    var b = parseInt(result![3], 16);

    r /= 255, g /= 255, b /= 255;
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if (max == min) {
      h = s = 0; // achromatic
    } 
    else {
      var d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);

    return h;
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
  }
  reArrangeFilter(starting, array, historyStatus) {
    this.canvas.getActiveObject().filters = [];
    
    for (let j = 0; j < starting; j++) {
      
      this.canvas.getActiveObject().filters.push(array[j]);
      this.canvas.getActiveObject().applyFilters();
      this.canvas.renderAll();
    }
    for (let i = starting + 1; i < array.length; i++) {
      
      this.canvas.getActiveObject().filters.push(array[i]);
      this.canvas.getActiveObject().applyFilters();
      this.canvas.renderAll();
    }
    
    this.canvas.getActiveObject().applyFilters();
    this.canvas.renderAll();
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

  // Adjust image
  setOpacity(opacity, event, isFloat: boolean = false, isInput: boolean = false, isButton: boolean = false, is_text: boolean = false) {
    this.isFromInput = true;

    if (opacity == null) {
      this.getOpacity();
    }
    else {
      this.props.opacity = (event) ? parseInt(event.target.value) : Math.round(opacity);
    }
    
    this.props.opacity = this.checkLimitBeforeApplyForInputSlider(this.props.opacity, 100, is_text ? 1 : 0);
    this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
    this.canvas.renderAll();
    
    if (isInput) {
      if (this.rangeMoveTimeout) {
        clearTimeout(this.rangeMoveTimeout);
      }
    }
    else {
      return;
    }
  }
  getOpacity() {
    this.props.opacity = Math.round(this.getActiveStyle('opacity', null) * 100);
  }
  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) return '';
    return (object.getSelectionStyles && object.isEditing)
      ? (object.getSelectionStyles()[styleName] || '')
      : (object[styleName] || '');
  }
  setActiveStyle(styleName, value, object) {
    let activeObject = this.canvas.getActiveObject();
    switch(styleName) {

      case 'opacity':
        activeObject.set('opacity',value);
        break;

    }
    this.canvas.renderAll();

    // object = object || this.canvas.getActiveObject();
    // if (!object) return;
    // if (object.setSelectionStyles && object.isEditing) {
    //   let style = {};
    //   style[styleName] = value;
    //   object.setSelectionStyles(style);
    //   object.setCoords();
    // }
    // else {
    //   object.set(styleName, value);
    // }
    // object.setCoords();
  }

  // Background
  activateBackgroundSubTab(key) {
    this.txturs_bg_pg_count = 1;
    
    switch (key) {
      case 'color':
        this.bgcolor = true;
        this.gradient = false;
        this.textures = false;
        this.images = false;
        this.bgMyPhotos = false;
        break;

      case 'gradient':
        this.bgcolor = false;
        this.gradient = true;
        this.textures = false;
        this.images = false;
        this.bgMyPhotos = false;
        break;

      case 'textures':
        if (!this.textures) {
          this.bg_search_query = "";
          this.tmp_bg_search_query = "";
          this.bg_stock_photo_search_query = "";
          this.stock_photo_search_query = "";
          this.activeTextures("");
        }
        this.bgcolor = false;
        this.gradient = false;
        this.textures = true;
        this.images = false;
        this.bgMyPhotos = false;
        this.isBgImg = true;
        break;

      case 'images':
        this.bgcolor = false;
        this.gradient = false;
        this.textures = false;
        this.images = true;
        this.bgMyPhotos = false;
        this.isBgImg = true;
        break;

      case 'myPhotos':
        this.bgcolor = false;
        this.gradient = false;
        this.textures = false;
        this.images = false;
        this.bgMyPhotos = true;
        this.bg_stock_photo_search_query = "";
        this.stock_photo_search_query = "";
        if (this.canvas.backgroundImage) {

          this.isBgImg = true;
        }
        else {
          this.isBgImg = false;
        }
        this.activateAddImageSubTab('bgMyPhotos');
        break;

    }
  }
  removeBackgroundColorGradient() {
    if (this.canvas.backgroundColor || this.canvas.backgroundImage) {
      
      this.props.canvasFill = transparentColor;
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }
  
  // Set BG Color
  setCanvasFill() {
    
    this.removeBackgroundImage(false);
    this.canvas.remove(this.getElementById('pattern'));
    this.canvas.backgroundColor = this.props.canvasFill;
    this.canvas.renderAll();
  }
  removeBackgroundImage(status: any = true) {
    if (typeof this.canvas.backgroundImage != 'undefined' && this.canvas.backgroundImage != null && this.canvas.backgroundImage != '') {
      this.canvas.backgroundImage = '';
      this.isBgImg = false;
      if (status == true) {
        this.renderStackObjects();
      }
    } 
    else {
      if (status) {
        this.removeBackgroundColorGradient();
      } 
      else {
        return;
      }
    }
  }
  
  // Set BG Gradient
  setNewGradient() {
    this.convertGradientOffsetFloatToInt();
    if (!this.props.isGradient) {
      this.props.isGradient = true;
      this.setGradient();
    }
  }
  
  selectGradient(type) {
    this.gradientMode = type;
    this.setGradient();
  }
  getCoords(mode, type) {

    if (type == 'linear') {
      var height, width;
      height = this.canvas.height;
      width = this.canvas.width;

      switch (mode) {

        case 'tl':
          this.coords = {
            x1: 0,
            y1: 0,
            x2: width,
            y2: height
          }
          break;
        case 'tm':
          this.coords = {
            x1: width / 2,
            y1: 0,
            x2: width / 2,
            y2: height
          }
          break;
        case 'tr':
          this.coords = {
            x1: width,
            y1: 0,
            x2: 0,
            y2: height
          }
          break;
        case 'ml':
          this.coords = {
            x1: 0,
            y1: height / 2,
            x2: width,
            y2: height / 2
          }
          break;
        case 'mr':
          this.coords = {
            x1: width,
            y1: height / 2,
            x2: 0,
            y2: height / 2
          }
          break;
        case 'bl':
          this.coords = {
            x1: 0,
            y1: height,
            x2: width,
            y2: 0
          }
          break;
        case 'bm':
          this.coords = {
            x1: width / 2,
            y1: height,
            x2: width / 2,
            y2: 0
          }
          break;
        case 'br':
          this.coords = {
            x1: width,
            y1: height,
            x2: 0,
            y2: 0
          }
          break;
      }

    }
    else if (type == 'radial') {
      var height, width;
      height = this.canvas.height;
      width = this.canvas.width;

      switch (mode) {

        case 'tl':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 0,
          }
          break;
        case 'tm':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: width / 2,
            y1: 0,
            x2: width / 2,
            y2: 0
          }
          break;
        case 'tr':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: width,
            y1: 0,
            x2: width,
            y2: 0
          }
          break;
        case 'ml':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: 0,
            y1: height / 2,
            x2: 0,
            y2: height / 2
          }
          break;
        case 'mm':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: width / 2,
            y1: height / 2,
            x2: width / 2,
            y2: height / 2,
          }
          break;
        case 'mr':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: width,
            y1: height / 2,
            x2: width,
            y2: height / 2
          }
          break;
        case 'bl':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: 0,
            y1: height,
            x2: 0,
            y2: height
          }
          break;
        case 'bm':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: width / 2,
            y1: height,
            x2: width / 2,
            y2: height
          }
          break;
        case 'br':
          this.radialCoords = {
            r1: 0,
            r2: height,
            x1: width,
            y1: height,
            x2: width,
            y2: height
          }
          break;
      }
    }
  }
  changeGradient(linearMode) {
    this.getCoords(linearMode, 'linear');
    this.convertGradientOffsetFloatToInt();
    this.setGradient();
  }
  changeRadialGradient(radialMode) {
    this.getCoords(radialMode, 'radial');
    this.convertGradientOffsetFloatToInt();
    this.setGradient();
  }
  changeGradientColor(color, id) {
    var tmp = JSON.parse(JSON.stringify(this.gradientArray));
    // this.gradientArray = [];
    tmp[id].color = color;
    // this.gradientArray = tmp;
    this.setGradient();
  }
  gradientIncreButton(max, step, gradientType, index) {

    if (this.gradientArray[index].offset != max) {
      this.gradientArray[index].offset = Number(this.gradientArray[index].offset) + step;
      this.setGradient();
    }

    this.counterInterval = setTimeout(() => {
      this.gradientIncreButton(max, step, gradientType, index);
    }, 150);
  }
  gradientDecreButton(min, step, gradientType, index) {

    if (this.gradientArray[index].offset != min) {
      this.gradientArray[index].offset = Number(this.gradientArray[index].offset) - step;
      this.setGradient();
    }
    this.counterInterval = setTimeout(() => {
      this.gradientDecreButton(min, step, gradientType, index);
    }, 150);
  }
  gradientInputIncreDecre(event, min, max, step, gradientType, index) {

    switch (event.key) {
      case 'ArrowUp':
        if (event.target.value != max) {

          this.gradientArray[index].offset = Number(this.gradientArray[index].offset) + step;
          this.setGradient();
        }
        break;
      case 'ArrowDown':
        if (event.target.value != min) {

          this.gradientArray[index].offset = Number(this.gradientArray[index].offset) - step;
          this.setGradient();
        }
        break;
    }
  }
  removeGradientColor(i) {

    if (this.gradientArray.length > 2) {
      let tmp_array = [];

      this.gradientArray.forEach((ele: never, index) => {
        if (index != i) {
          tmp_array.push(ele)
        }
      });

      this.gradientArray = [];
      this.gradientArray = tmp_array;

      var ratio = 1 / (this.gradientArray.length - 1);
      var start = 0 - ratio;
      this.gradientArray.forEach(element => {
        element.offset = Number(start + ratio).toFixed(2);
        start = start + ratio;
      });

      this.convertGradientOffsetFloatToInt();
      this.setGradient();
    }
  }
  addTextGradientColor() {

    this.gradientArray.push({ color: '#ffffff', offset: 0.5 });

    var ratio = 1 / (this.gradientArray.length - 1);
    var start = 0 - ratio;

    this.gradientArray.forEach(element => {
      element.offset = Number(start + ratio);
      start = start + ratio;
    });

    this.convertGradientOffsetFloatToInt();
    this.setGradient();
  }
  onSliderInput(event: Event, clr: any) {

    const target = event.target as HTMLInputElement;
    clr.offset = parseInt(target.value, 10);
    this.setGradient();
  }
  convertGradientOffsetFloatToInt(is_text: boolean = false) {

    if (is_text) {
      this.textGradientArray.map(x => { x.offset % 1 === 0 ? x.offset == 0 || x.offset == 1 ? x.offset = x.offset * 100 : x.offset : x.offset = (x.offset * 100).toFixed() });
    }
    else {
      this.gradientArray.map(x => { x.offset % 1 === 0 ? x.offset == 0 || x.offset == 1 ? x.offset = x.offset * 100 : x.offset : x.offset = (x.offset * 100).toFixed() });
    }
  }
  initializeGradient(constant_name, id) {
    var TMPCONST;

    if (constant_name == "bgDefaultGradient") {
      TMPCONST = TEXT_DEFAULT_GRADIENT_COLORS;
    }
    else {
      TMPCONST = GRADIENT_COLORS;
    }

    if (TMPCONST[id]) {
      const tmp = TMPCONST[id];
      this.gradientArray = [];

      if (tmp.TYPE == 'linear') {
        this.getCoords(tmp.COORDS, 'linear');
        this.isTextGradient = true;
        this.gradientMode = 'linear';
        this.linearMode = tmp.COORDS;
        this.gradientArray = [];
        this.gradientArray = JSON.parse(JSON.stringify(tmp.COLORARRAY));
        this.convertGradientOffsetFloatToInt();
        this.setGradient();
      }
      else if (tmp.TYPE == 'radial') {
        this.getCoords(tmp.COORDS, 'radial');
        this.isTextGradient = true;
        this.gradientMode = 'radial';
        this.radialMode = tmp.COORDS;
        this.gradientArray = [];
        this.gradientArray = JSON.parse(JSON.stringify(tmp.COLORARRAY));
        this.convertGradientOffsetFloatToInt();
        this.setGradient();
      }
    }
  }
  setGradient() {
    let array: any = [];
    let grad: any = '';

    this.gradientArray.forEach(element => {
      array.push({
        color: element.color,
        offset: element.offset / 100
      });
    });

    if (this.gradientMode == 'linear') {

      // if(this.gradientMode == 'linear' && Object.keys(this.coords).length === 0) {
      this.getCoords(this.linearMode, 'linear');
    }
    else if (this.gradientMode == 'radial') {

      // else if(this.gradientMode == 'radial' && Object.keys(this.radialCoords).length === 0) {
      this.getCoords(this.radialMode, 'radial')
    }

    if (this.gradientMode == 'linear') {
      grad = new fabric.Gradient({
        type: 'linear',
        coords: this.coords,
        colorStops: array
      });

      // if(this.receiveData.data['parent_type'] === "transparent") {

      //   const objects = this.canvas.getObjects();
      //   for (let i = objects.length - 1; i >= 0; i--) {
      //     if (objects[i].clipPath && objects[i].type === 'rect') {
      //       this.canvas.remove(objects[i]);
      //     }
      //   }

      //   this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
      //   this.canvas.backgroundColor = '';

      //   var backgroundRect = new fabric.Rect({
      //     width: this.loadCanvasWidth,
      //     height: this.loadCanvasHeight,
      //     fill: grad, // The new background color
      //     originX: 'center',
      //     originY: 'center',
      //     top: this.loadCanvasHeight / 2,
      //     left: this.loadCanvasWidth / 2,
      //     selectable: false,
      //     evented: false
      //   });

      //   if(this.receiveData.data['type'] === "transparent3") {

      //     var triangleClipPath = new fabric.Triangle({
      //       width: 400,
      //       height: 400,
      //       angle: 180,
      //       fill: 'transparent',
      //       originX: 'center',
      //       originY: 'center',
      //       top: 325,
      //       left: this.loadCanvasWidth / 2,
      //       absolutePositioned: true
      //     });
      //     backgroundRect.clipPath = triangleClipPath;
      //   }
      //   else if(this.receiveData.data['type'] === "transparent2") {

      //     var squareClipPath  = new fabric.Rect({
      //       width: 300, 
      //       height: 300,
      //       selectable: false,
      //       angle: 45,
      //       originX: 'center',
      //       originY: 'center',
      //       top: 250,
      //       left: this.loadCanvasWidth / 2,
      //       absolutePositioned: true,
      //       fill: 'transparent'
      //     });
      //     backgroundRect.clipPath = squareClipPath ;
      //   }
      //   else if(this.receiveData.data['type'] === "transparent1") {
      //     var circleClipPath = new fabric.Circle({
      //       radius: 175,//Math.min(this.loadCanvasWidth, this.loadCanvasHeight) / 2, 
      //       originX: 'center',
      //       originY: 'center',
      //       top: 250,
      //       left: this.loadCanvasWidth / 2,
      //       absolutePositioned: true
      //     });
      //     backgroundRect.clipPath = circleClipPath;
      //   }
      //   else if(this.receiveData.data['type'] === "transparent4") {

      //     const starPath = 'M 250 0 L 375 500 L 0 183.33 L 500 183.33 L 125 500 Z';
      //     const starClipPath = new fabric.Path(starPath, {
      //       left: 0,
      //       top: 0,
      //       fill: 'transparent',
      //       strokeWidth: 0, 
      //       originX: 'center',
      //       originY: 'center'
      //     });
      //     backgroundRect.clipPath = starClipPath;
      //   }

      //   this.canvas.add(backgroundRect);
      //   this.canvas.sendToBack(backgroundRect);
      //   this.canvas.renderAll();
      // }
      // else {
      this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
      this.canvas.backgroundColor = grad;
      this.canvas.renderAll();
      // }
    }
    else if (this.gradientMode == 'radial') {
      grad = new fabric.Gradient({
        type: 'radial',
        coords: this.radialCoords,
        colorStops: array
      });

      // if(this.receiveData.data['parent_type'] === "transparent") {

      //   const objects = this.canvas.getObjects();
      //   for (let i = objects.length - 1; i >= 0; i--) {
      //     if (objects[i].clipPath && objects[i].type === 'rect') {
      //       this.canvas.remove(objects[i]);
      //     }
      //   }

      //   this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
      //   this.canvas.backgroundColor = '';

      //   var backgroundRect = new fabric.Rect({
      //     width: this.loadCanvasWidth,
      //     height: this.loadCanvasHeight,
      //     fill: grad, // The new background color
      //     originX: 'center',
      //     originY: 'center',
      //     top: this.loadCanvasHeight / 2,
      //     left: this.loadCanvasWidth / 2,
      //     selectable: false,
      //     evented: false
      //   });

      //   if(this.receiveData.data['type'] === "transparent3") {

      //     var triangleClipPath = new fabric.Triangle({
      //       width: 400,
      //       height: 400,
      //       angle: 180,
      //       fill: 'transparent',
      //       originX: 'center',
      //       originY: 'center',
      //       top: 325,
      //       left: this.loadCanvasWidth / 2,
      //       absolutePositioned: true
      //     });
      //     backgroundRect.clipPath = triangleClipPath;
      //   }
      //   else if(this.receiveData.data['type'] === "transparent2") {

      //     var squareClipPath  = new fabric.Rect({
      //       width: 300, 
      //       height: 300,
      //       selectable: false,
      //       angle: 45,
      //       originX: 'center',
      //       originY: 'center',
      //       top: 250,
      //       left: this.loadCanvasWidth / 2,
      //       absolutePositioned: true,
      //       fill: 'transparent'
      //     });
      //     backgroundRect.clipPath = squareClipPath ;
      //   }
      //   else if(this.receiveData.data['type'] === "transparent1") {
      //     var circleClipPath = new fabric.Circle({
      //       radius: 175,//Math.min(this.loadCanvasWidth, this.loadCanvasHeight) / 2, 
      //       originX: 'center',
      //       originY: 'center',
      //       top: 250,
      //       left: this.loadCanvasWidth / 2,
      //       absolutePositioned: true
      //     });
      //     backgroundRect.clipPath = circleClipPath;
      //   }
      //   else if(this.receiveData.data['type'] === "transparent4") {

      //     const starPath = 'M 250 0 L 375 500 L 0 183.33 L 500 183.33 L 125 500 Z';
      //     const starClipPath = new fabric.Path(starPath, {
      //       left: 0,
      //       top: 0,
      //       fill: 'transparent',
      //       strokeWidth: 0, 
      //       originX: 'center',
      //       originY: 'center'
      //     });
      //     backgroundRect.clipPath = starClipPath;
      //   }

      //   this.canvas.add(backgroundRect);
      //   this.canvas.sendToBack(backgroundRect);
      //   this.canvas.renderAll();
      // }
      // else {
      this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
      this.canvas.backgroundColor = grad;
      this.canvas.renderAll();
      // }
    }
  }

  // Load BG Collection
  activeTextures(search_query) {
    let payLoad = {
      "sub_category_id": HOST.TEXTURE_SB_CAT_ID,
      "catalog_id": 0,
      "page": 1,
      "item_count": 100
    }
    this.dataService.postData("getNormalCatalogsBySubCategoryId",payLoad, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((res) => {
      
      if (res['code'] == 200) {
        this.backgroundCatalog_list = res['data'].result;
        this.backgroundCatalogChanged(this.backgroundCatalog_list[0]);
      }
    })
  }
  backgroundCatalogChanged(catalog_detail) {
    this.bg_catalog_id = catalog_detail.catalog_id;

    let payLoad = {
      "catalog_id": catalog_detail.catalog_id,
      "page": 1,
      "item_count": 100,
      "is_free": catalog_detail.is_free
    }

    this.dataService.postData("getContentByCatalogId", payLoad, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((res) => {
      if(res['code'] == 200) {

        if (res['data'].result && res['data'].result.length > 0) {
          this.isTextureList = false;
          this.txturs_bg_list = catalog_detail;
          this.txturs_bg_list.content_list = res['data'].result;
          this.txturs_bg_list.is_next_page = res['data'].is_next_page;
        }
      }
    })
  }
  async setCollectionBackground(item: any, txturs_bg_list) {
    this.props.canvasImage = await item.original_img;
    await this.setCanvasImage('', 'server');
  }
  async setCanvasImage(item = '', uploadFrom = '', isFromServer = false) {
    let self = this;
    var uploadSource = uploadFrom;
    var server_resource = isFromServer;
    if (this.props.canvasImage) {
      if (item) {
        this.backgroundStockPhoto = item;
      }
      else {
        this.backgroundStockPhoto = '';
      }
      if (this.props.scaleMode == 'Exact Fit') {
        await this.getMeta(this.props.canvasImage).then((results: any) => {
          this.props.canvasImage = results.src;
          if (results) {
            var option = {
              scaleX: this.zoomWidthRef / results.width,
              scaleY: this.zoomHeightRef / results.height,
              crossOrigin: 'anonymous',
              isFromServer: server_resource,
              stockphotodetail: item,
              uploadFrom: uploadSource,
              scaleMode: 'Exact Fit'
            };
            this.setBackground(option);
          }
          else {
            var optin = {
              top: 0,
              left: 0,
              scaleX: 1,
              scaleY: 1,
              crossOrigin: 'anonymous',
              isFromServer: server_resource,
              stockphotodetail: item,
              uploadFrom: uploadSource,
              scaleMode: 'Exact Fit'
            };
            this.setBackground(optin);
          }
        });
        // if (item) {
        //     this.canvas.backgroundImage.toObject = (function (toObject) {
        //         return function () {
        //             return fabric.util.object.extend(toObject.call(this), {
        //                 "isbgstockphoto": true,
        //                 "stockphotodetail": item
        //             });
        //         };
        //     })(this.canvas.backgroundImage.toObject);
        // }
        this.canvas.renderAll();
        /* this.canvas.setBackgroundColor({ source: this.props.canvasImage, repeat: 'repeat' }, function () {
         self.props.canvasFill = '';
         self.canvas.renderAll();
         }); */
        // if (!isurl) {
        //     self.props.canvasImage = '';
        // }
        // else {
        // }
      }
      else if (this.props.scaleMode == 'Maintain Aspect') {
        var left, top, scaleFactor;
        await this.getMeta(this.props.canvasImage).then((results: any) => {
          this.props.canvasImage = results.src;
          if (results) {
            // let self = this;
            // var canvasAspect = this.zoomWidthRef / this.zoomHeightRef;
            // var imgAspect = results.width / results.height;
            // if (canvasAspect >= imgAspect) {
            if (results.width <= results.height) {
              // scaleFactor = this.zoomWidthRef / results.width;
              // left = 0;
              // top = -((results.height * scaleFactor) - this.zoomHeightRef) / 2;
              scaleFactor = this.zoomHeightRef / results.height;
              left = -((results.width * scaleFactor) - this.zoomWidthRef) / 2;
              top = 0;
            } else {
              // scaleFactor = this.zoomHeightRef / results.height;
              // top = 0;
              // left = -((results.width * scaleFactor) - this.zoomWidthRef) / 2;
              scaleFactor = this.zoomWidthRef / results.width;
              top = -((results.height * scaleFactor) - this.zoomHeightRef) / 2;
              left = 0;
            }
          }
        });
        var option = {
          top: top,
          left: left,
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          crossOrigin: 'anonymous',
          isFromServer: server_resource,
          stockphotodetail: item,
          uploadFrom: uploadSource,
          scaleMode: 'Maintain Aspect'
        }
        this.setBackground(option);
      }
      else if (this.props.scaleMode == 'No Scale') {
        var optin = {
          top: 0,
          left: 0,
          scaleX: 1,
          scaleY: 1,
          crossOrigin: 'anonymous',
          isFromServer: server_resource,
          stockphotodetail: item,
          uploadFrom: uploadSource,
          scaleMode: 'No Scale'
        };
        this.setBackground(optin);
      }
      else if (this.props.scaleMode == 'Scale Crop') {
        var left, top, scaleFactor;
        await this.getMeta(this.props.canvasImage).then((results: any) => {
          this.props.canvasImage = results.src;
          if (results) {
            // let self = this;
            var canvasAspect = this.zoomWidthRef / this.zoomHeightRef;
            var imgAspect = results.width / results.height;
            if (canvasAspect >= imgAspect) {
              scaleFactor = this.zoomWidthRef / results.width;
              left = 0;
              top = -((results.height * scaleFactor) - this.zoomHeightRef) / 2;
            } else {
              scaleFactor = this.zoomHeightRef / results.height;
              top = 0;
              left = -((results.width * scaleFactor) - this.zoomWidthRef) / 2;
            }
          }
        });
        var option = {
          top: top,
          left: left,
          scaleX: scaleFactor,
          scaleY: scaleFactor,
          crossOrigin: 'anonymous',
          isFromServer: server_resource,
          stockphotodetail: item,
          uploadFrom: uploadSource,
          scaleMode: 'Scale Crop'
        }
        this.setBackground(option);
      }
    }
    else {
      return;
    }
    // var that = this;
    // fabric.Image.fromURL(this.props.canvasImage, function (img) {
    //     var patternSourceCanvas = new fabric.StaticCanvas();
    //     patternSourceCanvas.add(img);
    //     patternSourceCanvas.renderAll();
    //     var pattern = new fabric.Pattern({
    //         source: function () {
    //             patternSourceCanvas.setDimensions({
    //                 width: img.getWidth() * img.scaleX,
    //                 height: img.getHeight() * img.scaleY
    //             });
    //             patternSourceCanvas.renderAll();
    //             return patternSourceCanvas.getElement();
    //         },
    //         repeat: 'repeat'
    //     });
    //     that.canvas.add(new fabric.Polygon([
    //         { x: 0, y: 0 }, { x: that.zoomWidthRef, y: 0 }, { x: that.zoomWidthRef, y: that.zoomHeightRef }, { x: 0, y: that.zoomHeightRef }],
    //         {
    //             left: 0,
    //             top: 0,
    //             fill: pattern,
    //             objectCaching: false,
    //             selectable: false,
    //             evented: false
    //         }));
    // }, {
    //         width: this.props.backgroundWidth,
    //         height: this.props.backgroundHeight,
    //         crossOrigin: 'anonymous'
    //     });
  }
  getMeta(url): Promise<any> {
    return new Promise(resolve => {
      let that = this;
      var img = new Image();
      img.crossOrigin = 'anonymous';
      img.onerror = function () {
        setTimeout(() => {
          // that.utils.showError(ERROR.IMAGE_INTERNET_ERR, true, 5000);
        }, 500);
      }
      img.onload = function (image) {
        resolve({ 'height': img.height, 'width': img.width, 'src': img.src });
      };
      img.src = url;
    });
  }
  setBackground(option) {
    var self = this;
    if (option) {
      this.canvas.setBackgroundImage(this.props.canvasImage, function () {
        self.props.canvasFill = transparentColor;
        self.canvas.backgroundColor = self.props.canvasFill;
        self.canvas.remove(self.getElementById('pattern'));
        self.canvas.renderAll();
      }, option);
      this.isBgImg = true;
    }
  }
  changeScaleMode() {
    switch (this.props.scaleMode) {
      case 'Exact Fit':
        var isFromServer = this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer
        if (typeof isFromServer != 'undefined' && isFromServer != null && isFromServer != '') {

          this.setCanvasImage(this.backgroundStockPhoto, '', this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer);
        } else if (this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom) {

          this.setCanvasImage(this.backgroundStockPhoto, this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom);
        } else {

          this.setCanvasImage(this.backgroundStockPhoto);
        }
        break;
      case 'Maintain Aspect':
        var isFromServer = this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer
        if (typeof isFromServer != 'undefined' && isFromServer != null && isFromServer != '')
          this.setCanvasImage(this.backgroundStockPhoto, '', this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer);
        else if (this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom)
          this.setCanvasImage(this.backgroundStockPhoto, this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom);
        else
          this.setCanvasImage(this.backgroundStockPhoto);
        break;
      case 'No Scale':
        var isFromServer = this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer
        if (typeof isFromServer != 'undefined' && isFromServer != null && isFromServer != '')
          this.setCanvasImage(this.backgroundStockPhoto, '', this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer);
        else if (this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom)
          this.setCanvasImage(this.backgroundStockPhoto, this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom);
        else
          this.setCanvasImage(this.backgroundStockPhoto);
        break;
      case 'Scale Crop':
        var isFromServer = this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer
        if (typeof isFromServer != 'undefined' && isFromServer != null && isFromServer != '')
          this.setCanvasImage(this.backgroundStockPhoto, '', this.canvas.toJSON(this.custom_attributes).backgroundImage.isFromServer);
        else if (this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom)
          this.setCanvasImage(this.backgroundStockPhoto, this.canvas.toJSON(this.custom_attributes).backgroundImage.uploadFrom);
        else
          this.setCanvasImage(this.backgroundStockPhoto);
        break;
    }
  }

  public bgScrollLeft(): void {
    this.backgroundsTab.nativeElement.scrollLeft -= 100;
  }
  public bgScrollRight(): void {
    this.backgroundsTab.nativeElement.scrollLeft += 100;
  }
  setCategoryInCenter() { 
    setTimeout(() => {
      
      if (document.getElementsByClassName('new-active')[0]) {
        document.getElementsByClassName('new-active')[0].scrollIntoView({ behavior: "smooth", block: 'end', inline: 'center' });
      }
    }, 200);
  }


}
