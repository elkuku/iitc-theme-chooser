
export interface HelperHandlebars {
    compile: (templateString: any) => Handlebars.TemplateDelegate
    registerHelper: (name: Handlebars.HelperDeclareSpec) => void
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

export interface Theme {
    name: string,
    css: string,
    preview: string,
    variants: Record<string, string>,
    options: Record<string, string>,
}

export interface Settings {
    theme: string
    variant: string
    options: string[]
}

