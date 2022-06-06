const fs = require('fs')
const path = require('path')
const axios = require('axios').default
async function run() {
    let dir = path.join(process.env.HOME, 'Downloads')
    let files = (await fs.promises.readdir(dir)).filter(a => a.startsWith('aaa'))
    let all = await Promise.all(files.map(async file => {
        let name = /aaa_(?<name>.+).json$/.exec(file).groups.name;
        let content = await fs.promises.readFile(path.join(dir, file))
        return { name, list: JSON.parse(content) }
    }))
    for (let item of all) {
        let target = path.join(__dirname, 'download', item.name);
        if (!fs.existsSync(target)) {
            await fs.promises.mkdir(target)
        }
        for (let url of item.list) {
            let resp = await axios.get(url, {
                headers: {
                    'authority': 'i.pximg.net',
                    'referer': 'https://www.pixiv.net/'
                },
                validateStatus: () => true,
                responseType: 'stream'
            })
            if (resp.status == 200) {
                await new Promise((resolve, reject) => {
                    resp.data.pipe(fs.createWriteStream(
                        path.join(target, /.+\/(?<name>.+?)$/.exec(url).groups.name)))
                    resp.data.on('end', resolve)
                    resp.data.on('error', reject)
                })
                console.log(url, 'complete')
            } else {
                console.log(url, 'error')
            }
        }
        console.log(item.name, 'complete')
    }
}


run()