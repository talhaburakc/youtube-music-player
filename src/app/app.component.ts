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
  url: string;
  audio: Howl;
  currentSeekValue: number = 0;
  songDuration: number;
  sliderDisabled: boolean = true;
  volumeValue: number;
  timer: any = null;
  videoList: Array<any>;
  playlistVideos: Array<any>;
  playlistAudios: Array<any>;
  isAudioLoaded: boolean = false;
  isPlaylistClicked: boolean = false;

  playlistSearch: any;

  constructor(private youtubedl: YoutubeDlService, private http: HttpClient, private youtube: YoutubeService, private spinner: NgxSpinnerService) {
    this.onLoad = this.onLoad.bind(this);
    this.updateValue = this.updateValue.bind(this);

  }

  ngOnInit() { // TODO: multiple clicks on same video throws error
    
  }

  loadAudio(source, type) {
    if (this.audio) {
      this.stop();
    }
    this.spinner.show();
    let videoUrl;
    if (type == 'url') {
      videoUrl = source;
    } else if ( type == 'id') {
      videoUrl = this.watchURL + source;
    }
    let volume = 1.0;
    if (this.audio) {
      volume = this.audio.volume();
    }
    this.youtubedl.getAudioUrl(videoUrl).then( (data) => {
      this.audio = new Howl({
        src: [data as string],
        html5: true,
        volume: volume,
        onload: this.onLoad,
        onend: () => {
          this.playing = false;
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

  isUrl( s: string) {
    return s.includes('youtube.com/watch');
  }

  getSearchResults() {
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
      this.getSearchResults();
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
    this.youtube.getNextSearchResults(this.url).then((data: any) => {
      this.videoList = data;
    }, err => {
      console.log('ERR', err);
    });
  }

  prevPage() {
    this.youtube.getPrevSearchResults(this.url).then((data: any) => {
      this.videoList = data;
    }, err => {
      console.log('ERR', err);
    });
  }

  onPlaylistSlideClick() {
    this.isPlaylistClicked = !this.isPlaylistClicked;
  }
}
