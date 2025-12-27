import fs from 'fs'

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

fs.writeFileSync(
    'themes/themes.json',
    JSON.stringify(themesList, null, 2),
)
