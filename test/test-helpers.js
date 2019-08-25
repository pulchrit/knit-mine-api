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

/* function makeExpectedArticle(users, article, comments=[]) {
  const author = users
    .find(user => user.id === article.author_id)

  const number_of_comments = comments
    .filter(comment => comment.article_id === article.id)
    .length

  return {
    id: article.id,
    style: article.style,
    title: article.title,
    content: article.content,
    date_created: article.date_created.toISOString(),
    number_of_comments,
    author: {
      id: author.id,
      user_name: author.user_name,
      full_name: author.full_name,
      nickname: author.nickname,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
} 

function makeExpectedArticleComments(users, articleId, comments) {
  const expectedComments = comments
    .filter(comment => comment.article_id === articleId)

  return expectedComments.map(comment => {
    const commentUser = users.find(user => user.id === comment.user_id)
    return {
      id: comment.id,
      text: comment.text,
      date_created: comment.date_created.toISOString(),
      user: {
        id: commentUser.id,
        user_name: commentUser.user_name,
        full_name: commentUser.full_name,
        nickname: commentUser.nickname,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousArticle(user) {
  const maliciousArticle = {
    id: 911,
    style: 'How-to',
    date_created: new Date(),
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    author_id: user.id,
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  }
  const expectedArticle = {
    ...makeExpectedArticle([user], maliciousArticle),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousArticle,
    expectedArticle,
  }
} */

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

const cleanTables = (db) => {
    return db.transaction(trx =>  
        // Because we have three related tables, we have to truncate all
        // data from all tables and reset the primary key generator sequence.
        // We need to use the raw() method of knex to execute SQL (because knex
        // doesn't have a method to accomplish what we want.)
        trx.raw('TRUNCATE project_stitch, projects, stitches, patterns, users RESTART IDENTITY CASCADE')
    );
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

/* function seedMaliciousArticle(db, user, article) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('blogful_articles')
        .insert([article])
    )
} */

module.exports = {
  makeAuthHeader,
  /* makeExpectedArticle,
  makeExpectedArticleComments,
  makeMaliciousArticle, */

  cleanTables,
  seedProjectPatterns,
  //seedMaliciousArticle,
  seedUsers
}
