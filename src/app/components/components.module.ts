import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudioPlayerComponent } from './audio-player/audio-player.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CardComponent } from './card/card.component';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  declarations: [AudioPlayerComponent, CardComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    MatSliderModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatGridListModule
  ],
  exports: [AudioPlayerComponent, CardComponent]
})
export class ComponentsModule { }
