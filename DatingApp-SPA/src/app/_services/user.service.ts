import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../_models/user';
import { PaginatedResults } from '../_models/pagination';
import { map } from 'rxjs/operators';
import { Message } from '../_models/Message';



@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Commenting out to introduce pagination
  // getUsers(): Observable<User[]> {
  //   return this.http.get<User[]>(`${this.baseUrl}users`);
  // }

  getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginatedResults<User[]>> {

    const paginatedResults: PaginatedResults<User[]> = new PaginatedResults<User[]>();

    let params = new HttpParams();
    if ( page !== null &&  itemsPerPage !== null ) {
        params = params.append('pageNumber', page);
        params = params.append('pageSize', itemsPerPage);
    }

    if (userParams) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);

    }

    if ( likeParams === 'Likers' ) {
       params = params.append('likers', 'true' );
    }

    if ( likeParams === 'Likees' ) {
      params = params.append('likees', 'true' );
   }
    console.log(`params`, params);
    return this.http.get<User[]>(`${this.baseUrl}users`, {observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResults.result = response.body;
          console.log(`response.headers`, response);
          if (response.headers.get('Pagination') != null) {
              // console.log(`Pagination header `, response.headers.get('Pagination'));
              paginatedResults.pagination = JSON.parse(response.headers.get('Pagination'));
              // console.log(`paginatedResults.pagination`, paginatedResults.pagination);
          }
          return paginatedResults;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}users/${id}`);
  }

  updateUser(id: number, user: User) {
    console.log(`${this.baseUrl}user/${id}`, user);
    return this.http.put(`${this.baseUrl}users/${id}`, user);
  }

  setMainPhoto(userId: number, id: number) {
    return this.http.post(`${this.baseUrl}users/${userId}/photos/${id}/setMain`, {});
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(`${this.baseUrl}users/${userId}/photos/${id}`);
  }
  sendLike(id: number, receipientId: number) {
    return this.http.post(`${this.baseUrl}users/${id}/like/${receipientId}`, {});
  }
  getMessages(id: number, page?, itemsPerPage?, messageContainer?) {
    const paginatedResult: PaginatedResults<Message[]> = new PaginatedResults<Message[]>();

    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if ( page !== null &&  itemsPerPage !== null ) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    return this.http.get<Message[]>(`${this.baseUrl}users/${id}/messages`,{ observe: 'response', params})
      .pipe(
        map(response => {
          paginatedResult.result = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );

  }
}
