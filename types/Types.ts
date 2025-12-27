
export interface HelperHandlebars {
    compile: (templateString: any) => Handlebars.TemplateDelegate
    registerHelper: (name: string, function_: Handlebars.HelperDelegate) => void
}

declare global {
    interface Window {
        plugin: {
            HelperHandlebars: HelperHandlebars
        }

        PLAYER: {
            nickname: string,
        }
    }
}