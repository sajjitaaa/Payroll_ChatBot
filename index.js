const restify = require("restify");

const {
  BotFrameworkAdapter,
  ConversationState,
  MemoryStorage,
} = require("botbuilder");
const { BotActivityHandler } = require("./BotActivityHandler");
const { RootDialog } = require("./Dialogs/RootDialog");

//adapter init

const adapter = new BotFrameworkAdapter({
  appID: "",
  appPassword: "",
});

//adapter error handler

adapter.onTurnError = async (context, error) => {
  console.log("Error occured : ", error);

  await context.sendActivity("Bot encountered error");
};

const memory = new MemoryStorage();
let conversationState = new ConversationState(memory);

//create obj of activity handler
const rootDialog = new RootDialog(conversationState);
const mainBot = new BotActivityHandler(conversationState, rootDialog);
//creating server
let server = restify.createServer();

server.listen(3978, () => {
  console.log(`${server.name} listening to ${server.url}`);
});

server.post("/api/messages", (req, res) => {
  adapter.processActivity(req, res, async (context) => {
    await mainBot.run(context);
  });
});
