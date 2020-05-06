import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'setting',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./setting/setting.module').then(m => m.SettingPageModule)
                    }
                ]
            },
            {
                path: 'wallet',
                children: [
                    {
                        path: '',
                        loadChildren: () =>
                            import('./wallet/wallet.module').then(m => m.WalletPageModule)
                    }
                ]
            },
            {
                path: '',
                redirectTo: '/tabs/wallet',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/wallet',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TabsPageRoutingModule { }
