import { Component, inject } from '@angular/core';
import { AddressInputComponent } from '../../components/address-input/address-input.component';
import { ControlsComponent } from './controls/controls.component';
import { ApiService } from '../../_services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [
        ControlsComponent,
        AddressInputComponent,
        MatButtonModule,
        RouterLink,
        MatIconModule,
        MatDialogModule
    ],
    templateUrl: './landing.component.html',
    styleUrl: './landing.component.scss'
})
export class LandingComponent {
    apiService = inject(ApiService);
}
