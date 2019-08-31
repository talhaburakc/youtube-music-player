import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private readonly API_KEY = environment.API_KEY;
  regionCode = 'US';
  maxResults = 25;
  searchTypes = "playlist, video";

  nextPageToken: string = null;
  prevPageToken: string = null;

  nextPageTokenPlaylist: string = null;
  prevPageTokenPlaylist: string = null;

  playlistId: any;
  search: any;

  constructor(private http: HttpClient) { }

  getSearchResults(search: string) {
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&regionCode=${this.regionCode}&type=${this.searchTypes}&maxResults=${this.maxResults}&q=${search}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        if (res.ok) {
          resolve(res.body['items']);
          this.prevPageToken = res.body['prevPageToken'] || null;
          this.nextPageToken = res.body['nextPageToken'] || null;
          this.search = search;
        } else {
          this.prevPageToken = null;
          this.nextPageToken = null;
          this.search = null;
          reject(res);
        }
      });
    });
  }

  getNextSearchResults() {
    if (!this.nextPageToken) {
      return Promise.reject(new Error('Token not Available'));
    }
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&pageToken=${this.nextPageToken}&type=${this.searchTypes}&regionCode=${this.regionCode}&q=${this.search}&maxResults=${this.maxResults}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        if (res.ok) {
          resolve(res.body['items']);
          this.prevPageToken = res.body['prevPageToken'] || null;
          this.nextPageToken = res.body['nextPageToken'] || null;
        } else {
          this.prevPageToken = null;
          this.nextPageToken = null;
          reject(res);
        }
      });
    });
  }

  getPrevSearchResults() {
    if (!this.prevPageToken) {
      return Promise.reject(new Error('Token not Available'));
    }
    
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&pageToken=${this.prevPageToken}&type=${this.searchTypes}&regionCode=${this.regionCode}&q=${this.search}&maxResults=${this.maxResults}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        if (res.ok) {
          resolve(res.body['items']);
          this.prevPageToken = res.body['prevPageToken'] || null;
          this.nextPageToken = res.body['nextPageToken'] || null;
        } else {
          this.prevPageToken = null;
          this.nextPageToken = null;
          reject(res);
        }
      });
    });
  }3

  getPlaylistVideos(playlistId: string) {
    let noOfVideos = 10;
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';

    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${noOfVideos}&playlistId=${playlistId}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      if (res.ok) {
        resolve(res.body['items']);
        this.prevPageTokenPlaylist = res.body['prevPageToken'] || null;
        this.nextPageTokenPlaylist = res.body['nextPageToken'] || null;
        this.playlistId = playlistId;
      } else {
        reject(res);
        this.prevPageTokenPlaylist = null;
        this.nextPageTokenPlaylist = null;
        this.playlistId = null;
      }
      });
    });
  }

  getNextPlaylistVideos() {
    if (!this.nextPageTokenPlaylist) {
      return Promise.reject(new Error('Token not Available'));
    }

    let noOfVideos = 10;
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';

    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${noOfVideos}&playlistId=${this.playlistId}&pageToken=${this.nextPageTokenPlaylist}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      if (res.ok) {
        resolve(res.body['items']);
        this.prevPageTokenPlaylist = res.body['prevPageToken'] || null;
        this.nextPageTokenPlaylist = res.body['nextPageToken'] || null;
      } else {
        reject(res);
        this.prevPageTokenPlaylist = null;
        this.nextPageTokenPlaylist = null;
      }
      });
    });
  }

  getPrevPlaylistVideos() {
    if (!this.prevPageTokenPlaylist) {
      return Promise.reject(new Error('Token not Available'));
    }

    let noOfVideos = 10;
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';

    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${noOfVideos}&playlistId=${this.playlistId}&pageToken=${this.prevPageTokenPlaylist}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      if (res.ok) {
        resolve(res.body['items']);
        this.prevPageTokenPlaylist = res.body['prevPageToken'] || null;
        this.nextPageTokenPlaylist = res.body['nextPageToken'] || null;
      } else {
        reject(res);
        this.prevPageTokenPlaylist = null;
        this.nextPageTokenPlaylist = null;
      }
      });
    });
  }

  getRelatedToVideo(videoId: string) {
    const httpOptions = {
      headers: new HttpHeaders({
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';

    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      if (res.ok) {
        resolve(res.body['items']);
      } else {
        reject(res);
      }
      });
    });
  }
}
