const { ActivityHandler, CardFactory } = require("botbuilder");

class BotActivityHandler extends ActivityHandler {
  constructor(conversationState, rootDialog) {
    super();

    if (!conversationState) throw new Error("conv. state req.");

    this.conversationState = conversationState;
    this.rootDialog = rootDialog;
    this.accessor = this.conversationState.createProperty("DialogAccessor ");

    //message event
    this.onMessage(async (context, next) => {
      await this.rootDialog.run(context, this.accessor);
      await next();
    });

    this.onConversationUpdate(async (context, next) => {
      if (context.activity.membersAdded && context.activity.membersAdded[0]) {
        await context.sendActivity({
          attachments: [
            CardFactory.adaptiveCard({
              type: "AdaptiveCard",
              $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
              version: "1.2",
              body: [
                {
                  type: "Container",
                  items: [
                    {
                      type: "Image",
                      url: "https://cliply.co/wp-content/uploads/2019/05/371905140_MEET_ROBOT_400px.gif",
                      size: "Large",
                      width: "300px",
                    },
                  ],
                },
                {
                  type: "TextBlock",
                  wrap: true,
                  text: "Welcome, User! I am your personal HR assistant Bot. What can I help you with today?",
                  separator: true,
                  color: "Accent",
                  weight: "Bolder",
                  size: "Medium",
                  isSubtle: true,
                },
              ],
            }),
          ],
        });
        await context.sendActivity({
          attachments: [
            CardFactory.heroCard(
              "Here are some suggestions you can choose from :",
              null,
              CardFactory.actions([
                {
                  type: "imBack",
                  title: "Apply Leave",
                  value: "Apply Leave",
                },
                {
                  type: "imBack",
                  title: "Payroll",
                  value: "Payroll",
                },

                {
                  type: "imBack",
                  title: "L&D",
                  value: "L&D",
                },
                {
                  type: "imBack",
                  title: "Recharge",
                  value: "Recharge",
                },
                {
                  type: "imBack",
                  title: "Help",
                  value: "Help",
                },
              ])
            ),
          ],
        });
      }

      await next();
    });
  }

  async run(context) {
    await super.run(context);
    await this.conversationState.saveChanges(context, false);
  }
}

module.exports.BotActivityHandler = BotActivityHandler;
