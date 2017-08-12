import db from '../database'
import dbUtils from '../database/utils'
import companySchema from '../schemas/company'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'
const uuid = require('uuid/v4')