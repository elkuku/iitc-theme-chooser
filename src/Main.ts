import * as Plugin from 'iitcpluginkit'

import {DialogHelper} from './Helper/Dialog'
import {Settings} from '../types/Types'

const PLUGIN_NAME = 'ThemeChooser'
const KEY_STORAGE = 'theme-chooser'

const defaultSettings: Settings = {
    'theme': 'default',
    'variant': '',
    'options': [],
}

class ThemeChooser implements Plugin.Class {

    private dialogHelper: DialogHelper

    private dialog?: JQuery

    private settings: Settings

    init() {
        console.log(`ThemeChooser ${VERSION}`)

        const settings = localStorage.getItem(KEY_STORAGE)

        if (null === settings) {
            this.settings = structuredClone(defaultSettings)
            localStorage.setItem(KEY_STORAGE, JSON.stringify(this.settings))
        } else {
            this.settings = JSON.parse(settings)
        }

        this.dialogHelper = new DialogHelper(PLUGIN_NAME, 'Theme Chooser', this.settings)

        this.createButtons()
        this.addHooks()
    }

    public switchTheme(name: string) {
        console.log(`${PLUGIN_NAME} | Switching to: ${name}`)
        this.settings = structuredClone(defaultSettings)
        this.settings.theme = name

        this.storeSettings()

        this.dialogHelper.showTheme(this.settings)
        this.dialogHelper.updateOptions()
    }

    public setVariant(name: string) {
        console.log('set variant', name)
        this.settings.variant = name
        this.storeSettings()
        this.dialogHelper.showTheme(this.settings)
    }

    public setOption(name: string, value: boolean) {
        console.log('set option', name, value)

        if (value) {
            if (!this.settings.options.includes(name)) {
                this.settings.options.push(name)
            }
        } else {
            const index = this.settings.options.indexOf(name)
            if (index !== -1) {
                this.settings.options.splice(index, 1)
            }
        }
        this.storeSettings()
        this.dialogHelper.showTheme(this.settings)
    }

    public resetSettings = () => {
        if (confirm('Are you sure about that?')) {
            alert('reset settings (soon)')
        }
    }

    private onIitcLoaded = () => {
        console.log(`${PLUGIN_NAME} | Activating theme: ${this.settings.theme}`)
        document.head.insertAdjacentHTML('beforeend', `<style id="${PLUGIN_NAME}"><style>`)
        this.dialogHelper.showTheme(this.settings)
    }

    private addHooks() {
        window.addHook('iitcLoaded', this.onIitcLoaded)
    }

    private createButtons(): void {
        IITC.toolbox.addButton({
            id: `btn-${PLUGIN_NAME}`,
            label: 'Themes2',
            action: this.showDialog,
            title: 'Select a theme [t]',
            accessKey: 't'
        })
    }

    private showDialog = async (): Promise<void> => {
        if (this.dialog) return

        this.dialog = this.dialogHelper.getDialog()
        this.dialog.on('dialogclose', () => { this.dialog = undefined })

        // Init jquery tabs
        $(`#${PLUGIN_NAME}JqueryTabs`).tabs()

        this.dialogHelper.updateOptions()
    }

    private storeSettings() {
        localStorage.setItem(KEY_STORAGE, JSON.stringify(this.settings))
    }
}

Plugin.Register(new ThemeChooser, 'ThemeChooser')
