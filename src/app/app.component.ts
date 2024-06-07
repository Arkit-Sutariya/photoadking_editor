import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fabric } from 'fabric';
import { BASICSHAPELIST, COLORS, CUSTOM_ATTRIBUTES, ERROR, FILTERMATRIX, GRADIENT_COLORS, HOST, SHADOW_THEME, StickerType, TEXT_DEFAULT_GRADIENT_COLORS, TEXT_STATIC_COLORS, add_elements_tab_index, add_image_tab_index, background_tab_index, blendMode, editorTabs, layer_image_validation, textart_tab_index, transparentColor } from '../app/app.constant';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as $ from 'jquery';
import { DataService } from './services/data.service';
import { UtilsService } from './services/utils.service';
import { ImageCropper, FabricCropListener } from './../assets/js/cropping.js';
import { BgRemoverToolComponent } from './bg-remover-tool/bg-remover-tool.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

var custom_attributes: any[] = CUSTOM_ATTRIBUTES;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('croppingArea', { static: true }) croppingAreaRef!: ElementRef;
  @ViewChild('stickerTab', { read: ElementRef }) public stickerTab!: ElementRef<any>;
  @ViewChild('backgroundsTab', { read: ElementRef }) public backgroundsTab!: ElementRef<any>;
  @ViewChild('collectionTab', { read: ElementRef }) public collectionTab!: ElementRef<any>;

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
  isBasicShapes: boolean = true;
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

  isStockPhotoList: any = false;
  stock_photo_list: any = [];
  stock_photo_response: any = {};
  stock_photo_itm_pr_pg: number = 200;
  collection_bg_list: any = [];
  collectionCatalog_list: any = [];
  isCollectionList: any = false;
  collection_catalog_id: any;
  collection_sub_tab_shown: any = true;
  sel_collection_catalog: any;
  isShapeStickerActive: boolean = false;
  sticker_sub_tab_shown: any = true;

  stock_photo_search_query: any = "";
  bg_stock_photo_search_query: any = "";
  collection_search_query: any = "";
  tmp_collection_search_query: any = "";
  bg_search_query: any = "";
  tmp_bg_search_query: any = "";
  stickers_search_query: any = "";
  tmp_stickers_search_query: any = "";
  templates_search_query: any = "";
  search_message: any = "";
  tmp_templates_search_query: any = "";
  
  templates_pg_count: number = 1;
  stickers_pg_count: number = 1;
  texts_pg_count: number = 1;
  txturs_bg_pg_count: number = 1;
  collection_pg_count: number = 1;
  stock_photo_pg_count: number = 1;
  userUpload_bg_pg_count: number = 1;
  threed_pg_count: any = 1;
  public isCroping: boolean = true;
  user_free: any = false;
  isSubEditorOpen: boolean = false;

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
  croppingType: string = '0:0';
  // croppingType: string = '1:1';
  // croppingType: string = '16:9';
  // croppingType: string = '9:16';
  // croppingType: string = '5:4';
  // croppingType: string = '4:5';
  cropSource: any;
  activeObjectonCanvas!: fabric.Object;
  bgCropImage: fabric.Object;
  snapAngles: number[] = [0, 45, 90, 135, 180, 225, 270, 315, 360];
  snapThreshold: number = 5;

  // Background Variable
  bg_sub_tab_shown: any = true;
  bgcolor: any = true;
  gradient: any = false;
  textures: any = false;
  images: any = false;
  bgMyPhotos: any = false;
  bgStockPhotos: any = false;
  bgSetting: any = false;
  isBgImg: any = false;
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

  // Tools Variable
  active_tool: any = "default";
  active_qr_tab: any = "content";
  QrCode: any;
  qr_data_object: any = [
    {
      "select_name": "URL",
      "image_path": "./assets/icons/url-icon.svg",
      "qr_data": ""
    },
    {
      "select_name": "Phone",
      "image_path": "./assets/icons/phone-icon.svg",
      "qr_data": ""
    },
    {
      "select_name": "Contact",
      "image_path": "./assets/icons/contact-icon.svg",
      "qr_data": {
        "name": "",
        "firstname": "",
        "organization": "",
        "email": "",
        "phone": "",
        "address": "",
        "website": ""
      }
    },
    {
      "select_name": "Free Text",
      "image_path": "./assets/icons/text-icon.svg",
      "qr_data": ""
    },
    {
      "select_name": "SMS",
      "image_path": "./assets/icons/sms-icon.svg",
      "qr_data": {
        "number": "",
        "message": ""
      }
    },
    {
      "select_name": "Email",
      "image_path": "./assets/icons/email-icon.svg",
      "qr_data": {
        "email": "",
        "subject": "",
        "body": ""
      }
    },
    {
      "select_name": "Wifi",
      "image_path": "./assets/icons/wifi-icon.svg",
      "qr_data": {
        "security": "none",
        "networkName": "",
        "password": ""
      }
    },
  ];
  active_qr_theme: any = {
    "background_color": "#ffffff",
    "foreground_color": "#000000"
  }
  active_qr_data: any = this.qr_data_object[0];
  edit_qr_id: any;
  edit_qr_status: any = false;
  qr_code_error: any = false;
  qr_field_error: any = "";
  qr_field_error_types: any = {
    "email_error": "",
    "phone_error": "",
    "url_error": ""
  }
  qr_theme_object: any = [
    {
      "background_color": "#ffffff",
      "foreground_color": "#000000"
    },
    {
      "background_color": "#adf0d1",
      "foreground_color": "#00203f"
    },
    {
      "background_color": "#f9dca4",
      "foreground_color": "#4a2b19"
    },
    {
      "background_color": "#ffc6d1",
      "foreground_color": "#3f343a"
    },
    {
      "background_color": "#f4f24e",
      "foreground_color": "#421d56"
    },
    {
      "background_color": "#fdfdfb",
      "foreground_color": "#82ae57"
    },
    {
      "background_color": "#fff6ca",
      "foreground_color": "#a00fcf"
    },
    {
      "background_color": "#befc5f",
      "foreground_color": "#3d3938"
    },
    {
      "background_color": "#ffff03",
      "foreground_color": "#019b8e"
    }
  ];
  barcode_data_object: any = [
    {
      "format": "CODE128",
      "image_path": "./assets/images/code128.svg",
    },
    {
      "format": "UPC",
      "image_path": "./assets/images/UPC.svg",
    },
    {
      "format": "EAN8",
      "image_path": "./assets/images/EAN8.svg",
    },
    {
      "format": "CODE39",
      "image_path": "./assets/images/CODE39.svg",
    },
    {
      "format": "ITF14",
      "image_path": "./assets/images/ITF14.svg",
    },
    {
      "format": "codabar",
      "image_path": "./assets/images/CODABAR.svg",
    }
  ];
  active_barcode_data: any = {
    "format": "CODE128",
    "image_path": "./assets/images/code128.svg"
  };
  barcode_option: any = {
    "display_value": true,
    "code_color": "#000000",
    "vertical_align": "bottom",
    "horizontal_align": "center",
    "font_margin": 2,
    "font_size": 20
  }
  JsBarcode: any;
  barcode_value: any = "";
  barcode_error: any = "";
  edit_barcode_status: any = false;
  edit_barcode_id: any = false;
  active_barcode_tab: any = "content";
  chart_workspace = false;
  active_chart_tab: any = "data";
  chart_type_select_object: any = [
    {
      "chart_type": "column",
      "name": "Bar Chart",
      "image_path": "./assets/icons/bar-chart-icon.svg",
    },
    {
      "chart_type": "bar",
      "name": "Raw Chart",
      "image_path": "./assets/icons/raw-chart-icon.svg",
    },
    {
      "chart_type": "line",
      "name": "Line Chart",
      "image_path": "./assets/icons/line-chart-icon.svg",
    },
    {
      "chart_type": "area",
      "name": "Area Chart",
      "image_path": "./assets/icons/area-chart-icon.svg",
    },
    {
      "chart_type": "pie",
      "name": "Pie Chart",
      "image_path": "./assets/icons/pie-chart-icon.svg",
    },
    {
      "chart_type": "doughnut",
      "name": "Doughnut Chart",
      "image_path": "./assets/icons/donut-chart-icon.svg",
    },
    {
      "chart_type": "semi-doughnut",
      "name": "Half Doughnut Chart",
      "image_path": "./assets/icons/half-pie.svg",
    },
    {
      "chart_type": "cylinder",
      "name": "3D Cylinder Chart",
      "image_path": "./assets/icons/cylinder-chart-icon.svg",
    },
    {
      "chart_type": "3d-doughnut",
      "name": "3D Doughnut Chart",
      "image_path": "./assets/icons/donut-3d-chart-icon.svg",
    },
  ]
  active_select_chart_type: any = {
    "chart_type": "column",
    "name": "Bar Chart",
    "image_path": "./assets/icons/bar-chart-icon.svg",
  };
  Chart: any;
  single_chart_data_set: any = [
    {
      "item_name": "item1",
      "data_set": ['10', '', '', '', '']
    },
    {
      "item_name": "item2",
      "data_set": ['20', '', '', '', '']
    },
    {
      "item_name": "item3",
      "data_set": ['30', '', '', '', '']
    },
    {
      "item_name": "item4",
      "data_set": ['40', '', '', '', '']
    },
    {
      "item_name": "",
      "data_set": ['', '', '', '', '']
    }
  ];
  multi_chart_data_set: any = [
    {
      "item_name": "item1",
      "data_set": ['0', '5', '5', '', '']
    },
    {
      "item_name": "item2",
      "data_set": ['8', '8', '4', '', '']
    },
    {
      "item_name": "item3",
      "data_set": ['15', '10', '5', '', '']
    },
    {
      "item_name": "item4",
      "data_set": ['18', '14', '8', '', '']
    },
    {
      "item_name": "item5",
      "data_set": ['22', '20', '8', '', '']
    },
    {
      "item_name": "",
      "data_set": ['', '', '', '', '']
    }
  ];
  chart_data_set: any;
  tmp_data_set: any;
  column_display_string = ["B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "AA", "AB", "AC", "AD", "AE", "AF", "AG", "AH", "AI", "AJ", "AK", "AL", "AM", "AN", "AO", "AP", "AQ", "AR", "AS", "AT", "AU", "AV", "AW", "AX", "AY", "AZ"];
  barcode_font_sizes: any = [];
  barcode_font_margins: any = [];
  chart_type: any = "bar";
  chart_color: any = [];
  chart_theme_object: any = [
    {
      "theme_color": ['#6fb572', '#369936', '#076d07', '#034403', '#326d32', '#057d7e', '#21b7b8', '#25e5e6', '#9ffeff', '#daffff']
    },
    {
      "theme_color": ['#ede7a4', '#d8cc5d', '#968806', '#6b5b00', '#7f7844', '#81a103', '#b7d930', '#d3ff24', '#e9ff92', '#f1fcc7']
    },
    {
      "theme_color": ['#eab19b', '#c6674a', '#a82f0b', '#7f1800', '#844f42', '#8c005c', '#c40f86', '#f228ad', '#fc5cc5', '#fc93d8']
    },
    {
      "theme_color": ['#f27e73', '#8fb5d6', '#acdea0', '#caabd3', '#999b84', '#fafcc2', '#21b7b8', '#e5d35f', '#aaf7f7', '#c0cfd0']
    },
    {
      "theme_color": ['#08172b', '#034c4e', '#839783', '#b3b398', '#eaeac7', '#a6f2e8', '#58baad', '#069683', '#356a63', '#12453e']
    },
    {
      "theme_color": ['#583d72', '#9f5f80', '#ffba93', '#ff8e71', '#fedf62', '#d7fe62', '#86fc73', '#6dffe9', '#6598ff', '#f77e9e']
    },
    {
      "theme_color": ['#6c6f39', '#f0b24f', '#bc5b06', '#89231a', '#5b0c05', '#cb3b3b', '#ff9f68', '#e0c45c', '#fff98c', '#f6f4ca']
    },
    {
      "theme_color": ['#8982a9', '#7563a5', '#502997', '#402578', '#24085f', '#5f0854', '#a11790', '#ea4ed7', '#fb90ee', '#f2c4ec']
    },
    {
      "theme_color": ['#97bdf6', '#68a0f2', '#1365e2', '#0f51b3', '#01758e', '#069aba', '#1cc0e4', '#73e3fb', '#c2f3fe', '#eafbff']
    },
    {
      "theme_color": ['#c6b39f', '#b6a87c', '#9e7f5f', '#3a291c', '#220f00', '#6c280e', '#a24927', '#d66f47', '#ffa37f', '#feccb8']
    },
    {
      "theme_color": ['#1b049b', '#c301b4', '#fc507a', '#fdd234', '#ff9234', '#d23060', '#27d9c0', '#d7e019', '#ba5f8e', '#8d0fd8']
    },
    {
      "theme_color": ['#d2d3c9', '#0e918c', '#f6830f', '#bb2205', '#e8b90c', '#554a4a', '#8644a7', '#66a37d', '#c8baba', '#f287b3']
    },
    {
      "theme_color": ['#f5b900', '#ee8100', '#a63856', '#871d40', '#220f00', '#330724', '#374045', '#e29814', '#ead869', '#feccb8']
    },
    {
      "theme_color": ['#f53e5e', '#f59691', '#f0c6a4', '#bec2a0', '#7caa95', '#00a7a0', '#a1d6b0', '#f5efcd', '#d1b992', '#bc3e61']
    },
    {
      "theme_color": ['#e9deb2', '#de522e', '#38413f', '#5cb793', '#eeffa2', '#dbfa3f', '#ff9351', '#de3c6a', '#263586', '#87b7f2']
    },
    {
      "theme_color": ['#000000', '#122138', '#01434c', '#5b2e00', '#383f00', '#193f00', '#0a2564', '#3f037d', '#52111f', '#db3e01']
    },
    {
      "theme_color": ['#2d3848', '#f43b4b', '#57c7da', '#e5ded6', '#e9ec68', '#f27551', '#8ba89f', '#8ddbf6', '#f66e8c', '#aba8b6']
    },
    {
      "theme_color": ['#faf6f2', '#e7dbc2', '#e2d3f3', '#ae95c0', '#9f59a0', '#6f498c', '#5d3b78', '#901d7a', '#6c205e', '#4c1041']
    },
    {
      "theme_color": ['#e8c3af', '#e9877e', '#f15a55', '#f01b07', '#ee0824', '#d00412', '#c4002f', '#900123', '#5c0519', '#34020d']
    },
    {
      "theme_color": ['#3b3c38', '#e4c500', '#4d7dc2', '#c94cbe', '#c6723b', '#c96e7b', '#fbc17b', '#395a87', '#c6704b', '#50c0e9']
    },
    {
      "theme_color": ['#2c307a', '#15499f', '#e2d3f3', '#0c4e42', '#336a33', '#827830', '#f58020', '#d8570a', '#3e2622', '#202020']
    }
  ];
  chart_type_data_object: any = [
    {
      "chart_type": "column",
      "valid_chart_type": "column",
      "type_name": "Bar Chart",
      "type_object": [
        {
          "image_path": "./assets/images/bar-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/bar-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/bar-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "stackedbar",
      "valid_chart_type": "column",
      "type_name": "Stacked Bar Chart",
      "type_object": [
        {
          "image_path": "./assets/images/bar_step-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/bar_step-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/bar_step-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "bar",
      "valid_chart_type": "bar",
      "type_name": "Raw Chart",
      "type_object": [
        {
          "image_path": "./assets/images/raw-bar-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/raw-bar-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/raw-bar-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "stackedrow",
      "valid_chart_type": "bar",
      "type_name": "Stacked Raw Chart",
      "type_object": [
        {
          "image_path": "./assets/images/raw-bar-step-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/raw-bar-step-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/raw-bar-step-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "line",
      "valid_chart_type": "line",
      "type_name": "Line Chart",
      "type_object": [
        {
          "image_path": "./assets/images/S_line-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/S_line-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/S_line-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "stackedline",
      "valid_chart_type": "line",
      "type_name": "Stacked Line Chart",
      "type_object": [
        {
          "image_path": "./assets/images/M_line-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/M_line-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/M_line-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "area",
      "valid_chart_type": "area",
      "type_name": "Stacked Area Chart",
      "type_object": [
        {
          "image_path": "./assets/images/area-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/area-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/area-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "pie",
      "valid_chart_type": "pie",
      "type_name": "Pie Chart",
      "type_object": [
        {
          "image_path": "./assets/images/pie-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/pie-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/pie-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "doughnut",
      "valid_chart_type": "doughnut",
      "type_name": "Doughnut Chart",
      "type_object": [
        {
          "image_path": "./assets/images/donut-1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/donut-2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/donut-3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "semi-doughnut",
      "valid_chart_type": "semi-doughnut",
      "type_name": "Half Doughnut Chart",
      "type_object": [
        {
          "image_path": "./assets/images/half_donut_1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/half_donut_2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/half_donut_3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "cylinder",
      "valid_chart_type": "cylinder",
      "type_name": "3D Cylinder Chart",
      "type_object": [
        {
          "image_path": "./assets/images/cylinder_1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/cylinder_2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/cylinder_3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "3d-doughnut",
      "valid_chart_type": "3d-doughnut",
      "type_name": "3D Doughnut Chart",
      "type_object": [
        {
          "image_path": "./assets/images/doughnut_3d_1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/doughnut_3d_2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/doughnut_3d_3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    },
    {
      "chart_type": "solidgauge",
      "valid_chart_type": "solidgauge",
      "type_name": "Guage Chart",
      "is_new": true,
      "type_object": [
        {
          "image_path": "./assets/images/solidgauge_1.svg",
          "color_array": this.chart_theme_object[0]
        },
        {
          "image_path": "./assets/images/solidgauge_2.svg",
          "color_array": this.chart_theme_object[1]
        },
        {
          "image_path": "./assets/images/solidgauge_3.svg",
          "color_array": this.chart_theme_object[2]
        }
      ]
    }
  ];
  chart_template_json = [
    {
      "chart_type_index": 0,
      "active_chart_type_index": 0,
      "active_theme_index": 1,
      "is_new_chart": true,
      "chart_type": {
        "type": 'gauge',
        "is_new": true
      },
      "chart_data_set": [
        {
          item_name: "React",
          data_set: ["24640", "", "", "", ""]
        },
        {
          item_name: "Angular",
          data_set: ["19032", "", "", "", ""]
        },
        {
          item_name: "jQuery",
          data_set: ["14272", "", "", "", ""]
        },
        {
          item_name: "Vue",
          data_set: ["2816", "", "", "", ""]
        },
        {
          item_name: "Ember",
          data_set: ["2397", "", "", "", ""]
        },
        {
          item_name: "",
          data_set: ["", "", "", "", ""]
        }
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "is_new_chart": true,
        "title_setting": {
          "show_title": true,
          "solid_guage_title_name": "Speed",
          "guage_title_name": "Speedometer",
          "wordcloud_title_name": "What is wordcloud?",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 18,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          }
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 14,
          "font_color": "#000000",
          "font_style": {
            "bold": "bold",
            "italic": "none",
            "underline": "none"
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_ticks": true,
          "tick_color": "#ffffff",
          "show_grid_lines": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 12,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "solidgauge_settings": {
          "percent_value": true,
          "range_settings": {
            "min_value": 0,
            "max_value": 200,
            "steps": 1,
            "value": 120,
            "prefix": "",
            "suffix": "km/h",
            "color_stops": [
              {
                "value": 40,
                "color": "#6fb572"
              },
              {
                "value": 80,
                "color": "#369936"
              },
              {
                "value": 120,
                "color": "#076d07"
              },
              {
                "value": 160,
                "color": "#034403"
              }
            ],
            "last_stop_color": "#326d32"
          },
          "axis_setting": {
            "show_label": true,
            "color": "#000000"
          }
        },
        "gauge_settings": {
          "percent_value": true,
          "range_settings": {
            "min_value": 0,
            "max_value": 200,
            "steps": 1,
            "value": 120,
            "prefix": "",
            "suffix": "km/h",
            "color_stops": [
              {
                "value": 40,
                "color": "#6fb572"
              },
              {
                "value": 80,
                "color": "#369936"
              },
              {
                "value": 120,
                "color": "#076d07"
              },
              {
                "value": 160,
                "color": "#034403"
              }
            ],
            "last_stop_color": "#326d32"
          }
        },
        "wordcloud_setting": {
          "text": ""
        }
      },
      "image_path": "./assets/chart_templates/gauge_chart.jpg"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 0,
      "active_theme_index": 11,
      "is_new_chart": true,
      "chart_type": {
        "type": 'wordcloud',
        "is_new": true
      },
      "chart_data_set": [
        {
          item_name: "React",
          data_set: ["24640", "", "", "", ""]
        },
        {
          item_name: "Angular",
          data_set: ["19032", "", "", "", ""]
        },
        {
          item_name: "jQuery",
          data_set: ["14272", "", "", "", ""]
        },
        {
          item_name: "Vue",
          data_set: ["2816", "", "", "", ""]
        },
        {
          item_name: "Ember",
          data_set: ["2397", "", "", "", ""]
        },
        {
          item_name: "",
          data_set: ["", "", "", "", ""]
        }
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "is_new_chart": true,
        "title_setting": {
          "show_title": false,
          "solid_guage_title_name": "Speed",
          "guage_title_name": "Speedometer",
          "wordcloud_title_name": "What is wordcloud?",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "25",
          "font_color": "#c732e4",
          "font_style": {
            "bold": "bold",
            "italic": "none",
            "underline": "none"
          }
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "30px",
          "font_color": "#000000",
          "font_style": {
            "bold": "bold",
            "italic": "none",
            "underline": "none"
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_ticks": true,
          "tick_color": "#ffffff",
          "show_grid_lines": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "solidgauge_settings": {
          "percent_value": true,
          "range_settings": {
            "min_value": 0,
            "max_value": 200,
            "steps": 1,
            "value": 120,
            "prefix": "",
            "suffix": "km/h",
            "color_stops": [
              {
                "value": 40,
                "color": "#1b049b"
              },
              {
                "value": 80,
                "color": "#c301b4"
              },
              {
                "value": 120,
                "color": "#fc507a"
              },
              {
                "value": 160,
                "color": "#fdd234"
              }
            ],
            "last_stop_color": "#ff9234"
          },
          "axis_setting": {
            "show_label": true,
            "color": "#000000"
          }
        },
        "gauge_settings": {
          "percent_value": true,
          "range_settings": {
            "min_value": 0,
            "max_value": 200,
            "steps": 1,
            "value": 120,
            "prefix": "",
            "suffix": "km/h",
            "color_stops": [
              {
                "value": 40,
                "color": "#1b049b"
              },
              {
                "value": 80,
                "color": "#c301b4"
              },
              {
                "value": 120,
                "color": "#fc507a"
              },
              {
                "value": 160,
                "color": "#fdd234"
              }
            ],
            "last_stop_color": "#ff9234"
          }
        },
        "wordcloud_setting": {
          "text": "Bachelor of Science\ntelemetry\ncommunication\ntech-savvy\ndigerati\ninformation technology\ntelematics\naerospace\nelectrotechnology\nmodern\ntelepresence\nappropriate technology\ncomputer graphics\nedtech\nsophisticated\nsci-tech\nM.S.\nVoice over Internet Protocol\nCDT\nchemical engineering\nleading edge\ntelehealth\nseat-of-the-pants\nmetallurgy\ncomputery\nagrotechnology\nintermediate technology\n4G\nCMOS\nlow tech\ntechnic\nearly adopter\ntechnical college\ncyberbabe\ntechnically\nfuturology\nsolid-state\ndigital native\nbioengineering\nPET scanner\nthird-generation\nground control\nCTO\nprimitive\nsunrise\nTMT\nplatform\ntechno\nimagineer\ndeskill\ngadgetry\nSilicon Valley\nDSL\ncybernetics\norphan\nlate adopter\nwearable\nlow technology\ntechnostress\naugmented reality\nmaglev\ncontactless\nupgrade\nm-\ngeeky\npostindustrial\ntechnophobia\nLuddite\nradio\n3G\nup-to-date\ntechnocomplex\nmodernize\ntechnoculture\nthe digerati\nlead\nSilicon Alley\nmegatechnics\nclimate engineering"
        }
      },
      "image_path": "./assets/chart_templates/wordcloud.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 0,
      "active_theme_index": 6,
      "chart_data_set": [
        {
          item_name: "React",
          data_set: ["24640", "", "", "", ""]
        },
        {
          item_name: "Angular",
          data_set: ["19032", "", "", "", ""]
        },
        {
          item_name: "jQuery",
          data_set: ["14272", "", "", "", ""]
        },
        {
          item_name: "Vue",
          data_set: ["2816", "", "", "", ""]
        },
        {
          item_name: "Ember",
          data_set: ["2397", "", "", "", ""]
        },
        {
          item_name: "",
          data_set: ["", "", "", "", ""]
        }
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "Dec 2018 Job Board Postings Per Framework",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "24",
          "font_color": "#191919",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/bar_chart_6.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 0,
      "active_theme_index": 14,
      "chart_data_set": [
        { item_name: "2007", data_set: ["130", "", "", "", ""] },
        { item_name: "2008", data_set: ["131", "", "", "", ""] },
        { item_name: "2010", data_set: ["145", "", "", "", ""] },
        { item_name: "2011", data_set: ["197", "", "", "", ""] },
        { item_name: "2012", data_set: ["197", "", "", "", ""] },
        { item_name: "2013", data_set: ["200", "", "", "", ""] },
        { item_name: "2014", data_set: ["372", "", "", "", ""] },
        { item_name: "2015", data_set: ["551", "", "", "", ""] },
        { item_name: "2016", data_set: ["594", "", "", "", ""] },
        { item_name: "2017", data_set: ["282", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] }
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "PATENT APPLICATION FOR MACHINE LEARNING(2007 - 2017)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "24",
          "font_color": "#191919",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "",
          "font_color": "#ffffff",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },

      "image_path": "./assets/chart_templates/bar_chart_1_5.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 0,
      "active_theme_index": 9,
      "chart_data_set": [
        { item_name: "Rust", data_set: ["73.8", "79.1", "73.1", "78.9", "83.5", ""] },
        { item_name: "Kotlin", data_set: ["0", "0", "0", "75.1", "72.6", ""] },
        { item_name: "Python", data_set: ["66.6", "62.5", "62.7", "68.0", "73.1", ""] },
        { item_name: "Go", data_set: ["72.5", "68.7", "63.3", "65.6", "67.9", ""] },
        { item_name: "Swift", data_set: ["77.6", "72.1", "63.9", "65.1", "69.2", ""] },
        { item_name: "", data_set: ["", "", "", "", "", ""] }
      ],
      "chart_legend_label": ["2015", "2016", "2017", "2018", "2019", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "LOVED AND WANTED LANGUAGES (2015 - 19)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#ffffff",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/stacked_bar_9.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 0,
      "active_theme_index": 7,
      "chart_data_set": [
        { item_name: "Singapore", data_set: ["4.6", "4.92", "", "", ""] },
        { item_name: "Malaysia", data_set: ["25", "25.28", "", "", ""] },
        { item_name: "Thailend", data_set: ["51", "57", "", "", ""] },
        { item_name: "Vietnam", data_set: ["62", "64", "", "", ""] },
        { item_name: "Indonesia", data_set: ["150", "150", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] }
      ],
      "chart_legend_label": ["Internal Users", "Social Media Users", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "Digital Population, In millions, by Country, South East Asia, January 2019",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#ffffff",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/stacked_bar_1_7.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 1,
      "active_theme_index": 17,
      "chart_data_set": [
        { item_name: "JavaScript", data_set: ["40", "", "", "", ""] },
        { item_name: "SQL", data_set: ["33", "", "", "", ""] },
        { item_name: "Java", data_set: ["31", "", "", "", ""] },
        { item_name: "HTML/CSS", data_set: ["20", "", "", "", ""] },
        { item_name: ".Net/C#", data_set: ["12", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] }
      ],
      "chart_legend_label": [""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "THE TOP 5 LANGUAGES TESTED ON DEVSKILLER(%)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#ffffff",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/raw_chart_17.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 1,
      "active_theme_index": 21,
      "chart_data_set": [
        { item_name: "2015", data_set: ["15.41", "", "", "", ""] },
        { item_name: "2016", data_set: ["17.68", "", "", "", ""] },
        { item_name: "2017", data_set: ["20.35", "", "", "", ""] },
        { item_name: "2018", data_set: ["23.14", "", "", "", ""] },
        { item_name: "2019", data_set: ["26.66", "", "", "", ""] },
        { item_name: "2020", data_set: ["30.73", "", "", "", ""] },
        { item_name: "2021", data_set: ["35.82", "", "", "", ""] },
        { item_name: "2022", data_set: ["42.62", "", "", "", ""] },
        { item_name: "2023", data_set: ["51.11", "", "", "", ""] },
        { item_name: "2024", data_set: ["62.12", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] }
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "IOT Connected Devices installed base worldwide from 2015 - 25 (in billions)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/raw_chart_1_21.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 1,
      "active_theme_index": 12,
      "chart_data_set": [
        { item_name: "MongoDB", data_set: ["20.8", "18.6", "17.8", "19.4", "", ""] },
        { item_name: "SQL Server", data_set: ["4.6", "4.2", "3.3", "3.7", "", ""] },
        { item_name: "My SQL", data_set: ["8.5", "7.5", "8.2", "9.0", "", ""] },
        { item_name: "SQLite", data_set: ["7.2", "3.3", "7.2", "7.7", "", ""] },
        { item_name: "Oracle", data_set: ["3.8", "2.3", "3.4", "4.2", "", ""] },
        { item_name: "", data_set: ["", "", "", "", "", ""] },
      ],
      "chart_legend_label": ["2017", "2018", "2019", "2020", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "MOST WANTED DATABASES(2017- 20)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/stacked_raw_chart_12.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 1,
      "active_theme_index": 21,
      "chart_data_set": [
        { item_name: "Voice Assistent", data_set: ["65", "74", "", "", ""] },
        { item_name: "Natural Language Processing", data_set: ["37", "56", "", "", ""] },
        { item_name: "Text Recognition", data_set: ["45", "55", "", "", ""] },
        { item_name: "Computer Vision", data_set: ["38", "46", "", "", ""] },
        { item_name: "Drons", data_set: ["48", "46", "", "", ""] },
        { item_name: "Gaming Console", data_set: ["28", "35", "", "", ""] },
        { item_name: "Ride Hailing Apps", data_set: ["21", "31", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] }
      ],
      "chart_legend_label": ["General Population", "Tech Executives", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "Do People Know Where AI Is Used?",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#ffffff",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/stacked_raw_char_1_21.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 2,
      "active_theme_index": 13,
      "chart_data_set": [
        { item_name: "2016", data_set: ["88498", "", "", "", ""] },
        { item_name: "2017", data_set: ["122613", "", "", "", ""] },
        { item_name: "2018", data_set: ["192568", "", "", "", ""] },
        { item_name: "2019", data_set: ["252870", "", "", "", ""] },
        { item_name: "2020", data_set: ["220011", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "NPM TRENDS FOR ANGULAR(2016 - 20)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/line_chart_13.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 2,
      "active_theme_index": 11,
      "chart_data_set": [
        { item_name: "2016", data_set: ["88498", "283190", "", "", ""] },
        { item_name: "2017", data_set: ["122613", "522045", "", "", ""] },
        { item_name: "2018", data_set: ["192568", "1215580", "", "", ""] },
        { item_name: "2019", data_set: ["252870", "2364403", "", "", ""] },
        { item_name: "2020", data_set: ["423695", "5944193", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": ["Angular", "React", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "NPM TRENDS BETWEEN ANGULAR & REACT",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/stacked_line_chart_1_11.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 3,
      "active_theme_index": 3,
      "chart_data_set": [
        { item_name: "2016", data_set: ["283190", "", "", "", ""] },
        { item_name: "2017", data_set: ["522045", "", "", "", ""] },
        { item_name: "2018", data_set: ["1215580", "", "", "", ""] },
        { item_name: "2019", data_set: ["2364403", "", "", "", ""] },
        { item_name: "2020", data_set: ["3258303", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "NPM TRENDS FOR REACT(2016 - 20)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/area_chart_3.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 3,
      "active_theme_index": 20,
      "chart_data_set": [
        { item_name: "2014", data_set: ["2.28", "0.63", "0.9", "", ""] },
        { item_name: "2015", data_set: ["3.02", "0.82", "1.07", "", ""] },
        { item_name: "2016", data_set: ["3.96", "1.1", "1.32", "", ""] },
        { item_name: "2017", data_set: ["5.24", "1.5", "1.64", "", ""] },
        { item_name: "2018", data_set: ["7.04", "0.82", "2.03", "", ""] },
        { item_name: "2020", data_set: ["12.84", "4.18", "3.17", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] }
      ],
      "chart_legend_label": ["Consumer", "Business: Cross Industry", "Business: Vertical Specific", "", ""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "IOT Units Installed Base By Category 2014 to 2020(in billions of units)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/stacked_area_chart_20.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 4,
      "active_theme_index": 17,
      "chart_data_set": [
        { item_name: "2016", data_set: ["368902", "", "", "", ""] },
        { item_name: "2017", data_set: ["491327", "", "", "", ""] },
        { item_name: "2018", data_set: ["1168541", "", "", "", ""] },
        { item_name: "2019", data_set: ["1200381", "", "", "", ""] },
        { item_name: "2020", data_set: ["1513712", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": [""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "NPM TRENDS FOR JQUERY(2016 - 20)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/pie_chart_2.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 4,
      "active_theme_index": 12,
      "chart_data_set": [
        { item_name: "Homepage/Newsfeed", data_set: ["27", "", "", "", ""] },
        { item_name: "Profiles", data_set: ["21", "", "", "", ""] },
        { item_name: "Photos", data_set: ["17", "", "", "", ""] },
        { item_name: "Apps & Tools", data_set: ["10", "", "", "", ""] },
        { item_name: "All Other", data_set: ["25", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": [""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "U.S. Share of Time Spent on Facebook.com by Content Section(2011)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/pie_chart_1_12.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 5,
      "active_theme_index": 10,
      "chart_data_set": [
        { item_name: "2017", data_set: ["1135", "", "", "", ""] },
        { item_name: "2018", data_set: ["1071", "", "", "", ""] },
        { item_name: "2019", data_set: ["1411", "", "", "", ""] },
        { item_name: "2020", data_set: ["2748", "", "", "", ""] },
        { item_name: "2021", data_set: ["4704", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": [""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "NPM TRENDS FOR NODEJS(2017 - 21)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/doughnut_chart_10.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 5,
      "active_theme_index": 13,
      "chart_data_set": [
        { item_name: "Facebook", data_set: ["38", "", "", "", ""] },
        { item_name: "Twitter", data_set: ["25", "", "", "", ""] },
        { item_name: "LinkedIn", data_set: ["15", "", "", "", ""] },
        { item_name: "Google+", data_set: ["14", "", "", "", ""] },
        { item_name: "Pinterest", data_set: ["8", "", "", "", ""] },
        { item_name: "", data_set: ["", "", "", "", ""] },
      ],
      "chart_legend_label": [""],
      "chart_settings": {
        "title_setting": {
          "show_title": true,
          "title_name": "Favourite Social Media Channel In 2013",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 22,
          "font_color": "#080808",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "horizontal_align": "center",
          "vertical_align": "top",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'bold',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": '1',
          "slice_value": 'none',
          'doughnut_circle_size': 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "14",
          "font_color": "#000000",
          "font_style": {
            "bold": 'normal',
            "italic": 'none',
            "underline": 'none'
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 15,
          "beta_value": 15,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/doughnut_chart_1_4.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 6,
      "active_theme_index": 15,
      "chart_data_set": [
        {
          "item_name": "0-24",
          "data_set": [
            "14",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "25-34",
          "data_set": [
            "18",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "35-44",
          "data_set": [
            "22",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "45 +",
          "data_set": [
            "46",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "",
          "data_set": [
            "",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "",
          "data_set": [
            "",
            "",
            "",
            "",
            ""
          ]
        }
      ],
      "chart_legend_label": [""],
      "chart_settings": {
        "is_new_chart": false,
        "title_setting": {
          "show_title": true,
          "title_name": "User of Facebook that fall into various age groups",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 25,
          "font_color": "#000000",
          "font_style": {
            "bold": "bold",
            "italic": "none",
            "underline": "none"
          },
          "horizontal_align": "center",
          "vertical_align": "top"
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 14,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "square"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 14,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": "%"
          }
        },
        "pie_label_setting": {
          "format_value": "value",
          "connector_thick": "1",
          "slice_value": "none",
          "doughnut_circle_size": 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 45,
          "beta_value": 0,
          "depth_value": 50
        }
      },
      "image_path": "./assets/chart_templates/semi_doughnut_chart.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 7,
      "active_theme_index": 11,
      "chart_data_set": [
        {
          "item_name": "2017",
          "data_set": [
            "24.12",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2018",
          "data_set": [
            "24.6",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2019",
          "data_set": [
            "25",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2020",
          "data_set": [
            "25.35",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2021",
          "data_set": [
            "27.88",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2022",
          "data_set": [
            "29.23",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2023",
          "data_set": [
            "30.29",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2024",
          "data_set": [
            "31.22",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "2025",
          "data_set": [
            "32.07",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "",
          "data_set": [
            "",
            "",
            "",
            "",
            ""
          ]
        }
      ],
      "chart_legend_label": ["item1", "", "", "", ""],
      "chart_settings": {
        "is_new_chart": false,
        "title_setting": {
          "show_title": true,
          "title_name": "Number of social network user in Canada from 2017 to 2025 (in millions)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 23,
          "font_color": "#000000",
          "font_style": {
            "bold": "bold",
            "italic": "none",
            "underline": "none"
          },
          "horizontal_align": "center",
          "vertical_align": "top"
        },
        "legend_setting": {
          "show_legend": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 13,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": "1",
          "slice_value": "none",
          "doughnut_circle_size": 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 13,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": false,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 13,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": true,
          "alpha_value": 21,
          "beta_value": 15,
          "depth_value": 53,
          "enabled_threed": true
        }
      },
      "image_path": "./assets/chart_templates/cylinder.png"
    },
    {
      "chart_type_index": 0,
      "active_chart_type_index": 8,
      "active_theme_index": 1,
      "chart_color": ['#FE0000', '#FF00FE', '#FFFF01', '#4867AA', '#326d32', '#057d7e', '#21b7b8', '#25e5e6', '#9ffeff', '#daffff'],
      "chart_data_set": [
        {
          "item_name": "YouTube",
          "data_set": [
            "30.7",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "Instagram",
          "data_set": [
            "26.0",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "SnapChat",
          "data_set": [
            "24.9",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "Facebook",
          "data_set": [
            "18.4",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "",
          "data_set": [
            "",
            "",
            "",
            "",
            ""
          ]
        },
        {
          "item_name": "",
          "data_set": [
            "",
            "",
            "",
            "",
            ""
          ]
        }
      ],
      "chart_legend_label": [],
      "chart_settings": {
        "is_new_chart": false,
        "title_setting": {
          "show_title": true,
          "title_name": "Social Media usage among teens (ages 13-17)",
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 23,
          "font_color": "#000000",
          "font_style": {
            "bold": "bold",
            "italic": "none",
            "underline": "none"
          },
          "horizontal_align": "center",
          "vertical_align": "top"
        },
        "legend_setting": {
          "show_legend": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 13,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "horizontal_align": "center",
          "vertical_align": "bottom",
          "symbol_type": "circle"
        },
        "label_setting": {
          "show_label": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": 14,
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "pie_label_setting": {
          "format_value": "percent",
          "connector_thick": 4,
          "slice_value": "none",
          "doughnut_circle_size": 50
        },
        "X_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "Y_AXIS_setting": {
          "show_label": true,
          "show_grid_lines": true,
          "font_family": "Roboto-Regular",
          "font_path": "",
          "font_size": "13",
          "font_color": "#000000",
          "font_style": {
            "bold": "normal",
            "italic": "none",
            "underline": "none"
          },
          "label_position": "center",
          "label_values": {
            "prefix": "",
            "suffix": ""
          }
        },
        "threed_chart_settings": {
          "enable_threed": false,
          "alpha_value": 45,
          "beta_value": 0,
          "depth_value": 50,
          "enabled_threed": true
        }
      },
      "image_path": "./assets/chart_templates/doughnut_threed.png"
    },
  ];
  select_chart_type: any;
  multiCell: any;
  myChart: any;
  reeditChartId: any = null;
  emptyChartData = false;
  edit_chart_status = false;
  active_theme_index: any;
  chart_settings: any = {
    "title_setting": {
      "show_title": true,
      "title_name": "My Chart",
      "font_family": "Roboto-Regular",
      "font_path": "",
      "font_size": 25,
      "font_color": "#000000",
      "font_style": "normal",
      "title_position": "top"
    },
    "legend_setting": {
      "show_legend": true,
      "font_family": "Roboto-Regular",
      "font_path": "",
      "font_size": 16,
      "font_color": "#000000",
      "font_style": "normal",
      "legend_align": "center",
      "legend_position": "top"
    },
    "label_setting": {
      "show_label": true,
      "font_family": "Roboto-Regular",
      "font_path": "",
      "font_size": 20,
      "font_color": "#000000",
      "font_style": "normal",
      "label_position": "center"
    },
  };
  last_chart_setting: any = "title";
  //This variable is use for check data is imported in chart or not.
  import_data_chart_status: any = false;
  clone_chart_object: any;
  XLSX: any;
  render_chart_object: any = [];
  render_chart_index: any = 0;
  //In this variable we store the json object which come when page come for reedit and used in chart for set chart object position.
  render_compare_data: any;
  /*this variable is use for identify the chart is already in edit mode or not.*/
  target_chart_flag: any = false;
  /* this variable is use for store legend labels for chart */
  legend_label: any = [];
  //This variable is use for identify if user make changes in chart table
  edit_cell_status: any = false;
  //This variable is use for store the table chart color
  chart_table_color: any = [];
  //this variable is use for check all tool objects are loaded or not
  tool_render_items: any = 0;

  ngOnDestroy() {
    document.removeEventListener("keydown", this.processKeys, false);
    document.removeEventListener('mousedown', this.handleGlobalMouseDown);
  }

  constructor(private sanitizer: DomSanitizer, private dataService: DataService, public utils: UtilsService, public dialog: MatDialog,) {
      
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

              if(activeObject.element_type == "shapeSticker" && clonedObj._objects) {

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
    let user_detail = {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjM4ODgsImlzcyI6Imh0dHBzOi8vdGVzdC5waG90b2Fka2luZy5jb20vYXBpL3B1YmxpYy9hcGkvZG9Mb2dpbkZvclVzZXIiLCJpYXQiOjE3MTY5NTcyOTQsImV4cCI6MTcxNzU2MjA5NCwibmJmIjoxNzE2OTU3Mjk0LCJqdGkiOiJCSFpsa2ZqM2c5eXYzQ2s0In0.IrMcW92PcqwNvuFI52iCvyaI2RE5DZ6ptiXljMmvock",
      "user_detail": {
        "user_id": "b7d9sj5ec3e0d4",
        "user_name": "111612578324448906456",
        "first_name": "Arkit",
        "email_id": "arkit.optimumbrew@gmail.com",
        "thumbnail_img": "",
        "compressed_img": "",
        "original_img": "",
        "social_uid": "111612578324448906456",
        "signup_type": 3,
        "profile_setup": 1,
        "is_active": 1,
        "is_multi_login": 1,
        "is_verify": 1,
        "is_once_logged_in": 1,
        "mailchimp_subscr_id": "e19788a67357bf41621fe925959374fc",
        "balance": "",
        "user_keyword": "graph",
        "role_id": 11,
        "create_time": "2023-08-15 05:34:14",
        "update_time": "2024-04-17 06:23:13",
        "is_pending": 0,
        "subscr_expiration_time": "2028-08-15 06:04:36",
        "next_billing_date": "2028-08-15 06:04:36",
        "is_subscribe": 1,
        "payment_type": 3,
        "is_new_rule_applied": 1
      }
    }
    localStorage.setItem('l_r',JSON.stringify(user_detail));
    localStorage.setItem('ut','eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQ2OCwiaXNzIjoiaHR0cHM6Ly90ZXN0LnBob3RvYWRraW5nLmNvbS9hcGkvcHVibGljL2FwaS9kb0xvZ2luRm9yVXNlciIsImlhdCI6MTcxNzU2NDIwOSwiZXhwIjoxNzE4MTY5MDA5LCJuYmYiOjE3MTc1NjQyMDksImp0aSI6InlhallKM251VmNndXJ0UlQifQ.EdmOFU1PbRjiW8UAValoJTHTHy2yGhhXBQexUL-arPI')
    
   
    this.canvas.on({
      'selection:created': (e) => {
        
        const activeObject = this.canvas.getActiveObject();
        this.layerSelected = activeObject;
        this.selected = true;
        this.uniqueArray = [];
        this.referenceArray = [];
        this.isCircle = (activeObject.type === "circle") ? true : false;
        this.isRect = (activeObject.type === "rect") ? true : false;
        this.isLine = (activeObject.type === "line") ? true : false;
        this.isSvgEle = (activeObject.element_type === 'shapeSticker') ? true : false;
        this.isSvgSticker = (activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.type === 'image' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') ? true : false;
        
        if(activeObject._objects && !activeObject.element_type) {
          activeObject.set({
            borderColor: '#00C3F9',
            cornerSize: 15,
            cornerColor: '#00C3F9',
            cornerStyle: 'circle',
            transparentCorners: false,
            _controlsVisibility: {
              tl: true,
              tr: true,
              br: true,
              bl: true,
              ml: false,
              mt: false,
              mr: false,
              mb: false,
              mtr: true
            },
          });
          activeObject._objects.forEach(object => {
            object.set({
              borderColor: '#00C3F9',
              cornerSize: 15,
              cornerColor: '#00C3F9',
              cornerStyle: 'circle',
              transparentCorners: false,
              _controlsVisibility: {
                tl: false,
                tr: false,
                br: false,
                bl: false,
                ml: false,
                mt: false,
                mr: false,
                mb: false,
                mtr: false
              },
          })
          });
          this.isGroup = true;
          this.canvas.renderAll();
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
        this.activeStrokeWidth = activeObject.strokeWidth;
        this.isReplaceShow = (activeObject._objects && !activeObject.element_type) ? false : true;
        this.layerSelected = activeObject;

        if(this.isCircle || this.isRect) {
          this.shadowBlur = activeObject.shadow.blur;
          this.shadowColor = activeObject.shadow.color;
          this.offSetX = activeObject.shadow.offsetX;
          this.offSetY = activeObject.shadow.offsetY;
        }
        
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
          this.props.opacity = (activeObject.opacity * 100).toFixed(0);
          this.getfilter();
          
          // const filters = activeObject.filters || [];
          
          // filters.forEach(filter => {

          //   if (filter.type === 'Brightness') {
          //     this.props.brightness = (filter.brightness * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'Contrast') {
          //     this.props.contrast = (filter.contrast * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'Saturation') {
          //     this.props.saturation = (filter.saturation * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'Tint') {
          //     this.props.tint = filter.color;
          //   } 
          //   else if (filter.type === 'Blur') {
          //     this.props.blur = (filter.blur * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'BlendColor') {
          //     this.props.blendColor = filter.color;
          //     this.props.blendMode = filter.mode;
          //     this.props.blendAlpha = (filter.alpha * 100).toFixed(0);
          //   }

          //   console.log(filter.__proto__.type,"-- created");
          //   switch (filter.__proto__.type) {
          //     case 'Sepia':
          //       this.props.sepia = true;
          //       this.props.grayscale = false;
          //       this.props.invert = false;
          //       this.props.blackWhite = false;
          //       this.props.brownie = false;
          //       this.props.vintage = false;
          //       this.props.emboss = false;
          //       this.props.kodachrome = false;
          //       this.props.technicolor = false;
          //       break;

          //     case 'Sepia2':
          //       this.props.sepia2 = true;
          //       break;

          //     case 'Grayscale':
          //       this.props.grayscale = true;
          //       this.props.sepia = false;
          //       this.props.invert = false;
          //       this.props.blackWhite = false;
          //       this.props.brownie = false;
          //       this.props.vintage = false;
          //       this.props.emboss = false;
          //       this.props.kodachrome = false;
          //       this.props.technicolor = false;
          //       break;

          //     case 'Invert':
          //       this.props.invert = true;
          //       this.props.sepia = false;
          //       this.props.grayscale = false;
          //       this.props.blackWhite = false;
          //       this.props.brownie = false;
          //       this.props.vintage = false;
          //       this.props.emboss = false;
          //       this.props.kodachrome = false;
          //       this.props.technicolor = false;
          //       break;
                
          //     case 'ColorMatrix':
          //       if (this.compareArray(filter.matrix, FILTERMATRIX.BlackNWhite))
          //         this.props.blackWhite = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Brownie))
          //         this.props.brownie = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Vintage))
          //         this.props.vintage = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.kodachrome))
          //         this.props.kodachrome = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Technicolor))
          //         this.props.technicolor = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //       break;

          //     case 'Convolute':
          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Emboss))
          //         this.props.emboss = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;
          //       break;
              
          //   }
            
          // });
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
        this.isSvgSticker = (activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.type === 'image' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') ? true : false;

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
        this.activeStrokeWidth = activeObject.strokeWidth;
        this.isReplaceShow = (activeObject._objects && !activeObject.element_type) ? false : true;
        this.isReplaceMode = false;
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

        if(this.isCircle || this.isRect) {
          this.shadowBlur = activeObject.shadow.blur;
          this.shadowColor = activeObject.shadow.color;
          this.offSetX = activeObject.shadow.offsetX;
          this.offSetY = activeObject.shadow.offsetY;
        }

        if(activeObject.type == 'image') {
          this.props.opacity = (activeObject.opacity * 100).toFixed(0);
          this.getfilter();

          // const filters = activeObject.filters || [];
          // filters.forEach(filter => {
          //   if (filter.type === 'Brightness') {
          //     this.props.brightness = (filter.brightness * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'Contrast') {
          //     this.props.contrast = (filter.contrast * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'Saturation') {
          //     this.props.saturation = (filter.saturation * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'Tint') {
          //     this.props.tint = filter.color;
          //   } 
          //   else if (filter.type === 'Blur') {
          //     this.props.blur = (filter.blur * 100).toFixed(0);
          //   } 
          //   else if (filter.type === 'BlendColor') {
          //     this.props.blendColor = filter.color;
          //     this.props.blendMode = filter.mode;
          //     this.props.blendAlpha = (filter.alpha * 100).toFixed(0);
          //   }
          //   console.log(filter.__proto__.type,"-- updated");
          //   switch (filter.__proto__.type) {
              
          //     case 'Sepia':
          //       this.props.sepia = true;
          //       this.props.grayscale = false;
          //       this.props.invert = false;
          //       this.props.blackWhite = false;
          //       this.props.brownie = false;
          //       this.props.vintage = false;
          //       this.props.emboss = false;
          //       this.props.kodachrome = false;
          //       this.props.technicolor = false;
          //       break;

          //     case 'Sepia2':
          //       this.props.sepia2 = true;
          //       break;

          //     case 'Grayscale':
          //       this.props.grayscale = true;
          //       this.props.sepia = false;
          //       this.props.invert = false;
          //       this.props.blackWhite = false;
          //       this.props.brownie = false;
          //       this.props.vintage = false;
          //       this.props.emboss = false;
          //       this.props.kodachrome = false;
          //       this.props.technicolor = false;
          //       break;

          //     case 'Invert':
          //       this.props.invert = true;
          //       this.props.sepia = false;
          //       this.props.grayscale = false;
          //       this.props.blackWhite = false;
          //       this.props.brownie = false;
          //       this.props.vintage = false;
          //       this.props.emboss = false;
          //       this.props.kodachrome = false;
          //       this.props.technicolor = false;
          //       break;
                
          //     case 'ColorMatrix':
          //       if (this.compareArray(filter.matrix, FILTERMATRIX.BlackNWhite))
          //         this.props.blackWhite = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Brownie))
          //         this.props.brownie = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Vintage))
          //         this.props.vintage = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.kodachrome))
          //         this.props.kodachrome = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.technicolor = false;

          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Technicolor))
          //         this.props.technicolor = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.emboss = false;
          //         this.props.kodachrome = false;
          //       break;

          //     case 'Convolute':
          //       if (this.compareArray(filter.matrix, FILTERMATRIX.Emboss))
          //         this.props.emboss = true;
          //         this.props.sepia = false;
          //         this.props.grayscale = false;
          //         this.props.invert = false;
          //         this.props.blackWhite = false;
          //         this.props.brownie = false;
          //         this.props.vintage = false;
          //         this.props.kodachrome = false;
          //         this.props.technicolor = false;
          //       break;
              
          //   }
          // });
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
          this.isReplaceShow = (activeObject._objects && !activeObject.element_type) ? false : true;
          
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
        if(activeObject.type === 'activeSelection') {
          activeObject.set({lockScalingFlip : true});
          this.selectedObjPos.left = Math.round(activeObject.left);
          this.selectedObjPos.top = Math.round(activeObject.top);
        }
        else if(activeObject.type != 'activeSelection') {
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
          this.isReplaceShow = (activeObject._objects) ? false : true;//false;
          
          if(!activeObject.clipPath) {
            this.getClippathwidth = activeObject.width * activeObject.scaleX;
            this.getClippathheight = activeObject.height * activeObject.scaleY;
            this.getClippathleft = activeObject.left;
            this.getClippathtop = activeObject.top;
            // this.cropEleScale = activeObject.scaleX;
            this.newclipWidth = activeObject.width * activeObject.scaleX;
            this.newclipHeight = activeObject.height * activeObject.scaleY;
          }
  
          activeObject.set({
            noScaleCache: false,
            statefullCache: true
          })
          
          if(activeObject.type !== 'circle' && activeObject.element_type !== 'shapeSticker' && activeObject.element_type !== 'svgSticker' && activeObject.element_type !== 'stockphotos' && activeObject.element_type !== 'collectionImage' && activeObject.element_type !== 'iconSticker') {
            
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
        }
        this.canvas.renderAll();
      },
      'selection:cleared': (e) => {
        this.canvas.forEachObject((object) => {
          if (object.type !== 'line') {
            object.set({
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
            })
          }
          else if (object.type == 'line') {
            object.set({
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
            })
          }
        });
        this.canvas.renderAll();
        
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
          this.selectedObjDeg = Math.round(e.target.angle);
          this.selectedObjPos.left = Math.round(e.target.left);
          this.selectedObjPos.top = Math.round(e.target.top);

          // Set near by angle while rotating object
          /* const activeObject = e.target;
          const currentAngle = activeObject.angle % 360;
          const closestAngle = this.getClosestAngle(currentAngle);
          if (Math.abs(closestAngle - currentAngle) <= this.snapThreshold) {
            activeObject.angle = closestAngle;
            activeObject.setCoords();
          }
          else {
            activeObject.angle = Math.round(e.target.angle);
            activeObject.setCoords();
          }
          this.canvas.requestRenderAll(); */

          // object rotating 
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
          this.isReplaceShow = (this.isReplaceShow) ? false : true;
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
            cleft: this.listener.cropper.croppedData.left,
            ctop: this.listener.cropper.croppedData.top,
            cwidth: this.listener.cropper.croppedData.width,
            cheight: this.listener.cropper.croppedData.height,
            isCroped: true,
            originalHeight: this.listener.cropper.sourceData.height,
            originalWidth: this.listener.cropper.sourceData.width
          });

          this.canvas.renderAll();
          
          const acobj = this.canvas.getActiveObject();
          const result = {
            height: acobj.cheight,
            imageHeight: acobj.originalHeight,
            imageWidth: acobj.originalWidth,
            is_payment_done: false,
            left: acobj.cropX,
            res: true,
            top: acobj.cropY,
            width: acobj.cwidth,
          }
          
          this.convertCropToBlob(result);

          /* var tmpsrc;
          var server_src = this.canvas.getActiveObject().toJSON(custom_attributes).src || this.canvas.getActiveObject().toObject().src;
          var isTransparent = this.canvas.getActiveObject().toJSON(custom_attributes).isTransparent;
          var original_src = this.canvas.getActiveObject().toJSON(custom_attributes).original_src;

          if (isTransparent)
              tmpsrc = server_src;
          else
              tmpsrc = original_src || server_src;

          console.log(acobj);
          const imageDetails = {
            src: tmpsrc,
            imgWidth: acobj.width,
            imgHeight: acobj.height,
            scaleX: acobj.scaleX,
            scaleY: acobj.scaleY,
            cleft: acobj.cropX * acobj.scaleX,
            ctop: acobj.cropY * acobj.scaleY,
            cwidth: acobj.cwidth,
            cheight: acobj.cheight,
          }
          
          this.utils.cropImage(imageDetails).then((res: any) => {
            // // console.log(res.base64);
            // var blob = this.dataURLtoBlob(res.base64);
            // var blobUrl = URL.createObjectURL(blob);
            // // console.log(blobUrl);
            // var file = this.dataService.blobToFile(blob, 'tmp.png');
          }) */

          this.isCropingEnable = false;
          this.isReplaceShow = true;
          // this.activeTabID = 5;
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
        
        if(e.target.type === 'image' && !this.isCropingEnable) {
          // this.activeTabID = 0;
          this.isCropingEnable = true;

          // const activeObject = this.canvas.getActiveObject();
          // this.activeObjectonCanvas = activeObject;
          // const cropData = activeObject.toObject();
          // const sourceData = activeObject._cropSource || cropData;
          // let freeModeScaling;
          // freeModeScaling = "9:16";
          // freeModeScaling = "16:9";
          // freeModeScaling= "1:1";
          // freeModeScaling = "";

          // this.listener.crop({
          //   src: activeObject.getSrc(),
          //   cropData,
          //   sourceData,
          // freeModeScaling,
          // });
          
          // this.cropSource = {left:activeObject.left, top:activeObject.top, height:activeObject.height, width: activeObject.width, croppingType: this.croppingType, cropX: 0, cropY: 0, scaleX: activeObject.scaleX, scaleY: activeObject.scaleY}
          // if(!activeObject._cropSource){
          //   // if(activeObject.height > activeObject.width) {
          //   //   this.cropSource.height = activeObject.width//activeObject.height
          //   //   this.cropSource.width = activeObject.width//(activeObject.height * 4)/5
          //   // }
          //   // else if(activeObject.width > activeObject.height) {
          //   //   this.cropSource.height = activeObject.height//(activeObject.width * 5)/4
          //   //   this.cropSource.width = activeObject.height//activeObject.width
          //   // }
          // }
          // activeObject._cropSource = sourceData;
          
          // if(!activeObject.isCroped) {
          //   switch(this.croppingType) {
          //     case "9:16" :
          //       if(activeObject.height > activeObject.width) {
          //         this.cropSource.cropX = 100
          //         this.cropSource.cropY = 0; 
          //         this.cropSource.top = activeObject.top;
          //         this.cropSource.left = activeObject.left + (100 * activeObject.scaleX);
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height;
          //         this.cropSource.width = activeObject.width - 200;
          //       }
          //       else if(activeObject.width > activeObject.height) {
          //         this.cropSource.cropX = 400
          //         this.cropSource.cropY = 0; 
          //         this.cropSource.top = activeObject.top;
          //         this.cropSource.left = activeObject.left + (400 * activeObject.scaleX);
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height;
          //         this.cropSource.width = activeObject.width - 800;
          //       }
          //       break;
              
          //     case "1:1" :
          //       if(activeObject.height > activeObject.width) {
          //         this.cropSource.cropX = 0; //(activeObject.width - activeObject.height) / 2;
          //         this.cropSource.cropY = (activeObject.height - activeObject.width) / 2;
          //         this.cropSource.top = ((activeObject.height - activeObject.width) / 2) * activeObject.scaleY + activeObject.top;
          //         this.cropSource.left = activeObject.left; //((activeObject.width - activeObject.height) / 2) * activeObject.scaleX + activeObject.left;
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.width
          //         this.cropSource.width = activeObject.width
          //       }
          //       else if(activeObject.width > activeObject.height) {
          //         this.cropSource.cropX = (activeObject.width - activeObject.height) / 2;
          //         this.cropSource.cropY = 0;
          //         this.cropSource.top = activeObject.top;
          //         this.cropSource.left = ((activeObject.width - activeObject.height) / 2) * activeObject.scaleX + activeObject.left;
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height;
          //         this.cropSource.width = activeObject.height;
          //       }
          //       break;

          //     case "16:9" :
          //       if(activeObject.height > activeObject.width) {
          //         // this.cropSource.cropX = 0
          //         // this.cropSource.cropY = (activeObject.height - 700) / 2; 
          //         // this.cropSource.top = ((activeObject.height - (activeObject.height - 700)) / 2) * activeObject.scaleY + activeObject.top - 19;
          //         // this.cropSource.left = activeObject.left;
          //         // this.cropSource.scaleX = activeObject.scaleX;
          //         // this.cropSource.scaleY = activeObject.scaleY;
          //         // this.cropSource.height = activeObject.height - 700;
          //         // this.cropSource.width = activeObject.width;
          //         this.cropSource.cropX = 0
          //         this.cropSource.cropY = 400; 
          //         this.cropSource.top = activeObject.top + (400 * activeObject.scaleY);
          //         this.cropSource.left = activeObject.left;
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height - 800;
          //         this.cropSource.width = activeObject.width;
          //       }
          //       else if(activeObject.width > activeObject.height) {
          //         // this.cropSource.cropX = 0;
          //         // this.cropSource.cropY = ((activeObject.height - 200) / 2 )* activeObject.scaleY;
          //         // this.cropSource.top = activeObject.top + 19//+ ((activeObject.height * activeObject.scaleY) / 2); //((activeObject.height - (activeObject.width - 500)) / 2) * activeObject.scaleX + activeObject.top;
          //         // this.cropSource.left = activeObject.left;
          //         // this.cropSource.scaleX = activeObject.scaleX;
          //         // this.cropSource.scaleY = activeObject.scaleY;
          //         // this.cropSource.height = activeObject.height - 200;
          //         // this.cropSource.width = activeObject.width;
          //         this.cropSource.cropX = 0;
          //         this.cropSource.cropY = 100;
          //         this.cropSource.top = activeObject.top + (100 * activeObject.scaleY);
          //         this.cropSource.left = activeObject.left;
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height - 200;
          //         this.cropSource.width = activeObject.width;
          //       }
          //       break;
        
          //     case "5:4" :
          //       if(activeObject.height > activeObject.width) {
          //         this.cropSource.cropX = 0;
          //         this.cropSource.cropY = 250; 
          //         this.cropSource.top = activeObject.top + (250 * activeObject.scaleY);
          //         this.cropSource.left = activeObject.left;
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height - 500;
          //         this.cropSource.width = activeObject.width;
          //       }
          //       else if(activeObject.width > activeObject.height) {
          //         this.cropSource.cropX = 100
          //         this.cropSource.cropY = 0; 
          //         this.cropSource.top = activeObject.top;
          //         this.cropSource.left = activeObject.left + (100 * activeObject.scaleX);
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height;
          //         this.cropSource.width = activeObject.width - 200;
          //       }
          //       break;
            
          //     case "4:5" :
          //       if(activeObject.height > activeObject.width) {
          //         this.cropSource.cropX = 0;
          //         this.cropSource.cropY = 100; 
          //         this.cropSource.top = activeObject.top + (100 * activeObject.scaleY);
          //         this.cropSource.left = activeObject.left;
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height - 200;
          //         this.cropSource.width = activeObject.width;
          //       }
          //       else if(activeObject.width > activeObject.height) {
          //         this.cropSource.cropX = 250
          //         this.cropSource.cropY = 0; 
          //         this.cropSource.top = activeObject.top;
          //         this.cropSource.left = activeObject.left + (250 * activeObject.scaleX);
          //         this.cropSource.scaleX = activeObject.scaleX;
          //         this.cropSource.scaleY = activeObject.scaleY;
          //         this.cropSource.height = activeObject.height;
          //         this.cropSource.width = activeObject.width - 500;
          //       }
          //       break;
            
          //   }
          // }
          
          // this.listener.crop(this.cropSource);
          // console.log(this.listener,"-- listener");
          this.listener.crop();
          // console.log(this.listener.scaling());

          /* const editorContainer : any = document.querySelector('.editor-container');
          const canvasContainer : any = document.querySelector('.canvas-container');

          const editorHeight = editorContainer.offsetHeight;
          const editorWidth = editorContainer.offsetWidth;

          // Get the margin-right of the canvas-container
          const canvasMarginRight = window.getComputedStyle(canvasContainer).marginRight;

          // Log the values to the console
          console.log('Editor Height:', editorHeight);
          console.log('Editor Width:', editorWidth);
          console.log('Canvas Margin Right:', canvasMarginRight); */
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

  handleEditorClick(event: MouseEvent) {
    // console.log(event,"click");
    // if(this.listener && this.isCropingEnable){
          
    //   this.listener.confirm();
    //   this.canvas.getActiveObject().set({
    //     cleft: this.listener.cropTarget.left,
    //     ctop: this.listener.cropTarget.top,
    //     cwidth: this.listener.cropTarget.width,
    //     cheight: this.listener.cropTarget.height,
    //     isCroped: true
    //   });

    //   this.canvas.renderAll();
    //   this.isCropingEnable = false;
    //   this.isReplaceShow = true;
    // }

    // const target = event.target as HTMLElement;
    // (this.isCropingEnable) ? console.log(target,'outside click') : '';
    (this.isCropingEnable) ? console.log(this.listener) : '';

    // console.log(target,"-- target");

    // // Check if the clicked element is a canvas or if the canvas contains the clicked element
    // if (target.tagName === 'CANVAS' || target.closest('canvas')) {
    //   console.log('Canvas was clicked, ignoring.');
    //   return; // Do not proceed further if the click is from a canvas
    // }
    // else {
    //   if(target.className == 'ic-corner-ctrl') {
    //     console.log('ic-corner');
    //   }
    //   else {
    //     console.log('other');
    //   }
    // }

    const target = event.target as HTMLElement;
    if(this.isCropingEnable) {
      if (target.className.includes('ic')) {
        if (this.isCropingEnable) {
          console.log("click on ic");
        }
      } 
      else {
        if(this.listener.cropper.activeCursorStyle.over == "move") {
          if(this.listener && this.isCropingEnable){
          
            this.listener.confirm();
            this.canvas.getActiveObject().set({
              cleft: this.listener.cropTarget.left,
              ctop: this.listener.cropTarget.top,
              cwidth: this.listener.cropTarget.width,
              cheight: this.listener.cropTarget.height,
              isCroped: true
            });
  
            this.canvas.renderAll();
            this.isCropingEnable = false;
            this.isReplaceShow = true;
          }
        }
        else {
          console.log("Do-nothing");
        }
      }
    }
    else {
      console.log("croping not enable");
    }

  }
  stopPropagation(event: MouseEvent): void {
    let target = event.target as HTMLElement;
    // console.log('click on canvas and ic:', target.className);
    // (this.isCropingEnable) ? console.log('click on canvas and ic:', event) : '';
    event.stopPropagation();
  }

  /********** Image cropping without library ***********/
  showReplaceImageHint() {
    let uploadFromType;
    this.isReplaceMode = !this.isReplaceMode;
    uploadFromType = this.canvas.getActiveObject().toObject(custom_attributes).element_type;

    if (uploadFromType == 'stockphotos') {
      if (this.isReplaceMode == true) {
        this.navTab(this.tabs[add_image_tab_index], add_image_tab_index);
        this.activateAddImageSubTab('stockPhotos');
      } 
      else {
        return null;
      }
    } 
    else if (uploadFromType == 'collectionImage') {
      if (this.isReplaceMode == true) {
        this.navTab(this.tabs[add_image_tab_index], add_image_tab_index, false, true);
        this.activateAddImageSubTab('collection');
      } 
      else {
        return null;
      }
    } 
    else if (uploadFromType == 'userUploadImage' || uploadFromType == 'user_upload') {
      if (this.isReplaceMode == true) {
        this.navTab(this.tabs[add_image_tab_index], add_image_tab_index, false, true);
        this.activateAddImageSubTab('myPhotos');
      } 
      else {
        return null;
      }
    } 
    else if (uploadFromType == "basicShape") {
      if (this.isReplaceMode == true) {
        this.sticker_sub_tab_shown = true;
        this.navTab(this.tabs[add_elements_tab_index], add_elements_tab_index);
        this.activateStickerSubTab('shapes')
        this.activeBasicShape();
      } 
      else {
        return null;
      }
    } 
    else if (uploadFromType == "shapeSticker") {
      if (this.isReplaceMode == true) {

        if (this.activeTab.tabId != add_elements_tab_index + 1) {
          this.navTab(this.tabs[add_elements_tab_index], add_elements_tab_index, true);
        } 
        else {
          this.navTab(this.tabs[add_elements_tab_index], add_elements_tab_index);
        }
        if (!this.isShapeStickerActive) {
          this.activateStickerSubTab('shapes', true);
        }
      } 
      else {
        return null;
      }
    } 
    else if (uploadFromType == "svgSticker") {
      if (this.isReplaceMode == true) {
        this.navTab(this.tabs[add_elements_tab_index], add_elements_tab_index);
        this.activateStickerSubTab('stickers')
      } 
      else {
        return null;
      }
    } 
    else if (uploadFromType == "iconSticker") {
      if (this.isReplaceMode == true) {
        this.navTab(this.tabs[add_elements_tab_index], add_elements_tab_index);
        this.activateStickerSubTab('buttons', true);
      } 
      else {
        return null;
      }
    } 
    else {
      if (this.isReplaceMode == true) {
        this.navTab(this.tabs[add_image_tab_index], add_image_tab_index);
        this.activateAddImageSubTab('stockPhotos');
      } 
      else {
        return;
      }
    }
    
  }
  navTab(tab, i, isOpenReplace: boolean = false, isStock: boolean = false) {
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
    this.edit_qr_status = false;
    this.edit_barcode_status = false;
    this.edit_chart_status = false;
    this.active_tool = "default";

    for (let j = 0; j < this.tabs.length; j++) {
      if (i == j) {
        this.tabs[j].selected_nav = "active";
      }
      else {
        this.tabs[j].selected_nav = "";
      }
    }
    const activeObject = this.canvas.getActiveObject();

    switch (tab.tabId) {
      case 2:
        
        this.activeTabID = tab.tabId;
        if (this.activeTab.tabId != tab.tabId) {

          this.activeTab = tab;
          this.shape = true;
          this.buttons = false;
          this.stickers = false;

          if (activeObject && activeObject.element_type == "iconSticker" && this.isReplaceMode) {
            this.buttons = true;
            this.shape = false;
          }
          if (activeObject && activeObject.element_type == "svgSticker" && this.isReplaceMode) {
            this.stickers = true;
            this.shape = false;
          }

          this.activeStickers(isOpenReplace);
        }
        else {

          if (isOpenReplace) {
            this.activeStickers(isOpenReplace);
          }
        }
        break;

      case 5:
        this.activeTabID = tab.tabId
        if (this.activeTab.tabId != tab.tabId) {
          this.collection_sub_tab_shown = true;
          this.activeTab = tab;

          if (!isStock) {
            this.activeAddImage();
          }
        }
        break;
  
    }

  }
  activeAddImage() {
    this.stock_photo_search_query = "";
    this.stockPhotos = false;
    this.activateAddImageSubTab('stockPhotos');
  }
  activeBasicShape() {
    this.isBasicTabActive = true;
    this.isShapeStickerActive = false;
    this.stkr_catalog_id = null;
    this.setCategoryInCenter();
  }
  
  /********** Set filter on object create and update. ***********/
  getfilter() {
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
            this.props.contrast = (element.contrast  * 100).toFixed(0);
            break;

          case 'Saturation':
            this.props.saturation = (element.saturation  * 100).toFixed(0);
            break;

          case 'Tint':
            this.props.tint = element.color;
            let hue = Math.round(this.hexToHsl(element.color) / 3.6);
            if (hue == 0 && element.opacity != 0) {
              hue = 100;
            }
            this.props.tintOpacity = hue;
            break;

          case 'Blur':
            this.props.blur = (element.blur * 100).toFixed(0);
            break;

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

          case 'BlendColor':
            this.props.blendColor = element.color;
            this.props.blendMode = element.mode;
            this.props.blendAlpha = (element.alpha * 100).toFixed(0);
            break;

        }
      });
    }
  }
  
  /********** Apply crop to image using crop suggestion ***********/
  applyCrop() {
    if(!this.listener){

      this.listener = new FabricCropListener(this.canvas);
    }
    if(this.canvas.getActiveObject().type === 'image' && !this.isCropingEnable) {
      this.isCropingEnable = true;
      this.listener.crop();
    }
  }

  changeCropStyle(type) {
    const activeObject = this.activeObjectonCanvas;
    this.croppingType = type;
    this.cropSource.croppingType = type;
    
    switch(this.croppingType) {
      case "0:0" :
        this.cropSource.cropX = 0;
        this.cropSource.cropY = 0;
        this.cropSource.top = activeObject.top;
        this.cropSource.left = activeObject.left;
        this.cropSource.scaleX = activeObject.scaleX;
        this.cropSource.scaleY = activeObject.scaleY;
        this.cropSource.height = activeObject.height;
        this.cropSource.width = activeObject.width;
        break;

      case "9:16" :
        if(activeObject.height > activeObject.width) {
          this.cropSource.cropX = 100
          this.cropSource.cropY = 0; 
          this.cropSource.top = activeObject.top;
          this.cropSource.left = activeObject.left + (100 * activeObject.scaleX);
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height;
          this.cropSource.width = activeObject.width - 200;
        }
        else if(activeObject.width > activeObject.height) {
          this.cropSource.cropX = 400
          this.cropSource.cropY = 0; 
          this.cropSource.top = activeObject.top;
          this.cropSource.left = activeObject.left + (400 * activeObject.scaleX);
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height;
          this.cropSource.width = activeObject.width - 800;
        }
        break;
      
      case "1:1" :
        if(activeObject.height > activeObject.width) {
          this.cropSource.cropX = 0; //(activeObject.width - activeObject.height) / 2;
          this.cropSource.cropY = (activeObject.height - activeObject.width) / 2;
          this.cropSource.top = ((activeObject.height - activeObject.width) / 2) * activeObject.scaleY + activeObject.top;
          this.cropSource.left = activeObject.left; //((activeObject.width - activeObject.height) / 2) * activeObject.scaleX + activeObject.left;
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.width
          this.cropSource.width = activeObject.width
        }
        else if(activeObject.width > activeObject.height) {
          this.cropSource.cropX = (activeObject.width - activeObject.height) / 2;
          this.cropSource.cropY = 0;
          this.cropSource.top = activeObject.top;
          this.cropSource.left = ((activeObject.width - activeObject.height) / 2) * activeObject.scaleX + activeObject.left;
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height;
          this.cropSource.width = activeObject.height;
        }
        break;

      case "16:9" :
        if(activeObject.height > activeObject.width) {
          this.cropSource.cropX = 0
          this.cropSource.cropY = 400; 
          this.cropSource.top = activeObject.top + (400 * activeObject.scaleY);
          this.cropSource.left = activeObject.left;
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height - 800;
          this.cropSource.width = activeObject.width;
        }
        else if(activeObject.width > activeObject.height) {
          this.cropSource.cropX = 0;
          this.cropSource.cropY = 100;
          this.cropSource.top = activeObject.top + (100 * activeObject.scaleY);
          this.cropSource.left = activeObject.left;
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height - 200;
          this.cropSource.width = activeObject.width;
        }
        break;

      case "5:4" :
        if(activeObject.height > activeObject.width) {
          this.cropSource.cropX = 0;
          this.cropSource.cropY = 250; 
          this.cropSource.top = activeObject.top + (250 * activeObject.scaleY);
          this.cropSource.left = activeObject.left;
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height - 500;
          this.cropSource.width = activeObject.width;
        }
        else if(activeObject.width > activeObject.height) {
          this.cropSource.cropX = 100
          this.cropSource.cropY = 0; 
          this.cropSource.top = activeObject.top;
          this.cropSource.left = activeObject.left + (100 * activeObject.scaleX);
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height;
          this.cropSource.width = activeObject.width - 200;
        }
        break;
    
      case "4:5" :
        if(activeObject.height > activeObject.width) {
          this.cropSource.cropX = 0;
          this.cropSource.cropY = 100; 
          this.cropSource.top = activeObject.top + (100 * activeObject.scaleY);
          this.cropSource.left = activeObject.left;
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height - 200;
          this.cropSource.width = activeObject.width;
        }
        else if(activeObject.width > activeObject.height) {
          this.cropSource.cropX = 250
          this.cropSource.cropY = 0; 
          this.cropSource.top = activeObject.top;
          this.cropSource.left = activeObject.left + (250 * activeObject.scaleX);
          this.cropSource.scaleX = activeObject.scaleX;
          this.cropSource.scaleY = activeObject.scaleY;
          this.cropSource.height = activeObject.height;
          this.cropSource.width = activeObject.width - 500;
        }
        break;
    
    }
    this.listener.crop(this.cropSource);

    let element = document.querySelector('.ic-crop-upper') as HTMLElement;
    element.style.width = `${this.cropSource.width}px`;
    element.style.height = `${this.cropSource.height}px`;
    element.style.transform = `matrix(${this.cropSource.scaleX}, 0, 0, ${this.cropSource.scaleY}, ${this.cropSource.left}, ${this.cropSource.top})`;
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
      this.canvas.getActiveObject().set({
        cleft: this.listener.cropper.croppedData.left,
        ctop: this.listener.cropper.croppedData.top,
        cwidth: this.listener.cropper.croppedData.width,
        cheight: this.listener.cropper.croppedData.height,
        isCroped: true,
        originalHeight: this.listener.cropper.sourceData.height,
        originalWidth: this.listener.cropper.sourceData.width
      });

      this.canvas.renderAll();
    }

    /* const canvasDomElement = this.canvas.nativeElement;
    const targetElement = event.target as HTMLElement;
    
    if (!this.croppingAreaRef.nativeElement.contains(targetElement)) {
      this.listener.confirm();
    } */
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
            const imageData = ctx.getImageData(0, 0, clipWidth, clipHeight); */
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

  /********** Svg Element color array ***********/
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
    this.isReplaceMode = false;
    this.activeTabID = tab_details.tabId;
    // this.activeTab.tabId = tab_details.tabId;
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
        if (!this.stockPhotos) {
          this.stock_photo_search_query = "";
          this.collection_search_query = "";
          this.tmp_collection_search_query = "";
          this.stock_photo_search_query = "";
          this.getStockPhotos(this.stock_photo_search_query);
        }
        this.stockPhotos = true;
        this.collection = false;
        this.myPhotos = false;
        this.activeStickers();
        break;

      case 'myPhotos':
        if (!this.myPhotos) {
          this.collection_search_query = "";
          this.tmp_collection_search_query = "";
          this.stock_photo_search_query = "";
          // this.refreshUserUpload(false); 
        }
        this.myPhotos = true;
        this.collection = false;
        this.stockPhotos = false;
        break;

      case 'collection':
        this.setCategoryInCenter();
        if (!this.collection) {
          this.collection_search_query = "";
          this.tmp_collection_search_query = "";
          this.stock_photo_search_query = "";
          this.activeCollection("");
        }
        this.myPhotos = false;
        this.collection = true;
        this.stockPhotos = false;
        break;

      case 'bgStockPhotos':
        if (!this.bgStockPhotos) {
          this.bg_stock_photo_search_query = "";
          this.stock_photo_search_query = "";
          this.getBGStockPhotos(this.bg_stock_photo_search_query);
        }
        this.bgStockPhotos = true;
        this.bgMyPhotos = false;
        this.bgSetting = false;
        break;

      case 'bgSetting':
        if (this.canvas.backgroundImage) {
          this.isBgImg = true;
          this.bgStockPhotos = false;
          this.bgMyPhotos = false;
          this.bgSetting = true;
        }
        break;
    }
  }
  getStockPhotos(search_query) {
    
    if (search_query.trim().length) {
      this.collection_sub_tab_shown = false;
    } 
    else {
      this.stock_photo_search_query = search_query.trim();
      this.collection_sub_tab_shown = true;
    }

    search_query = this.stock_photo_search_query;
    this.stock_photo_list = [];
    this.isStockPhotoList = false;
    this.stock_photo_pg_count = 1;

    this.dataService.postData("getImagesFromPixabay", {
      "search_query": search_query,
      "page": this.stock_photo_pg_count,
      "item_count": this.stock_photo_itm_pr_pg
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((results: any) => {
      if (results.code == 200) {
        if (results.data.result.hits) {
          this.stock_photo_list = results.data.result.hits;
        }
        this.stock_photo_response = results.data;
        if (this.stock_photo_list && this.stock_photo_list.length <= 0) {
          this.isStockPhotoList = true;
        }
      } 
    }, err => {
      console.log(err);
    })
  }
  activeCollection(search_query) {
    var payLoad = {
      "sub_category_id": HOST.TEXTURE_SB_CAT_ID,
      "catalog_id": 0,
      "page": 1,
      "item_count": 100,
    }

    this.dataService.postData("getNormalCatalogsBySubCategoryId", payLoad, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((res) => {
      this.collectionCatalog_list = res['data'].result;
      if (this.collectionCatalog_list.length > 0) {
        this.collection_catalog_id = this.collectionCatalog_list[0].catalog_id;
        this.collection_bg_list = this.collectionCatalog_list[0];

        if (this.collection_bg_list.content_list.length <= 0) {
          this.collection_bg_list = [];
          this.isCollectionList = true;
        }
      } 
      else {
        this.collection_bg_list = [];
        this.isCollectionList = true;
      }
    });
  }

  saveJson() {
    console.log(this.canvas.toJSON(['isCroped','cwidth','cheight','ctop','cleft']));
  }
  
  /********** Add shape into canvas ***********/
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
        if(this.isReplaceMode && this.selected && this.canvas.getActiveObject().element_type == 'basicShape') {
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
            stroke: '#0F1934',
            strokeDashArray: shape.strokeDashArray,
            clipTo: null,
            excludeFromExport: false,
            // strokeLineJoin: "round",
            // strokeMiterLimit: 8,
            strokeWidth: shape.strokeWidth,
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

        if(this.isReplaceMode && this.selected && this.canvas.getActiveObject().element_type == 'basicShape') {
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

        if(this.isReplaceMode && this.selected && this.canvas.getActiveObject().element_type == 'basicShape') {

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

  /********** Draw grids on object active ***********/
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

  /********** Remove Grids on mouse leave ***********/
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

  /********** Duplicate active object ***********/
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

        if(activeObject.element_type === 'shapeSticker' && cloned._objects) {
          cloned.class = activeObject.class,
          
          cloned._objects.forEach((subObj, index) => {
            if (activeObject._objects && activeObject._objects[index]) {
              subObj.set({
                id: activeObject._objects[index].id,
              });
            }
          });
        }

        if(activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') {
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

  /********** Remove active object ***********/
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

  /********** Object move ***********/
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
        if (this.selectedObjPos.left == null) {
          this.selectedObjPos.left = Math.round(activeObject.left);
        }
        else {
          this.selectedObjPos.left = parseInt(event.target.value);
        }
        // activeObject.set('left',parseInt(event.target.value));
        activeObject.set('left', this.selectedObjPos.left);
        break;

      case 'horizontal':
        if (this.selectedObjPos.top == null) {
          this.selectedObjPos.top = Math.round(activeObject.top);
        }
        else {
          this.selectedObjPos.top = parseInt(event.target.value);
        }
        activeObject.set('top', this.selectedObjPos.top);
        break;

      case 'rotate':
        
        if (this.selectedObjDeg == null) {
          this.selectedObjDeg = parseInt(activeObject.angle);
        }
        else {
          this.selectedObjDeg = parseInt(event.target.value);
        }
        console.log(this.selectedObjDeg,"-- this.selectedObjDeg --",typeof(this.selectedObjDeg));
        activeObject.set('angle', this.selectedObjDeg);
        break;

      case 'borderSize':
        if (this.activeStrokeWidth == null) {
          this.activeStrokeWidth = Math.round(activeObject.strokeWidth);
        }
        else {
          this.activeStrokeWidth = parseInt(event.target.value);
        }

        if(activeObject.type === 'line') {
          this.elementHeight = this.activeStrokeWidth;
        }

        this.activeStrokeWidth = this.checkLimitBeforeApplyForInputSlider(this.activeStrokeWidth, 50, 0);
        activeObject.set('strokeWidth', this.activeStrokeWidth);
        break;

      case 'borderRadius':
        if (this.activeBorderRadius == null) {
          this.activeBorderRadius = Math.round(activeObject.rx);
        }
        else {
          this.activeBorderRadius = parseInt(event.target.value);
        }
        this.activeBorderRadius = this.checkLimitBeforeApplyForInputSlider(this.activeBorderRadius, 100, 0);
        
        activeObject.set('rx', this.activeBorderRadius);
        activeObject.set('ry', this.activeBorderRadius);
        break;

      case 'shadowBlur':
        if (this.shadowBlur == null) {
          this.shadowBlur = Math.round(activeObject.shadow.blur);
          this.offSetX = Math.round(activeObject.shadow.offsetX);
          this.offSetY = Math.round(activeObject.shadow.offsetY);
        }
        else {
          this.shadowBlur = parseInt(event.target.value);
        }

        this.shadowBlur = this.checkLimitBeforeApplyForInputSlider(this.shadowBlur, 100, 0);
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
        
        if (this.offSetX == null) {
          this.shadowBlur = Math.round(activeObject.shadow.blur);
          this.offSetX = Math.round(activeObject.shadow.offsetX);
          this.offSetY = Math.round(activeObject.shadow.offsetY);
        }
        else {
          this.offSetX = parseInt(event.target.value);
        }

        this.offSetX = this.checkLimitBeforeApplyForInputSlider(Math.round(this.offSetX), 50, -50);
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
        
        if (this.offSetY == null) {
          this.shadowBlur = Math.round(activeObject.shadow.blur);
          this.offSetX = Math.round(activeObject.shadow.offsetX);
          this.offSetY = Math.round(activeObject.shadow.offsetY);
        }
        else {
          this.offSetY = parseInt(event.target.value);
        }

        this.offSetY = this.checkLimitBeforeApplyForInputSlider(Math.round(this.offSetY), 50, -50);
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
          if(this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(parseInt(activeObject.width), 10000, 10);
          }
          else {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10); //parseInt(event.target.value);
          }

          activeObject.set({
            width: this.elementWidth,
            scaleX: 1
          });
        }
        else if(activeObject.type === 'circle') {
          if(this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.floor(activeObject.width * activeObject.scaleX), 10000, 10);
          }
          else {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10); //parseInt(event.target.value);
          }
          
          activeObject.set({
            scaleX: (this.elementWidth * 1.0008519837389847) / 300,
          });
        }
        else if(activeObject.type === 'line') {
          if(this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(parseInt(activeObject.width), 10000, 10);
          }
          else {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10); //parseInt(event.target.value);
          }
          
          activeObject.width = this.elementWidth;
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') {
          if(this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(activeObject.width * activeObject.scaleX), 10000, 10);
          }
          else {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10);
          }

          activeObject.scaleX = ((this.elementWidth/this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
        }
        break;

      case 'height':
        if(activeObject.type === 'rect') {
          if(this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(parseInt(activeObject.height), 10000, 10);
          }
          else {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10); //parseInt(event.target.value);
          }

          activeObject.set({
            height: this.elementHeight,
            scaleX: 1
          });
        }
        else if(activeObject.type === 'circle') {
          if(this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.floor(activeObject.height * activeObject.scaleY), 10000, 10);
          }
          else {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10); //parseInt(event.target.value);
          }

          activeObject.set({
            scaleY: (this.elementHeight * 1.0008519837389847) / 300,
          });
        }
        else if(activeObject.type === 'line') {
          if(this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(parseInt(activeObject.strokeWidth), 50, 0);
          }
          else {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 50, 0); //parseInt(event.target.value);
          }

          this.activeStrokeWidth = this.elementHeight
          activeObject.set('strokeWidth',this.activeStrokeWidth);
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') {
          if(this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(activeObject.height * activeObject.scaleY), 10000, 10);
          }
          else {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(parseInt(event.target.value), 10000, 10); 
          }

          activeObject.scaleY = ((this.elementHeight/this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
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

  /********** Set width and height of element ***********/
  setWidthofElement(type) {
    let activeObject = this.canvas.getActiveObject();
    
    switch(type) {
      case 'decWidth':  
        if(activeObject.type === 'rect' && this.elementWidth >= 11) {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 10);
          }

          this.elementWidth = this.elementWidth - 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle' && this.elementWidth >= 11) {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 10);
          }
          this.elementWidth = this.elementWidth - 1;
          // activeObject.width = this.elementWidth;
          activeObject.scaleX = ((this.elementWidth * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line' && this.elementWidth >= 11) {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 0);
          }
          this.elementWidth = activeObject.width - 1;
          activeObject.width = this.elementWidth;
        }
        if((activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') && this.elementWidth >= 11) {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 10);
          }
          this.elementWidth = this.elementWidth - 1;
          activeObject.scaleX = ((this.elementWidth/this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
        }
        break;

      case 'incWidth':
        if(activeObject.type === 'rect') {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 10);
          }
          this.elementWidth = this.elementWidth + 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle') {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 10);
          }
          this.elementWidth = this.elementWidth + 1;
          // activeObject.width = this.elementWidth;
          activeObject.scaleX = ((this.elementWidth * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line') {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 0);
          }
          this.elementWidth = activeObject.width + 1;
          activeObject.width = this.elementWidth;
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') {
          if (this.elementHeight == null) {
            this.elementHeight = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementHeight), 10000, 10);
          }
          this.elementWidth = this.elementWidth + 1;
          activeObject.scaleX = ((this.elementWidth/this.whatEleScale) * this.whatEleScale / this.whatEleWidth);
        }
        break;

      case 'decHeight':
        if(activeObject.type === 'rect' && this.elementHeight >= 11) {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = this.elementHeight - 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle' && this.elementHeight >= 11) {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = this.elementHeight - 1;
          // activeObject.height = this.elementHeight;
          activeObject.scaleY = ((this.elementHeight * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line' && this.activeStrokeWidth > 0) {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = activeObject.strokeWidth - 1;
          this.activeStrokeWidth = this.elementHeight
          activeObject.set('strokeWidth',this.activeStrokeWidth);
        }
        if((activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') && this.elementHeight >= 11) {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = this.elementHeight - 1;
          activeObject.scaleY = ((this.elementHeight/this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
        }
        break;

      case 'incHeight':
        if(activeObject.type === 'rect') {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = this.elementHeight + 1;
          activeObject.width = this.elementWidth;
          activeObject.height = this.elementHeight;
          activeObject.scaleX = 1;
          activeObject.scaleY = 1;
        }
        else if(activeObject.type === 'circle') {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = this.elementHeight + 1;
          // activeObject.height = this.elementHeight;
          activeObject.scaleY = ((this.elementHeight * 1.0008519837389847) / 300);
        }
        else if(activeObject.type === 'line' && this.activeStrokeWidth < 50) {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = activeObject.strokeWidth + 1;
          this.activeStrokeWidth = this.elementHeight
          activeObject.set('strokeWidth',this.activeStrokeWidth);
        }
        if(activeObject.element_type === 'shapeSticker' || activeObject.element_type === 'svgSticker' || activeObject.element_type === 'stockphotos' || activeObject.element_type === 'collectionImage' || activeObject.element_type === 'iconSticker') {
          if (this.elementWidth == null) {
            this.elementWidth = this.checkLimitBeforeApplyForInputSlider(Math.round(this.elementWidth), 10000, 10);
          }
          this.elementHeight = this.elementHeight + 1;
          activeObject.scaleY = ((this.elementHeight/this.whatEleScale) * this.whatEleScale / this.whatEleHeight);
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

  /********** Flip active object ***********/
  flip(type) {
    const activeObject = this.canvas.getActiveObject();
    switch(type) {
      case 'y':
        activeObject.flipX = activeObject.flipX ? false : true;
        this.canvas.renderAll();
        break;

      case 'x':
        activeObject.flipY = activeObject.flipY ? false : true;
        this.canvas.renderAll();
        break;
    }
  }

  /********** Rotate active object ***********/
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
    if (this.selectedObjDeg == null) {
      this.selectedObjDeg = parseInt(activeObject.angle);
    }
    else {
      this.selectedObjDeg = event ? parseInt(event.target.value) : Math.round(value);
    }
    
    this.isFromInput = true;
    if (!activeObject) return;
  
    // this.selectedObjDeg = event ? this.checkLimitBeforeApplyForInputSlider(parseFloat(event.target.value), 360, 0) : this.checkLimitBeforeApplyForInputSlider(Math.round(value), 360, 0);
    this.selectedObjDeg = this.checkLimitBeforeApplyForInputSlider(Math.round(this.selectedObjDeg), 360, 0)
    
    // Calculate the object's center points
    const center = activeObject.getCenterPoint();
  
    // Set the angle
    activeObject.angle = this.selectedObjDeg;
    this.selectedObjPos.left = Math.round(activeObject.left);
    this.selectedObjPos.top = Math.round(activeObject.top);
  
    // Move the object to the calculated center
    activeObject.setPositionByOrigin(center, 'center', 'center');
  
    // Update the canvas
    this.canvas.requestRenderAll();
  }
  
  /**********  Change active object color ***********/
  setFill(text_color) {
    
    var activeObject = this.canvas.getActiveObject();
    this.fillColor = text_color;
    if (activeObject) {
      activeObject.set('fill', text_color);
      this.canvas.renderAll();
    }
  }

  /********** Set stroke color, width and radius ***********/
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
        if(this.activeStrokeWidth > 0) {
    
          this.activeStrokeWidth = this.activeStrokeWidth - 1;
          activeObject.set('strokeWidth', this.activeStrokeWidth);
          if(activeObject.type === 'line') {
            this.elementHeight = this.activeStrokeWidth;
          }
          this.canvas.renderAll();  
        }

        break;

      case 'increase':
        if(this.activeStrokeWidth < 50) {
      
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
        if(this.activeBorderRadius > 0) {
    
          this.activeBorderRadius = this.activeBorderRadius - 1;
          activeObject.set('rx', this.activeBorderRadius);
          activeObject.set('ry', this.activeBorderRadius);
          this.canvas.renderAll();  
        }

        break;

      case 'increase':
        if(this.activeBorderRadius < 100) {
      
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

  /********** set shadow blur ***********/
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
        if(this.offSetX == null || this.offSetY == null) {
          this.offSetX = Math.round(this.canvas.getActiveObject().shadow.offsetX);
          this.offSetY = Math.round(this.canvas.getActiveObject().shadow.offsetY);
        }

        this.shadowBlur = parseInt(event.target.value);
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
        if(this.shadowBlur == null || this.offSetY == null) {
          this.shadowBlur = Math.round(this.canvas.getActiveObject().shadow.blur);
          this.offSetY = Math.round(this.canvas.getActiveObject().shadow.offsetY);
        }

        this.offSetX = parseInt(event.target.value);
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
        if(this.offSetX == null || this.shadowBlur == null) {
          this.shadowBlur = Math.round(this.canvas.getActiveObject().shadow.blur);
          this.offSetX = Math.round(this.canvas.getActiveObject().shadow.offsetX);
        }

        this.offSetY = parseInt(event.target.value);
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
        if(this.offSetX > -50) {
    
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
          if(this.offSetX < 50) {
        
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

  /********** set all color using color-picker ***********/
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

  /********** De-select selected object  ***********/
  deselectElement(event) {
    this.canvas.discardActiveObject();
    this.canvas.renderAll(); 
    
    if (this.isFormatPainterEnable == true) {
      this.isFormatPainterEnable = false;
      this.formatPainterClipboard = {};
    }
  }

  /********** Toggle lock in layer section ***********/
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

  /********** Toggle visibility of object ***********/
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

  /********** show replace tooltip ***********/
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

  /********** For SVG Element ***********/
  activateStickerSubTab(key, isOpenReplace: boolean = false) {
    // this.isBasicShapes = false;
    /* switch (key) {
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
    } */

    switch (key) {
      case 'shapes':

        this.setCategoryInCenter();
        if (!this.shape) {
          this.stickers_search_query = "";
          this.shape = true;
          this.stickers = false;
          this.buttons = false;
          this.activeStickers(isOpenReplace);
        }
        else {
          if (isOpenReplace) {
            this.activeStickers(isOpenReplace);
          }
        }
        break;
      
      case 'stickers':
        this.isShapeStickerActive = false;
        this.setCategoryInCenter();
        if (!this.stickers) {
          this.stickers_search_query = "";
          this.stickers = true;
          this.shape = false;
          this.buttons = false;
          this.activeStickers();
        }
        break;
      
      case 'buttons':
        this.isShapeStickerActive = false;
        this.setCategoryInCenter();
        if (!this.buttons) {
          this.stickers_search_query = "";
          this.buttons = true;
          this.shape = false;
          this.stickers = false;
          if (isOpenReplace) {
            this.activeStickers(false);
          } 
          else {
            this.activeStickers();
          }
        }
        break;
      
      default:
        this.setCategoryInCenter();
        this.stickers_search_query = "";
        if (!this.shape) {
          this.shape = true;
          this.activeStickers();
        }
        this.stickers = false;
        this.buttons = false;
        break;
      
    }
  }
  activeStickers(isOpenReplace: boolean = false,) {

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
        if(this.canvas.getActiveObject() && this.canvas.getActiveObject().element_type === "basicShape") {
          this.isBasicShapes = true;
          this.isBasicTabActive = true
        }
        else {
          
          if(this.buttons || this.stickers) {
            
            this.stickerCatalogChanged(this.stickerCatalog_List[0], true);
          }
          else if(this.stickers) {
  
            this.stickerCatalogChanged(this.stickerCatalog_List[0],true);
          }
        }

      });
      
    }
    else if(this.activeTabID === 5) {
      // this.isBgImg = false;
      // this.stock_photo_list = []

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
      payLoad = {
        "search_query": "",
        "page": 1,
        "item_count": 50
      }

      this.dataService.postData("getImagesFromPixabay", payLoad ,{
        headers: {
          Authorization: "Bearer " + localStorage.getItem("ut")
        }
      }).subscribe((res) => {

        if (res["code"] == 200) {
          if (res["data"].result.hits) {
            this.stock_photo_list = res['data']['result']["hits"];
          }
          this.stock_photo_response = res["data"];
          if (this.stock_photo_list && this.stock_photo_list.length <= 0) {
            this.isStockPhotoList = true;
          }
        } 
      })  
    }
    else if(this.activeTabID === 4) {
      // this.isBgImg = true;
      this.activeTab.tabId = 4;
    }
    else if(this.activeTabID === 8) {
      // this.isBgImg = false;
      this.activeTab.tabId = 8;
    }
  }

  /********** Load sticker from database ***********/
  stickerCatalogChanged(catalog_detail, isOpenReplace: boolean = false) {
    this.isBasicShapes = false;
    // if(this.canvas.getActiveObject() && this.canvas.getActiveObject().element_type === "basicShape") {
    //   this.isBasicShapes = true;
    //   this.isBasicTabActive = true
    // }
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

  /********** Add SVG Element ***********/
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
      if(!shape._objects) {
        objects.forEach((obj) => {
          obj.strokeWidth = 0; 
        });
      }
      
      shape.set({
        angle: 0,
        padding: 0,
        borderColor: '#00C3F9',
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

      if (this.isReplaceMode == true && this.canvas.getActiveObject().element_type != 'basicShape' && this.canvas.getActiveObject().type != 'image') {
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

  /********** Add Image Element ***********/
  getImgPolaroid(image_details, uploadfrom = '', st: any = {}, stickerFrom: string = '') {
    // console.log(uploadfrom,"-- uploadfrom --",stickerFrom);
    uploadfrom = (uploadfrom == 'stockphotos') ? 'stockphotos' : stickerFrom;
    var id, that = this;

    if (that.isReplaceMode == true && this.selected && this.canvas.getActiveObject().type == "image" && !this.canvas.getActiveObject().toolType) {
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
          'element_type': uploadfrom,
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
          }
        }
        else {
          customAttribute = {
            'customSourceType': "sticker_json",
            'uploadFrom': uploadfrom,
            'isLocked': false,
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
  /********** Load Collection Image ***********/
  collectionCatalogChanged(catalog_detail) {
    this.collection_sub_tab_shown = true;
    this.collection_catalog_id = catalog_detail.catalog_id;
    this.sel_collection_catalog = catalog_detail;
    this.collection_bg_list = [];

    this.dataService.postData("getContentByCatalogId", {
      "catalog_id": catalog_detail.catalog_id,
      "page": 1,
      "item_count": 100,
      "is_free": catalog_detail.is_free
    }, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((res) => {

      if (res['data'].result && res['data'].result.length > 0) {
        this.isCollectionList = false;
        this.collection_bg_list = catalog_detail;
        this.collection_bg_list.content_list = [];
        
        res['data'].result.forEach(element => {
          this.collection_bg_list.content_list.push(element)
        });

        this.collection_bg_list.is_next_page = res['data'].is_next_page;
      }
    });
  }
  
  /********** Format painter ***********/
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
  
  /********** Image Crop and Eraser ***********/
  openCroper() {

    if(!this.listener){

      this.listener = new FabricCropListener(this.canvas);
    }
    if(this.canvas.getActiveObject().type === 'image' && !this.isCropingEnable) {
      this.isCropingEnable = true;
      this.listener.crop();
    }
  }
  
  openBgRemover() {
    var that = this;
    this.isSubEditorOpen = true;
    var tmpsrc;
    var server_src = this.canvas.getActiveObject().toJSON(custom_attributes).src || this.canvas.getActiveObject().toObject().src;
    tmpsrc = server_src;
    
    const dialogRef = this.dialog.open(BgRemoverToolComponent, {
      width: '330px',
      height: '400px',
      autoFocus: true,
      disableClose: true,
      panelClass: 'bg-reomve-crop-dialog',
      data: tmpsrc
    });

    dialogRef.afterClosed().subscribe((result) => {
      var blob = this.dataURLtoBlob(result.base64);
      var blobUrl = URL.createObjectURL(blob);
      var options = this.canvas.getActiveObject().toObject();
      delete options.filters;
      options.crossOrigin = true;
      var exclusiveName: any = '';
      exclusiveName = this.generateUniqueName('transparent_image', 'png');
      this.canvas.getActiveObject().setSrc(blobUrl, () => {
        if(this.canvas.getActiveObject().isCroped) {
          this.canvas.getActiveObject().height = this.canvas.getActiveObject().cheight;
          this.canvas.getActiveObject().width = this.canvas.getActiveObject().cwidth;
        }
        this.canvas.renderAll();
        // var custom_attr = [
        //   { key: 'isModified', value: true },
        //   { key: 'isTransparent', value: true },
        //   { key: 'exclusiveName', value: exclusiveName }
        // ];
        
        // if (this.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('isCroped')) {
        //   custom_attr.push({ key: 'isCroped', value: false });
        // }
        // if (this.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('ctop') && this.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('cleft') &&
        //   this.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('cwidth') && this.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('cheight')) {
        //   custom_attr.push({ key: 'ctop', value: null });
        //   custom_attr.push({ key: 'cleft', value: null });
        //   custom_attr.push({ key: 'cheight', value: null });
        //   custom_attr.push({ key: 'cwidth', value: null });
        // }
        
      }, options);

    });
  }

  dataURLtoBlob(dataurl) {
    let parts = dataurl.split(','), mime = parts[0].match(/:(.*?);/)[1]
    if (parts[0].indexOf('base64') !== -1) {
        let bstr = atob(parts[1]), n = bstr.length, u8arr = new Uint8Array(n)
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], { type: mime })
    } else {
        let raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: mime })
    }
  }
  generateUniqueName(image_string, type) {
    var chars = "0123456789ABCDEFG5H1IJKLMNO4P71QRST1UVWX7TZabc8defghi9klmnop5qrs99tuvw0xyz";
    var string_length = 15;
    var uniqueId = '';
    for (var i = 0; i < string_length; i++) {
      var rnum = Math.floor(Math.random() * chars.length);
      uniqueId += chars.substring(rnum, rnum + 1);
    }
    var name = uniqueId + '_' + image_string + '_' + Date.now() + '.' + type;
    return name;
  }

  /*********** Convert Cropped image into blob url *************/
  convertCropToBlob(result) {
    var tmpsrc;
    var server_src = this.canvas.getActiveObject().toJSON(custom_attributes).src || this.canvas.getActiveObject().toObject().src;
    var isTransparent = this.canvas.getActiveObject().toJSON(custom_attributes).isTransparent;
    var original_src = this.canvas.getActiveObject().toJSON(custom_attributes).original_src;

    if (isTransparent) {
      tmpsrc = server_src;
    }
    else {
      tmpsrc = original_src || server_src;
    }

    if (result.is_payment_done && result.is_payment_done == true) {
      this.login_response = this.dataService.getLocalStorageData('l_r');
    }

    if (result != false && result != undefined) {
      var that = this;
      
      this.utils.cropImage(tmpsrc, result.top, result.left, result.height, result.width).then((res: any) => {
        try {
          var blob = that.dataURLtoBlob(res.base64);
          var blobUrl = URL.createObjectURL(blob);
          that.canvas.getActiveObject().src = blobUrl;
          this.canvas.renderAll();

          // var options = that.canvas.getActiveObject().toObject();
          // delete options.filters;
          // options.crossOrigin = true;

          // that.canvas.getActiveObject().setSrc(blobUrl, () => {
          //   that.canvas.getActiveObject().set({ height: result.height, width: result.width });
          //   that.canvas.renderAll();
          //   that.renderStackObjects();
          //   if (isTransparent == true) {
          //     var new_attr: any = [];
          //     if (that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('isCroped') &&
          //       that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('ctop') &&
          //       that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('cleft') &&
          //       that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('cheight') &&
          //       that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('cwidth')) {
          //       new_attr.push({ key: 'isCroped', value: false })
          //       new_attr.push({ key: 'ctop', value: null });
          //       new_attr.push({ key: 'cleft', value: null });
          //       new_attr.push({ key: 'cheight', value: null });
          //       new_attr.push({ key: 'cwidth', value: null });
          //     }
          //     if (that.canvas.getActiveObject() && !that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('original_src')) {
          //       new_attr.push({ key: 'original_src', value: tmpsrc });
          //     }
          //     new_attr.push({ key: 'isModified', value: true });
          //     this.utils.pushCustomAttribute(this.canvas.getActiveObject().toJSON(custom_attributes), new_attr).then((allAttr: any) => {
          //       // this.canvas.getActiveObject().toObject = (function (toObject) {
          //       //   return function () {
          //       //     return fabric.util.object.extend(toObject.call(this), allAttr);
          //       //   };
          //       // })(this.canvas.getActiveObject().toObject);
          //       that.canvas.renderAll.bind(that.canvas);
          //       let selectedObj = this.canvas.getActiveObject().toJSON(custom_attributes);
          //       this.canvas.loadFromJSON(this.canvas.toJSON(this.custom_attributes), () => {
          //         that.canvas._objects.forEach((o) => {
          //           if (o.toJSON(custom_attributes).id == selectedObj.id) {
          //             that.selectItemAfterAdded(o);
          //           }
          //         });
          //       });
          //       this.renderStackObjects();
          //       that.isSubEditorOpen = false;
          //       setTimeout(() => {
          //         this.changeToolTipPosition(this.selected);
          //       }, 200);
          //     });
          //   }
          //   else {
          //     var custom_attr = [
          //       { key: 'ctop', value: result.top },
          //       { key: 'cleft', value: result.left },
          //       { key: 'cheight', value: result.height },
          //       { key: 'cwidth', value: result.width },
          //       { key: 'isCroped', value: true }
          //     ];
          //     if (!that.canvas.getActiveObject().toJSON(custom_attributes).hasOwnProperty('original_src')) {
          //       custom_attr.push({ key: 'original_src', value: tmpsrc });
          //     }
          //     this.utils.pushCustomAttribute(that.canvas.getActiveObject().toJSON(custom_attributes), custom_attr).then((result: any) => {
          //       // that.canvas.getActiveObject().toObject = (function (toObject) {
          //       //   return function () {
          //       //     return fabric.util.object.extend(toObject.call(this), result);
          //       //   };
          //       // })(that.canvas.getActiveObject().toObject);
          //       that.canvas.renderAll.bind(that.canvas);
          //       let selectedObj = this.canvas.getActiveObject().toJSON(custom_attributes);
          //       this.canvas.loadFromJSON(this.canvas.toJSON(this.custom_attributes), () => {
          //         that.canvas._objects.forEach((o) => {
          //           if (o.toJSON(custom_attributes).id == selectedObj.id) {
          //             that.selectItemAfterAdded(o);
          //           }
          //         });
          //       });
          //       this.renderStackObjects();
          //       that.isSubEditorOpen = false;
          //     });
          //   }
          // }, options);

        } catch (error) {
          this.isSubEditorOpen = false;
        }
      }, err => {
        console.log(err);
        this.isSubEditorOpen = false;
      });
    }
    else {
      this.isSubEditorOpen = false;
    }

  }

  /********** Image Effects ***********/
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
   
    if (this.canvas.getActiveObject().filters) {
      this.canvas.getActiveObject().filters.forEach(element => {
        
        switch (element.__proto__.type) {
        
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

    if(value == null) {
      this.getfilter();
    }
    else {

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
            updateOrAddFilter(image, 'brightness', { brightness: this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0) / 100 });
            // this.props.brightness = value;
            this.props.brightness = this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0);
            break;
  
          case 'contrast':
            updateOrAddFilter(image, 'contrast', { contrast: this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0) / 100 });
            this.props.contrast = this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0);
            break;
  
          case 'saturation':
            updateOrAddFilter(image, 'saturation', { saturation: this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0) / 100 });
            this.props.saturation = this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0);
            break;
  
          case 'blur':
            updateOrAddFilter(image, 'blur', { blur: this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0) / 100 });
            this.props.blur = this.checkLimitBeforeApplyForInputSlider(Math.round(value), 100, 0);
            break;
        
          case 'blend':
            updateOrAddFilter(image, 'blend', {color: value[0], mode: value[1],alpha: (this.checkLimitBeforeApplyForInputSlider(Math.round(value[2]), 100, 1) / 100)})
            this.props.blendColor = value[0];
            this.props.blendMode = value[1];
            this.props.blendAlpha = this.checkLimitBeforeApplyForInputSlider(Math.round(value[2]), 100, 1);
        }
  
        image.applyFilters();
        this.canvas.renderAll();
      }
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

  /********** Adjust image ***********/
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

  /********** Background ***********/
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
        // this.isBgImg = true;
        break;

      case 'images':
        this.bgcolor = false;
        this.gradient = false;
        this.textures = false;
        this.images = true;
        this.bgMyPhotos = false;
        if (this.canvas.backgroundImage) {

          this.isBgImg = true;
        }
        else {
          this.isBgImg = false;
        }
        this.activateAddImageSubTab('bgStockPhotos');
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
      this.canvas.backgroundImage = '';
      this.backgroundStockPhoto = '';
      this.isBgImg = false;
      this.props.canvasFill = transparentColor;
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }
  
  /********** Set BG Color ***********/
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
  
  /********** Set BG Gradient ***********/
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
    this.isFromInput = true;
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
  
  /********** Load BG Collection ***********/
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

  /********** Load Stock Photo ***********/
  getBGStockPhotos(search_query) {
    search_query = this.bg_stock_photo_search_query;
    /* let payLoad = {
      "search_query": "",
      "page": 2,
      "item_count": 200,
    }

    this.dataService.postData("getImagesFromPixabay", payLoad, {
      heheaders: {
        Authorization: "Bearer " + localStorage.getItem("ut")
      }
    }).subscribe((res) => {
    }); */

    this.stock_photo_list = [
      {
        "id": 8783208,
        "pageURL": "https:\/\/pixabay.com\/photos\/nature-landscape-canal-path-8783208\/",
        "type": "photo",
        "tags": "nature, landscape, canal",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/23\/13\/19\/nature-8783208_150.jpg",
        "previewWidth": 150,
        "previewHeight": 84,
        "webformatURL": "https:\/\/pixabay.com\/get\/g50a2cb54a8ad7acda1b5b6489a2c68da0d653f69b0df7087d7451621535ced62f3b5332e50cd640047e914eb03213f10_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 360,
        "largeImageURL": "https:\/\/pixabay.com\/get\/gbf1a256cdea6981f2abaff0742e476109ff335caa964e509530641b95df6ef1c7b37c067400a5ce70f417ff13c2da2211a561ec4ebeb41fddc2adcf47ffa9969_1280.jpg",
        "imageWidth": 6517,
        "imageHeight": 3666,
        "imageSize": 7926735,
        "views": 55,
        "downloads": 39,
        "collections": 11,
        "likes": 53,
        "comments": 16,
        "user_id": 1425977,
        "user": "ChiemSeherin",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/16\/09-32-35-836_250x250.jpg"
      },
      {
        "id": 8780896,
        "pageURL": "https:\/\/pixabay.com\/photos\/frog-lily-pad-pond-water-wildlife-8780896\/",
        "type": "photo",
        "tags": "frog, wallpaper 4k, windows wallpaper",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/15\/13\/frog-8780896_150.jpg",
        "previewWidth": 150,
        "previewHeight": 97,
        "webformatURL": "https:\/\/pixabay.com\/get\/g5ee1f65f4136672f6d4a6d1c748108b2359aa93384e11ece7582f79a92039fc2c0a0d9693dfabe27cb6e9abce91743c9_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 415,
        "largeImageURL": "https:\/\/pixabay.com\/get\/gea29acdd57fe6dc68afa3a2ce1b5994e36a812a1c63dd793b3212c6b4c721c66dcb0416c90a3f583cb99343e8e4d530a8c8adc86908c0d220d35649313af2328_1280.jpg",
        "imageWidth": 3240,
        "imageHeight": 2100,
        "imageSize": 1275682,
        "views": 78,
        "downloads": 62,
        "collections": 2,
        "likes": 46,
        "comments": 20,
        "user_id": 9214707,
        "user": "Mollyroselee",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/04\/16\/20-11-29-225_250x250.jpg"
      },
      {
        "id": 8779824,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-woman-headscarf-veil-8779824\/",
        "type": "illustration",
        "tags": "ai generated, woman, headscarf",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/06\/46\/ai-generated-8779824_150.jpg",
        "previewWidth": 150,
        "previewHeight": 85,
        "webformatURL": "https:\/\/pixabay.com\/get\/g9c23613717488b0b1d313526a563b1c19aa36913d8af3eb4df311385793fa578a142f64be00d07b09a9cf6ad48f42ede_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 362,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g65a9d10fd0e20a127f8797e6da7501b3074ee3638b98846f60bdd01ab21b0891625e3520de04b80d07ecd2e313b3e689d82deb2f2f66cc08ca72e750a23ee80b_1280.jpg",
        "imageWidth": 4084,
        "imageHeight": 2310,
        "imageSize": 3005484,
        "views": 124,
        "downloads": 82,
        "collections": 4,
        "likes": 60,
        "comments": 0,
        "user_id": 10327513,
        "user": "NickyPe",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
        "id": 8780090,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-wine-fruits-berries-8780090\/",
        "type": "illustration",
        "tags": "ai generated, wine, fruits",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/08\/36\/ai-generated-8780090_150.jpg",
        "previewWidth": 85,
        "previewHeight": 150,
        "webformatURL": "https:\/\/pixabay.com\/get\/ge3f1d5cbb28a787ac55e592f5582e37c0aa25d52150696ed78ca6464d7545b40d2793024da074f2bf680cebf0cef70db_640.jpg",
        "webformatWidth": 362,
        "webformatHeight": 640,
        "largeImageURL": "https:\/\/pixabay.com\/get\/ga1d692b9227804694d714736780424524f7b467b54268c240ec581e4fa6a69cdd15e868100800fb1c1cfb32535f26921ea94b5542842134e800fef0a5de6d0d7_1280.jpg",
        "imageWidth": 2310,
        "imageHeight": 4084,
        "imageSize": 1521800,
        "views": 134,
        "downloads": 90,
        "collections": 3,
        "likes": 58,
        "comments": 0,
        "user_id": 10327513,
        "user": "NickyPe",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
        "id": 8775773,
        "pageURL": "https:\/\/pixabay.com\/photos\/winter-nevada-snow-path-home-8775773\/",
        "type": "photo",
        "tags": "winter, nevada, nature",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/20\/16\/50\/winter-8775773_150.jpg",
        "previewWidth": 150,
        "previewHeight": 100,
        "webformatURL": "https:\/\/pixabay.com\/get\/g04445ccb6636409fa6495315c964fc4db6578ec992eb6d7489be35df6146337a1185b000b6ec9df57af3db7c6e803b40_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 427,
        "largeImageURL": "https:\/\/pixabay.com\/get\/gffeb500374b1f7a880caf7041b96d5a6b4df9e313c2cb881ada57b88628da5bee2ec9973f87e4ea7cb76ac6758993c706144281ebd1dd7777cb53c4041f82b72_1280.jpg",
        "imageWidth": 7087,
        "imageHeight": 4724,
        "imageSize": 5710581,
        "views": 1873,
        "downloads": 1684,
        "collections": 9,
        "likes": 85,
        "comments": 20,
        "user_id": 3764790,
        "user": "ELG21",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2022\/04\/07\/18-24-56-559_250x250.jpg"
      },
      {
        "id": 8783345,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/woman-multicoloured-very-beautiful-8783345\/",
        "type": "illustration",
        "tags": "woman, multicoloured, very beautiful",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/23\/15\/09\/woman-8783345_150.jpg",
        "previewWidth": 150,
        "previewHeight": 86,
        "webformatURL": "https:\/\/pixabay.com\/get\/g1d229d0e1f4d866a1fd3376a60b8094793b24a3759e33a51ee025e6e66ec50802dbc6eb1e09bbe9ac67f8ba33a1e656d_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 367,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g1ed8240936325c1b449d4c411c995bcd937680053c738e6d6a450c2a00d9b42019747835f4b837e8aa9d372c07533dd3a623143091a29e76fc48eec917ff9168_1280.jpg",
        "imageWidth": 4030,
        "imageHeight": 2310,
        "imageSize": 2088919,
        "views": 46,
        "downloads": 28,
        "collections": 3,
        "likes": 55,
        "comments": 0,
        "user_id": 10327513,
        "user": "NickyPe",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
        "id": 8783202,
        "pageURL": "https:\/\/pixabay.com\/photos\/nature-landscape-canal-path-8783202\/",
        "type": "photo",
        "tags": "nature, landscape, canal",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/23\/13\/16\/nature-8783202_150.jpg",
        "previewWidth": 150,
        "previewHeight": 111,
        "webformatURL": "https:\/\/pixabay.com\/get\/g67ea9b958a50606ef7e8e8e3998b6e5e75de8e99a4985adfa9573cc08be503dfe5b25cd75c5ee86f7c47b933923a9991_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 473,
        "largeImageURL": "https:\/\/pixabay.com\/get\/gaf76a4c107a4632468ceb42c3f2e2ebbdba284652dd3c68da595a16bf6535d5f0c8c3ef7896932acd70ee8d6a87a50786f5556b00ee43c63ea239c575e8905e3_1280.jpg",
        "imageWidth": 6028,
        "imageHeight": 4458,
        "imageSize": 10469147,
        "views": 51,
        "downloads": 41,
        "collections": 9,
        "likes": 48,
        "comments": 10,
        "user_id": 1425977,
        "user": "ChiemSeherin",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/16\/09-32-35-836_250x250.jpg"
      },
      {
        "id": 8783349,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-drink-lemon-glass-8783349\/",
        "type": "illustration",
        "tags": "ai generated, drink, lemon",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/23\/15\/12\/ai-generated-8783349_150.jpg",
        "previewWidth": 85,
        "previewHeight": 150,
        "webformatURL": "https:\/\/pixabay.com\/get\/g6eb4b09b1290b799e0c38f5bda74909551ddbf93619e959bc44358943d8526eb5da8e52699eae153adc15d705f5ce8df_640.jpg",
        "webformatWidth": 362,
        "webformatHeight": 640,
        "largeImageURL": "https:\/\/pixabay.com\/get\/ge51ffb68be8549698c1a20863473b78d5d49fc33c7c0ae7e39a9966cca00938d2d3918e5290f88613d606c45538ca0a8ddb3aeeb4c9df430c1701aa30c32a7ac_1280.jpg",
        "imageWidth": 2310,
        "imageHeight": 4084,
        "imageSize": 1682731,
        "views": 30,
        "downloads": 12,
        "collections": 4,
        "likes": 53,
        "comments": 0,
        "user_id": 10327513,
        "user": "NickyPe",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
        "id": 8779808,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-woman-turban-cloth-8779808\/",
        "type": "illustration",
        "tags": "ai generated, woman, turban",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/06\/39\/ai-generated-8779808_150.jpg",
        "previewWidth": 85,
        "previewHeight": 150,
        "webformatURL": "https:\/\/pixabay.com\/get\/g93bc839f96f0b524aa670233a51820ae151f9f6067bcdad40dcf593029f277676c25ba1570d342ce0980d996ae307858_640.jpg",
        "webformatWidth": 362,
        "webformatHeight": 640,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g12e6b2b4ede40b9f20d5103323683b72f7b4d723f83d9917760020c3608bce755f69e9dc93b7dc532927d96f5b521b036ad7b23d924f58062d6f7d8341dc7a54_1280.jpg",
        "imageWidth": 2310,
        "imageHeight": 4084,
        "imageSize": 2180468,
        "views": 133,
        "downloads": 68,
        "collections": 2,
        "likes": 54,
        "comments": 0,
        "user_id": 10327513,
        "user": "NickyPe",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
        "id": 8782405,
        "pageURL": "https:\/\/pixabay.com\/photos\/kiskadee-benteveo-bird-animal-8782405\/",
        "type": "photo",
        "tags": "kiskadee, benteveo, bird",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/23\/07\/03\/kiskadee-8782405_150.jpg",
        "previewWidth": 150,
        "previewHeight": 106,
        "webformatURL": "https:\/\/pixabay.com\/get\/g5fb767e68da13f997e28d853d85f53664446bcb15251dcc9b29700b9029dbd82fe0f0dd32c53c23a41e21c651d90d5e7_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 453,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g9802d2788011dc0d0db886099e66b6e291b04f1b449141d8f711dd5a089475f5ab99828c46d7e1fc05fceeaf21dd1545ca7d500b2dfd850b97788f02f3b5401a_1280.jpg",
        "imageWidth": 4315,
        "imageHeight": 3055,
        "imageSize": 2161901,
        "views": 47,
        "downloads": 38,
        "collections": 1,
        "likes": 46,
        "comments": 0,
        "user_id": 17561499,
        "user": "Beto_MdP",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2022\/02\/04\/00-22-52-402_250x250.jpg"
      },
      {
        "id": 8781136,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-lavender-field-bloom-8781136\/",
        "type": "illustration",
        "tags": "ai generated, lavender, field",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/16\/45\/ai-generated-8781136_150.jpg",
        "previewWidth": 150,
        "previewHeight": 100,
        "webformatURL": "https:\/\/pixabay.com\/get\/g15b1b700083dd7f117adff88ab17480a0bd02a056b7a8bc57deda9e400f6ff44295868ff1d73a5a1f834b5fc48136ab1_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 427,
        "largeImageURL": "https:\/\/pixabay.com\/get\/ge6fd1754ce26ef15e69a2008720daf5abb61b2d6b21e7f03b0e9e93a644aa38d05905e6f5f2d85c2445bd19b459d780e150dca0b51de6930d3303856446b5bbd_1280.jpg",
        "imageWidth": 5016,
        "imageHeight": 3344,
        "imageSize": 2015532,
        "views": 45,
        "downloads": 31,
        "collections": 2,
        "likes": 51,
        "comments": 0,
        "user_id": 7673058,
        "user": "Ray_Shrewsberry",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
        "id": 8775846,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/sky-cumulus-atmosphere-cloudscape-8775846\/",
        "type": "illustration",
        "tags": "sky, cumulus, atmosphere",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/20\/17\/33\/sky-8775846_150.png",
        "previewWidth": 150,
        "previewHeight": 113,
        "webformatURL": "https:\/\/pixabay.com\/get\/gbb713d695614466e158b4eee848981e25cbb4009d5b3f052ca42bc5f1bd3b40a4c0a8d8a1832efcb0d56efdac2b94b7e_640.png",
        "webformatWidth": 640,
        "webformatHeight": 480,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g8f2e77593a7dcbee8ecd7ab9c98ddc2bf7a4ad2810a0ff2e030cd6dcfdb6d57edd97eb544174e178aef11d4ca710685ecfd8541684426db58ad1679994990026_1280.png",
        "imageWidth": 4160,
        "imageHeight": 3121,
        "imageSize": 8960481,
        "views": 2959,
        "downloads": 2108,
        "collections": 32,
        "likes": 79,
        "comments": 12,
        "user_id": 28956359,
        "user": "Satya_1",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2023\/12\/06\/09-11-41-397_250x250.jpg"
      },
      {
        "id": 8780779,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-coneflower-flower-8780779\/",
        "type": "illustration",
        "tags": "ai generated, coneflower, flower",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/14\/08\/ai-generated-8780779_150.jpg",
        "previewWidth": 150,
        "previewHeight": 100,
        "webformatURL": "https:\/\/pixabay.com\/get\/g5b7ce2997dc9a559ab9e4119e2dadc1c6203a07d12ff4700c7c4e18ccfb50e8a2a43c941d0e60e5751512041de55d7b6_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 427,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g29c2c9c80da601ecc5a03e43d53e29582b624045b0c93e966b80897a29655ce1bec3f391026248ec8acb8d9f64383c0a8a0e45ee6cce8a3d73b5ae3093bd7b3b_1280.jpg",
        "imageWidth": 5016,
        "imageHeight": 3344,
        "imageSize": 2138198,
        "views": 138,
        "downloads": 108,
        "collections": 1,
        "likes": 52,
        "comments": 0,
        "user_id": 7673058,
        "user": "Ray_Shrewsberry",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
        "id": 8782316,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-rabbit-happy-cartoon-8782316\/",
        "type": "illustration",
        "tags": "ai generated, rabbit, happy",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/23\/06\/10\/ai-generated-8782316_150.jpg",
        "previewWidth": 150,
        "previewHeight": 85,
        "webformatURL": "https:\/\/pixabay.com\/get\/g5e0f67391606209252ada428cb91156221c1c22053aee084f2175ddceb467167790665abde46ef1b0b6e53869801626f_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 362,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g673cfbc7422ae2a5342b14942de1ab3d04689e02d22ab47fa963de2203581b0f8434619c9792241f10b896cb8c8e9749e1e8bbabcca6acd59378ae54936c47fb_1280.jpg",
        "imageWidth": 4084,
        "imageHeight": 2310,
        "imageSize": 1047018,
        "views": 21,
        "downloads": 12,
        "collections": 5,
        "likes": 46,
        "comments": 0,
        "user_id": 10327513,
        "user": "NickyPe",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/02\/05\/16-05-14-742_250x250.jpg"
      },
      {
        "id": 8780413,
        "pageURL": "https:\/\/pixabay.com\/photos\/birds-waterfowl-lake-wildlife-8780413\/",
        "type": "photo",
        "tags": "birds, waterfowl, lake",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/11\/06\/birds-8780413_150.jpg",
        "previewWidth": 150,
        "previewHeight": 100,
        "webformatURL": "https:\/\/pixabay.com\/get\/g0684a803b159faf36edc0dfa57d4a731f4b049db056a709abdb584ae3639db22805b563481898eece9032f3d2ccb0a37_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 427,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g2ae414ab59e0e873aa314667f66ce7f1a19945c0d32a17baade425e3faf738b6e22f4fa66517d8f86a82c11b5a19084d163e472fb84773145487d7e56e81b2cc_1280.jpg",
        "imageWidth": 4676,
        "imageHeight": 3119,
        "imageSize": 4122670,
        "views": 190,
        "downloads": 156,
        "collections": 4,
        "likes": 47,
        "comments": 11,
        "user_id": 1425977,
        "user": "ChiemSeherin",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/16\/09-32-35-836_250x250.jpg"
      },
      {
        "id": 8779596,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-sombrero-hat-mexican-8779596\/",
        "type": "illustration",
        "tags": "ai generated, sombrero, hat",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/03\/45\/ai-generated-8779596_150.jpg",
        "previewWidth": 150,
        "previewHeight": 100,
        "webformatURL": "https:\/\/pixabay.com\/get\/g666be18412dbe9224052b1ed10caa10a0eb30bcc5e204e54800356ec626f4f2c421559e74a96292156badadaa70a8001_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 427,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g8f25ae6595d7af753788703ebbed35cdfa4f42d23d2bc4ffa00806a7fffa4cd77ec4d2410784b35915ed84c9fc9954528f732e43e4f1ac910d32abeb6e1dab0a_1280.jpg",
        "imageWidth": 5016,
        "imageHeight": 3344,
        "imageSize": 2677222,
        "views": 127,
        "downloads": 96,
        "collections": 1,
        "likes": 53,
        "comments": 0,
        "user_id": 7673058,
        "user": "Ray_Shrewsberry",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
        "id": 8780840,
        "pageURL": "https:\/\/pixabay.com\/illustrations\/ai-generated-sunflower-flower-8780840\/",
        "type": "illustration",
        "tags": "ai generated, sunflower, flower",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/14\/39\/ai-generated-8780840_150.jpg",
        "previewWidth": 100,
        "previewHeight": 150,
        "webformatURL": "https:\/\/pixabay.com\/get\/g8d875aec713b97adaa7b2f2b61cdaac2e4fcfcff094d4133bf50b2aa04bc67647744f92e94ba604869a2932afd66ec80_640.jpg",
        "webformatWidth": 427,
        "webformatHeight": 640,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g84da57ae7427e2d6839e1a07e59d42b507a8d03194b97e7b008196812ccd870669ec76389c33e41b1e2150067d9210a67945884b49371ec0efbe5a87df6ea1c2_1280.jpg",
        "imageWidth": 3344,
        "imageHeight": 5016,
        "imageSize": 2706555,
        "views": 45,
        "downloads": 34,
        "collections": 1,
        "likes": 48,
        "comments": 0,
        "user_id": 7673058,
        "user": "Ray_Shrewsberry",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/03\/29\/03-05-16-838_250x250.jpg"
      },
      {
        "id": 8780402,
        "pageURL": "https:\/\/pixabay.com\/photos\/goosander-gosling-chicks-goose-8780402\/",
        "type": "photo",
        "tags": "goosander, gosling, chicks",
        "previewURL": "https:\/\/cdn.pixabay.com\/photo\/2024\/05\/22\/11\/03\/goosander-8780402_150.jpg",
        "previewWidth": 150,
        "previewHeight": 84,
        "webformatURL": "https:\/\/pixabay.com\/get\/g5668d831ee181d3f48296437ac47740f62b267c5a1a881e478f0c5d44342a35fa7bd5f107547ca7ec53b54851d1621e5_640.jpg",
        "webformatWidth": 640,
        "webformatHeight": 360,
        "largeImageURL": "https:\/\/pixabay.com\/get\/g4d6425497ff0a03631bfff279df5cb2bae644ac4b4da47cd53ee5465aa9435bd533e3e246408fd8728f51bfe40c685e2ace35fa9556992e563a8b5d54264d3b6_1280.jpg",
        "imageWidth": 4482,
        "imageHeight": 2521,
        "imageSize": 2187058,
        "views": 184,
        "downloads": 152,
        "collections": 4,
        "likes": 45,
        "comments": 12,
        "user_id": 1425977,
        "user": "ChiemSeherin",
        "userImageURL": "https:\/\/cdn.pixabay.com\/user\/2024\/01\/16\/09-32-35-836_250x250.jpg"
      },
    ]
  }
  async setCanvasImageForStockPhoto(stock_photo) {
    this.props.canvasImage = stock_photo.largeImageURL;
    await this.setCanvasImage(stock_photo);
    await this.canvas.renderAll();
  }

  public bgScrollLeft(): void {
    this.backgroundsTab.nativeElement.scrollLeft -= 100;
  }
  public bgScrollRight(): void {
    this.backgroundsTab.nativeElement.scrollLeft += 100;
  }
  public clScrollLeft(): void {
    this.collectionTab.nativeElement.scrollLeft -= 100;
  }
  public clScrollRight(): void {
    this.collectionTab.nativeElement.scrollLeft += 100;
  }
  setCategoryInCenter() { 
    setTimeout(() => {
      
      if (document.getElementsByClassName('new-active')[0]) {
        document.getElementsByClassName('new-active')[0].scrollIntoView({ behavior: "smooth", block: 'end', inline: 'center' });
      }
    }, 200);
  }

  /********** Tools functions ***********/
  hideToolTab(type) {
    if (type == "default") {
      if (this.active_tool == "chart" && this.chart_workspace) {
        this.edit_chart_status = false;
        // this.resetChartTab();
        this.active_tool == "chart";
      }
      else {
        this.active_tool = type;
      }
    }
    else {
      this.active_tool = type;
    }
    this.edit_qr_status = false;
    this.edit_barcode_status = false;
    if (type == "qrcode") {
      if (!this.QrCode) {
        // import("qrcode").then(QRCode => {
        //   this.QrCode = QRCode;
        // });
      }
      // this.resetQrTab();
    }
    else if (type == "barcode") {
      this.barcode_value = "";
      if (!this.JsBarcode) {
        // import("jsbarcode").then(JsBarcode => {
        //   this.JsBarcode = JsBarcode;
        // });
      }
      // this.resetBarcodeTab();
    }
    else if (type == "chart") {
      this.edit_chart_status = false;
      // this.resetChartTab();
      if (!this.XLSX) {

        // import("xlsx").then(XLSX => {
        //   this.XLSX = XLSX;
        // });
      }
    }
  }
  changeQrTab(type) {
    this.active_qr_tab = type;
  }
  changeBarcodeTab(type) {
    this.active_barcode_tab = type;
  }
  openDropDown(status, code_type_data) {
    if (status == "open") {
      $("#qrSelctOption").slideToggle("fast");
    }
    else {
      $("#qrSelctOption").slideUp("fast");
      if (code_type_data) {

        this.qr_code_error = false;
        this.qr_field_error = "";
        this.qr_field_error_types = {
          "email_error": "",
          "phone_error": "",
          "url_error": ""
        }
        if (this.active_tool == "qrcode") {
          this.active_qr_data = code_type_data;
          if (code_type_data.select_name == "Contact") {

            this.active_qr_data.qr_data = {
              "name": "",
              "firstname": "",
              "organization": "",
              "email": "",
              "phone": "",
              "address": "",
              "website": ""
            }
          }
          else if (code_type_data.select_name == "SMS") {

            this.active_qr_data.qr_data = {
              "number": "",
              "message": ""
            }
          }
          else if (code_type_data.select_name == "Email") {

            this.active_qr_data.qr_data = {
              "email": "",
              "subject": "",
              "body": ""
            }
          }
          else if (code_type_data.select_name == "Wifi") {

            this.active_qr_data.qr_data = {
              "security": "none",
              "networkName": "",
              "password": ""
            }
          }
          else {
            this.active_qr_data.qr_data = "";
          }
          if (this.edit_qr_status) {
            setTimeout(() => {
              // document.getElementById("qrcode_gen_btn").setAttribute("disabled", "");
            }, 100);
          }
          // this.generateQrCode(this.active_qr_data);
        }
        else if (this.active_tool == "barcode") {

          this.barcode_value = "";
          this.active_barcode_data = code_type_data;
          // this.generateBarcode(this.active_barcode_data.format);
        }
        else if (this.active_tool == "chart" && this.chart_workspace) {

          if (this.active_select_chart_type.chart_type != code_type_data.chart_type) {
            this.active_select_chart_type = JSON.parse(JSON.stringify(code_type_data));
            // this.changeBarType(code_type_data.chart_type, "select", "add", "normal");
          }
        }
      }
    }
  }
  checkValidFieldForQr(type, qr_data_obj) {
    var pattern;
    var code_value = "";
    var msg;
    if (type == "url") {
      pattern = /\s/g;
      if (qr_data_obj.select_name == "URL") {
        code_value = qr_data_obj.qr_data;
      }
      else {
        code_value = qr_data_obj.qr_data.website;
      }
      if (code_value.trim().length > 0) {
        if (pattern.test(code_value)) {
          this.qr_field_error_types.url_error = "Please enter valid URL";
        }
        else {
          this.qr_field_error_types.url_error = "";
        }
      }
      else {
        this.qr_field_error_types.url_error = "";
      }
    }
    else if (type == "phone") {
      pattern = /^[ +()]*[0-9][ +()0-9]*$/;
      // pattern = /^( +())[0-9]$/;
      if (qr_data_obj.select_name == "Phone") {
        code_value = qr_data_obj.qr_data;
      }
      else if (qr_data_obj.select_name == "Contact") {
        code_value = qr_data_obj.qr_data.phone;
      }
      else if (qr_data_obj.select_name == "SMS") {
        code_value = qr_data_obj.qr_data.number;
      }
      if (code_value.trim().length > 0) {
        if (pattern.test(code_value)) {
          this.qr_field_error_types.phone_error = "";
        }
        else {
          this.qr_field_error_types.phone_error = "Please enter valid Phone Number";
        }
      }
      else {
        this.qr_field_error_types.phone_error = "";
      }
    }
    else if (type == "email") {
      code_value = qr_data_obj.qr_data.email;
      pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (code_value.trim().length > 0) {
        if (pattern.test(code_value)) {
          this.qr_field_error_types.email_error = "";
        }
        else {
          this.qr_field_error_types.email_error = "Please enter valid Email Address";
        }
      }
      else {
        this.qr_field_error_types.email_error = "";
      }
    }
  }
  generateQrCode(active_qr_data) {
  }
}
