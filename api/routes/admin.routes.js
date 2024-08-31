import express from 'express'
import { adminDashboard } from '../controllers/admin.controller.js'

const router = express.Router()

router.get('/dashboard', adminDashboard)

export default router