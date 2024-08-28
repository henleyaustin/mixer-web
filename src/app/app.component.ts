import { Component, inject, OnInit } from '@angular/core';
import { ThemeService } from './_services/theme.service';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { InfoDialogComponent } from './components/info-dialog/info-dialog.component';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        MatDialogModule,
        FontAwesomeModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    themeService = inject(ThemeService);
    private dialog = inject(MatDialog);

    ngOnInit (): void {
        this.themeService.initializeThemes();
    }

    openInfoDialog (): void {
        const dialogRef = this.dialog.open(InfoDialogComponent, {
            height: 'auto'
        });
    }
}
