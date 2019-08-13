import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { config } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import {Howl, Howler} from 'howler';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class YoutubeDlService {
  
  configUrl = environment.API_ENDPOINT
  

  constructor(private http: HttpClient) {
  }

  getAudioUrl(url: string) {
    //let url = "https://www.youtube.com/watch?v=xMsSGNvQmoQ";
    const httpOptions = {
      headers: new HttpHeaders({
        'VideoURL': url
      })
    };
    httpOptions['observe'] = 'response';
    return new Promise( (resolve, reject) => {
      this.http.get(this.configUrl + '/highest-quality-link', httpOptions).subscribe( (response: Response) => {
        console.log('response:', response);
        if ( response.ok ) { 
          resolve(response.body);
        } else {
          reject(response);
        }
      }, err => {
        reject(err);
      });
    });
  }

}
