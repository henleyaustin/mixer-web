import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ApiService } from '../../_services/api.service';
import { MatInputModule } from '@angular/material/input';
import { StorageService } from '../../_services/storage.service';
import { CacheKeys } from '../../_models/CacheKeys';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-retry-dialog',
    standalone: true,
    imports: [
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatTooltipModule
    ],
    templateUrl: './retry-dialog.component.html',
    styleUrl: './retry-dialog.component.scss'
})
export class RetryDialogComponent {
    private dialogRef = inject(MatDialogRef<RetryDialogComponent>);
    private apiService = inject(ApiService);
    private storageService = inject(StorageService);
    private toastr = inject(ToastrService);

    currAddress = new FormControl<string>(
        `${this.apiService.clientServerAddress()}`
    );

    onUpdate (): void {
        if (this.currAddress.value) {
            this.apiService.setClientAddress(this.currAddress.value);
            this.toastr.show('Address Updated!');
        }
    }

    onClear (): void {
        this.storageService.removeLocalItem(CacheKeys.API_SERVER_ADDRESS);
        this.apiService.setClientAddress('');
        this.dialogRef.close(false);
    }

    onRetry (): void {
        this.dialogRef.close(true);
    }
}
