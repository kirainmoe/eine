# 🎩 Eine

(WIP) Another TypeScript framework to build a QQ bot.

```bash
npm install @eine-nineteen/eine --save-dev
```

# Simple Usage

```ts
import Eine, { Components, Filters, Types } from "@eine-nineteen/eine";

const { Plain, ImageFrom } = Components;
const { SentBy, TextEquals } = Filters;
const { EventHandleResult } = Types;

// new Eine(config: Parital<EineOptions>)
const eine = new Eine({
  verifyKey: "YourVerifyKey",
  adapters: {
    http: {
      host: "127.0.0.1",
      port: 8080,
    },
    ws: {
      host: "127.0.0.1",
      port: 8080,
    },
  },
  qq: 12345678,

  // Eine depends on MongoDB to record something.
  // If you don't need, disable the follwing options:
  // enableDatabase: false,
  // enableServer: false,
  mongoConfig: {
    username: 'admin',
    password: 'admin',
    dbName: 'BOT',
  },

  // [experiment] concurrency mode
  // start many eine processes to handle events and messages
  // use with caution!
  enableConcurrent: true,
});

// start Eine
eine.init()
  .then(eine.verify)
  .then(eine.bind)
  .then(async () => {
    const profile = await eine.http!.botProfile();
    console.log("MyProfile: ", profile);
  });

// Register an event listener:
// eine.on(eventType: EineEventType)(handler: EventCallback)
eine.on('FriendMessage', 'GroupMessage')(async ({
  messageChain,
  quote,
  recall,
  reply,
  sender,
  str,
}: Partial<Types.EventCallbackParams>) => {
  // Do something with messageChain, sender, str(serialized messageChain)...
  // and use reply(messageChain), recall(messageChain), recall() to react...

  if (str.contains("hello!")) {
    reply!([
      Plain("Hi!"), 
      ImageFrom("./hello.jpg") 
    ]);
    return EventHandleResult.DONE;          // return DONE to block other events
  }

  return EventHandleResult.CONTINUE;        // ...or CONTINUE to react next event
})

// with Eine's wait mechanism, you can easily write an interactive procedure:
const MASTER = 10001;
eine.on('FriendMessage', SentBy(MASTER), TextEquals("/shutdown"))(function*() {
  const { iterator, sender, reply, wait }: Types.EventInterruptParams = yield null;
  reply!(["send /confirm to shutdown BOT."]);

  // wait(iterator: EventIterator, filters: EventFilter)
  const { messageChain } = yield wait(iterator, TextEquals("/confirm"));    
  reply!(["BOT is shutting down."]);
  eine.shutdown(0);
  
  return EventHandleResult.DONE;      // this should never reached
                                      // but you should return it 
                                      // when using wait() to do othewr things.
});
```

# Advanced

- Eine provided an simple GUI admin panel. You can visit `http://[hostname]:9119` to use the panel.
- Eine provided an asynchronized encapsulation of node-canvas called `EinePainter`. Check `eine.painter` for more detail.
- Eine provided a logging system `eine.logger`. You can use `logLevel` option to control the level of logs.


# License

Copyright(c) 2021 @kirainmoe

MIT License