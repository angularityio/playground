import { Component, OnInit, HostListener, HostBinding, ElementRef } from '@angular/core';

@Component({
  selector: '[app-svg-element]',
  templateUrl: './svg-element.component.html',
  styleUrls: ['./svg-element.component.scss']
})
export class SvgElementComponent implements OnInit {
  id: string;

  @HostListener('click', ['$event.target'])
  click(btn){
    console.log(`cliked ${this.id}`);
    // this.data.push(this.id);
  }

  @HostListener('mouseenter', ['$event.target'])
  hover(btn){
    // this.data.hoverMessage = this.id;
  }

  @HostBinding('attr.fill') get color() {
    return '#f00';
  };
  @HostBinding('attr.fill-opacity') get opacity() {
    return 0.7;
    // return this.data.isSelected(this.id) ? '1.0' : '0.1';
  };

  constructor(
    private element: ElementRef,
    // private data: DataService
  ) {
    this.id = element.nativeElement.id;
    if (this.id === 'Shape---Abdominal-vena-cava') {
      console.log(`created ${element.nativeElement.id}`)
    }
  }

  ngOnInit() {
  }

}
