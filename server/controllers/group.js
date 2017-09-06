import jwt from 'jsonwebtoken';
import Group from '../models/group';
import Event from '../models/event.js';
import config from '../config';
import { DAY } from '../../client/constants/calendar.js';

export function getGroups(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = decoded._doc._id
    Group.find({user: id}, (err, groups) => {
      if (err) return res.status(400).end();
      res.send(groups);
    });
  });
}

export function addGroup(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const newGroup = new Group({...req.body, user: decoded._doc._id});
    newGroup.save((err, group) => {
      if (err) return res.send(err);
      res.send(group);
    });
  });
}

export function updateGroup(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const _id = req.params.id;
    const options = {
      runValidators: true,
      new: true
    };
    Group.findOneAndUpdate({_id}, req.body, (err, updatedGroup) => {
      if (err) return res.send({error: err.message});
      res.send(updatedGroup);
    });
  });
}

export function deleteGroup(req, res) {
  const token = req.headers.authorization.substr(4);
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) return res.status(403).end();
    const id = req.params.id;
    Group.findByIdAndRemove(id, (err, group) => {
      if (err) return res.send(err);
      Event.remove({ group: id }, (err) => {
        if (err) return res.send(err);
        res.json({id:id});
      });
    });
  });
}