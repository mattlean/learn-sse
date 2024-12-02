var express = require('express');
var router = express.Router();

let clients = [];
const facts = [];

const eventsHandler = (req, res, next) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  };
  res.writeHead(200, headers);

  const data = `data: ${JSON.stringify(facts)}\n\n`;

  res.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    res
  };

  clients.push(newClient);

  req.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

const sendEventsToAll = (newFact) => {
  clients.forEach(client => client.res.write(`data: ${JSON.stringify(newFact)}\n\n`))
}

async function addFact(req, res, next) {
  const newFact = req.body;
  facts.push(newFact);
  res.json(newFact);
  return sendEventsToAll(newFact);
}

router.get('/status', (req, res) => res.json({ clients: clients.length }));

router.get('/events', eventsHandler);

router.post('/fact', addFact);

module.exports = router;
