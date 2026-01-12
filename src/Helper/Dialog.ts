// @ts-expect-error "Import attributes are only supported when the --module option is set to esnext, nodenext, or preserve"
import dialogTemplate from '../tpl/dialog.hbs' with {type: 'text'}

import {HelperHandlebars, Settings} from '../../types/Types'
import {ThemeProvider} from './ThemeProvider'

export class DialogHelper {

    private handlebars: HelperHandlebars

    private themeProvider: ThemeProvider

    public constructor(
        private pluginName: string,
        private title: string,
        private settings: Settings,
    ) {
        this.themeProvider = new ThemeProvider
        document.head.insertAdjacentHTML('beforeend', `<style id="${this.pluginName}-Style"><style>`)
    }

    public getDialog(): JQuery {
        this.handlebars = window.plugin.HelperHandlebars

        if (!this.handlebars) {
            alert(`${this.pluginName} - Handlebars helper not found`)
            throw new Error(`${this.pluginName} - Handlebars helper not found`)
        }

        this.handlebars.registerHelper({
            if_eq: (arg1: string, arg2: string, options: Handlebars.HelperOptions) => {
                return (arg1 === arg2) ? options.fn(this) : options.inverse(this)
            },
            title: (str: string) => {
                return this.formatTitle(str)
            },
        })

        const template = this.handlebars.compile(dialogTemplate)

        const data = {
            plugin: 'window.plugin.' + this.pluginName,
            pluginVersion: VERSION,
            prefix: this.pluginName,
            settings: this.settings,
            themes: this.themeProvider.getList(),
        }

        return window.dialog({
            id: this.pluginName,
            title: this.title,
            html: template(data),
            width: 'auto',
            height: 'auto',
            buttons: [],
        }).parent()
    }

    public showTheme(settings: Settings) {
        this.settings = settings

        const theme = this.themeProvider.getTheme(settings.theme)

        let variantCss = '', optionsCss = ''

        // @ts-ignore
        if (theme.variants && Object.keys(theme.variants).length !== 0) {
            if (settings.variant) {
                variantCss = theme.variants[settings.variant]
            } else {
                const keys = Object.keys(theme.variants);
                const firstKey = keys[0];
                // @ts-ignore
                window.plugin[this.pluginName].setVariant(firstKey, false)
                variantCss = theme.variants[firstKey]
            }
        }

        if (settings.options && theme.options) {
            for (const option of settings.options) {
                optionsCss += theme.options[option]
            }
        }

        const element = document.getElementById(this.pluginName + '-Style')

        if (element) element.innerHTML = variantCss + theme.css + optionsCss
    }

    public updateOptions() {
        const theme = this.themeProvider.getTheme(this.settings.theme)

        let variants: string[] = []
        if (theme.variants) {
            Object.keys(theme.variants).forEach(key => {
                const checked = key === this.settings.variant
                variants.push('<label><input type="radio" name="themeVariant"'
                    + (checked ? 'checked' : '')
                    + ` onchange="window.plugin.${this.pluginName}.setVariant('${key}')">`
                    + this.formatTitle(key) + '</label><br>'
                )
            })
        }

        let options: string[] = []
        if (theme.options) {
            Object.keys(theme.options).forEach(key => {
                const checked = this.settings.options.includes(key)
                options.push('<label><input type="checkbox"'
                    + (checked ? ' checked' : '')
                    + ` onchange="window.plugin.${this.pluginName}.setOption('${key}', this.checked)">`
                    + this.formatTitle(key) + '</label><br>'
                )
            })
        }

        const info = this.themeProvider.getInfo(this.settings.theme)
        let infoHtml = ''

        if (info) {
            infoHtml = '<li>Author: ' + info.author + '</li>'

            infoHtml = '<ul>' + infoHtml + '</ul>'
        }

        const variantsElement = document.getElementById(`${this.pluginName}ThemeVariants`)
        const optionsElement = document.getElementById(`${this.pluginName}ThemeOptions`)
        const infoElement = document.getElementById(`${this.pluginName}ThemeInfo`)

        if (variantsElement) variantsElement.innerHTML = variants.length ? variants.join('\n') : 'none'
        if (optionsElement) optionsElement.innerHTML = options.length ? options.join('\n') : 'none'
        if (infoElement) infoElement.innerHTML = infoHtml
    }

    private formatTitle(str: string) {
        if ('' === str) return str

        const normalized = str.replace(/-+/g, ' ')
        return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    }
}
