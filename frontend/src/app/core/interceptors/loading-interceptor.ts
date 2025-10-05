import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { Loading } from '../services/loading';

export const LoadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loader = inject(Loading);
  loader.show();

  return next(req).pipe(finalize(() => loader.hide()));
};
