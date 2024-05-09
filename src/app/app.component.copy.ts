import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { BASICSHAPELIST, CUSTOM_ATTRIBUTES, FILTERMATRIX, HOST, SHADOW_THEME, StickerType, TEXT_STATIC_COLORS, blendMode, editorTabs, layer_image_validation } from '../app/app.constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';
import { DataService } from './services/data.service';
import { UtilsService } from './services/utils.service';
var custom_attributes: any[] = CUSTOM_ATTRIBUTES;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('stickerTab', { read: ElementRef }) public stickerTab!: ElementRef<any>;

  public title = 'Flyers, Business Cards, Logo Maker, Resume Templates, Cover Letter';
  public designName: any = "Untitled Design";
  public canvas_container = "calc(100% - 665px)";
  public right_width = "240px";
  public canvas: any;
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

  ngOnDestroy() {
    document.removeEventListener("keydown", this.processKeys, false);
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
              // active selection needs a special treatment
              clonedObj.canvas = this.canvas;
              clonedObj.forEachObject((obj) => {
                obj.id = this.generateUniqueId();
                obj.cornerSize= 15,
                obj.cornerColor= '#00C3F9',
                obj.cornerStyle= 'circle',
                obj.transparentCorners= false,
                obj.excludeFromExport= false,
                obj.clipTo= null,
                obj.element_type='basicShape'
                this.canvas.add(obj);
                this.canvasObjectList.push(obj.toJSON(['class','id','isLocked','element_type']));
              });
              clonedObj.setCoords();
            } 
            else {
              clonedObj.element_type = activeObject.element_type;
              clonedObj.class = activeObject.class;
              clonedObj.isLocked = activeObject.isLocked;
              clonedObj._objects.forEach((subObj, index) => {
                if (activeObject._objects && activeObject._objects[index]) {
                  subObj.set({
                    id: activeObject._objects[index].id,
                  });
                }
              });
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
    let hoveredObject: any;
    localStorage.setItem('ut','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM4ODgsImlzcyI6Imh0dHBzOi8vdGVzdC5waG90b2Fka2luZy5jb20vYXBpL3B1YmxpYy9hcGkvZG9Mb2dpbkZvclVzZXIiLCJpYXQiOjE3MTQ3MzEzMDUsImV4cCI6MTcxNTMzNjEwNSwibmJmIjoxNzE0NzMxMzA1LCJqdGkiOiIzTW5WZjBVQ2NoZ0NuU2puIn0.9EI6njV--3VV2YipguvpNIStwWtKGK4_4Sbpm739rsg')

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
        
        const activeObject = this.canvas.getActiveObject();
        
        let activeObjectBottom = activeObject.top + (activeObject.height * activeObject.scaleY);
        let activeObjectRight = activeObject.left + (activeObject.width * activeObject.scaleX);
        
        if(activeObject.clipPath) {
          // console.log("if moving");
          if( activeObject.clipPath && this.whatLastLeft > activeObject.left && this.whatLastTop > activeObject.top && this.whatLastBottom < activeObjectBottom && this.whatLastRight < activeObjectRight ){
            // console.log("if if moving");
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
            // console.log("if else moving");
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
          // console.log("else moving");
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
        // activeObject.set({ left: 100, top: 100});
        // this.canvas.renderAll();

        // var obj = activeObject//e.target;
               
        // if (!obj.isScaling) {
        //   obj.initialScaleX = obj.scaleX;
        //   obj.initialScaleY = obj.scaleY;
        //   obj.initialLeft = obj.left;
        //   obj.initialTop = obj.top;
        //   obj.isScaling = true;  // Flag to indicate scaling has started
        // }
        // console.log(obj.scaleX, '--', obj.scaleY, "--", obj.top, "--", obj.left, "-- before");
        // // Constrain left position and scaling
        // if (obj.left > 150) {
        //   obj.scaleX = obj.initialScaleX;
        //   obj.scaleY = obj.initialScaleY;
        //   obj.left = 150;
        //   console.log(obj.scaleX, '--', obj.scaleY, "--", obj.top, "--", obj.left, "-- left");
        // }

        // // Constrain top position and scaling
        // if (obj.top > 130) {
        //   obj.scaleX = obj.initialScaleX;
        //   obj.scaleY = obj.initialScaleY;
        //   obj.top = 130;
        //   console.log(obj.scaleX, '--', obj.scaleY, "--", obj.top, "--", obj.left, "-- top");
        // }

        // // Constrain right edge position and scaling
        // if (obj.left + (obj.width * obj.scaleX) > 450) {
        //   obj.scaleX = obj.initialScaleX;
        //   obj.left = 450 - obj.width * obj.scaleX;
        //   console.log(obj.scaleX, '--', obj.scaleY, "--", obj.top, "--", obj.left, "-- right");
        // }

        // // Constrain bottom edge position and scaling
        // if (obj.top + (obj.height * obj.scaleY) > 530) {
        //   obj.scaleY = obj.initialScaleY;
        //   obj.top = 530 - obj.height * obj.scaleY;
        //   console.log(obj.scaleX, '--', obj.scaleY, "--", obj.top, "--", obj.left, "-- bottom");
        // }

      //     // // Disable scaling from the top-left corner by checking the corner
          
      //     // if (obj.__corner === 'tl' ) {
      //     // //   // obj.scaleX = obj.lastScaleX;
      //     // //   // obj.scaleY = obj.lastScaleY;
      //     // //   obj.scaleX = 0.31;
      //     // // obj.scaleY = 0.31;
      //     // //   obj.top = obj.lastTop;
      //     // //   obj.left = 10//obj.lastLeft;
      //     // //   obj.lockMovementY = true;

      //     // var newScaleX = obj.scaleX;
      //     //   obj.scaleX = obj.initialScaleX;
      //     //   var adjustX = (obj.width * newScaleX - obj.width * obj.scaleX) / obj.scaleX;

      //     //   obj.left = 10//obj.initialLeft - adjustX;
      //     //   console.log(obj.scaleX,'--',obj.scaleY,"--",obj.top,"--",obj.left,"-- after")
      //     // }
      //   } 
      // //   else {
          
      // //     obj.initialScaleX = obj.scaleX;
      // //     obj.initialScaleY = obj.scaleY;
      // //     obj.initialLeft = obj.left;
      // //     obj.initialTop = obj.top;
      // //     console.log(obj.scaleX,'--',obj.scaleY,"--",obj.top,"--",obj.left,"--else val after")
      // // }

      
        // console.log(obj.left,"-- left");
        // this.canvas.renderAll();

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
          // this.isObjectRotating = false;
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
              // this.setRotationSelStyle();
              break;
            default:
              // this.setRotationDefStyle();
              break;
          }
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
          // this.isReplaceShow = false;
          this.drawGrid(15);
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
        
        this.isReplaceShow = false;
        this.isReplaceMode = false;

        // if (e.target && e.target.type === 'image') {
          
          this.isCropingEnable = true;
          this.canvas.setBackgroundImage(null, this.canvas.renderAll.bind(this.canvas));
          this.canvas.backgroundColor = '#969ca33d';
          this.canvas.renderAll();
          const activeobject = this.canvas.getActiveObject();

          if (this.currentImg) {
            this.applyCropToImage(this.currentImg,activeobject);
          // }
        }
      }
    });
  }

  /* // apply crop to image
  addSelectionRect() {
    this.selectionRect = new fabric.Rect({
      fill: "rgba(0,0,0,0.3)",
      originX: "left",
      originY: "top",
      stroke: "black",
      opacity: 1,
      width: this.currentImg.width,
      height: this.currentImg.height,
      hasRotatingPoint: false,
      transparentCorners: false,
      cornerColor: "white",
      cornerStrokeColor: "black",
      borderColor: "black",
      cornerSize: 12,
      padding: 0,
      cornerStyle: "circle",
      borderDashArray: [5, 5],
      borderScaleFactor: 1.3,
      absolutePositioned: true,
    });

    this.selectionRect.scaleToWidth(300);
    this.canvas.centerObject(this.selectionRect);
    this.canvas.add(this.selectionRect);
    // this.canvas.moveTo(this.selectionRect, this.canvas.getObjects().indexOf(this.currentImg) + 1);
    // this.canvas.bringToFront(this.selectionRect);

    // Now set clipPath on the image after the rect is added
    // this.currentImg.clipPath = this.selectionRect;
    // this.canvas.renderAll();

    // this.canvas.on('mouse:down', (options) => {
      
    //   if (options.target.element_type === "stockphotos") {
    //     var index = this.canvas.getObjects().indexOf();
    //     this.selectionRect.moveTo(index);
    //     // this.canvas.bringToFront(options.target);
    //     // options.target.clipPath = this.selectionRect;
    //     this.canvas.renderAll();
    //   }
    // });

  } */

  applyCropToImage(image,activeobject) {
    this.canvas.off('mouse:down');
    this.canvas.off('selection:updated');
    this.canvas.off('mouse:up');
    console.log(this.canvas.toObject());

    var backgroundImg = new fabric.Image(image.getElement(), {
      left: this.getClippathleft - this.whatLeftDiff,
      top: this.getClippathtop - this.whatTopDiff,
      scaleX: image.scaleX,
      scaleY: image.scaleY,
      opacity: 0.3,
      selectable: true,
      stroke: '#0069ff',
      strokeWidth: 8,
    });

    backgroundImg.setCoords();
    this.canvas.add(backgroundImg);
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
      // lockMovementX: true,
      // lockMovementY: true,
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

    console.log(rect,"-- rect");
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
      });
      rect.setCoords();
      image.setCoords();
      image.clipPath = rect;
      
      if(this.canvas.getActiveObject().isCroped){
        this.canvas.remove(this.canvas.getActiveObject())
        console.log(image);
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
          console.log("clippath");
          if(posX > rect.left && posY > rect.top && posX < (rect.left + rect.width) && posY < (rect.top + rect.height)) {
            this.canvas.setActiveObject(image.clipPath);
            this.canvas.renderAll();
          }else if(e.target.element_type == 'stockphotos'){
            image.selectable = false;
            image.evented  =  false;
            this.canvas.setActiveObject(image.clipPath);
            this.canvas.renderAll();
          }
        }
        if (!e.target) {
          
          if (image.clipPath) {
            this.isCropingEnable = true;
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
              // this.canvas.add(newImage);

              // Remove clip path and background image (optional)
             backgroundImg.opacity = 0
             backgroundImg.selectable = false;
            //  image.opacity = 0
            //  image.selectable = false;
              // this.canvas.remove(backgroundImg);
              // this.canvas.remove(image);
              this.canvas.renderAll();
              console.log(this.canvas.toObject(),"-- crop on image");
            };

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
      'object:moving': (e) => {
        const clipPath = image.clipPath;
          clipPath.set({
            left: image.left,
            top: image.top,
          });
          clipPath.setCoords();
      }
    });

    image.on({
      'moving':  () => {
        console.log("Image ove");

        if(this.isCropingEnable){
          rect.lockMovementX =  true;
          rect.lockMovementY =  true;
          // image.lockMovementX = true
          // image.lockMovementY = true
          // backgroundImg.lockMovementX = true
          // backgroundImg.lockMovementY = true
        }
        
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

        if(!this.isCropingEnable){

        
        console.log("clippath moving");
        // const clipPath = image.clipPath;
        image.set({
          left: rect.left,
          top: rect.top,
        });
        image.setCoords();
        const clipPath = image.clipPath;
        clipPath.set({
          left: image.left,
          top: image.top,
        });
        clipPath.setCoords();
      }


      },
      'scaling': (e) => {
        
        const activeObject = this.canvas.getActiveObject();
        var obj = activeObject;
        let imageRight = image.left + (image.width * image.scaleX);
        let imageBottom = image.top + (image.height * image.scaleY);
        let rectRight = rect.left + rect.width;
        let rectBottom = rect.top + rect.height;

        if(obj.__corner == 'tl') {
          // console.log(image.left,"-- image.left --", rect.left,"--  rect.left --",image.top,"-- image.top --",rect.top,"-- rect.top --");
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
              // _controlsVisibility: {
              //   tl: true,
              //   tr: true,
              //   br: true,
              //   bl: false,
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
              //   br: true,
              //   bl: false,
              //   ml: false,
              //   mt: false,
              //   mr: false,
              //   mb: false,
              //   mtr: false
              // },
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

  activeTab(type) {
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
    console.log(this.canvas.toJSON()['objects']);
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
            stroke: shape.stroke,
            strokeDashArray: shape.strokeDashArray,
            clipTo: null,
            excludeFromExport: false,
            // strokeLineJoin: "round",
            // strokeMiterLimit: 8,
            strokeWidth: shape.strokeWidth,
            // touchCornerSize: 50,
            transparentCorners: false,
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
          borderColor: '#00C3F9',
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
            
            obj.class = activeObject._objects[index].class,
            obj.element_type = activeObject._objects[index].element_type,
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
      })
    }
    else if (this.activeTabID === 5) {
      this.stock_photo_list = [
        {
          "id": 8734968,
          "pageURL": "https:\/\/pixabay.com\/photos\/mandarin-duck-duck-waterbird-8734968\/",
          "type": "photo",
          "tags": "mandarin duck, duck, waterbird",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/15\/39\/mandarin-duck-8734968_150.jpg",
          "previewWidth": 150,
          "previewHeight": 100,
          "webformatURL": "https:\/\/pixabay.com\/get\/g3546787f1741a027a52756094fb67cb573859cf6865ce99d4939591675a0d95822e6d4e39538be5163f216c186766174_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 427,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g5435209be36192c47ba9541aad2cc8631deb178f0d8d939abbee3d21f7b6346243606f89ba7be1143169c480d69fc8dc0543a3e7973a85010bc7c6659f2d4301_1280.jpg",
          "imageWidth": 6000,
          "imageHeight": 4000,
          "imageSize": 4803739,
          "views": 828,
          "downloads": 774,
          "collections": 3,
          "likes": 33,
          "comments": 8,
          "user_id": 7998824,
          "user": "jggrz",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/28\/17-00-01-404_250x250.jpg"
      },
      {
          "id": 8730854,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-red-rose-flower-bloom-8730854\/",
          "type": "illustration",
          "tags": "ai generated, red, rose",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/04\/30\/19\/17\/ai-generated-8730854_150.png",
          "previewWidth": 150,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g9da5d966e311c5063c3052a651e0374546d52e8982811d67849cd24b75485d38c41388fa9f79aa5532eff73bd479a1b4_640.png",
          "webformatWidth": 640,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g6cf425ae55a9cbc214fdf8c53e5b22935f24f69653d77093c047179e730eb69d3023d32c7086e52f83dc5a0be102a1826c12d71ce1954b41bb7ca50eb29cbcd6_1280.png",
          "imageWidth": 3000,
          "imageHeight": 3000,
          "imageSize": 6211201,
          "views": 1708,
          "downloads": 1472,
          "collections": 4,
          "likes": 63,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
          "id": 8731445,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/puma-mountain-lion-predator-8731445\/",
          "type": "illustration",
          "tags": "puma, mountain lion, predator",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/01\/05\/44\/puma-8731445_150.jpg",
          "previewWidth": 150,
          "previewHeight": 87,
          "webformatURL": "https:\/\/pixabay.com\/get\/g0d42df147c43d122f1bd1008e4f3f71ef888d489017aa61ffebf8772f7ce37ae44ece8cd33995cbab5c97c49a3ba5a46_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 370,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g97b721ea703e7815d4159968c8e8e9ea7e6d6c3561845c1d08101f0cabf4844902f16d82abb0a8f5007db7f75fa11281f9a04b432b137e5fad73e5a860d5e998_1280.jpg",
          "imageWidth": 3994,
          "imageHeight": 2310,
          "imageSize": 1589718,
          "views": 598,
          "downloads": 490,
          "collections": 2,
          "likes": 49,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
          "id": 8735332,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-man-portrait-male-8735332\/",
          "type": "illustration",
          "tags": "ai generated, man, portrait",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/18\/13\/ai-generated-8735332_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g7f66507fd7d04facf2c87210ed8e21282df77f3eb66220df5d275d00ef3868dbd70115537e2dc7384729c203e5d1223b_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g344a47a79d8f5cc172ef1191e9017b24a48530ed08cf2f3475f6d8aeb2b94a03622e2b8dab1131ebe63f6bef94bf8c3018550a08a5397b246f5f2b7e76f14acb_1280.jpg",
          "imageWidth": 3344,
          "imageHeight": 5016,
          "imageSize": 2538849,
          "views": 331,
          "downloads": 265,
          "collections": 0,
          "likes": 39,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
          "id": 8735428,
          "pageURL": "https:\/\/pixabay.com\/vectors\/ai-generated-divider-separator-8735428\/",
          "type": "vector\/svg",
          "tags": "ai generated, divider, separator",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/19\/02\/ai-generated-8735428_150.png",
          "previewWidth": 150,
          "previewHeight": 75,
          "webformatURL": "https:\/\/pixabay.com\/get\/g2f357ac74d7cf2ba9053ea6a12a9160c9faca234134cccf9c15820b250a8ed83eb8ea611e7e7d881a777178169645155_640.png",
          "webformatWidth": 640,
          "webformatHeight": 320,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g76fdd7c700606b400fd3a79b71bdc97c86f0bcfacfeac26b221c71652789ec53ce1bc755b5880537832fe5cfedd80cd2e1dbcb9b9dc59e0b5b9c65c036ad82aa_1280.png",
          "imageWidth": 1920,
          "imageHeight": 960,
          "imageSize": 188437,
          "views": 419,
          "downloads": 342,
          "collections": 5,
          "likes": 35,
          "comments": 1,
          "user_id": 1086657,
          "user": "GDJ",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2015\/12\/02\/23-35-18-266_250x250.png"
      },
      {
          "id": 8729254,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-woman-lotus-pond-8729254\/",
          "type": "illustration",
          "tags": "ai generated, woman, lotus",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/04\/30\/04\/30\/ai-generated-8729254_150.jpg",
          "previewWidth": 150,
          "previewHeight": 86,
          "webformatURL": "https:\/\/pixabay.com\/get\/g674a8edf1d6eba14300a9589a84c59660996f116b4d3ac943f22f9cb34a385cbda893c92b60961e3ac9fea306a0b3e48_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 365,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g6d85959e3291b5f4097b4f73082c23edcf0cc735dcec9497b9f213204373e2317cb6e854a1920c8e496a34cf8425e84894c1f5179d077fc6a9c5020d0e88172e_1280.jpg",
          "imageWidth": 4048,
          "imageHeight": 2310,
          "imageSize": 1581260,
          "views": 952,
          "downloads": 758,
          "collections": 5,
          "likes": 61,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
          "id": 8736305,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-woman-beauty-8736305\/",
          "type": "illustration",
          "tags": "ai generated, woman, beauty",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/03\/06\/32\/ai-generated-8736305_150.jpg",
          "previewWidth": 150,
          "previewHeight": 85,
          "webformatURL": "https:\/\/pixabay.com\/get\/gdaffaa41aba3c7dd0634d51277fcd954460afa175dec97b629d1780f3bb3a3486a96481d03d3859fe59f7d75c5861a21_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 362,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g11efe143f19895fc218d350c859b3f745ae9d72a3511691745f3e86c3d9cecf53992a70cf8d40f6b378417df4d3efc79b7418a8bba69d0843acf460bacc2e11a_1280.jpg",
          "imageWidth": 4084,
          "imageHeight": 2310,
          "imageSize": 2032198,
          "views": 78,
          "downloads": 51,
          "collections": 0,
          "likes": 35,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
          "id": 8729255,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-woman-lotus-pond-8729255\/",
          "type": "illustration",
          "tags": "ai generated, woman, lotus",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/04\/30\/04\/32\/ai-generated-8729255_150.jpg",
          "previewWidth": 85,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g1684b97afc5e98057659917b77fd31d723297c0ae34592573a12ae08f7c33f8ee02bd2d7b31a0db0721fa98ba76282b6_640.jpg",
          "webformatWidth": 362,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g7f8a6a781299d33f6f6214058e706b8756131971c694c3571a55493ae09473648ae406c64c8e0cc7342f272b828f903f4d54cb7a8ab75fccc152cbf8f8cbdba6_1280.jpg",
          "imageWidth": 2310,
          "imageHeight": 4084,
          "imageSize": 1826732,
          "views": 889,
          "downloads": 722,
          "collections": 6,
          "likes": 58,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
          "id": 8733777,
          "pageURL": "https:\/\/pixabay.com\/photos\/mauereidechse-eidechse-reptil-8733777\/",
          "type": "photo",
          "tags": "mauereidechse, eidechse, reptil",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/06\/51\/mauereidechse-8733777_150.jpg",
          "previewWidth": 150,
          "previewHeight": 92,
          "webformatURL": "https:\/\/pixabay.com\/get\/g908c8b5683b23c349a7756628f5f8cc0d03ec32a83305a7b5d846ac0488782d0ed270235f122b0d9681ad2adabc6467a_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 391,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g7424e1a87572c49d3de0c2c506a91575e0ea92680548faeda279322bfdda8313220d2d804301191bf27330d899d312663eeb143199ffc0ef417fb4fc704318eb_1280.jpg",
          "imageWidth": 6000,
          "imageHeight": 3662,
          "imageSize": 3158048,
          "views": 656,
          "downloads": 609,
          "collections": 3,
          "likes": 38,
          "comments": 12,
          "user_id": 10084616,
          "user": "Nennieinszweidrei",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2022\/12\/04\/11-13-16-116_250x250.png"
      },
      {
          "id": 8728683,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/van-automobile-vacation-travel-8728683\/",
          "type": "illustration",
          "tags": "van, automobile, vacation",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/04\/29\/19\/01\/van-8728683_150.png",
          "previewWidth": 150,
          "previewHeight": 113,
          "webformatURL": "https:\/\/pixabay.com\/get\/g605928bc4efe0c2360d0bac277c1c5276ae160b5264195ad54eee53a0cdd5540ed1be3f18523949b63fe326890d0f165_640.png",
          "webformatWidth": 640,
          "webformatHeight": 480,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gd20fa9619cfd43fa19d441700afebfb6491d78532d2d3b68882ba1f948228a529736664cc5e6a77542ae1647bd8aa3df062232c881de5447c70c4b8d0effbb9f_1280.png",
          "imageWidth": 4032,
          "imageHeight": 3024,
          "imageSize": 7918794,
          "views": 1330,
          "downloads": 1168,
          "collections": 5,
          "likes": 65,
          "comments": 18,
          "user_id": 9214707,
          "user": "Mollyroselee",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/04\/16\/20-11-29-225_250x250.jpg"
      },
      {
          "id": 8733492,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-panda-bear-mammal-8733492\/",
          "type": "illustration",
          "tags": "ai generated, panda, bear",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/02\/57\/ai-generated-8733492_150.png",
          "previewWidth": 150,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g1febb2caa6386b4bac48765db6bc3f6409f9fa2c86b34c6f390c6eeb603681333722618d0c35586ff2b7dd015623ca38_640.png",
          "webformatWidth": 640,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g575dc80c242ad54449a1316fa8662c5dea277bfb25eab1efe0f50668272c2565e28df8bb8c0b010a63f5b42cf2931e6e7ee4cb94c1e0b85db1a29c26d7996d1b_1280.png",
          "imageWidth": 3000,
          "imageHeight": 3000,
          "imageSize": 7499467,
          "views": 477,
          "downloads": 435,
          "collections": 3,
          "likes": 38,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
          "id": 8732381,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/fish-nature-sea-underwater-ocean-8732381\/",
          "type": "illustration",
          "tags": "fish, nature, sea",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/01\/13\/36\/fish-8732381_150.jpg",
          "previewWidth": 110,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g5669957d3594dc8be88c6737d7c45b9ab25cd37dc9d35955216af97915c05a0f05dc48a8b5cefb3bb6c637e600b09156_640.jpg",
          "webformatWidth": 469,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g61f3e46e98166c7b2913ba2355d86538b9bf79dc39e3907b0ac926ce0752734e264ab68ccb42580f4a29a8ad863b2c9d44f83112de2fd2c089eb0bb6d08d2261_1280.jpg",
          "imageWidth": 3000,
          "imageHeight": 4096,
          "imageSize": 1015756,
          "views": 444,
          "downloads": 390,
          "collections": 8,
          "likes": 34,
          "comments": 10,
          "user_id": 17475707,
          "user": "flutie8211",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2023\/05\/21\/19-38-51-804_250x250.jpg"
      },
      {
          "id": 8721090,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/woman-flower-bloom-blossom-petals-8721090\/",
          "type": "illustration",
          "tags": "woman, flower, bloom",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/04\/26\/04\/38\/woman-8721090_150.jpg",
          "previewWidth": 85,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/g79c076ed3f9e9df8442f108ea7f89ccd948d280501224d3775716c20fb1e75e8147f5867bc9cda18e7ef55c26c99f29f_640.jpg",
          "webformatWidth": 362,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g13f9a3c0840f512ac8dda4af3251387ca63caeacffa4b54d839345889a87b0b015f47447a692499894f32f232cd09235665ece85e3512edfce00ad3e3708473a_1280.jpg",
          "imageWidth": 2310,
          "imageHeight": 4084,
          "imageSize": 2355987,
          "views": 2268,
          "downloads": 1716,
          "collections": 9,
          "likes": 91,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
          "id": 8735351,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-woman-portrait-girl-8735351\/",
          "type": "illustration",
          "tags": "ai generated, woman, portrait",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/18\/24\/ai-generated-8735351_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/gfd8c5c97eb94e3a0cca3f564eb2e2fe1728b1daf361989949a01b583317766e6ba1aca6c071080c94523d2b4f15b3014_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g04a93786687614475e3f3a485e0eaff1513b1a5ea91e03af58e754fa05e957ca4df34dac3b972acb55854242ea546382f0d715c99d2a7e04b20570890e6f21f3_1280.jpg",
          "imageWidth": 3344,
          "imageHeight": 5016,
          "imageSize": 2849820,
          "views": 315,
          "downloads": 273,
          "collections": 0,
          "likes": 39,
          "comments": 0,
          "user_id": 7673058,
          "user": "Ray_Shrewsberry",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
          "id": 8733989,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-cyborg-colleague-8733989\/",
          "type": "illustration",
          "tags": "ai generated, cyborg, colleague",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/02\/07\/16\/ai-generated-8733989_150.jpg",
          "previewWidth": 150,
          "previewHeight": 85,
          "webformatURL": "https:\/\/pixabay.com\/get\/g0b95289998f9ed538b7877586efafec049abb5719e3ab69a576e1fa6c02dcfff6d3a7280fcb48577f3d8c1dfb5272927_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 362,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gfa3e682f8b06fa36476d771ee75fc6de7a6bbf75c77ab1353ac6dfe768c9110fd1dfab505cd46aaca2e0c96ef519f9a8833230aea01eeadfca47d0d2d36a1e4e_1280.jpg",
          "imageWidth": 4084,
          "imageHeight": 2310,
          "imageSize": 1333833,
          "views": 381,
          "downloads": 309,
          "collections": 5,
          "likes": 34,
          "comments": 4,
          "user_id": 9301,
          "user": "geralt",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2022\/08\/25\/06-52-36-900_250x250.jpg"
      },
      {
          "id": 8737324,
          "pageURL": "https:\/\/pixabay.com\/photos\/sunflower-yellow-flower-organic-8737324\/",
          "type": "photo",
          "tags": "sunflower, flower wallpaper, beautiful flowers",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/03\/15\/54\/sunflower-8737324_150.jpg",
          "previewWidth": 100,
          "previewHeight": 150,
          "webformatURL": "https:\/\/pixabay.com\/get\/gb55a7eb8d6771e59e9bfc66dc866a1f8ac816762eb733a1122e7feefb0cce33746e9a4ebf45d2c5f274e8f1a7f502b05_640.jpg",
          "webformatWidth": 427,
          "webformatHeight": 640,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g626678abe6856a84fc10033c65b7a1f01822a18e9241a2538f40403abbfea817268bfe92b99dd3055daea2e830e9c2a2bcca16932bbd49a5015b09f67f7f44f8_1280.jpg",
          "imageWidth": 2430,
          "imageHeight": 3640,
          "imageSize": 1385896,
          "views": 239,
          "downloads": 207,
          "collections": 2,
          "likes": 31,
          "comments": 7,
          "user_id": 9214707,
          "user": "Mollyroselee",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/04\/16\/20-11-29-225_250x250.jpg"
      },
      {
          "id": 8726850,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-cocktail-beverages-8726850\/",
          "type": "illustration",
          "tags": "ai generated, cocktail, beverages",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/04\/29\/06\/13\/ai-generated-8726850_150.jpg",
          "previewWidth": 150,
          "previewHeight": 86,
          "webformatURL": "https:\/\/pixabay.com\/get\/g9d49f1182ab0731cd5240dc039befc95ad93c6ebfc68a9b8b7271fd720c99c6a46837575b419f1c968dace250ff33c7b_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 365,
          "largeImageURL": "https:\/\/pixabay.com\/get\/g877ff4714ade7ba1dbc0410090e4b46d4e2b18a87cdcd5586b58801760b5077d7273c8a7644b7ecd928dab49d33900a2bf79c6de7e1939a7cc4d37c1a80d2b27_1280.jpg",
          "imageWidth": 4054,
          "imageHeight": 2310,
          "imageSize": 1861709,
          "views": 1582,
          "downloads": 1269,
          "collections": 5,
          "likes": 62,
          "comments": 0,
          "user_id": 10327513,
          "user": "NickyPe",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
          "id": 8732538,
          "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-robin-songbird-plumage-8732538\/",
          "type": "illustration",
          "tags": "ai generated, robin, songbird",
          "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/01\/15\/40\/ai-generated-8732538_150.jpg",
          "previewWidth": 150,
          "previewHeight": 112,
          "webformatURL": "https:\/\/pixabay.com\/get\/ga5eab8e3fec1ffeb5319e462a8b02e7383fb02da76c2ec1749f4a3b9c5d58dc62a34a11c803c3f1187c8bca4b1f34a93_640.jpg",
          "webformatWidth": 640,
          "webformatHeight": 476,
          "largeImageURL": "https:\/\/pixabay.com\/get\/gd0c689d2277505c51b3713ed96cd49504cacc72ab89a14508d35c4c118060235d75cebb76dcd78239fccef8664c59415c97dd7bd0eb3b30c78258989ccbcb1a9_1280.jpg",
          "imageWidth": 4000,
          "imageHeight": 2972,
          "imageSize": 2628433,
          "views": 176,
          "downloads": 142,
          "collections": 1,
          "likes": 34,
          "comments": 3,
          "user_id": 32364022,
          "user": "beasternchen",
          "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/16-15-30-223_250x250.jpg"
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

}