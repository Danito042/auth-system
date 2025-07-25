import multer from "multer"


const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        cb(null, "media")
    },
    filename: (req: any, file: any, cb: any) => {
        const uniquesuffix = Date.now() + "_" + Math.round(Math.random() * 1E9)

        cb(null, file.filename + uniquesuffix + ".jpg")
    }
})

export const upload = multer ({storage :storage}).single("avater")