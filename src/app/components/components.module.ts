import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [AudioPlayerComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSliderModule,
    FormsModule,
    MatButtonModule
  ],
  exports: [AudioPlayerComponent]
})
export class ComponentsModule { }
