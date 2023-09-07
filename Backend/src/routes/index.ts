import { upload } from '@/http/controllers/upload-products'
import { products } from '../http/controllers/fetch-product'
import { Router } from 'express'
import multer from 'multer'

const multerConfig = multer()

const routes = Router()

routes.get('/products', products)
routes.patch('/products/upload', multerConfig.single('file'), upload)

export { routes }
