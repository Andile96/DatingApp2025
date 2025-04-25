import { Component, inject } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-roles-model',
  standalone: true,
  imports: [],
  templateUrl: './roles-model.component.html',
  styleUrl: './roles-model.component.css'
})
export class RolesModelComponent {
  bsModalRef = inject(BsModalRef);
  username = '';
  title = '';
  rolesUpdated = false;
  availableRoles: string[] = [];
  selectedRoles: string[] = [];

  updateChecked(checkedValue: string) {
    if (this.selectedRoles.includes(checkedValue)) {
      this.selectedRoles = this.selectedRoles.filter(r => r !== checkedValue)
    } else {
      this.selectedRoles.push(checkedValue);
    }
  }
  onSelectRole(){
    this.rolesUpdated = true;
    this.bsModalRef.hide();
  }


}
