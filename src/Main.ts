import * as Plugin from "iitcpluginkit";


class IitcThemeChooser implements Plugin.Class {

    init() {
        console.log("IitcThemeChooser " + VERSION);

        

        // FILL ME
    }

}

/**
 * use "main" to access you main class from everywhere
 * (same as window.plugin.IitcThemeChooser)
 */
export const main = new IitcThemeChooser();
Plugin.Register(main, "IitcThemeChooser");
