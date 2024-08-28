import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    Validators,
    ReactiveFormsModule
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../_services/api.service';
import { CacheKeys } from '../../_models/CacheKeys';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-address-input',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTooltipModule
    ],
    templateUrl: './address-input.component.html',
    styleUrl: './address-input.component.scss'
})
export class AddressInputComponent implements OnInit {
    private apiService = inject(ApiService);
    private toastr = inject(ToastrService);
    private formBuilder = inject(FormBuilder);

    addressForm!: FormGroup;

    ngOnInit (): void {
        const cachedAddress =
            sessionStorage.getItem(CacheKeys.API_SERVER_ADDRESS) || '';
        this.addressForm = this.formBuilder.group({
            address: [cachedAddress, Validators.required],
            savePrompt: [!!cachedAddress]
        });
    }

    onSubmit (): void {
        if (this.addressForm.invalid) {
            this.toastr.error('Please provide a valid server address.');
            return;
        }

        const { address, savePrompt } = this.addressForm.value;

        if (address) {
            this.apiService.checkApiHealth(address).subscribe({
                next: () => {
                    if (savePrompt) {
                        sessionStorage.setItem(
                            CacheKeys.API_SERVER_ADDRESS,
                            address
                        );
                    } else {
                        sessionStorage.removeItem(CacheKeys.API_SERVER_ADDRESS);
                    }

                    this.apiService.validConnection.set(true);
                    this.apiService.setClientAddress(address);
                    this.toastr.success('Server reached!');
                },
                error: () => {
                    this.toastr.error(
                        'Unable to reach the API. Please check your server address.'
                    );
                }
            });
        }
    }
}
