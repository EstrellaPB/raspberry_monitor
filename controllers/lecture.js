'use strict'

let Lecture = require('../models/lecture');
let mongoosePaginate = require('mongoose-pagination');
let moment = require('moment');

function saveLecture(req, res) {
    let lecture = new Lecture();
    let params = req.body;
    console.log(params);
    lecture.mac_address = params.mac_address;
    lecture.vib_sensor_data = params.vib_sensor_data;
    lecture.voltage_data = params.voltage_data;
    lecture.pow_sensor_data = params.pow_sensor_data;
    lecture.pow_sensor_data_01 = params.pow_sensor_data_01;
    lecture.pow_sensor_data_02 = params.pow_sensor_data_02;
    lecture.save((err, lectureStored) => {
        if (err) {
            res.status(500).send({ message: 'error al guardar lectura' });
        } else {
            if (!lectureStored) {
                res.status(404).send({ message: 'no se ha guardado la lectura' });
            } else {
                res.status(200).send({ lecture: lectureStored });
            }
        }
    });
}

function findLectures(req, res) {
    let page = 1;
    let itemsPerPage = 10;
    let search = {};
    let sortBy = {};

    let query = req.query;
    console.log("Query: ", query);
    if (!!query) {
        for (const q_attr in query) {
            if (query.hasOwnProperty(q_attr)) {
                switch (q_attr) {
                    case 'page':
                        page = parseFloat(query[q_attr]);
                        break;
                    case 'perPage':
                        itemsPerPage = parseFloat(query[q_attr]);
                        break;
                    case 'sortBy':
                        let obj = JSON.parse(query[q_attr]);
                        let column = obj.column;

                        if (!!column) {
                            let sortOrder = 0;
                            if (obj.sort == 'ascending') {
                                sortOrder = 1;
                            } else if (obj.sort == 'descending') {
                                sortOrder = -1;
                            }
                            sortBy[column] = sortOrder
                        } else {
                            sortBy = {}
                        }
                        break;
                    case 'search':
                        if (!!query[q_attr]) {
                            search = { $or: [
                                { mac_address: { $regex: '.*' + query[q_attr] + '.*' } },
                                { pow_sensor_data: parseFloat(query[q_attr]) },
                                { voltage_data: parseFloat(query[q_attr]) }
                            ]}
                        }

                        break;
                    default:
                        break;
                }
            }
        }
    }

    Lecture.find(search).sort(sortBy)
        .paginate(page, itemsPerPage, function(err, lectures, total) {
            if (err) {
                console.error(err);
                res.status(500).send({ message: 'Something went wrong' });
            } else {
                if (!lectures) {
                    res.status(404).send({ message: 'No results' });
                } else {
                    return res.status(200).send({
                        total: total,
                        perPage: itemsPerPage,
                        lectures: lectures
                    })
                }
            }
        });
}

function findLecturesGraph(req, res) {
    // Defaults
    let today = moment().format('YYYY-MM-DD');
    let createdAtQuery = { $gte: today };
    let macAddressQuery = {};

    // Query validation
    let query = req.query;

    if (!!query) {
        for (const q_attr in query) {
            if (query.hasOwnProperty(q_attr)) {
                var queryDay = moment(query[q_attr]);
                var queryNextDay = moment(queryDay).add(1, 'days')
                switch (q_attr) {
                    case 'dates':
                        createdAtQuery = { $gte: queryDay, $lt: queryNextDay };

                        break;
                    case 'device':
                        if (!!query[q_attr]) {
                            macAddressQuery = { mac_address: query[q_attr]}
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
    console.log('Query: ', query);
    Lecture.find({ createdAt: createdAtQuery, ...macAddressQuery })
        .exec()
        .then((lecturesFound) => {
            res.status(200).send({ lectures: lecturesFound });
        })
        .catch(err => {
            res.status(500).send({ message: 'Something went wrong' });
        });
}

function findLectureById(req, res) {
    let lectureId = req.params.id;
    Lecture.findById(lectureId).
    exec().
    then((Lecture) => {
        res.status(200).send({ lecture: Lecture });
    }).
    catch(err => {
        res.status(500).send({ message: 'Something went wrong' });
    });
}

function deleteLecture(req, res) {
    let lectureId = req.params.id;
    Lecture.deleteOne({ _id: lectureId }, (err) => {
        if (err) {
            res.status(500).send({ message: 'Something went wrong' });
        } else {
            res.status(200).send({ message: 'Lecture was eliminated succesfully' });
        }
    })
}
module.exports = {
    findLectures,
    saveLecture,
    findLectureById,
    deleteLecture,
    findLecturesGraph
};