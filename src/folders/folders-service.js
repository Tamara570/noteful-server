const FoldersService = {
    getAllFolders(db) {
        return db.select('*').from('folders')
    },
    insertFolder(db, newFolder) {
        return db
            .insert(newFolder)
            .into('folders')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getFolderById(db, id) {
        return db.from('folders').select('*').where('id', id).first()
    },
    deleteFolder(db, id) {
        return db('folders')
            .where({ id })
            .delete()
    },
  
    updateFolder(db, id, newFolderFields) {
      return db('folders')
        .where({ id })
        .update(newFolderFields)
    }
  }
  
  module.exports = FoldersService
  