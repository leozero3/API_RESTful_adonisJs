import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/', async () => {
    return { hello: 'world' }
  })

  // Route.post('/moments', 'MomentsController.store')
  Route.resource('/moments', 'MomentsController').apiOnly()
}).prefix('/api')
