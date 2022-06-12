import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './gallery.component.html',
  styles: [
  ]
})
export class GalleryComponent implements OnInit {
  @Input() selectedImage?: string = '';

  constructor() { }

  ngOnInit(): void {
   
  }

}
