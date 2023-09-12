import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, ElementRef, Input, ViewChild, Output, EventEmitter, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../service/auth.service';
import { EncryptService } from '../service/encrypt.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  @Input() entitySpocId;
  @ViewChild('closeModal') closeModal: ElementRef;
  @Output() public sidenavToggle = new EventEmitter();

  changePWError = false;
  msg;
  submitForm = true;
  constructor(private el: ElementRef, public router: Router,
    private authService: AuthService, private encryptService: EncryptService) { }

  username: any;
  ngOnInit(): void {
    this.username = this.authService.currentUser.sub;
    //console.log(this.entitySpocId)
  }

  menuClicked() {
    let menuContainer = this.el.nativeElement.querySelector(".navbar-collapse");
    if (menuContainer.classList.contains('show')) {
      menuContainer.classList.remove('show');
    }
    window.scroll(0, 0);
  }

  changePassword(oldPass, newPass) {
    this.submitForm = false;
    var encryptedOldPw = this.encryptService.encrypt(oldPass.value)
    var encryptedNewPw = this.encryptService.encrypt(newPass.value)

    this.authService.changeSpocPassword(encryptedOldPw, encryptedNewPw).subscribe(
      res => {
        this.submitForm = true;
        
        this.closeModal.nativeElement.click();
        this.authService.removeToken();
        this.router.navigateByUrl('/', { state: { ischanged: true } });
      }, err => {
        this.submitForm = true;

        this.changePWError = true;
        this.msg = 'Service not avaliable now,Try again later.'
      }
    )

  }

  logout() {
    this.authService.removeToken();
    //console.log('logout')
    this.router.navigateByUrl('/');
  }

 
  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  

}
