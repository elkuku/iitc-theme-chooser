// NOTE: The `themes.json` file does not exist in the repository.
// It is generated using the `scripts/create-theme-file.js` script
// @ts-ignore
import themes from '../../build/themes.json'

import {Theme} from '../../types/Types'

export class ThemeProvider {

    public getTheme(name: string): Theme {
        return themes[name] as Theme
    }

    public getList(): Record<string, Theme> {
        return themes
    }
}
