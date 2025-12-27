// NOTE: The `themes.json` file does not exist in the repository.
// It is generated using the `.github/scripts/create-theme-file.js` script
// @ts-ignore
import themes from '../../themes/themes.json'

export interface Theme {
    name: string,
    css: string,
    preview: string,
}

export class ThemeProvider {

    public getTheme(name: string): Theme {
        return themes[name] as Theme
    }

    public getList():Record<string, Theme> {
        return themes
    }
}