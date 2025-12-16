import fs from "fs"
import fs_promises from "fs/promises"
import path from "path"

class JsonFabric {
    private folderPath: string
    
    public image_list: string[]

    constructor(folder_path: string) {
        this.folderPath = folder_path
        this.image_list = []
    }

    public async extractData<T>
    (
        tablename: string, 
        db_func: (data: T, order: number) => {image: string | null}
    ) 
    {
        try {
            const files = await fs_promises.readdir(this.folderPath)
            for (const [index, file] of files.entries()) {
                const childPath = path.join(this.folderPath, file)
                const folderstat = await fs_promises.stat(childPath)
                if (folderstat.isDirectory()) {
                    //const entityId = file
                    const filepath = path.join(childPath, "index.json")
                    const data = await fs_promises.readFile(filepath)
                    const jsonData: T = JSON.parse(data.toString())
                    const {image} = db_func(jsonData, index)
                    if (image) this.image_list[index] = image
                }
            }
            console.log(`${tablename} have been copied to db form json file! and also got all image filenames`)
            return;
        } catch (e) {
            throw e
        }
    }

    
}

export default JsonFabric;

// old realization 
// fs.readdir(this.folderPath, (err, files) => {
//             if (err) throw err;
//             for (let [index, file] of files.entries()) {
//                 const childPath = path.join(this.folderPath, file)
//                 fs.stat(childPath, (err, folderstat) => {
//                     if (folderstat.isDirectory()) {
//                         if (err) throw err;
//                         const entityId = file
//                         const filepath = path.join(childPath, "index.json")
//                         fs.readFile(filepath, (err, data) => {
//                             if (err) throw err;
//                             const jsonData: T = JSON.parse(data.toString())
//                             const {image} = db_func(jsonData, index)
//                             this.image_list.push(image)
//                         })
                        
//                     }
//                 })
//             }
//             //console.log(`${tablename} have been copied to db form json file!`)
//         })