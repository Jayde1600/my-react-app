const Joi = require('joi'); // Joi
const express = require('express');  //import express from 'express' equivalent/ load express module
const app = express();  //calls function

app.use(express.json());  // returns middleware

const courses = [
    {id: 1, name: 'course1'},
    {id: 2, name: 'course2'},
    {id: 3, name: 'course3'},
];

app.get('/', (req, res) => { //req = request and res = response  '/' get root of the website
    res.send('Hello World!!');
});

app.get('/api/courses', (req, res) => {
    res.send(courses);
});

app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) {
        //400 Bad Request
        return res.status(400).send(error.details[0].message); // first element and get message property
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

// Look up course with existing ID first, if doesn't exist then return 404
// If invalid, return 400 meaning Bad Request
// Update course, return the updated course
app.put('/api/courses/:id', (req, res) => {

    let course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course was not found!');

    const { error } = validateCourse(req.body);
    if (error) {
        //400 Bad Request
        return res.status(400).send(error.details[0].message); // first element and get message property
    }

    course.name = req.body.name;
    res.send(course);
});

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course); // Return the result of the validation
}

app.delete('/api/courses/:id', (req, res) => {
    //Look up the course, if it doesn't exist return 404
    let course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course was not found!');

    //Delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);

    // returning response to the user
    res.send(course);
});




app.get('/api/courses/:id', (req, res) => {
    let course = courses.find(x => x.id === parseInt(req.params.id)); //boolean value determines if this is the course we are looking for
    if (!course) return res.status(404).send('The course was not found!');
    res.send(course);
});

// PORT
const port = 3000 || process.env.PORT ; // port 3000 won't always be available so it will pick another port

app.listen(port, () => console.log(`Listening on port ${port}...`));
