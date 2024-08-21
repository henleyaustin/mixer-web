import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { ThemeService } from '../../_services/theme.service';
import { themes } from '../../_models/Themes';

@Component({
    selector: 'theme-picker',
    standalone: true,
    imports: [MatIconModule, MatMenuModule, MatButtonModule],
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss']
})
export class ThemePickerComponent implements OnInit {
    private themeService = inject(ThemeService);
    themes = themes;

    selectedTheme: string;

    constructor () {
        this.selectedTheme =
            this.themeService.getStoredTheme() || themes[0].name;
    }

    ngOnInit () {
        this.themeService.setTheme(this.selectedTheme);
    }

    selectTheme (themeName: string) {
        this.selectedTheme = themeName;
        this.themeService.setTheme(themeName);
    }
}
