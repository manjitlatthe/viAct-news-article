import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppRoutingModule } from './app.routing';
import { CommonModule } from '@angular/common';

import { AppComponent } from './app.component';

import { MaterialModule } from './material.module';

import { JwtTokenInterceptor } from './interceptors/jwt-headers';
import { ErrorInterceptor } from './interceptors/error-interceptor';
import { ToastrModule } from 'ngx-toastr';

import { LoaderComponent } from './loader/loader.component';
import { ArticlesComponent } from './articles/articles.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    CommonModule,
    AppRoutingModule,
    MaterialModule,
    ToastrModule.forRoot()
  ],
  declarations: [
    AppComponent,
    LoaderComponent,
    ArticlesComponent
  ],
  providers: [
      { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ], 
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ], 
  bootstrap: [AppComponent]
})
export class AppModule { }
