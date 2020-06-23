import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

let users = [{
    id: 1,
    firstName: 'VMware',
    lastName: 'Global',
    username: 'VMWare',
    userEmail: 'vmware@vmware.com',
    password: 'test@123',
},
{
    id: 2,
    firstName: 'Nitesh',
    lastName: 'Kumar',
    username: 'nkumar',
    userEmail: 'nkumar@vmware.com',
    password: 'test@123',
}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) 
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/users/authenticate') && method === 'POST':
                    return authenticate();
                default:
                    return next.handle(request);
            }
        }

        // route functions

        function authenticate() {
            const { email, password } = body;
            const returnUser = users.find(user => user.userEmail === email && user.password === password);
            if (!returnUser) return error('Email or password is incorrect');
            return ok({
                id: returnUser.id,
                username: returnUser.username,
                firstName: returnUser.firstName,
                lastName: returnUser.lastName,
                token: 'vm-ware-token'
            })
        }

        // helper functions

        function ok(body?) {
            return of(new HttpResponse({ status: 200, body }))
        }

        function error(message) {
            return throwError({ error: { message } });
        }
    }
}

export const fakeBackendProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};