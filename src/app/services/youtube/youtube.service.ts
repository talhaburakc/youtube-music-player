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

  nextPageToken: string = null;
  prevPageToken: string = null;

  constructor(private http: HttpClient) { }

  getSearchResults(url: string) {
    /* 
    GET https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=[YOUR_API_KEY] HTTP/1.1

    Authorization: Bearer [YOUR_ACCESS_TOKEN]
    Accept: application/json

    */

    const httpOptions = {
      headers: new HttpHeaders({
      //Authorization: 'Bearer' + ,
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&regionCode=${this.regionCode}&maxResults=${this.maxResults}&q=${url}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        console.log('response: ', res);
        if (res.ok) {
          resolve(res.body['items']);
          this.nextPageToken = res.body['nextPageToken'];
        } else {
          this.nextPageToken = null;
          reject(res);
        }
      });
    });
  }

  getNextSearchResults(url: string) {
    if (this.nextPageToken === undefined || this.nextPageToken == null) {
      return;
    }
    
    const httpOptions = {
      headers: new HttpHeaders({
      //Authorization: 'Bearer' + ,
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&pageToken=${this.nextPageToken}&regionCode=${this.regionCode}&maxResults=${this.maxResults}&q=${url}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        console.log('response: ', res);
        if (res.ok) {
          resolve(res.body['items']);
          this.nextPageToken = res.body['nextPageToken'] || null;
          this.prevPageToken = res.body['prevPageToken'] || null;
        } else {
          this.nextPageToken = null;
          this.prevPageToken = null;
          reject(res);
        }
      });
    });
  }

  getPrevSearchResults(url: string) {
    if (this.prevPageToken === undefined || this.prevPageToken == null) {
      return;
    }
    
    const httpOptions = {
      headers: new HttpHeaders({
      //Authorization: 'Bearer' + ,
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';
    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&pageToken=${this.prevPageToken}&regionCode=${this.regionCode}&maxResults=${this.maxResults}&q=${url}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        console.log('response: ', res);
        if (res.ok) {
          resolve(res.body['items']);
          this.nextPageToken = res.body['nextPageToken'] || null;
          this.prevPageToken = res.body['prevPageToken'] || null;
        } else {
          this.nextPageToken = null;
          this.prevPageToken = null;
          reject(res);
        }
      });
    });
  }3

  getPlaylistVideos(playlistId: string) {
    let noOfVideos = 10;
    const httpOptions = {
      headers: new HttpHeaders({
      //Authorization: 'Bearer' + ,
      Accept: 'application/json'
     })
    };
    httpOptions['observe'] = 'response';

    return new Promise((resolve, reject) => {
      this.http.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${noOfVideos}&playlistId=${playlistId}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
      console.log('response: ', res.body['items']);
      if (res.ok) {
        resolve(res.body['items']);      
      } else {
        reject(res);
      }
      });
    });
  }
}
