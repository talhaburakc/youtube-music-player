import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { YoutubeDlService} from './services/youtube-dl/youtube-dl.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from "ngx-spinner";
import { enableProdMode } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { SocialLoginModule, AuthServiceConfig, LoginOpt } from "angularx-social-login";
import { GoogleLoginProvider, FacebookLoginProvider } from "angularx-social-login";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';

import { faPlay, faStop, faPause, faStepBackward, faStepForward, faChevronCircleRight, faChevronCircleLeft, faAngleDoubleUp, faAngleDoubleDown, faCircle, faPlus } from '@fortawesome/free-solid-svg-icons';
import { ComponentsModule } from './components/components.module';
import { environment } from '../environments/environment';

library.add(faPlay, faStop, faPause, faStepBackward, faStepForward, faChevronCircleRight, faChevronCircleLeft, faAngleDoubleUp, faAngleDoubleDown, faCircle, faPlus);

const googleLoginOptions: LoginOpt = {
  scope: 'https://www.googleapis.com/auth/youtube.readonly'
};

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(environment.GOOGLE_AUTH_KEY, googleLoginOptions)
  }
]);

export function provideConfig() {
  return config;
}

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
    MatButtonModule,
    ComponentsModule,
    MatListModule,
    SocialLoginModule
  ],
  providers: [
    YoutubeDlService,
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
