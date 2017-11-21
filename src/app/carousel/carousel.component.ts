import { Component, Input, ElementRef, OnInit, AfterViewInit, ChangeDetectorRef, AfterViewChecked } from '@angular/core';

@Component({
  selector: 'app-carousel',
  styleUrls: ['./carousel.component.scss'],
  template: `
    <div class='wrapper'>
      <div class='carousel-wrapper'>
        <div class='carousel' fxLayout='row' fxLayoutAlign='center stretch'>
          <ul *ngFor='let items of batches' fxLayout='row' fxLayoutAlign='space-evenly stretch'>
            <li *ngFor='let item of items' fxLayout='column' fxLayoutAlign='center center'>
              <img src='assets/Icon-Database.svg' alt='Widget Icon'>
              <div class='text'>{{item.title}}</div>
            </li>
          </ul>
        </div>
      </div>

      <div *ngIf='batches.length > 1' class='arrow-left' (click)='currentItem !== 0 ? slide(1) : null'
        [ngClass]='{"disabled": currentItem === 0}'>
        <i class='material-icons'>keyboard_arrow_left</i>
      </div>

      <div *ngIf='batches.length > 1' class='arrow-right' (click)='currentItem !== batches.length - 1 ? slide(-1) : null'
        [ngClass]='{"disabled": currentItem === batches.length - 1}'>
        <i class='material-icons'>keyboard_arrow_right</i>
      </div>
    </div>
  `
})
export class CarouselComponent implements OnInit, AfterViewChecked {
  @Input() items: Array<object>;
  currentItem = 0;
  carousel: any;
  position = 0;
  increment: any;
  translation = 0;
  elementsPerSlide: number;
  batches: Array<Array<object>> = [];
  carouselWidth: number;
  carouselWrapper: any;
  carouselWrapperWidth: number;

  constructor (
    private elementRef: ElementRef,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carousel = this.elementRef.nativeElement.querySelector('.carousel');
    this.carouselWrapper = this.elementRef.nativeElement.querySelector('.carousel-wrapper');
  }

  renderBatches = () => {
    const itemWidth = 130;

    // we split the items in batches
    this.elementsPerSlide = Math.floor(this.carouselWrapperWidth / itemWidth);
    this.batches = this.chunk(this.items, this.elementsPerSlide);

    // The carousel is 100 * ng batches wide
    this.carousel.style.width = 100 * this.batches.length + '%';

    this.increment = (100 / this.batches.length);

    this.changeDetectorRef.detectChanges();
  }

  setBatchSize = () => {
    const ulElements = this.elementRef.nativeElement.querySelectorAll('ul');

    // Each ul element needs to be 100 / nb batches wide.
    for (let i = 0; i < ulElements.length; i++) {
      ulElements[i].style.width = 100 / this.batches.length + '%';
    }
  }

  // On size changes, recalculate the bacthes
  ngAfterViewChecked() {
    if (this.carouselWrapper.offsetWidth !== 0 && this.carouselWrapper.offsetWidth !== this.carouselWrapperWidth) {
      this.carouselWrapperWidth = this.carouselWrapper.offsetWidth;

      this.renderBatches();
      this.setBatchSize();
    }
  }

  slide = (direction: number) => {
    this.currentItem = this.currentItem - direction;
    this.translation  = this.translation + direction * this.increment;
    this.carousel.style.transform = 'translateX(' + this.translation + '%)';
  }

  chunk = (arr, n) => {
    return arr.slice(0, (arr.length + n - 1) / n | 0).map((c, i) => arr.slice(n * i , n * i + n));
  }
}
