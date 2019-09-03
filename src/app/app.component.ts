import { Component, ViewEncapsulation } from '@angular/core';
import { YoutubeDlService } from './services/youtube-dl/youtube-dl.service';
import { YoutubeService } from './services/youtube/youtube.service';
import { GoogleAuthService } from './services/google-auth/google-auth.service';
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
  isLoggedIn: boolean;

  playlist: Array<any>;
  currentPlayingIndex: number;

  constructor(private youtubedl: YoutubeDlService, private youtube: YoutubeService, private spinner: NgxSpinnerService, private auth: GoogleAuthService) {
    this.onLoad = this.onLoad.bind(this);
    this.updateValue = this.updateValue.bind(this);
  }

  ngOnInit() {
    this.auth.loginState.subscribe((isLoggedIn) => {
      console.log('isLoggedIn', isLoggedIn);
      this.isLoggedIn = isLoggedIn;
    });
  }

  loadAudio(source, type) {
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
    return this.youtubedl.getAudioUrl(videoUrl).then( (data) => {
      this.audio = new Howl({
        src: [data as string],
        html5: true,
        volume: volume,
        onload: this.onLoad,
        onend: () => {
          this.playing = false;
          this.play('next');          
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
    }).catch( (err) => {
      console.log('ERR', err.status);
    });

  }

  hasInLine(direction: string) {
    if (this.currentPlayingIndex === undefined) { 
      return false;
    }
    if (direction == 'next') {
      return this.playlist.length > this.currentPlayingIndex + 1;
    } else {
      return this.currentPlayingIndex > 0;
    }
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
    if (this.audio) {
      this.stop();
    }
    this.spinner.show();
    this.loadAudio(video.id.videoId, 'id').then(() => {
      this.play();
      this.spinner.hide();
    });
  }

  onPlaylistClick(playlist) {
    console.log('asd', playlist);
    this.getPlaylist(playlist.id.playlistId);
    this.isPlaylistClicked = true;
  }

  updateValue() {
    this.currentSeekValue = Math.floor(this.audio.seek() as number);
  }

  onLoad() {
    this.songDuration = this.audio.duration();
    this.isAudioLoaded = true;
  }

  play(direction?: string) {
    // if direction is not set and audio is not set
    if ( !direction && this.audio && !this.audio.playing() ) {
      this.audio.play();
      this.playing = true;
      return;
    }
    // if direction is next and has no next in line
    if (direction == 'next' && !this.hasInLine('next')) {
      return;
    } // vice versa
    if (direction == 'prev' && !this.hasInLine('prev')) {
      return;
    }

    if (this.audio) {
      this.stop();
    }
    let nextIndex;
    if (direction == 'next') {
      nextIndex = this.currentPlayingIndex + 1;
    } else {
      nextIndex = this.currentPlayingIndex - 1;
    }
    this.spinner.show();
    this.loadAudio( this.playlist[nextIndex].snippet.resourceId.videoId ,'id').then(() => {
      this.currentPlayingIndex = nextIndex;
      this.play();
      this.spinner.hide();
    });
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
        if (this.audio) {
          this.stop();
        }
        this.spinner.show();
        this.loadAudio(this.search, 'url').then(() => {
          this.play();
          this.spinner.hide();
        });        
      } else {
        this.getSearchResults();
      }
    }
  }

  getPlaylist(id?: string) {
    if (!this.isPlaylistUrl(this.search) && !id) {
      return;
    }
    let playlistId = id || this.getPlaylistIdFromUrl(this.search);
    console.log(playlistId);
    this.youtube.getPlaylistVideos(playlistId).then((data: any) => {
      console.log(data);
      this.playlist = data;
    });
  }

  onPlaylistElementClick(s) {
    console.log('element:', s);
    console.log('playlist:', this.playlist);

    if (this.audio) {
      this.stop();
    }
    this.spinner.show();
    this.loadAudio(s.snippet.resourceId.videoId, 'id').then(() => {
      this.currentPlayingIndex = this.playlist.indexOf(s);
      this.play();
      this.spinner.hide();
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
    this.youtube.getNextSearchResults().then((data: any) => {
      this.videoList = data;
    }, err => {
      console.log('ERR', err);
    });
  }

  prevPage() {
    this.youtube.getPrevSearchResults().then((data: any) => {
      this.videoList = data;
    }, err => {
      console.log('ERR', err);
    });
  }

  onPlaylistSlideClick() {
    this.isPlaylistClicked = !this.isPlaylistClicked;
  }

  PlaylistLoadMore() {
    this.youtube.getNextPlaylistVideos().then((data: any) => {
      this.playlist = this.playlist.concat(data);
      console.log('data', data);
    }, err => {
      console.log('ERR', err);
    });
  }

  signIn() {
    this.auth.signIn().then((data) => {
      this.youtube.setAuthToken(this.auth.getAuthToken());
    });
  }

  signOut() {
    this.auth.signOut();
  }

}
