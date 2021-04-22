var express = require('express');
var { graphqlHTTP} = require('express-graphql');
var { buildSchema } = require('graphql');

// GraphQL schema
//The Course object type consist of six properties in total. 
//The defined query actions enable the user to retrieve a single course by ID or retrieving an array of Course objects by course topic.
var schema = buildSchema(`
    type Query {
        course(id: Int!): [Course]
        courses(topic: String): [Course]
        courseWithTitle(pieceTitle: String!): [Course]
    },
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    },
    type Mutation {
        createCourse(input: CourseInput): [Course]
    }
    input CourseInput {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }

`);

//ci-dessus, le "!" signifie que le paramètre est obligatoire. Ici c'est pour l'ID
//courses renvoit un array de Course.

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

var getCourse = function(args) { 
    var id = args.id;
    return coursesData.filter(course => {
        return course.id == id;
    })[0];
}

var getCourses = function(args) {
    if (args.topic) {
        var topic = args.topic;
        return coursesData.filter(course => course.topic === topic);
    } else {
        return coursesData;
    }
}

var getTitle = function(args){
    var pieceTitle = args.pieceTitle;
    return coursesData.filter(course => course.title.includes(pieceTitle));
}

var createCourse = function({input}){
    coursesData.push(input);
    return coursesData;
}
//In the root resolver we’re connecting the course query action to the getCourse function
//and the courses query action to the getCourses function
//Pour définir root, il faut utiliser des fonctions, d'où getCourse et getCourses qui sont définies juste au dessus.
var root = {
    course: getCourse,
    courses: getCourses,
    courseWithTitle : getTitle,
    createCourse : createCourse

};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));

/*
à rentrer dans la console: 
query getID($courseID: Int!){
  course(id: $courseID){
              id
              title
              author
              description
              topic
              url
  }
}

mutation createCourse($input: CourseInput) {
    createCourse(input: $input) {
        id
        title
        author
        description
        topic
        url
    }
}
*/

/*
{
  "input": {
    "id": 4,
    "title": "Star wars",
    "author": "Peter",
    "description": "Super cool",
    "topic": "pas didee",
    "url": "https://codingthesmartway.com/courses/nodejs/"
  }
}
*/