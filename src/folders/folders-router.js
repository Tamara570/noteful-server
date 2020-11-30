const FoldersService = require('./folders-service')
const express = require('express')
const path = require('path')
const xss = require('xss')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder= folder => ({
  id: folder.id,
  folder_name: xss(folder.folder_name),

})

foldersRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    FoldersService.getAllFolders(knexInstance)
      .then(folders => {
        res.json(folders)
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { folder_name } = req.body
    const newFolder = { folder_name }

    if (!folder_name) {
      return res
        .status(400)
        .json({
          error: { message: `Missing 'folder name' in request body` }
        });
    }


    FoldersService.insertFolder(
      req.app.get('db'),
      newFolder
    )
      .then(folder => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${folder.id}`))
          .json(folder)
      })
      .catch(next)
  })

foldersRouter
  .route('/:folder_id')
  .all((req, res, next) => {
    const { folder_id } = req.params
    // const knexInstance = req.app.get('db')
    FoldersService.getFolderById(
      req.app.get('db'),
      folder_id
    )
      .then(folder => {
        if (!folder) {
          return res.status(404).json({
            error: { message: `Folder doesn't exist` }
          })
        }
        res.folder = folder
        next()
      })
      .catch(next)
  })

  .get((req, res, next) => {
    res.json(
        serializeFolder(res.folder)); 
    next()
  })

  .delete((req, res, next) => {
    FoldersService.deleteFolder(
      req.app.get('db'),
      req.params.folder_id
    )
      .then(() => {
        res.status(204).end()
      })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const {folder_name} = req.body
    const folderToUpdate = {folder_name}

    if (!folder_name) {
      return res
        .status(400)
        .json({
          error: { message: `Missing 'folder name' in request body` }
        });
    }

    FoldersService.updateFolder(
      req.app.get('db'),
      req.params.folder_id,
      folderToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })

      .catch(next)
  })


module.exports = foldersRouter