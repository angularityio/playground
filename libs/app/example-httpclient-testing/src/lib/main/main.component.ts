import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BlogPostsService } from '../blog-posts.service';

@Component({
  selector: 'playground-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainComponent implements OnInit {
  displayedColumns = ['id', 'title', 'content', 'updated_at'];
  dataSource: MatTableDataSource<Post> = new MatTableDataSource<Post>([]);
  selectedRecord: Post;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private postsService: BlogPostsService
  ) {
    this.form = formBuilder.group({
      id: [null],
      title: [null],
      content: [null]
    });
  }

  ngOnInit() {
    this.loadList();
    this.newRecord();
  }

  loadList() {
    this.postsService.getAll().subscribe(posts => {
      this.dataSource = new MatTableDataSource<Post>(posts);
      if (posts.length) {
        this.selectRecord(posts[posts.length - 1]);
      } else {
        this.newRecord();
      }
    });
  }

  newRecord() {
    this.selectRecord({
      id: null,
      title: null,
      content: null,
      created_at: new Date(),
      updated_at: null
    });
  }

  saveRecord() {
    this.postsService.save(this.form.value).subscribe(savedRecord => {
      this.selectRecord(savedRecord);
      this.loadList();
    });
  }

  deleteRecord() {
    if (this.selectedRecord.id) {
      this.postsService.delete(this.selectedRecord).subscribe(() => {
        this.loadList();
      });
    } else {
      this.newRecord();
    }
  }

  selectRecord(post: Post) {
    this.selectedRecord = post;
    this.form.patchValue(post);
  }
}

export interface Post {
  id: number;
  title: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}
