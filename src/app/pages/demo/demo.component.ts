import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
    MatDialog,
    MatDialogActions,
    MatDialogModule
} from '@angular/material/dialog';
import { ProcessInfo } from '../../_models/ProcessInfo';
import { ThemeService } from '../../_services/theme.service';
import { IpInputComponent } from '../../components/ip-input/ip-input.component';
import { SettingsComponent } from '../../components/settings/settings.component';
import { ThemePickerComponent } from '../../components/theme-picker/theme-picker.component';
import { VolumeSliderComponent } from '../../components/volume-slider/volume-slider.component';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

export const demoList: ProcessInfo[] = [
    { name: 'Spotify', id: 1205, currentVolume: 37.27 },
    { name: 'YouTube', id: 2719, currentVolume: 7.71 },
    { name: 'Zoom', id: 4240, currentVolume: 91.8 },
    { name: 'Discord', id: 5339, currentVolume: 3.68 },
    { name: 'Chrome', id: 8096, currentVolume: 37.51 },
    { name: 'VLC', id: 6103, currentVolume: 45.23 },
    { name: 'Skype', id: 7521, currentVolume: 62.17 },
    { name: 'Slack', id: 2901, currentVolume: 15.89 },
    { name: 'Microsoft Teams', id: 4885, currentVolume: 88.11 },
    { name: 'Audacity', id: 9430, currentVolume: 53.45 }
];

@Component({
    selector: 'demo',
    standalone: true,
    imports: [
        VolumeSliderComponent,
        MatButtonModule,
        MatIconModule,
        MatExpansionModule,
        CommonModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatSelectModule,
        ThemePickerComponent,
        FormsModule,
        MatInputModule,
        ReactiveFormsModule,
        MatListModule,
        TitleCasePipe,
        LayoutModule,
        IpInputComponent,
        RouterLink,
        MatDialogModule,
        FontAwesomeModule
    ],
    templateUrl: './demo.component.html',
    styleUrl: './demo.component.scss'
})
export class DemoComponent {
    private themeService = inject(ThemeService);
    private breakpointObserver = inject(BreakpointObserver);

    private toastr = inject(ToastrService);

    demoList = demoList;

    selectedProcesses: ProcessInfo[] = [];

    isLandscapeMobile: boolean = false;

    ngOnInit (): void {
        const storedTheme = this.themeService.getStoredTheme();
        if (storedTheme) {
            this.themeService.setTheme(storedTheme);
        }
        this.checkLandscapeMobile();
    }

    simulateRefresh () {
        this.toastr.success('App list and volumes refreshed!');
    }

    compareProcesses (p1: ProcessInfo, p2: ProcessInfo): boolean {
        return p1 && p2 ? p1.id === p2.id : p1 === p2;
    }

    checkLandscapeMobile (): void {
        this.breakpointObserver
            .observe([
                '(max-width: 767px) and (orientation: landscape)',
                '(max-height: 500px) and (orientation: landscape)'
            ])
            .subscribe(result => {
                this.isLandscapeMobile = result.matches;
            });
    }
}
