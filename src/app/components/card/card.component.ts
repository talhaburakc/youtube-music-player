import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  
  @Input() video: any;
  @Output() onVideoClick = new EventEmitter();
  @Output() onPlaylistClick = new EventEmitter();
  
  constructor() { }

  ngOnInit() {
  }

  videoClick(video) {
    this.onVideoClick.emit(video);
  }

  playlistClick(video) {
    this.onPlaylistClick.emit(video);
  }
}
