import { inject, Injectable, signal } from '@angular/core';
import { themes } from '../_models/Themes';
import { StorageService } from './storage.service';
import { CacheKeys } from '../_models/CacheKeys';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private themeKey = 'app-theme';
    private defaultTheme = 'magenta-violet';

    private storageService = inject(StorageService);
    currentThemeName = signal<string>(
        this.getStoredTheme() || this.defaultTheme
    );

    constructor () {}

    setTheme (themeName: string) {
        const linkElement = document.getElementById(
            this.themeKey
        ) as HTMLLinkElement;

        if (!linkElement) {
            const link = document.createElement('link');
            link.id = this.themeKey;
            link.rel = 'stylesheet';
            link.href = `assets/css/material/${themeName}.css`;
            document.head.appendChild(link);
        } else {
            linkElement.href = `assets/css/material/${themeName}.css`;
        }

        this.currentThemeName.set(themeName);
        this.storageService.setLocalItem(CacheKeys.THEME_SELECTED, themeName); // Save to localStorage via StorageService
    }

    getStoredTheme (): string | null {
        return this.storageService.getLocalItem<string>(
            CacheKeys.THEME_SELECTED
        );
    }

    getCurrentThemePrimaryColor (): string {
        if (this.currentThemeName()) {
            const currentThemeObject = themes.find(
                theme => theme.name === this.currentThemeName()
            );
            const currentPrimary = currentThemeObject?.color || '#000000';
            return currentPrimary;
        }
        return '#000000';
    }
}
