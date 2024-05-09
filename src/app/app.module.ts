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
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxUiLoaderHttpModule, NgxUiLoaderModule } from 'ngx-ui-loader';
import { ReverseArrayPipe } from './reverse-array.pipe'; 
import { DataService } from 'src/app/services/data.service';

@NgModule({
  declarations: [
    AppComponent,
    ReverseArrayPipe
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
    ColorPickerModule,
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({
      showForeground : true
    }),
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
