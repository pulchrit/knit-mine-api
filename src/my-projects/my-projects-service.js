const xss = require('xss')

const MyProjectsService = {

    getAllProjectsForUser(db, userId) {
            return db
            .from('projects')
            .select('*')            
            .where('projects.user_id', '=', userId)     
    },

    // Does this need to account for user_id?????
    // I don't think so because the project_id would be linked to 
    // a particular user and there are no duplicate project_ids.
    getStitchesForProject(db, project_id) {
            return db
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
                .then(results => results.map(stitchesObject => 
                        MyProjectsService.serializeStitch(stitchesObject.stitches))
                ) 
    },

    serializeStitch(stitch) {
        return {
            stitches_id: stitch.stitches_id,
            stitches_name: xss(stitch.stitches_name)
        }
    },

    serializePattern(pattern) {
        return {
            pattern_id: pattern.pattern.pattern_id,
            pattern_name: xss(pattern.pattern.pattern_name)
        }
    },

    // Need to separate all projects from individual projects.
    // For all projects, we don't need stitch or project pattern information for 
    // this route on the endpoint. We only need stitch info.  and pattern info.
    // when we call an individual project. 
    serializeAllProjects(project) {
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
            user_id: project.user_id,
            pattern: project.pattern
        }
    },

    // Serialize an individual project for POST and GET by Id.
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
            stitches: await MyProjectsService.getStitchesForProject(db, project.id) || [],
            user_id: project.user_id,
            pattern: await MyProjectsService.getPatternForProject(db, project.pattern_id) || '' // await???
        }
    }, 

    insertProject(db, project) {
        return db
            .insert(project)
            .into('projects')
            .returning('*')
            .then(rows => rows[0]) 
            .then(project => 
                MyProjectsService.getProjectById(db, project.id)
            ) 
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
    },

    getPatternForProject(db, id) {
        if (!id) {
            return ''
        } else {
            return db
                .from('patterns')
                .select(
                    db.raw(
                        `json_strip_nulls(
                            json_build_object(
                                'pattern_id', patterns.id,
                                'pattern_name', patterns.name
                            )
                        ) AS "pattern"`
                    )
                )
                .where('id', id)
                .first() 
                .then(pattern => MyProjectsService.serializePattern(pattern))  
        }                     
    },

    // getProjectById only gets the project from the project table. We get and serialize
    // the pattern and stitches (if there are any) when we serialize the project
    // for POST and GET /:id. 
    getProjectById(db, id) {
        return db
            .from('projects')
            .select('*')
            .where('id', id)
            .first()
    }
}

module.exports = MyProjectsService