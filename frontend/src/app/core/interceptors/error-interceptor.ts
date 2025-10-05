import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err) => {
      const msg = err.error?.message || 'Erro inesperado.';
      console.error('Erro na requisição:', err);

      // Mostrar erro em um alert simples (pode ser substituído por um toast mais elegante)
      if (err.status !== 401) { // Não mostrar alert para erros de autenticação
        alert(`Erro: ${msg}`);
      }

      throw err;
    })
  );
};
