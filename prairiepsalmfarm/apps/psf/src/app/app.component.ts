import { Component, OnInit } from '@angular/core';
import { UsersService } from '@prairiepsalmfarm/users';

@Component({
  selector: 'prairiepsalmfarm-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.usersService.initAppSession();
  }

  title = 'psf';
}
