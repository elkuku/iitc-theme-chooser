// @ts-expect-error "Import attributes are only supported when the --module option is set to esnext, nodenext, or preserve"
import dialogTemplate from '../tpl/dialog.hbs' with {type: 'text'}

import {Theme} from "./ThemeProvider";
import {HelperHandlebars} from "../../types/Types";

export class DialogHelper {

    private handlebars: HelperHandlebars

    public constructor(
        private pluginName: string,
        private title: string,
        private activeTheme: string,
        private themes:Record<string, Theme>,
    ) {}

    public getDialog(): JQuery {
        this.handlebars = window.plugin.HelperHandlebars

        if (!this.handlebars) {
            alert(`${this.pluginName} - Handlebars helper not found`)
            throw new Error(`${this.pluginName} - Handlebars helper not found`)
        }

        // @ts-expect-error 'howtodeclaretypes?'
        this.handlebars.registerHelper({
            if_eq:(arg1:string, arg2:string, options: Handlebars.HelperOptions) => {
                return (arg1 === arg2) ? options.fn(this) : options.inverse(this);
            }
        })

        const template: Handlebars.TemplateDelegate = this.handlebars.compile(dialogTemplate)

        const data = {
            plugin: 'window.plugin.' + this.pluginName,
            prefix: this.pluginName,
            activeTheme: this.activeTheme,
            themes: this.themes,
            playerName: window.PLAYER.nickname // @TODO remove?
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

    async updateDialog() {
        console.info('DialogHelper.updateDialog()')
    }
}