const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

// Makes the authorization header for tests that require it.
// Use JWT bearer tokens.
const makeAuthHeader = (user, secret = process.env.JWT_SECRET) => {
  const token = jwt.sign({id: user.id}, secret, {
    subject: user.email,
    algorithm: 'HS256'
  })
  return `Bearer ${token}`
}

const cleanTables = (db) => {
  return db.transaction(trx =>  
      // Because we have three related tables, we have to truncate all
      // data from all tables and reset the primary key generator sequence.
      // We need to use the raw() method of knex to execute SQL (because knex
      // doesn't have a method to accomplish what we want.)
      trx.raw('TRUNCATE project_stitch, projects, stitches, patterns, users RESTART IDENTITY CASCADE')
  );
}

const makeExpectedProject = () => {
  
  return {
    id: 6,
    name: "Blue's hat",
    image: "",
    description: "A hat for a young man",
    gift_recipient: "Blue",
    gift_occasion: "Holiday present 2019",
    yarn: "Cascade Fibers, Superwash 220, Carnival",
    needles: "US 7, circular",
    pattern_id: 3,
    stitches: [
        {
            stitch_id: 1,
            stitch_name: "Alsacian scallops"
        },
        {
            stitch_id: 5,
            stitch_name: "Horseshoe lace stitch"
        },
    ],
    user_id: 1,
    patterns: {
        pattern_id: 3,
        pattern_name: "Transverse cowl"
    }
  }
}



// Add users to the users table. The user table must be populated
// before all other tables, because all other tables are related
// to it via the user id foreign key.
const seedUsers = (db, users) => {
    const preppedUser = users.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, 10)
    })
    )
    return db.into('users').insert(preppedUser)
}


/* const seedProjectPatterns = (db, users, projectPatterns) => {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('patterns').insert(projectPatterns)
  })
} */

const seedProjectPatterns = (db, projectPatterns) => {
  return db.into('patterns').insert(projectPatterns)
}

const seedStitchPatterns = (db, stitchPatterns) => {
  return db.into('stitches').insert(stitchPatterns)
}

const seedMyProjects = (db, myProjects) => {
  db.into('projects').insert(myProjects)
}

const seedProjectStitch = (db, projectStitchData) => {
  db.into('project_stitch').insert(projectStitchData)
}


async function seedAllTables(db, users, projectPatterns, stitchPatterns, myProjects, projectStitchData) {
  await seedUsers(db, users)
  await seedProjectPatterns(db, projectPatterns)
  await seedStitchPatterns(db, stitchPatterns)
  await seedMyProject(db, myProjects)
  await seedProjectStitch(db, projectStitchData)
}



module.exports = {
  makeAuthHeader,
  makeExpectedProject,
  cleanTables,
  seedProjectPatterns,
  seedStitchPatterns,
  seedUsers,
  seedMyProjects,
  seedProjectStitch,
  seedAllTables
}
