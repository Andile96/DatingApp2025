import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Member } from '../../_models/member';
import {TabDirective, TabsetComponent, TabsModule} from 'ngx-bootstrap/tabs';
import { Gallery, GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { TimeagoModule } from 'ngx-timeago';
import { DatePipe } from '@angular/common';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../_models/message';
import { MessageService } from '../../_services/message.service';
import { PresenceService } from '../../_services/presence.service';
import { AccountService } from '../../_services/account.service';
import { HubConnectionState } from '@microsoft/signalr';
import { VipService } from '../../_services/vip.service';

@Component({
    selector: 'app-member-detail',
    standalone: true,
    imports: [TabsModule, GalleryModule, TimeagoModule, DatePipe, MemberMessagesComponent],
    templateUrl: './member-detail.component.html',
    styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {
 
  @ViewChild('memberTabs', {static:true}) memberTabs?: TabsetComponent;
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private visitService = inject(VipService);
  
  member: Member = {} as Member;
  images: GalleryItem[] = [];
  activeTab?: TabDirective;
 

  ngOnInit(): void {
    const currentUser = this.accountService.currentUser();
    this.route.data.subscribe({
      next: data =>{
        this.member = data['member'];
        this.member && this.member.photos.map(p=>{
          this.images.push(new ImageItem({src: p.url, thumb: p.url}))
        });
        
        if (currentUser && this.member.username !== currentUser.username) {
        this.visitService.trackVisit(this.member.id).subscribe({
          next: () => console.log('Visit tracked'),
          error: err => console.error('Failed to track visit', err)
        });
      }

      }
      

    })
    
    this.route.paramMap.subscribe({
      next: _=> this.onRouteParamsChange()
    })
    this.route.queryParams.subscribe({
      next: params =>{
        params['tab'] && this.selectTab(params['tab'])
      }
    })
  }

  selectTab(heading: string) {
    if (this.memberTabs) {
      const messageTab = this.memberTabs.tabs.find(x => x.heading === heading);
      if (messageTab) messageTab.active = true;
    }
  }
  onRouteParamsChange() {
    const user = this.accountService.currentUser();
    if (!user) return
    if (this.messageService.hubConnection?.state === HubConnectionState.Connected && this.activeTab?.heading === 'Messages') {
      this.messageService.hubConnection.stop().then(() => {
        this.messageService.createHubConnection(user, this.member.username);
      })
    }
  }
  
  onTabActived(data: TabDirective) {
    this.activeTab =data;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams:{tab: this.activeTab.heading},
      queryParamsHandling: 'merge'
    })
    if(this.activeTab.heading === 'Messages' && this.member){
      const user = this.accountService.currentUser();
      if(!user) return;
      this.messageService.createHubConnection(user, this.member.username);
    }
    else {
      this.messageService.stopHubConnection();
    }
  }

  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }
}


