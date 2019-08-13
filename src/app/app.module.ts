import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YoutubeDlService} from './services/youtube-dl/youtube-dl.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import { faPlay, faStop, faPause, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';

library.add(faPlay, faStop, faPause, faStepBackward, faStepForward);


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MatSliderModule,
    NgxSpinnerModule,
    MatCardModule,
    MatGridListModule,
    MatInputModule,
    MatButtonModule
  ],
  providers: [
    YoutubeDlService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
