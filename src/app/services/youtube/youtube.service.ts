import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  private readonly API_KEY = environment.API_KEY;

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
      this.http.get(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=${url}&key=${this.API_KEY}`, httpOptions).subscribe( (res: Response) => {
        console.log('response: ', res);
        if (res.ok) {
          resolve(res.body['items']);
        } else {
          reject(res);
        }
      });
    });
  }

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
