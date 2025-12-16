
export function getUrlFilename(url: string, filefolder: string): string {
    return url.slice(url.indexOf(filefolder)+filefolder.length+1, url.length) //+1 cuz '/' in url string
}