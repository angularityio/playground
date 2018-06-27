import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-svg',
  templateUrl: './svg.component.html',
  styleUrls: ['./svg.component.scss']
})
export class SvgComponent implements OnInit {
  @Input() src: string;

  constructor(private element: ElementRef) {
    // const d = element;
    // const g = d.nativeElement.querySelector('g');
    // const children = g.nativeElement.querySelector('path[id]');
  }

  ngOnInit() {}
}
