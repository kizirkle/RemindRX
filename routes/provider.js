import express from 'express'
const providerRouter = express.Router()

import {getProviderById} from '../database.js'

//Access provider portal of specific provider
providerRouter.get("/:id", async(req,res) => {
    var provider = await getProviderById(req.params.id)
    return res.render('patientPortal.ejs', {patientName: `${provider.provider_first_name} ${provider.provider_last_name}`})
})

export default providerRouter