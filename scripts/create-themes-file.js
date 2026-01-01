import fs from 'fs'

if (!fs.existsSync('build')) fs.mkdirSync('build')

const themes = fs.readdirSync('themes', {withFileTypes: true})
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

themes.unshift(themes.splice(themes.indexOf('default'), 1)[0])

const themesList = {}

themes.forEach(theme => {
    const variants = {}
    const options = {}

    const meta = JSON.parse(fs.readFileSync(`themes/${theme}/meta.json`))
    let cssString = fs.readFileSync(`themes/${theme}/main.css`, 'utf8') + '\n'

    const additionalCssFiles = fs.readdirSync(`themes/${theme}`)
        .filter(file => file.endsWith('.css'))
        .filter(file => !file.startsWith('main.css'))

    if (fs.existsSync(`themes/${theme}/variants`)) {
        const variantFiles = fs.readdirSync(`themes/${theme}/variants`)
        variantFiles.forEach(file => {
            variants[file.replace('.css', '')] = fs.readFileSync(`themes/${theme}/variants/${file}`, 'utf8') + '\n'
        })
    }

    if (fs.existsSync(`themes/${theme}/variants`)) {
        const optionFiles = fs.readdirSync(`themes/${theme}/options`)
        optionFiles.forEach(file => {
            options[file.replace('.css', '')] = fs.readFileSync(`themes/${theme}/options/${file}`, 'utf8') + '\n'
        })
    }

    additionalCssFiles.forEach(file => {
        cssString += fs.readFileSync(`themes/${theme}/${file}`, 'utf8') + '\n'
    })

    themesList[theme] = {
        name: meta.name,
        css: cssString,
        //css: cssString.replace(/ {4}|[\r\n\t]/g, ''),
        variants: variants,
        options: options,
        preview: meta.preview,
    }
})

fs.writeFileSync(
    'build/themes.json',
    JSON.stringify(themesList, null, 2),
)
