import { Component } from '@angular/core';
import { Developer } from '../_models/developer';

@Component({
    selector: 'app-contact-us',
    standalone: true,
  imports: [],
    templateUrl: './contact-us.component.html',
    styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {

  developer : Developer = {
    developerName : 'Innocent Andile Mnisi',
    developerEmail : '2019728480@ufs4life.ac.za',
    developerBio : 'CSIP6833 student passionate about Angular'
  };

}
