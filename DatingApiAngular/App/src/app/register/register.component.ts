import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AlrtifyService } from '../services/alertify.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  model: any = {};
  registerForm: FormGroup;
  @Output() cancelReg = new EventEmitter<boolean>();
  registers: Subscription;
  constructor(private authservice: AuthService, private http: HttpClient, private fb: FormBuilder, private alertify: AlrtifyService, private router: Router) { }
  cont = 0;
  baseUrl = "http://localhost:31199/api/Auth"
  ngOnInit(): void {

    // this.registerForm = new FormGroup({
    //   gender: new FormControl('male',),
    //   username: new FormControl('', Validators.required),
    //   knownAs: new FormControl('', Validators.required),
    //   dateOfBirth: new FormControl(null, Validators.required),
    //   city: new FormControl('', Validators.required),
    //   country: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', Validators.required),

    // }, this.passMatchValidator)
    this.createRegisterForm();
  }
  createRegisterForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required],

    }, { validators: [this.passMatchValidator] });
  }
  register() {
    debugger;
    if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
      return
    }
    if (this.registerForm.valid) {
      this.model = Object.assign({}, this.registerForm.value);
      this.authservice.register(this.model).subscribe(data => {
        this.alertify.success("Registration Successfull");
      }, err => { this.alertify.Error(err.message); },
        () => {
          this.authservice.login(this.model).subscribe(() => {
            this.router.navigate['/members']
          })
        })
    }
    // this.cont++;
    // debugger
    // this.registers = this.http.post(this.baseUrl + "/" + 'register', this.model).subscribe(() => {
    //   console.log("reg successfull");
    //   this.registers.unsubscribe()
    // },
    //   error => {
    //     console.log(error.message);
    //     this.registers.unsubscribe();
    //   }
    // )
    // console.log(this.cont)
  }
  passMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value ? null : { 'mismatch': true }

  }
  cancel() {
    this.cancelReg.emit(false);
    console.log("cancelled");
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    // this.registers.unsubscribe();
  }


}
