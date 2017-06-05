import jwt from 'jsonwebtoken';
import Event from '../models/event';
import config from '../config';
import { DAY } from '../../client/constants/calendar.js';

export function getEvents(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = decoded._doc._id;
    Event.find({user: id}, (err, events) => {
      console.log(events[0].dateBegin, typeof events[0].dateBegin)
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
      console.log(err, event)
      if (err) return res.send({error: err.message});
      res.send(event);
    });
  });
}

export function updateEvent(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = req.body._id;
    Event.findById(id, (err, event) => {
      if (err) return res.send({error: err.message});
      event = {...event, ...req.body};
      event.save((err, updatedEvent) => {
        res.send(updatedEvent);
      });
    });
  });
}

export function deleteEvent(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = req.body.id;
    Event.findByIdAndRemove(id, (err, event) => {
      if (err) return res.send(err);
    });
  });
}
