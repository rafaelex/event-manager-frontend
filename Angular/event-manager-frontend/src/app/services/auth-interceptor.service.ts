import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private localStorage: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Obter o token do localStorage
    console.log("Intercepted!");
    const token = this.localStorage.retrieve('auth-token');

    //Se o token existir, clona a requisição e adiciona o cabeçalho Authorization
    if(token){
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      return next.handle(clonedReq);
    }

    return next.handle(req);
  }
}
