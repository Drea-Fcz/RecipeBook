import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "../shared/services/auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {PlaceholderDirective} from "../shared/directives/placeholder.directive";
import {AlertComponent} from "../shared/components/alert/alert.component";

@Component({
  selector: 'app-auths',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  private closeSubscription: Subscription;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;
  constructor(
    private authService: AuthService,
    private router: Router,
    private viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  onSwitchMode(): void {
    this.isLoginMode = !this.isLoginMode;
  }
  onSubmit(form: NgForm): void {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;
    if (this.isLoginMode) {
      authObs = this.authService.login(email, password) ;
    } else {
     authObs = this.authService.singUp(email, password) ;
    }
    authObs.subscribe(respData => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      errorResponse => {
        this.error =  errorResponse;
        this.showErrorAlert(errorResponse);
        this.isLoading = false;
      });
    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert(message: string): void {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(AlertComponent);
    componentRef.instance.message = message;
    this. closeSubscription = componentRef.instance.close.subscribe( () => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
