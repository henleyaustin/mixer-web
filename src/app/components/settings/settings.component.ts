import { Component, inject } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    FormControl,
    ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CacheKeys } from '../../_models/CacheKeys';
import { ApiService } from '../../_services/api.service';
import { StorageService } from '../../_services/storage.service';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTooltipModule
    ],
    templateUrl: './settings.component.html',
    styleUrl: './settings.component.scss'
})
export class SettingsComponent {
    private fb = inject(FormBuilder);
    private storageService = inject(StorageService);
    private dialogRef = inject(MatDialogRef<SettingsComponent>);
    private apiService = inject(ApiService);

    userSettingsForm: FormGroup = this.fb.group({
        currentIp: new FormControl<string>({
            value: `${this.apiService.clientApiIp()}:${this.apiService.clientApiPort()}`,
            disabled: true
        })
    });

    clearIpFromCache (): void {
        this.storageService.removeLocalItem(CacheKeys.API_SERVER_ADDRESS);
        this.apiService.setClientIpAddress('', '');
        this.dialogRef.close();
    }

    closeDialog (): void {
        this.dialogRef.close();
    }
}
