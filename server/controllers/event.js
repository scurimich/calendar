import jwt from 'jsonwebtoken';
import eachSeries from 'async/eachSeries';
import Event from '../models/event';
import config from '../config';
import { DAY } from '../../client/constants/calendar.js';

export function getEvents(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = decoded._doc._id;
    Event.find({user: id}, (err, events) => {
      if(err) return res.status(400).end();
      res.json(events);
    });
  });
}

export function addEvent(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const newEvent = new Event({...req.body, user: decoded._doc._id});
    newEvent.save((err, event) => {
      if (err) return res.json(err);
      res.send(event);
    });
  });
}

export function updateEvent(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const _id = req.params.id;
    const options = {
      runValidators: true,
      new: true
    };
    Event.findOneAndUpdate({_id}, req.body, options, (err, updatedEvent) => {
      if (err) return res.send({error: err.message});
      res.send(updatedEvent);
    });
  });
}

export function deleteEvent(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = req.params.id;
    Event.findByIdAndRemove(id, (err, event) => {
      if (err) return res.send(err);
    });
  });
}