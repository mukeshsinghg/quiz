import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IQuestion, IQuiz, IUser } from '../interfaces/iquiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  
  private _baseurl = environment.basepath;
  constructor(private http: HttpClient) { }


  GetCatalog(): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(this._baseurl+"/catalog");
  }

  GetQuiz(quiznumber:string): Observable<IQuiz[]> {
    return this.http.get<IQuiz[]>(this._baseurl+"/quiz");
  }

  GetUsetAttempt(userid,quizid): Observable<number> {
    return this.http.get<number>(this._baseurl+"/userattempt/"+userid+"/"+quizid);
  }

  GetQuestion(userid: any,quizid:any):Observable<IQuestion> {
    return this.http.get<IQuestion>(this._baseurl+"/question/"+userid+"/"+quizid);

  }

  PostUserAttempt(userattempt:any):Observable<any> {
    console.log(userattempt);
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }
    return this.http.post<any>(this._baseurl+"/userattempt",JSON.stringify(userattempt),httpOptions);
  }

  AbortQuiz(userid):Observable<any>
  {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    }
    return this.http.post<any>(this._baseurl+"/abort",JSON.stringify(userid),httpOptions);
  }
  
}
