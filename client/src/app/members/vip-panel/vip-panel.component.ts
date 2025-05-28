import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import { MembersService } from '../../_services/members.service';
import { VipService } from '../../_services/vip.service';
import { VisitParams } from '../../_models/visitParams';

@Component({
  selector: 'app-vip-panel',
  standalone: true,
  imports: [MemberCardComponent, PaginationModule, FormsModule,ButtonsModule],
  templateUrl: './vip-panel.component.html',
  styleUrl: './vip-panel.component.css'
})
export class VipPanelComponent implements OnInit {

 visitsService = inject(VipService);
  filterList = [
    { value: 'AllVisits', display: 'All Visits' },
    { value: 'Month', display: 'Visits Per Month' }
  ];
  tabList = [
    { value: 'visited', display: 'Visited Profiles' },
    { value: 'visitors', display: 'Visited My Profile' }
  ];

  ngOnInit(): void {
    this.loadVisits();
  }

  loadVisits() {
    this.visitsService.getVisits();
  }
 
  resetFilters() {
    this.visitsService.resetVisitParams();
    this.loadVisits();
  }

  pageChanged(event: any) {
    const params = this.visitsService.getVisitParams();
    params.pageNumber = event.page;
    this.visitsService.setVisitParams(params);
    this.loadVisits();
  }

  updateTab(tab: string) {
    const params = this.visitsService.getVisitParams();
    params.tab = tab;
    this.visitsService.setVisitParams(params);
    this.loadVisits();
  }

  updateFilter(filter: string) {
    const params = this.visitsService.getVisitParams();
    params.filter = filter;
    this.visitsService.setVisitParams(params);
    this.loadVisits();
  }
}
