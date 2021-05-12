import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  public isLoading = new BehaviorSubject(false);
  constructor() { 
  }

  get loaderValue(): boolean{
    return this.isLoading.getValue();
  }

  set loaderValue(value : boolean){
    this.isLoading.next(value);
  }
}