
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
    imports?: string,
    variants?: Record<string, string>,
    options?: Record<string, string>,
}

export interface ThemeInfo {
    name: string,
    preview: string,
    variants?: string[],
    options?: string[],
}

export interface Info {
    name: string,
    description: string,
    author: string,
    version: string,
}

export interface Changelog {
    name: string,
    message: string,
}

export interface Settings {
    theme: string
    variant: string
    options: string[]
}

