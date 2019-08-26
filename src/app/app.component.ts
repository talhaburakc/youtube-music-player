import { Component, ViewEncapsulation } from '@angular/core';
import { YoutubeDlService } from './services/youtube-dl/youtube-dl.service';
import { YoutubeService } from './services/youtube/youtube.service';
import { Howl, Howler } from 'howler';
import { NumberValueAccessor } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None // required to add background color to whole page
})
export class AppComponent {
  watchURL: string = 'https://www.youtube.com/watch?v=';

  playing: boolean = false;
  search: string;
  audio: Howl;
  currentSeekValue: number = 0;
  songDuration: number;
  sliderDisabled: boolean = true;
  volumeValue: number;
  timer: any = null;
  videoList: Array<any>;
  isAudioLoaded: boolean = false;
  isPlaylistClicked: boolean = false;

  playlist: Array<any>;

  constructor(private youtubedl: YoutubeDlService, private youtube: YoutubeService, private spinner: NgxSpinnerService) {
    this.onLoad = this.onLoad.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  ngOnInit() { }

  loadAudio(source, type) {
    if (this.audio) {
      this.stop();
    }
    this.spinner.show();
    let videoUrl;
    let videoId;
    if (type == 'url') {
      videoUrl = source;
      videoId = this.getVideoIdFromUrl(videoUrl);
    } else if ( type == 'id') {
      videoId = source;
      videoUrl = this.watchURL + videoId;
    }
    let volume = 1.0;
    if (this.audio) {
      volume = this.audio.volume();
    }
    this.youtube.getRelatedToVideo(videoId).then((data: any) => {
      console.log('related videos:', data);
    });
    this.youtubedl.getAudioUrl(videoUrl).then( (data) => {
      this.audio = new Howl({
        src: [data as string],
        html5: true,
        volume: volume,
        onload: this.onLoad,
        onend: () => {
          this.playing = false;
          if (this.hasNextInLine()) {
            this.playNextInLine();
          }
        },
        onplay: () => {          
          if (this.timer == null) {
            this.timer = setInterval( this.updateValue, 1000);
          }
          this.updateValue();
          this.sliderDisabled = false;
          this.volumeValue = this.audio.volume() * 100;
          this.playing = true;
        }        
      });
      this.play();
      this.spinner.hide();
      
    }).catch( (err) => {
      this.spinner.hide();
      console.log('ERR', err.status);
    });

  }
  
  hasNextInLine() {
    return false;
  }

  playNextInLine() {

  }

  getVideoIdFromUrl(url: string) {
    let id = url.split('watch?v=')[1];
    if (id.includes('&')) {
      id = id.split('&')[0];
    }
    return id;
  }

  getPlaylistIdFromUrl(url: string) {
    let playlistId = this.search.split('list=')[1];
    if (playlistId.includes('&')) {
      playlistId = playlistId.split('&')[0];
    }
    return playlistId;
  }

  isUrl( s: string) {
    return s.includes('youtube.com/watch');
  }

  isPlaylistUrl( s: string) {
    return this.isUrl(s) && s.includes('list');
  }

  getSearchResults() {
    this.youtube.getSearchResults(this.search).then((data: any) => {
      this.videoList = data;
    }, err => {
    
    });
  }

  onVideoClick(video) {
    console.log(video.id.videoId);
    if (this.audio && this.audio.state() == 'loaded') {
      this.audio.unload();
    }
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.loadAudio(video.id.videoId, 'id');
  }

  updateValue() {
    this.currentSeekValue = Math.floor(this.audio.seek() as number);
  }

  onLoad() {
    this.songDuration = this.audio.duration();
    this.isAudioLoaded = true;
  }

  play() {
    if ( this.audio && !this.audio.playing() ) {
      this.audio.play();
      this.playing = true;
    }
  }

  pause() {
    if ( this.audio && this.audio.playing() ) {
      this.audio.pause();
      this.playing = false;
    }
  }

  stop() {
    if ( this.audio.state() == "loaded") {
      this.audio.unload();
      clearInterval(this.timer);
      this.timer = null;
      this.sliderDisabled = true;
      this.isAudioLoaded = false;
    }
  }

  keyDownFunction(e) {
    if (e.key == "Enter") {
      if (this.isPlaylistUrl(this.search)) {
        this.getPlaylist();
        this.isPlaylistClicked = true;
      } else if ( this.isUrl(this.search)) {
        this.loadAudio(this.search, 'url');
      } else {
        this.getSearchResults();
      }
    }
  }

  getPlaylist() {
    if (!this.isPlaylistUrl(this.search)) {
      return;
    }
    let playlistId = this.getPlaylistIdFromUrl(this.search);
    console.log(playlistId);
    this.youtube.getPlaylistVideos(playlistId).then((data: any) => {
      console.log(data);
      this.playlist = data;
    });
  }

  playFromPlaylist(s) {
    console.log(s);
    console.log(s.snippet.resourceId.videoId);

    this.loadAudio(s.snippet.resourceId.videoId, 'id');
  }

  onSeekValueChange(value) {
    this.currentSeekValue = value;
    this.audio.seek(this.currentSeekValue);
    this.updateValue();
    if ( this.timer == null) {
      this.timer = setInterval( this.updateValue, 1000);
    }
  }

  onSeekSlide(value) {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  onVolumeValueChange(value) {
    this.volumeValue = value;
    this.audio.volume(this.volumeValue / 100);
    this.volumeValue = this.audio.volume() * 100;
  }

  nextPage() {
    this.youtube.getNextSearchResults(this.search).then((data: any) => {
      this.videoList = data;
    }, err => {
      console.log('ERR', err);
    });
  }

  prevPage() {
    this.youtube.getPrevSearchResults(this.search).then((data: any) => {
      this.videoList = data;
    }, err => {
      console.log('ERR', err);
    });
  }

  onPlaylistSlideClick() {
    this.isPlaylistClicked = !this.isPlaylistClicked;
  }
}
