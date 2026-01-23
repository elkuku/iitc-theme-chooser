// @ts-expect-error "Import attributes are only supported when the --module option is set to esnext, nodenext, or preserve"
import dialogTemplate from '../tpl/dialog.hbs' with {type: 'text'}

import {HelperHandlebars, Settings, Theme} from '../../types/Types'
import {ThemeProvider} from './ThemeProvider'

export class DialogHelper {

    private handlebars: HelperHandlebars
    private themeProvider: ThemeProvider
    private readonly plugin: string

    public constructor(
        private pluginName: string,
        private title: string,
        private settings: Settings,
    ) {
        this.plugin = `window.plugin.${this.pluginName}`
        this.themeProvider = new ThemeProvider
        document.head.insertAdjacentHTML('beforeend', `<style id="${this.pluginName}-Style"><style>`)
    }

    public getDialog(): JQuery {
        this.handlebars = window.plugin.HelperHandlebars

        if (!this.handlebars) {
            alert(`${this.pluginName} - Handlebars helper not found.<br>Please <a href="https://iitc.app/community_plugins#helper-handlebars-by-elkuku">download</a> it.`)
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
            plugin: this.plugin,
            pluginVersion: VERSION,
            prefix: this.pluginName,
            settings: this.settings,
            themes: this.themeProvider.getList(),
        }

        return window.dialog({
            id: `dialog-${this.pluginName}`,
            title: this.title,
            html: template(data),
            width: 'auto',
            height: 'auto',
            buttons: [],
            hide: {
                effect: 'fade',
                duration: 1000
            }
        }).parent()
    }

    public showTheme(settings: Settings) {
        this.settings = settings

        const theme = this.themeProvider.getTheme(settings.theme)

        let variantCss = '', optionsCss = ''

        const importsCss = theme.imports ? theme.imports : ''

        // @ts-ignore
        if (theme.variants && Object.keys(theme.variants).length !== 0) {
            if (settings.variant) {
                variantCss = theme.variants[settings.variant]
            } else {
                const keys = Object.keys(theme.variants)
                const firstKey = keys[0]
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

        if (element) element.innerHTML = importsCss + variantCss + theme.css + optionsCss

        this.updateThemeSelection(settings.theme)
    }

    private updateThemeSelection(targetValue: string) {
        const container = document.getElementById(this.pluginName + '-ThemeList')
        if (!container) return

        const items = container.querySelectorAll('div')

        items.forEach(div => {
            if (div.dataset.for === targetValue) {
                div.classList.add('selected')
            } else {
                div.classList.remove('selected')
            }
        })
    }

    public updateOptions() {
        const theme = this.themeProvider.getTheme(this.settings.theme)

        const variantsHtml = this.getVariantsHtml(theme)
        const optionsHtml = this.getOptionsHtml(theme)
        const infoHtml = this.getInfoHtml(theme)

        const variantsElement = document.getElementById(`${this.pluginName}-ThemeVariants`)
        const optionsElement = document.getElementById(`${this.pluginName}-ThemeOptions`)
        const infoElement = document.getElementById(`${this.pluginName}-ThemeInfo`)

        if (variantsElement) variantsElement.innerHTML = variantsHtml.length ? variantsHtml.join('\n') : 'none'
        if (optionsElement) optionsElement.innerHTML = optionsHtml.length ? optionsHtml.join('\n') : 'none'
        if (infoElement) infoElement.innerHTML = infoHtml
    }

    private getVariantsHtml(theme: Theme) {
        let html: string[] = []

        if (theme.variants) {
            Object.keys(theme.variants).forEach(key => {
                const checked = key === this.settings.variant
                html.push('<label><input type="radio" name="themeVariant"'
                    + (checked ? 'checked' : '')
                    + ` onchange="${this.plugin}.setVariant('${key}')">`
                    + this.formatTitle(key) + '</label><br>'
                )
            })
        }

        return html
    }

    private getOptionsHtml(theme: Theme) {
        let html: string[] = []

        if (theme.options) {
            Object.keys(theme.options).forEach(key => {
                const checked = this.settings.options.includes(key)
                html.push('<label><input type="checkbox"'
                    + (checked ? ' checked' : '')
                    + ` onchange="${this.plugin}.setOption('${key}', this.checked)">`
                    + this.formatTitle(key) + '</label><br>'
                )
            })
        }

        return html
    }

    private getInfoHtml(theme: Theme) {
        const info = this.themeProvider.getInfo(this.settings.theme)
        const changelog = this.themeProvider.getChangelog(this.settings.theme)

        let html = ''

        if (info) {
            html += '<ul>'
            html += ''
            html += '<li>' + info.name + '</li>'
            html += '<li>' + info.description + '</li>'
            html += '<li>Version: ' + info.version + '</li>'
            html += '<li>Author: ' + info.author + '</li>'

            if (changelog.length > 0) {
                html += `<li><a href="#" onclick="${this.plugin}.showChangelog('${this.settings.theme}')">Changelog</a></li>`
            }

            html += '</ul>'
        }

        return html
    }

    private formatTitle(str: string) {
        if ('' === str) return str

        const normalized = str.replace(/-+/g, ' ')
        return normalized.charAt(0).toUpperCase() + normalized.slice(1)
    }

    public showChangelog(name: string) {
        const changelog = this.themeProvider.getChangelog(name)

        let html = ''

        if (changelog.length === 0) {
            html = 'No Changelog :('
        } else if (changelog[0].name === 'changelog') {
            html = `<pre>${changelog[0].message}</pre>`
        } else {
            html = 'todo: parse json changelog'
        }

        window.dialog({
            id: `dialog-changelog-${this.pluginName}`,
            title: 'Changelog',
            modal: true,
            html: html,
        }).parent()
    }
}
