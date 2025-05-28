import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { authGuard } from './_guards/auth.guard';
import { TestErrorsComponent } from './errors/test-errors/test-errors.component';
import { NotFoundComponent } from './errors/not-found/not-found.component';
import { ServerErrorComponent } from './errors/server-error/server-error.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './_guards/prevent-unsaved-changes.guard';
import { memberDetailedResolver } from './_resolver/member-detailed.resolver';
import { AdminPanelComponent } from './admin/admin-panel/admin-panel.component';
import { adminGuard } from './_guards/admin.guard';
import { vipGuard } from './_guard/vip.guard';
import { VipPanelComponent } from './members/vip-panel/vip-panel.component';

export const routes: Routes = [
    {path:'',component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [authGuard],
        children: [

            {path:'members',component: MemberListComponent},
            {path:'members/:username',component: MemberDetailComponent, 
                resolve:{member:memberDetailedResolver}},
            {path:'lists',component: ListsComponent},
            {path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard]},
            {path:'messages',component: MessagesComponent},
            {path:'admin', component:AdminPanelComponent, canActivate: [adminGuard],},
            {path:'vip-panel',component:VipPanelComponent, canActivate: [vipGuard]}
    

        ]
    },
    {path:'errors',component: TestErrorsComponent},
    {path:'contact-us',component: ContactUsComponent},
    {path:'not-found',component: NotFoundComponent},
    {path:'server-error',component: ServerErrorComponent},
    {path:'**',component: HomeComponent,pathMatch:'full'},
];


