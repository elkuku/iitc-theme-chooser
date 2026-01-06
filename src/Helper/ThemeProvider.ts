// NOTE: The `themes.json` file does not exist in the repository.
// It is generated using the `scripts/create-theme-file.js` script
// @ts-ignore
import themes from '../../build/themes.json'

import {Theme} from '../../types/Types'

export class ThemeProvider {

    private themes: Record<string, Theme> = {}

    public constructor() {
        this.themes['default'] = {
            'name': 'Default IITC',
            'css': '/* Default IITC */',
            'preview': 'https://github.com/Falenone/Blurtheme/blob/main/images/prev-default.png?raw=true'
        }

        Object.keys(window.plugin).forEach((value) => {
            if (value.toLowerCase().startsWith('tctheme-')) {
                const newTheme = {}

                // @ts-ignore
                newTheme[value] = window.plugin[value].getTheme()

                this.themes = {...this.themes, ...newTheme}
            }
        })

        console.log('ThemeProvider', this.themes)
    }

    public getTheme(name: string): Theme {
        return this.themes[name] as Theme
    }

    public getList(): Record<string, Theme> {
        return this.themes
    }
}
