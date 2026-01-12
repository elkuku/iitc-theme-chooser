import {Info, Theme, ThemeInfo} from '../../types/Types'

export class ThemeProvider {

    private themes: Record<string, Theme> = {}

    private themeNames: string[] = []

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
                this.themeNames.push(value)
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

    public getThemeInfo(name: string): ThemeInfo {
        // @ts-ignore
        const plugin = window.plugin[name]

        // @todo remove legacy code
        if (typeof plugin.getThemeInfo === 'function') {
            console.warn(plugin.getThemeInfo())
            return plugin.getThemeInfo() as ThemeInfo
        } else {
            return this.getTheme(name) as ThemeInfo
        }
    }

    public getInfo(name: string): Info | null {
        // @ts-ignore
        const plugin = window.plugin[name]

        // @todo remove legacy code
        if (typeof plugin.getInfo === 'function') {
            console.warn(plugin.getInfo())
            return plugin.getInfo() as Info
        }

        return null
    }

    public getList2(): ThemeInfo[] {
        const list = []

        console.log('ThemeProvider', this.themeNames)

        // @ts-ignore
        for (const theme of this.themeNames) {
            list.push(this.getThemeInfo(theme))
        }

        return list
//        return this.themes
    }

    public getList(): Record<string, Theme> {
        return this.themes
    }
}
