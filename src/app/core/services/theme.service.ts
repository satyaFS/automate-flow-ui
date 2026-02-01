import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'automate-flow-theme';
  private themeSubject = new BehaviorSubject<Theme>(this.getInitialTheme());
  
  theme$ = this.themeSubject.asObservable();

  constructor() {
    this.applyTheme(this.themeSubject.value);
    this.watchSystemPreference();
  }

  private getInitialTheme(): Theme {
    // Check localStorage first
    const savedTheme = localStorage.getItem(this.THEME_KEY) as Theme;
    if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
      return savedTheme;
    }
    
    // Fall back to system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  private watchSystemPreference(): void {
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        // Only auto-switch if user hasn't set a preference
        if (!localStorage.getItem(this.THEME_KEY)) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  private applyTheme(theme: Theme): void {
    document.documentElement.setAttribute('data-theme', theme);
  }

  get currentTheme(): Theme {
    return this.themeSubject.value;
  }

  setTheme(theme: Theme, save = true): void {
    this.themeSubject.next(theme);
    this.applyTheme(theme);
    
    if (save) {
      localStorage.setItem(this.THEME_KEY, theme);
    }
  }

  toggleTheme(): void {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  isDark(): boolean {
    return this.currentTheme === 'dark';
  }
}
