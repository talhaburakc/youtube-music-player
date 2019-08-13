import { Component } from '@angular/core';
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
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  watchURL: string = 'https://www.youtube.com/watch?v=';

  playing: boolean = false;
  title = 'youtube-mp3-player';
  url: string;
  audio: Howl;
  durationValue: number = 0;
  formattedValue: string = '0';
  showThumbLabel: boolean = true;
  showThumbLabelVolume: boolean = true;
  songDurationFormatted: string = "0:00";
  songDuration: number;
  sliderDisabled: boolean = true;
  volumeValue: number;
  timer: any = null;
  videoList: Array<any>;
  playlistVideos: Array<any>;
  playlistAudios: Array<any>;
  isClickInProgress: boolean = false;

  playlistSearch: any;

  constructor(private youtubedl: YoutubeDlService, private http: HttpClient, private youtube: YoutubeService, private spinner: NgxSpinnerService) {
    this.onLoad = this.onLoad.bind(this);
    this.updateValue = this.updateValue.bind(this);
    this.formatLabel = this.formatLabel.bind(this);
    this.volumeLabel = this.volumeLabel.bind(this);
  }

  ngOnInit() { // TODO: multiple clicks on same video throws error
    
  }

  loadAudio(source, type) {
    this.isClickInProgress = true;
    this.spinner.show();
    let videoUrl;
    if (type == 'url') {
      videoUrl = source;
    } else if ( type == 'id') {
      videoUrl = this.watchURL + source;
    }
    this.youtubedl.getAudioUrl(videoUrl).then( (data) => {
      this.audio = new Howl({
        src: [data as string],
        html5: true,
        volume: 1.0,
        onload: this.onLoad,
        onplay: () => {
          this.timer = setInterval( this.updateValue, 1000);
          this.sliderDisabled = false;
          this.volumeValue = this.audio.volume() * 100;
          this.playing = true;
        }
      });
      this.play();
      this.isClickInProgress = false;
      this.spinner.hide();
      
    }).catch( (err) => {
      this.isClickInProgress = false;
      this.spinner.hide();
      console.log('ERR', err.status);
    });

  }

  isUrl( s: string) {
    return s.includes('youtube.com/watch');
  }

  get() {
    if ( this.isUrl(this.url)) {
      this.loadAudio(this.url, 'url');
      return;
    } 
    /* 
    GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY] HTTP/1.1

    Authorization: Bearer [YOUR_ACCESS_TOKEN]
    Accept: application/json

    */
    this.youtube.getSearchResults(this.url).then((data: any) => {
      this.videoList = data;
    }, err => {
    
    });
    /*
    const httpOptions = {
      headers: new HttpHeaders({
      //Authorization: 'Bearer' + ,
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${this.url}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      console.log('response: ', res);
      this.videoList = res.body['items'];
      console.log('videoList:', this.videoList);
    });*/
  }

  onVideoClick(video) {
    console.log(video.id.videoId);
    this.loadAudio(video.id.videoId, 'id');
  }

  parseSecondsToMinuteFormat(seconds: number) {
    let minute = Math.floor(seconds / 60) + '';
    let second = Math.floor(seconds % 60) + '';
    if ( seconds % 60 < 10) {
      second = '0' + second;
    }
    return minute + ':' + second;
  }

  parseMinuteFormatToSeconds(format: string) {
    console.log('format:', format);
    let arr = (format.toString()).split(':');
    console.log('arr:', arr)
    return (parseInt(arr[0]) * 60) + parseInt(arr[1]);
  }

  updateValue() {
    this.formattedValue = this.parseSecondsToMinuteFormat( Math.floor(this.audio.seek() as number));
    this.durationValue = Math.floor(this.audio.seek() as number);
  }

  onLoad() {
    this.songDurationFormatted = this.parseSecondsToMinuteFormat(this.audio.duration());
    this.songDuration = this.audio.duration();
  }

  play() {
    if ( this.audio && !this.audio.playing() ) {
      this.audio.play();
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
    }
  }

  onReleaseClick() {
    this.showThumbLabel = false;
    this.audio.seek(this.durationValue);
    this.updateValue();
    if ( this.timer == null) {
      this.timer = setInterval( this.updateValue, 1000);
    }
    
  }

  onClick() {
    clearInterval(this.timer);
    this.timer = null;
    this.showThumbLabel = true;
  }

  temp() {
    console.log('ASDASDASD');
  }
  
  formatLabel(value: number | null) {
    let number = this.parseSecondsToMinuteFormat(value as number);
    return number;
  }

  volumeLabel(value: number | null) {
    if ( this.audio ) {
      this.audio.volume(value / 100);
    }
    return value;
  }

  onVolumeReleaseClick() {
    this.showThumbLabelVolume = false;
    this.audio.volume(this.volumeValue / 100);
    this.volumeValue = this.audio.volume() * 100;
  }

  onVolumeClick() {
    this.showThumbLabelVolume = true;
    
  }

  keyDownFunction(e) {
    if (e.key == "Enter") {
      this.get();
    }
  }

  keyDownFunctionn(e) {
    if (e.key == "Enter") {
      this.getPlaylist();
    }
  }

  getPlaylist() {
    /*
    this.playlistVideos = [];
    let noOfVideos = 10;
    let playlistID = this.playlistSearch;
    const httpOptions = {
      headers: new HttpHeaders({
      //Authorization: 'Bearer' + ,
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    this.http.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${noOfVideos}&playlistId=${playlistID}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      console.log('response: ', res.body['items']);
      for (let video of res.body['items']) {
        this.playlistVideos.push(video);
        this.playlistAudios.push(
          new Howl({
            src: 'asd',
            html5: true,
            volume: 0.75,
            onload: this.onLoad,
            onplay: () => {
              this.timer = setInterval( this.updateValue, 1000);
              this.sliderDisabled = false;
              this.volumeValue = this.audio.volume() * 100;
              this.playing = true;
            }
          })
        );
      }
    });
    console.log('playlistvideos', this.playlistVideos);*/
    let promises: Array<Promise<any>> = [];
    this.youtube.getPlaylistVideos(this.playlistSearch).then((data: any) => {
      console.log(data);
      for (let video of data) {
        promises.push( this.youtubedl.getAudioUrl(this.watchURL + video.snippet.resourceId.videoId));
      }
      Promise.all(promises).then((values: any) => {
        console.log('VALUES', values);
      });
    }, err => {

    });
  }
}
