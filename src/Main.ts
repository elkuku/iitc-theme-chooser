import * as Plugin from 'iitcpluginkit';
import {DialogHelper} from "./Helper/Dialog";
import {ThemeProvider} from "./Helper/ThemeProvider";

const PLUGIN_NAME = 'ThemeChooser'
const KEY_STORAGE = 'theme-chooser';

interface Settings {
    theme: string;
}

class ThemeChooser implements Plugin.Class {

    private themeProvider: ThemeProvider
    private dialogHelper: DialogHelper
    private dialog: JQuery | undefined
    private settings: Settings

    private defaultSettings = {
        'theme': 'default',
        'blur': true,
        'animations': false,
    }

    init() {
        console.log(`ThemeChooser ${VERSION}`);

        const settings = localStorage.getItem(KEY_STORAGE)

        if (null === settings) {
            localStorage.setItem(KEY_STORAGE, JSON.stringify(this.defaultSettings))
            this.settings = this.defaultSettings
        } else {
            this.settings = JSON.parse(settings)
        }

        this.themeProvider = new ThemeProvider()
        this.dialogHelper = new DialogHelper(PLUGIN_NAME, 'Theme Chooser', this.settings.theme, this.themeProvider.getList())

        this.createButtons()
        this.addHooks()
    }

    public activateTheme(themeName = '') {
        if (themeName === '') {
            themeName = this.settings.theme;
            console.log(`ThemeChooser | Activating theme: ${themeName}`);
        } else {
            console.log(`ThemeChooser | Switching to: ${themeName}`);
            this.settings.theme = themeName;
            localStorage.setItem(KEY_STORAGE, JSON.stringify(this.settings));
        }

        const element = document.getElementById('themeChooser')

        if (element) {
            const theme = this.themeProvider.getTheme(themeName)

            element.innerHTML = theme.css
        }
    }

    private onIitcLoaded = () => {
        document.head.insertAdjacentHTML('beforeend', '<style id="themeChooser"><style>')
        this.activateTheme()
    }

    private addHooks() {
        window.addHook('iitcLoaded', this.onIitcLoaded);
    }

    private createButtons(): void {
        IITC.toolbox.addButton({
            id: `btn-${PLUGIN_NAME}`,
            label: 'xThemes',
            action: this.showDialog,
            title: 'Select a theme [t]',
            accessKey: 't'
        })
    }

    private showDialog = async (): Promise<void> => {
        if (!this.dialog) {
            this.dialog = this.dialogHelper.getDialog()
            this.dialog.on('dialogclose', () => {
                this.dialog = undefined
            })

            await this.dialogHelper.updateDialog()
        }
    }
}

Plugin.Register(new ThemeChooser(), 'ThemeChooser');
