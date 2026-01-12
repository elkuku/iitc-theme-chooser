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
        console.log(`${PLUGIN_NAME} ${VERSION}`)
        this.loadSettings()
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

    public setVariant(name: string, update = true) {
        console.log('set variant', name)
        this.settings.variant = name

        this.storeSettings()

        if (update) {
            this.dialogHelper.showTheme(this.settings)
        }
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

    private addHooks() {
        window.addHook('iitcLoaded', this.onIitcLoaded)
    }

    private onIitcLoaded = () => {
        console.log(`${PLUGIN_NAME} | Activating theme: ${this.settings.theme}`)
        this.dialogHelper = new DialogHelper(PLUGIN_NAME, 'Theme Chooser', this.settings)
        this.dialogHelper.showTheme(this.settings)
    }

    private loadSettings() {
        const settings = localStorage.getItem(KEY_STORAGE)

        if (null === settings) {
            this.settings = structuredClone(defaultSettings)
            localStorage.setItem(KEY_STORAGE, JSON.stringify(this.settings))
        } else {
            this.settings = JSON.parse(settings)
        }
    }

    private storeSettings() {
        localStorage.setItem(KEY_STORAGE, JSON.stringify(this.settings))
    }

    private createButtons(): void {
        IITC.toolbox.addButton({
            label: 'Themes2',
            title: 'Select a theme [t]',
            accessKey: 't',
            id: `btn-${PLUGIN_NAME}`,
            action: this.showDialog
        })
    }

    private showDialog = async (): Promise<void> => {
        if (this.dialog) return

        this.dialog = this.dialogHelper.getDialog()
        this.dialog.on('dialogclose', () => { this.dialog = undefined })

        this.dialogHelper.updateOptions()
    }
}

Plugin.Register(new ThemeChooser, 'ThemeChooser')
