const xss = require('xss')

const MyProjectsService = {

    getAllProjectsForUser(db, userId) {
        return db
            .from('projects')
            .select(
                'projects.id', 
                'projects.name', 
                'projects.image', 
                'projects.description', 
                'projects.gift_recipient', 
                'projects.gift_occasion',
                'projects.yarn', 
                'projects.needles', 
                'projects.pattern_id',
                'projects.user_id',
                db.raw(
                    `json_strip_nulls(
                        json_build_object(
                            'patterns_id', patterns.id,
                            'patterns_name', patterns.name
                        )
                    ) AS "pattern"`
                ),
            )
            .innerJoin('patterns', 'patterns.id', 'projects.pattern_id')
            .where('projects.user_id', '=', userId)   
    },

    // Does this need to account for user_id?????
    // I don't think so because the project_id would be linked to 
    // a particular user and there are no duplicate project_ids.
    getStitchesForProject(db, project_id) {
            return  db
                .from('project_stitch')
                .select(
                    db.raw(
                    `json_build_object(
                        'stitches_id', stitches.id,
                        'stitches_name', stitches.name
                    ) AS "stitches"`
                    )
                )
                .innerJoin('stitches', 'project_stitch.stitch_id', 'stitches.id')
                .where('project_stitch.project_id', '=', project_id)
                .then(results => console.log("before serialize", results) || results)
                .then(results => {
                    const serialized = results.map(stitchesObject => 
                        MyProjectsService.serializeStitch(stitchesObject.stitches))
                    return serialized
                }
                ) 
                // If I return to the then as below, not all of the stitches are processed.
                //.then(results => {return (Object.values(results))} )
                //.then(results => results)
                //.then(results => console.log("after serialize", results) || results) //?????????????????
    },

    serializeStitch(stitch) {
        return {
            stitches_id: stitch.stitches_id,
            stitches_name: xss(stitch.stitches_name)
        }
    },

    async serializeProject(db, project) {

        return {
            id: project.id,
            name: xss(project.name),
            image: project.image,
            description: xss(project.description),
            gift_recipient: xss(project.gift_recipient),
            gift_occasion: xss(project.gift_occasion),
            yarn: xss(project.yarn),
            needles: xss(project.needles),
            pattern_id: project.pattern_id,
            //stitches: await Object.values(MyProjectsService.getStitchesForProject(db, project.id)),
            stitches: await MyProjectsService.getStitchesForProject(db, project.id),
            user_id: project.user_id
        }
    }, 
/* 
    return knex("users")
  .insert({ first_name: "John", last_name: "Doe" })
  .returning('id')
  .then(function (response) {
    return knex('groups')
      .insert({name: 'Cool Group', user_id: response[0]})
  });*/

   /*  insertProject(db, project) { 
        return db
            .insert(project)
            .into('projects')
            .returning('*')
            .then(rows => rows[0])
            .then(project => {
                return db('project_stitch')
                .insert({project_id: response[0].id, stitch_id: })
            })
            
    },  */


    insertProject(db, project) {
        return db
            .insert(project)
            .into('projects')
            .returning('*')
            .then(rows => {return rows[0]})
            /* .then(project => 
                MyProjectsService.getById(db, pattern.id)
            ) */
    }, 

    insertProjectStitch(db, project_id, stitch_id) {
        return db
            .insert({
                project_id,
                stitch_id
            })
            .into('project_stitch')
            .returning('*')
            .then(rows => {return rows})
            //getById here instead of above????
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

module.exports = MyProjectsService