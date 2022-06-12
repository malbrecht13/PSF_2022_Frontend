import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@prairiepsalmfarm/users';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'prairiepsalmfarm-users-list',
  templateUrl: './users-list.component.html',
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  endsubs$: Subject<any> = new Subject();

  constructor(
    private usersService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this._getUsers();
  }

  ngOnDestroy() {
    this.endsubs$.complete();
  }

  deleteUser(userId: string) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this category?',
        header: 'Delete Category',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.usersService.deleteUser(userId)
          .pipe(takeUntil(this.endsubs$))
          .subscribe(res => {
            this.messageService.add({severity:'success', summary:'Success', detail:'User Deleted!'});
            this._getUsers();
          },
          (error) => {
            this.messageService.add({severity:'error', summary:'Error', detail:'User Not Deleted!'});
          });
        },
        reject: () => {}
    })
  }

  updateUser(userId: string): void {
    this.router.navigateByUrl(`users/form/${userId}`);
  }

  private _getUsers() {
    this.usersService.getUsers()
    .pipe(takeUntil(this.endsubs$))
    .subscribe((users) => {
      this.users = users;
    })
  }

}
