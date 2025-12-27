// @ts-ignore
import themes from '../../dist/themes.json'

export interface Theme {
    name: string,
    css: string,
    preview: string,
}

export class ThemeProvider {

    public getTheme(themeName: string): Theme {
        return themes[themeName] as Theme
    }

    public getList():Record<string, Theme> {
        return themes
    }
}