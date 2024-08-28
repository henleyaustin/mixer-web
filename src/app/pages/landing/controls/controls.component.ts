import { BreakpointObserver, LayoutModule } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
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
import { AddressInputComponent } from '../../../components/address-input/address-input.component';
import { ThemePickerComponent } from '../../../components/theme-picker/theme-picker.component';
import { VolumeSliderComponent } from '../../../components/volume-slider/volume-slider.component';
import { CacheKeys } from '../../../_models/CacheKeys';
import { RetryDialogComponent } from '../../../components/retry-dialog/retry-dialog.component';

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
        AddressInputComponent
    ],
    templateUrl: './controls.component.html',
    styleUrl: './controls.component.scss'
})
export class ControlsComponent implements OnInit {
    storageService = inject(StorageService);
    apiService = inject(ApiService);
    breakpointObserver = inject(BreakpointObserver);
    dialog = inject(MatDialog);

    selectedProcesses: ProcessInfo[] = [];

    isLandscapeMobile: boolean = false;

    ngOnInit (): void {
        this.loadProcesses();
    }

    fetchSelectedProcesses () {
        const processes: ProcessInfo[] =
            this.storageService.getLocalItem(CacheKeys.SELECTED_PROCESSES) ||
            [];

        const matchingProcesses = processes.filter(selectedProcess => {
            return this.apiService
                .activeProcesses()
                .some(
                    activeProcess =>
                        activeProcess.name === selectedProcess.name ||
                        activeProcess.id === selectedProcess.id
                );
        });

        this.updateSelection(matchingProcesses);
        this.selectedProcesses = matchingProcesses;
    }

    loadProcesses (): void {
        this.apiService.fetchProcesses().subscribe({
            next: () => {
                this.fetchSelectedProcesses();
                this.checkLandscapeMobile();
            },
            error: () => {
                this.openRetryDialog();
            }
        });
    }

    updateSelection (processes: ProcessInfo[]) {
        this.storageService.setLocalItem(
            CacheKeys.SELECTED_PROCESSES,
            processes
        );
    }

    onVolumeChange ($event: { processId: number; newVolume: number }) {
        var { processId, newVolume } = $event;

        this.apiService.changeVolume(processId, newVolume);
    }

    openRetryDialog (): void {
        const dialogRef = this.dialog.open(RetryDialogComponent, {
            width: 'auto',
            height: 'auto'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.loadProcesses();
            } else {
            }
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
