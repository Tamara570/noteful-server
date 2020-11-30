const NotesService = require('./notes-service')
const express = require('express')
const path = require('path')
const xss = require('xss')

const notesRouter = express.Router()

const jsonParser = express.json()

const serializeNote = note => ({
  id: note.id,
  note_name: xss(note.note_name),
  content: xss(note.content),
  date_created: xss(note.date_created),
  folder_id: note.folder_id,

})

notesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    NotesService.getAllNotes(knexInstance)
      .then(notes => {
        res.json(notes.map(serializeNote))
      })
      .catch(next)
  })

  .post(jsonParser, (req, res, next) => {
    const { note_name, content, folder_id} = req.body
    const newNote = { note_name, content, folder_id }

    if (!note_name) {
      return res
        .status(400)
        .json({
          error: { message: `Missing 'note_name' in request body` }
        });
    }

    if (!content) {
        return res
          .status(400)
          .json({
            error: { message: `Missing 'content' in request body` }
          });
      }

      if (!folder_id) {
        return res
          .status(400)
          .json({
            error: { message: `Missing 'folder_id' in request body` }
          });
      }


    NotesService.insertNote(
      req.app.get('db'),
      newNote
    )
      .then(note => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${note.id}`))
          .json(serializeNote(note))
      })
      .catch(next)
  })

notesRouter
  .route('/:note_id')
  .all((req, res, next) => {
    const { note_id } = req.params
    // const knexInstance = req.app.get('db')

    NotesService.getNoteById(
      req.app.get('db'),
      note_id
    )
      .then(note => {
        if (!note) {
          return res.status(404).json({
            error: { message: `Note doesn't exist` }
          })
        }
        res.note = note
        next()
      })
      .catch(next)
  })

  .get((req, res, next) => {
    res.json(serializeNote(res.note))
  })


  .delete((req, res, next) => {
    NotesService.deleteNote(
      req.app.get('db'),
      req.params.note_id
      
    )
    .then(numRowsAffected => {
      res.status(204).end()
    })
      .catch(next)
  })

  .patch(jsonParser, (req, res, next) => {
    const { note_name, content} = req.body
    const noteUpdate = { note_name, content}

    if (!note_name) {
      return res
        .status(400)
        .json({
          error: { message: `Missing 'note_name' in request body` }
        });
    }

    if (!content) {
        return res
          .status(400)
          .json({
            error: { message: `Missing 'content' in request body` }
          });
      }


      NotesService.updateNote(
      req.app.get('db'),
      req.params.note_id,
      noteUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      
      

      .catch(next)
  })

module.exports = notesRouter