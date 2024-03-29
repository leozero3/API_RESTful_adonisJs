import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext' //contem tudo que é enviado na request, parametro de rota, body.
import Moment from 'App/Models/Moment'

import { v4 as uuidv4 } from 'uuid'
import Application from '@ioc:Adonis/Core/Application'

export default class MomentsController {
  private validatorOptions = {
    types: ['image'],
    size: '2mb',
  }

  public async store({ request, response }: HttpContextContract) {
    const body = request.body()

    const image = request.file('image', this.validatorOptions)
    if (image) {
      const imageName = `${uuidv4()}.${image.extname}`

      await image.move(Application.tmpPath('uploads'), {
        name: imageName,
      })

      body.image = imageName
    }

    const moment = await Moment.create(body)

    response.status(201)
    return { message: 'sucesso', data: moment }
  }

  public async index() {
    const moments = await Moment.query().preload("comments")
    return {
      data: moments,
    }
  }

  public async show({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)

    await moment.load('comments')

    return {
      data: moment,
    }
  }

  public async destroy({ params }: HttpContextContract) {
    const moment = await Moment.findOrFail(params.id)
    await moment.delete()

    return {
      message: 'Momento excluido com sucesso!',
      data: moment,
    }
  }

  public async update({ params, request }: HttpContextContract) {
    const body = request.body()
    const moment = await Moment.findOrFail(params.id)
    moment.title = body.title
    moment.description = body.description

    if (moment.image != body.image || !moment.image) {
      const image = request.file('image', this.validatorOptions)

      if (image) {
        const imageName = `${uuidv4()}.${image.extname}`

        await image.move(Application.tmpPath('uploads'), {
          name: imageName,
        })

        moment.image = imageName
      }
    }

    await moment.save()

    return { message: 'Momento atualizado com sucesso!', data: moment }
  }
}
