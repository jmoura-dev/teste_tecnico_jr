import { upload } from '@/http/controllers/products/upload-products'
import { products } from '../http/controllers/products/fetch-product'
import { validate } from '@/http/controllers/products/validated-products'
import { Router } from 'express'
import multer from 'multer'

const multerConfig = multer()

const routes = Router()

routes.get('/products', products)
routes.put('/products/update', multerConfig.single('file'), upload)
routes.post('/products/validate', multerConfig.single('file'), validate)

export { routes }
