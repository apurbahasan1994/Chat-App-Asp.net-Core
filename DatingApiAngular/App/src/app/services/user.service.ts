import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PaginatedResult } from "../_models/pagination";
import { User } from "../_models/user";
import { AuthService } from "./auth.service";
import { map } from 'rxjs/operators'
import { Message } from "../_models/message";

// const httpOptions = {
//   headers: new HttpHeaders({
//     'Authorization': 'Bearer ' + localStorage.getItem('token')
//   })
// };
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  httpOptions = {
    headers: new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    })
  };

  constructor(private http: HttpClient, private authService: AuthService) {

  }
  getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginatedResult<User[]>> {
    debugger
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    const paginatedresult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
    let params = new HttpParams();
    if (userParams) {
      debugger
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    if (likeParams === 'Likers') {
      params = params.append('likers', 'true');
    }
    if (likeParams === 'Likees') {
      params = params.append('likees', 'true');
    }
    httpOptions['params'] = params;
    httpOptions['observe'] = 'response';
    return this.http.get<User[]>(this.baseUrl + 'User/getUsers', httpOptions)
      .pipe(
        map((res: any) => {
          paginatedresult.results = res.body;
          if (res.headers.get("pagination") != null) {
            paginatedresult.pagination = JSON.parse(res.headers.get("pagination"));
          }
          return paginatedresult
        })
      )
  }

  getUser(id: Number): Observable<User> {
    debugger;
    return this.http.get<User>(this.baseUrl + 'User/getUser/' + id, this.httpOptions);
  }
  updateUser(id: Number, user: User) {
    return this.http.put(this.baseUrl + 'User/updateUser/' + id, user, this.httpOptions);
  }
  setMainPhoto(userId: number, id: number) {
    return this.http.post(this.baseUrl + "Cloudenary/setmainPhoto/" + userId + "/" + id, {}, this.httpOptions);
  }
  deletePhoto(userId: number, id: number) {
    return this.http.delete(this.baseUrl + "Cloudenary/deltePhoto/" + userId + "/" + id, this.httpOptions);
  }
  sendlike(userId: number, recipientId: number) {
    return this.http.post(this.baseUrl + "User/getLike/" + userId + "/" + recipientId, {}, this.httpOptions);
  }
  getMessages(userId: number, page?, itemsPerPage?, messageContainer?) {
    console.log(userId)
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();
    let params = new HttpParams();
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      })
    };
    params.append("messageContainer", messageContainer);
    if (page && itemsPerPage) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }
    httpOptions["params"] = params;
    httpOptions['observe'] = 'response';
    return this.http.get<Message[]>(this.baseUrl + "Message/getMessagesForUser/" + userId, httpOptions)
      .pipe(
        map((res: any) => {
          paginatedResult.results = res.body;
          if (res.headers.get("pagination") != null) {
            paginatedResult.pagination = JSON.parse(res.headers.get("pagination"));
          }
          return paginatedResult
        })
      )
  }
  getMessageThread(id: number, recipientId: number) {
    return this.http.get<Message[]>(this.baseUrl + "Message/GetMessageThread/" + id + "/" + recipientId, this.httpOptions)

  }
  sendMessage(id: number, message: Message) {
    return this.http.post(this.baseUrl + "Message/createMessage/" + id, message, this.httpOptions)

  }
  deleteMessages(id: number, userId: number) {
    return this.http.post(this.baseUrl + "Message/deleteMessage/" + id + "/" + userId, {}, this.httpOptions);
  }
  markAsRead(id: number, userId: number) {
    return this.http.post(this.baseUrl + "readMessage/" + id + "/" + userId, {}, this.httpOptions)
      .subscribe();
  }
}
