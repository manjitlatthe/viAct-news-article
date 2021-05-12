import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    // private errorInfo: BehaviorSubject<string>;
    constructor(private route: Router,  private toastr: ToastrService) { 
        // this.errorInfo = new BehaviorSubject<string>(null);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
     
        return next.handle(request).pipe(catchError((errorRes : HttpErrorResponse ) => {
           
            if (errorRes.status == 401 || errorRes.status == 404) {
                this.route.navigate(['/']);
            } 
            return throwError(errorRes.error);
        }))
    }
}
