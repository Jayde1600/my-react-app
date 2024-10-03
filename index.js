const Joi = require('joi'); // Import the Joi validation library
const express = require('express');  // Import the Express framework
const app = express();  // Create an instance of Express

app.use(express.json()); // Middleware to parse incoming JSON requests

// Array of sample courses for demonstration purposes
const courses = [
    { id: 1, name: 'course1' },
    { id: 2, name: 'course2' },
    { id: 3, name: 'course3' },
];

// Route handler for the root URL ('/'), sends a greeting message
app.get('/', (req, res) => { // req = request, res = response
    res.send('Hello World!!'); // Send a plain-text response
});

// Route handler for '/api/courses' to get the list of all courses
app.get('/api/courses', (req, res) => {
    res.send(courses); // Send the array of courses as the response
});

// Route handler for creating a new course (POST request)
app.post('/api/courses', (req, res) => {
    // Validate the request body (course data)
    const { error } = validateCourse(req.body); // Destructure to get the 'error' from validation result
    if (error) {
        // 400 Bad Request if validation fails
        return res.status(400).send(error.details[0].message); // Send the first validation error message
    }

    // Create a new course object and add it to the courses array
    const course = {
        id: courses.length + 1, // New course ID is one greater than the last ID
        name: req.body.name // Use the 'name' property from the request body
    };
    courses.push(course); // Add the new course to the array
    res.send(course); // Send the new course as the response
});

// Route handler for updating a course (PUT request)
app.put('/api/courses/:id', (req, res) => {
    // Look for the course with the given ID
    let course = courses.find(x => x.id === parseInt(req.params.id)); // Find the course by ID
    if (!course) return res.status(404).send('The course was not found!'); // 404 if course not found

    // Validate the request body
    const { error } = validateCourse(req.body);
    if (error) {
        // 400 Bad Request if validation fails
        return res.status(400).send(error.details[0].message); // Send the first validation error message
    }

    // Update the course name and send the updated course back to the client
    course.name = req.body.name;
    res.send(course); // Send the updated course as the response
});

// Function to validate a course object using Joi
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required() // Course name must be a string, at least 3 characters long, and required
    });

    return schema.validate(course); // Validate the course object against the schema and return the result
}

// Route handler for deleting a course (DELETE request)
app.delete('/api/courses/:id', (req, res) => {
    // Look up the course by ID
    let course = courses.find(x => x.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('The course was not found!'); // 404 if course not found

    // Remove the course from the array
    const index = courses.indexOf(course); // Get the index of the course
    courses.splice(index, 1); // Remove the course from the array

    // Send the deleted course as the response
    res.send(course);
});

// Route handler for getting a course by ID (GET request)
app.get('/api/courses/:id', (req, res) => {
    // Look for the course with the given ID
    let course = courses.find(x => x.id === parseInt(req.params.id)); // Parse the course ID from the URL
    if (!course) return res.status(404).send('The course was not found!'); // 404 if course not found
    res.send(course); // Send the course as the response
});

// PORT configuration
const port = process.env.PORT || 3000; // Use the PORT from environment variables, or default to 3000

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Listening on port ${port}...`));
