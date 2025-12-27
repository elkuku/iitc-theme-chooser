import fs from 'fs'

//const templateFile = 'src/Helper/ThemeProvider.ts'

if (!fs.existsSync('dist')) fs.mkdirSync('dist')

const themes = fs.readdirSync('themes', {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const themesList = {}

themes.forEach(theme => {
    const meta = JSON.parse(fs.readFileSync(`themes/${theme}/meta.json`))

    let cssString = fs.readFileSync(`themes/${theme}/main.css`, 'utf8') + '\n'
    const additionalCssFiles = fs.readdirSync(`themes/${theme}`)
        .filter(file => file.endsWith('.css'))
        .filter(file => !file.startsWith('main.css'))
    additionalCssFiles.forEach(file => {
        cssString += fs.readFileSync(`themes/${theme}/${file}`, 'utf8') + '\n'
    })

    themesList[theme] = {
        name: meta.name,
        css: cssString.replace(/ {4}|[\r\n\t]/g, ''),
        preview: meta.preview,
    }
})

//const fileName = 'IITC-plugin-Blurtheme.template.js'

//let template = fs.readFileSync(templateFile, 'utf8') + '\n'

fs.writeFileSync(
    //'dist/' + fileName.replace('.template.', '.user.'),
    //templateFile.replace('.ts', '.copy.ts'),
    'dist/themes.json',
    //template.replace(
      //  '{} // {{THEME_LIST}}',
        JSON.stringify(themesList, null, 2)
    //),
)
