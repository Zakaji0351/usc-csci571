import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'https://tickmaster-events-update0351.wl.r.appspot.com/api';
  //private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getWelcomeMessage(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  submitForm(formData: any, lat: any, lng: any){
    let params = new HttpParams({ fromObject: formData })
    if(lat && lng){
      params = params.set('ipLat', lat);
      params = params.set('ipLng', lng);
    }
    return this.http.get<any>(`${this.apiUrl}/submit-form`,{ params });
  }
  getKeywordSuggestions(query: string): Observable<any>{
    const url = `${this.apiUrl}/autocomplete?query=${query}`;
    return this.http.get<string[]>(url);
  }
  getDetails(eventId: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/event-details/${eventId}`);
  }
  getVenue(venue: string): Observable<any>{
    return this.http.get<any>(`${this.apiUrl}/venue/${venue}`);
  }
  getArtistsInfo(artistNames: string[]): Observable<any>{
    const artistNamesList = artistNames.join(',');
    return this.http.get<any>(`${this.apiUrl}/artists?artists=${encodeURIComponent(artistNamesList)}`);
  }
}