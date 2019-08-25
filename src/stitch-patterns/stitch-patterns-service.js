const xss = require('xss')

const StitchPatternsService = {

    getAllStitchPatternsForUser(db, userId) {
        return db
            .from('stitches')
            .select('*')
            .where('user_id', userId)
    },

    serializePattern(stitchPattern) {
        return {
            id: stitchPattern.id,
            name: xss(stitchPattern.name),
            url: xss(stitchPattern.url),
            image_url: xss(stitchPattern.image_url),
            notes: xss(stitchPattern.notes),
            user_id: stitchPattern.user_id
        }
    },

    insertPattern(db, pattern) {
        return db
            .insert(pattern)
            .into('stitches')
            .returning('*')
            .then(rows => rows[0])
            .then(pattern => 
                StitchPatternsService.getById(db, pattern.id)
            )
    },

    getById(db, id) {
        return db
            .from('stitches')
            .select('*')
            .where('id', id)
            .first();
    },

    deletePattern(db, id) {
        return db('stitches')
            .where({id})
            .delete()
    }
}

module.exports = StitchPatternsService