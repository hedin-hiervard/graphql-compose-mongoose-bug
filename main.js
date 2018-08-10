import mongoose from 'mongoose'
import { composeWithMongoose } from 'graphql-compose-mongoose'

(async function() {

  const PlayerSchema = new mongoose.Schema({
      name: {
          type: String,
          required: true,
      },
      surname: {
          type: String,
          required: true,
          default: [],
      },
      sex: {
          type: String,
          required: true,
          enum: ['m', 'f'],
      },
  })

  const GameSchema = new mongoose.Schema({
      players: {
          required: true,
          type: [{
              type: mongoose.Schema.Types.ObjectId,
              ref: 'PlayerModel',
          }],
      },
  })

  const GameModel = mongoose.model('GameModel', GameSchema)
  const PlayerModel = mongoose.model('PlayerModel', PlayerSchema)

  mongoose.connect('mongodb://localhost/test')

  await mongoose.connection.dropDatabase()

  const player1 = new PlayerModel( { name: '1', surname: '1', sex: 'm' })
  const player2 = new PlayerModel( { name: '2', surname: '2', sex: 'f' })
  await player1.save()
  await player2.save()

  const game = new GameModel({
    players: [ player1, player2 ]
  })
  await game.save()
  const id = game._id


  let g1 = await GameModel
    .find({ _id: id })
    .populate('players')
  console.log(g1)

  composeWithMongoose(GameModel)

  let g2 = await GameModel
    .find({ _id: id })
    .populate('players')
  console.log(g2)

})()
