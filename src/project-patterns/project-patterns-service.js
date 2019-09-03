const xss = require('xss')

const ProjectPatternsService = {

    getAllProjectPatternsForUser(db, userId) {
        return db
            .from('patterns')
            .select('*')
            .where('patterns.user_id', userId)
    },

    serializePattern(projectPattern) {
        return {
            id: projectPattern.id,
            name: xss(projectPattern.name),
            url: xss(projectPattern.url),
            image_url: xss(projectPattern.image_url),
            notes: xss(projectPattern.notes),
            yarn: xss(projectPattern.yarn),
            needles: xss(projectPattern.needles),
            user_id: projectPattern.user_id
        }
    },

    insertPattern(db, pattern) {
        return db
            .insert(pattern)
            .into('patterns')
            .returning('*')
            .then(rows => rows[0])
            .then(pattern => 
                ProjectPatternsService.getById(db, pattern.id)
            )
    },

    getById(db, id) {
        return db
            .from('patterns')
            .select('*')
            .where('id', id)
            .first();
    },

    deletePattern(db, id) {
        return db('patterns')
            .where({id})
            .delete()
    }
}

module.exports = ProjectPatternsService