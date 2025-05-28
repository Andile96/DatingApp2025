import { CanActivateFn } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export const vipGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const toastr = inject(ToastrService);
  
    if (accountService.roles().includes('VIP')) {
      return true;
    } else {
      toastr.error('You cannot enter this area');
      return false;
    }
};
