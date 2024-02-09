const pool = require('../../db');
const queries = require('./queries')

const getStudents = (req, res) => {
    pool.query(queries.getStudents, (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    })
}

const getStudentById = (req, res) => {
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentById, [id], (error, results) => {
        if(error) throw error;
        res.status(200).json(results.rows);
    })
}

const addStudent = (req, res) => {
    const {name, email, age, dob} = req.body;

    // check if emila exists
    pool.query(queries.checkEmailExists, [email], (error, results) => {
        if(results.rows.length) {
            res.send("Email alreday exists.");
        }

        // Add student to db
        pool.query(queries.addStudent, [name, email, age, dob], (error, results) => {
            if(error) throw error;
            res.status(201).send("Student Created Successfully!");
        })
    })
}

const deleteStudent = (req, res) => {   
    const id = parseInt(req.params.id);
    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if(noStudentFound) {
            res.send("Student does not exists in the database!");
        }
    })

    pool.query(queries.deleteStudent, [id], (error, results) => {
        if(error) throw error;
        res.status(200).send("Student Deleted Successfully!");
    })
}

const updateStudent = (req, res) => {
    const id = parseInt(req.params.id);
    const {name} = req.body;

    pool.query(queries.getStudentById, [id], (error, results) => {
        const noStudentFound = !results.rows.length;
        if(noStudentFound) {
            res.send("Student does not exists in the database!");
        }

        pool.query(queries.updateStudent, [name, id], (error, results) => {
            if(error) throw error;
            res.status(200).send("Student Updated Successfully!");
        })
    })
}

module.exports = {
    getStudents,
    getStudentById,
    addStudent,
    deleteStudent,
    updateStudent
}