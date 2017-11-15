import passport from 'passport';
import path from 'path';
import { login, register, logout, auth} from './controllers/user';
import { getEvents, addEvent, updateEvent, deleteEvent} from './controllers/event';
import { getGroups, addGroup, updateGroup, deleteGroup} from './controllers/group';

const reqAuth = passport.authenticate('jwt', {session: false});

export default function (app) {
  app.get('/auth', auth);
  app.post('/login', login);
  app.post('/register', register);
  app.get('/logout', logout);

  app.get('/event', reqAuth, getEvents);
  app.post('/event', reqAuth, addEvent);
  app.put('/event/:id', reqAuth, updateEvent);
  app.delete('/event/:id', reqAuth, deleteEvent);

  app.get('/group', reqAuth, getGroups);
  app.post('/group', reqAuth, addGroup);
  app.put('/group/:id', reqAuth, updateGroup);
  app.delete('/group/:id', reqAuth, deleteGroup);

  app.get('/', defaultRoute);
  app.get('/login', defaultRoute);
}

const defaultRoute = (req, res) => {
  res.sendFile(path.resolve(__dirname + '/../public/index.html'));
};