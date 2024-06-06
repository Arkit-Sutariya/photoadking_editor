import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSelectModule } from "@angular/material/select";
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from "@angular/material/dialog";
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReverseArrayPipe } from './reverse-array.pipe'; 
import { DataService } from 'src/app/services/data.service';
import { BgRemoverToolComponent } from './bg-remover-tool/bg-remover-tool.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
  declarations: [
    AppComponent,
    ReverseArrayPipe,
    BgRemoverToolComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    MatSliderModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMenuModule,
    MatRadioModule,
    MatDialogModule,
    ColorPickerModule,
    NgxUiLoaderModule,
    NgbModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground : true
    }),
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
