import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.css']
})
export class AudioPlayerComponent implements OnInit {

  @Input()
  set currentSeekValue( currentSeekValue: number) {
    this._currentSeekValue = currentSeekValue;
    this.formattedCurrentSeekValue = this.parseSecondsToMinuteFormat(this._currentSeekValue);
  }
  get currentSeekValue(): number { return this._currentSeekValue; }

  @Input()
  set songDuration( songDuration: number) {
    this._songDuration = songDuration;
    this.songDurationFormatted = this.parseSecondsToMinuteFormat(this._songDuration);
  }
  get songDuration(): number { return this._songDuration; }
  
  @Input() volumeValue;
  @Input() showThumbLabelVolume: boolean = true;
  @Input() audioLoaded: boolean = true;
  @Input() playing: boolean = false;

  @Output() onPlay = new EventEmitter();
  @Output() onPause = new EventEmitter();
  @Output() onSeekValueChange = new EventEmitter();
  @Output() onSeekSlide = new EventEmitter();
  @Output() onVolumeValueChange = new EventEmitter();
  @Output() onVolumeSlide = new EventEmitter();

  private _songDuration: number;
  private _currentSeekValue: number;
  formattedCurrentSeekValue: string;
  showSeekThumbLabel: boolean = true;
  showVolumeThumbLabel: boolean = true;
  songDurationFormatted: string = "0:00";

  constructor() {
    this.formatSeekLabel = this.formatSeekLabel.bind(this);
  }

  ngOnInit() {
  }

  play() {
    if (!this.playing) {
      this.onPlay.emit();
      this.playing = true;
    }
  }

  pause() {
    if (this.playing) {
      this.onPause.emit();
      this.playing = false;
    }
  }

  parseSecondsToMinuteFormat(seconds: number) {
    if (!seconds) {
      return '0:00';
    }
    let minute = Math.floor(seconds / 60) + '';
    let second = Math.floor(seconds % 60) + '';
    if ( seconds % 60 < 10) {
      second = '0' + second;
    }
    return minute + ':' + second;
  }

  onSeekSliderChange(e) {
    this.currentSeekValue = e.value;
    this.onSeekValueChange.emit(this.currentSeekValue);
    this.showSeekThumbLabel = false;
  }

  onSeekSliderSlide(e) {
    this.onSeekSlide.emit(e.value);
    this.showSeekThumbLabel = true;
  }

  onVolumeSliderChange(e) {
    this.onVolumeValueChange.emit(e.value);
    this.showVolumeThumbLabel = false;
  }

  onVolumeSliderSlide(e) {
    this.onVolumeSlide.emit(e.value);
    this.showVolumeThumbLabel = true;
  }

  formatSeekLabel(value: number | null) {
    let number = this.parseSecondsToMinuteFormat(value as number);
    return number;
  }

  formatVolumeLabel(value: number | null) {
    return Math.floor(value);
  }
}
