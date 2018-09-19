'use strict';

const amqp = require('amqplib');

const q = 'test_queue';
amqp.connect('amqp://localhost')
  .then(conn => {
    return conn.createChannel();
  })
  .then(ch => {
    ch.assertQueue(q, { durable: false });
    ch.prefetch(1);
    console.log(" [x] Awaiting RPC Requests");
    ch.consume(q, msg => {
      
      const n = msg.content.toString()

      console.log(" [.] Receive [%s]", n);

      // start
      let tStart = Date.now();

      //let r = fibonacci(n);
      let r = "SERVER|REPLY|"+n+"|"

      // finish
      let tEnd = Date.now();

      // to send object as a message,
      // you have to call JSON.stringify
      /* r = JSON.stringify({
        result: r,
        time: (tEnd - tStart)
      }); */
      
      ch.sendToQueue(msg.properties.replyTo,
        new Buffer.from(r.toString()),
        { correlationId: msg.properties.correlationId });
      ch.ack(msg);
    })
  });

function fibonacci(n) {
  if (!n) n = 1;

  if (n === 0 || n === 1) 
    return n;
  else
    return fibonacci(n - 1) + fibonacci(n - 2);
}