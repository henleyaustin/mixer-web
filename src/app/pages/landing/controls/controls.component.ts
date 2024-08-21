import {
    BreakpointObserver,
    Breakpoints,
    LayoutModule
} from '@angular/cdk/layout';
import { Component, inject } from '@angular/core';
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
import { MatDialog } from '@angular/material/dialog';
import { ProcessInfo } from '../../../_models/ProcessInfo';
import { ApiService } from '../../../_services/api.service';
import { StorageService } from '../../../_services/storage.service';
import { ThemeService } from '../../../_services/theme.service';
import { IpInputComponent } from '../../../components/ip-input/ip-input.component';
import { SettingsComponent } from '../../../components/settings/settings.component';
import { ThemePickerComponent } from '../../../components/theme-picker/theme-picker.component';
import { VolumeSliderComponent } from '../../../components/volume-slider/volume-slider.component';
import { CacheKeys } from '../../../_models/CacheKeys';

@Component({
    selector: 'app-controls',
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
        IpInputComponent
    ],
    templateUrl: './controls.component.html',
    styleUrl: './controls.component.scss'
})
export class ControlsComponent {
    storageService = inject(StorageService);
    apiService = inject(ApiService);
    breakpointObserver = inject(BreakpointObserver);
    dialog = inject(MatDialog);

    selectedProcesses: ProcessInfo[] = [];

    isLandscapeMobile: boolean = false;

    ngOnInit (): void {
        this.apiService.refreshProcesses();
        this.selectedProcesses =
            this.storageService.getLocalItem(CacheKeys.SELECTED_PROCESSES) ||
            [];

        this.checkLandscapeMobile();
    }

    updateSelection ($event: ProcessInfo[]) {
        this.storageService.setLocalItem(CacheKeys.SELECTED_PROCESSES, $event);
    }

    onVolumeChange ($event: { processId: number; newVolume: number }) {
        var { processId, newVolume } = $event;

        this.apiService.changeVolume(processId, newVolume);
    }

    openSettingsDialog (): void {
        const dialogRef = this.dialog.open(SettingsComponent, {
            height: 'auto'
        });
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
