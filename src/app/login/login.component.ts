import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { EncryptService } from '../service/encrypt.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  invalidUser = false;
  errorMsg;

  passwordChanged = false;
  passwordChangedMsg = 'Password changed. Please login again.'

  submittable: boolean = false;
  submitForm: boolean = true;
  loginForm = new FormGroup({
    username: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required]),
    domain: new FormControl('', Validators.required)
  });

  constructor(private router: Router, private authSerivce: AuthService,
    private encryptService: EncryptService, private activatedRoute: ActivatedRoute) {

    this.activatedRoute.paramMap.pipe(map(() => window.history.state))
      .subscribe((data) => {
        //console.log('LoginComponent')
        //console.log(data);
        if (data.ischanged) {
          this.passwordChanged = true;
        }
      });

    if (this.authSerivce.isAuthenticated()) {
      //console.log('Token still valid')
      this.router.navigate(['/home']);
    } else {
      authSerivce.removeToken()
    }

    this.loginForm.valueChanges.subscribe(res => {
      // //console.log(res);
      // //console.log(this.loginForm.value);
      if (this.loginForm.valid) {
        // //console.log(this.loginForm.value);
        this.submittable = true;
      } else {
        this.submittable = false;
      }
    });
  }

  ngOnInit(): void {
  }

  submitLogin() {
    this.submitForm = false;
    this.submittable = false;


    this.invalidUser = false;
    var encryptedUsername = this.encryptService.encrypt(this.loginForm.get('domain').value.trim() +"\\" +this.loginForm.get('username').value);
    var encryptedPassword = this.encryptService.encrypt(this.loginForm.get('password').value);




            // this.router.navigateByUrl("/branch-manager");

    //console.log(encryptedUsername)
    //console.log(encryptedPassword)
    this.authSerivce.login(encryptedUsername, encryptedPassword).subscribe(
      (response) => {
        //console.log('login sucssfully');
        
        this.submitForm = true;
        this.submittable = true;
        localStorage.setItem('token', response['userToken'])
        this.router.navigateByUrl("/home");
        
      },
      (err) => {

        //console.log(err);
        // this.invalidLogin = true;
        this.invalidUser = true;
        this.submitForm = true;
        this.submittable = true;

        if (err['status'] == 500) {
          // //console.log('500')
          this.errorMsg = err.error['message'];
          return;
        } 
        else if(err['status'] == 401)
        {
          this.errorMsg = "Invalid Username or Password.";
          return;
        }
        else {
          //console.log('not avaliable')
          this.errorMsg = "Service is not avaliable now, Try again later.";
          return;
        }

      })

    // setTimeout(()=>{
    //   //console.log('submitLogin')
    //   this.submitForm = true;
    // this.submittable = true;
    //   this.router.navigateByUrl('/branch-manager')
    // },2000);

  }
}
