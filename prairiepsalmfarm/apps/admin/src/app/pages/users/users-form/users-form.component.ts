import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { User, UsersService } from '@prairiepsalmfarm/users';
import { ActivatedRoute } from '@angular/router';
import { timer, firstValueFrom, Subject, takeUntil } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'prairiepsalmfarm-users-form',
  templateUrl: './users-form.component.html',
})
export class UsersFormComponent implements OnInit, OnDestroy {
  editMode: boolean = false;
  form: UntypedFormGroup = new UntypedFormGroup({});
  isSubmitted: boolean = false;
  endsubs$: Subject<any> = new Subject();

  constructor(
    private location: Location,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      phone: ['', Validators.required],
      isAdmin: [false],
      street: ['', Validators.required],
      apartment: [''],
      zip: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required]
    });

    this._checkEditMode();
  }

  ngOnDestroy(): void {
      this.endsubs$.complete();
  }

  onSubmit() {
    this.isSubmitted = true;
    if(this.form.invalid) return;

    const user: User = {
      name: this.userForm['name'].value,
      email: this.userForm['email'].value,
      password: this.userForm['password'].value,
      phone: this.userForm['phone'].value,
      isAdmin: this.userForm['isAdmin'].value,
      street: this.userForm['street'].value,
      apartment: this.userForm['apartment'].value,
      city: this.userForm['city'].value,
      state: this.userForm['state'].value,
      zip: this.userForm['zip'].value,
    }

    if(this.editMode) {
      this._updateUser(user);
    }
    else {
      this._addUser(user);
    }
  }

  private _updateUser(user: User) {
    this.route.params
    .pipe(takeUntil(this.endsubs$))
    .subscribe(params => {
      this.usersService.updateUser(params['id'], user)
      .pipe(takeUntil(this.endsubs$))
      .subscribe(() => {
        this.messageService.add({severity:'success', summary:'Success', detail:'User Updated!'});
        firstValueFrom(timer(2000)).then(done => {
          this.location.back();
        })
      },
      ()=> {
        this.messageService.add({severity:'error', summary:'Error', detail:'User Not Updated!'});
      });
    })
  }

  private _addUser(user: User) {
    this.usersService.createUser(user)
    .pipe(takeUntil(this.endsubs$))
    .subscribe(() => {
      this.messageService.add({severity:'success', summary:'Success', detail:'User Created!'});
      firstValueFrom(timer(2000)).then(done => {
        this.location.back();
      })
    },
    () => {
      this.messageService.add({severity:'error', summary:'Error', detail:'User Not Created!'});
    });
  }

  private _checkEditMode() {
    this.route.params
    .pipe(takeUntil(this.endsubs$))
    .subscribe(params => {
      if(params['id']) {
        this.editMode = true;
        this.usersService.getUser(params['id']).subscribe(user => {
          this.userForm['name'].setValue(user.name);
          this.userForm['email'].setValue(user.email);
          this.userForm['password'].setValue(user.password);
          this.userForm['phone'].setValue(user.phone);
          this.userForm['isAdmin'].setValue(user.isAdmin);
          this.userForm['street'].setValue(user.street);
          this.userForm['apartment'].setValue(user.apartment);
          this.userForm['zip'].setValue(user.zip);
          this.userForm['city'].setValue(user.city);
          this.userForm['state'].setValue(user.state);
          this.userForm['password'].setValidators([]);
          this.userForm['password'].updateValueAndValidity();
        });
      }
    })
  }

  cancel() {
    this.location.back();
  }

  get userForm() {
    return this.form.controls;
  }

}
