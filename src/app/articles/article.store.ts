import { map, shareReplay, catchError, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article, Articles } from './articles.model';

@Injectable({
  providedIn: 'root'
})
export class ArticleStore {
  private _listSubject = new BehaviorSubject<Article[]>([]);
  private _currentPage = new BehaviorSubject<number>(1);
  private _totalLength = new BehaviorSubject<number>(0);
  private _pageSize = new BehaviorSubject<number>(0);
  private filterType = new BehaviorSubject<string>('');
  private filterValue = new BehaviorSubject<any>(null);

  eventlist$: Observable<Article[]> = this._listSubject.asObservable();

  constructor(private http: HttpClient) { 
    /** As per requirement doc we are keeping fixed page size as 10 so total records will be 100 and 10 pages will be navigated */
    this.pageSize = 10;
    this.totalLength = 100;
  }

//   loadNoticeForUser(){
//     return this.http.get<Notice[]>(environment.baseUrl +  'noticeboard-student');
//   }

  getAll(): Observable<Article[]>  {
    let pageNumber = this.currentPage;
    let apiUrl = '';
    let fType = this.FilterType;
    let fValue = this.FilterValue;
    //console.log(fType,fValue);
    if ( fType == 'sort') {
      apiUrl = environment.baseUrl +  '?domains=techcrunch.com&pageSize=' + this.pageSize + '&page=' + pageNumber;
      if(fValue.direction == 'desc'){
        apiUrl += '&sortBy=' + fValue.active
      }
      else{
        apiUrl += '&sortBy=popularity'
      }
    } else if(fType == 'search') {
      apiUrl = environment.baseUrl + '?domains=techcrunch.com&pageSize=' + this.pageSize + '&page=' + pageNumber + '&q=' + encodeURI(fValue);
    }else{
      apiUrl = environment.baseUrl +  '?domains=techcrunch.com&pageSize=' + this.pageSize + '&page=' + pageNumber;
    }
    return this.http.get<Article[]>(apiUrl)
      .pipe(
          map(res => {
            this.listSubject = res['articles'];
            // this.currentPage = res['current_page'];
            // this.totalLength = res['totalResults'];
            // this.pageSize = 10;
            return res['articles'];
          }),
        shareReplay(),
        catchError(error => {
          return throwError(error.error);
        }),
        tap(list => {
          this.listSubject = (list);
        })
      );
  }

  uploadEventImage(addObject, eventID): Observable<boolean> {
    return this.http.post<boolean>(environment.baseUrl + 'gallery-event-image/' + eventID, addObject).pipe(
      shareReplay(),
      catchError(error => {
        return throwError(error.error);
      })
    );
  }

  // loadEventImages(eventID){
  //   return this.http.get<GalleryEventImage[]>(environment.baseUrl + 'gallery-event-image/' + eventID);
  // }
  // deleteEventImage(imageID){
  //   return this.http.delete<boolean>(environment.baseUrl + 'gallery-event-image/' + imageID);
  // }

  // addData(addObject): Observable<GalleryEvent> {
  //   this.currentPage = (1);
  //   return this.http.post<GalleryEvent>(environment.baseUrl + 'gallery-events', addObject).pipe(
  //     shareReplay(),
  //     catchError(error => {
  //       return throwError(error.error);
  //     })
  //   );
  // }

  // updateData(ID: number,updateObject): Observable<GalleryEvent> {
  //   this.currentPage = (1);
  //   return this.http.put<GalleryEvent>(environment.baseUrl + 'gallery-events/' + ID, updateObject).pipe(
  //     shareReplay(),
  //     catchError(error => {
  //       return throwError(error.error);
  //     })
  //   );
  // }

  // deleteData(ID: number): Observable<any> {
  //   return this.http.delete<any>(environment.baseUrl + 'gallery-events/' + ID).pipe(
  //     catchError(error => {
  //       return throwError(error.error);
  //     })

  //   );
  // }

  // getSingleData(findId: number){
  //      const dataArray = this.listSubject;
  //      if(dataArray){
  //       const fdata = dataArray.find(cust => cust.id === Number(findId));
  //       return fdata;
  //      }else{
  //         this.router.navigate(['/gallery-events']);
  //      }
      
  // }

  get listSubject(): Article[] {
    return this._listSubject.getValue();
  }

  set listSubject(value: Article[]) {
    this._listSubject.next(value);
  }

  get totalLength(): number {
    return this._totalLength.getValue();
  }

  set totalLength(value: number) {
    this._totalLength.next(value);
  }

  get pageSize(): number {
    return this._pageSize.getValue();
  }

  set pageSize(value: number) {
    this._pageSize.next(value);
  }

  get currentPage(): number {
    return this._currentPage.getValue();
  }

  set currentPage(value: number) {
    this._currentPage.next(value);
  }

  get FilterType(): string {
    return this.filterType.getValue();
  }
  set Filtertype(value: string) {
    this.filterType.next(value);
  }

  get FilterValue(): any {
    return this.filterValue.getValue();
  }
  set FilterValue(value: any) {
    this.filterValue.next(value);
  }



}
