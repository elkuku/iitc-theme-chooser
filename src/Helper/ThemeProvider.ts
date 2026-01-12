import {Theme} from '../../types/Types'

export class ThemeProvider {

    private themes: Record<string, Theme> = {}

    public constructor() {
        this.themes.default = {
            'name': 'Default IITC',
            'css': '/* Default IITC */',
            'variants': {},
            'options': {},
            'preview': 'https://elkuku.github.io/iitc-theme-chooser/preview-default.png'
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
