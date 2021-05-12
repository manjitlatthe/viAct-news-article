import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { LoaderService } from 'app/services/loader.service';
import { finalize } from 'rxjs/operators';
// import { ToastrService } from 'ngx-toastr';

import { Article } from './articles.model';
import { ArticleStore } from './article.store';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.css']
})
export class ArticlesComponent implements OnInit {

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild('inputSearch') serachVar: ElementRef;
  displayedColumns: string[] = ['urlToImage', 'source', 'author', 'title', 'publishedAt', 'url'];
  // , 'source.name', , 'actions'
  dataSource = new MatTableDataSource<Article>();
  sortInfo = {
    active: 'id',
    direction: 'asc'
  }
  filterValue : string = '';

  constructor(private router: Router, 
    public articleStore: ArticleStore, 
    // private toastr: ToastrService,
    private loaderService: LoaderService) { }

  ngOnInit(): void {
      this.articleStore.Filtertype = ('');
      this.articleStore.FilterValue = ('');
      this.getAll();
  }
  getAll() {
    this.loaderService.loaderValue = (true);
    this.articleStore.getAll()
    .pipe(
      finalize(() => {
        this.loaderService.loaderValue = (false);
      })
    )
    .subscribe(data => {
      if (data) {
        this.dataSource.data = data;
      }
    })
  }

  ngAfterViewInit() {
    this.sort.start = 'asc';
    this.sort.disableClear = true;
    this.sort.sortChange.subscribe(sortData => {
      //console.log(sortData);
      this.serachVar.nativeElement.value = '';
      this.sortInfo.active = sortData.active;
      this.sortInfo.direction = sortData.direction;
      this.articleStore.currentPage = (1);
      this.articleStore.Filtertype = ('sort');
      this.articleStore.FilterValue = (sortData);
      this.getAll();
    })
  }

  applyFilter(event: Event) {
    //  console.log(event);
      // this.filterValue = ((event.target as HTMLElement).value).trim().toLowerCase();
      
     this.filterValue = this.serachVar.nativeElement.value.trim().toLowerCase();
      if (this.filterValue != '') {
        this.articleStore.Filtertype = ('search');
        this.articleStore.FilterValue = (this.filterValue);
        this.getAll();
      }else{
        this.articleStore.Filtertype = ('');
        this.articleStore.FilterValue = (this.filterValue);
        this.getAll();
      }
    }

    pageEvent(event) {
      if (event.previousPageIndex > event.pageIndex) {
        this.articleStore.currentPage = (this.articleStore.currentPage - 1);
      } else {
        this.articleStore.currentPage = (this.articleStore.currentPage + 1);
      }
      this.getAll();
    }
}
