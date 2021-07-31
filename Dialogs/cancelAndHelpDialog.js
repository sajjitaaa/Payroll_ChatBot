const { InputHints } = require("botbuilder");
const {
  ComponentDialog,
  DialogTurnStatus,
  ChoiceFactory,
  ChoicePrompt,
} = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const ChoicePromptDialog = "ChoicePromptDialog";
new ChoicePrompt(ChoicePromptDialog);
const { rootDialog } = require("../Constants/DialogIds");

class CancelAndHelpDialog extends ComponentDialog {
  async onContinueDialog(innerDc) {
    const result = await this.interrupt(innerDc);
    if (result) {
      return result;
    }
    return await super.onContinueDialog(innerDc);
  }

  async interrupt(innerDc) {
    if (innerDc.context.activity.text) {
      const text = innerDc.context.activity.text.toLowerCase();

      switch (text) {
        case "yes":
          if (innerDc.stack) {
            return await innerDc.continueDialog();
          }

        case "no":
          await innerDc.cancelAllDialogs();
          {
            const helpMessageText =
              "Here are some other options you can go with : ";
            await innerDc.context.sendActivity(
              helpMessageText,
              helpMessageText,
              InputHints.ExpectingInput
            );
            await innerDc.context.sendActivity({
              attachments: [
                CardFactory.heroCard(
                  "Here are some options you can choose from :",
                  null,
                  CardFactory.actions([
                    {
                      type: "imBack",
                      title: "Salary Slip",
                      value: "Salary Slip",
                    },
                    {
                      type: "imBack",
                      title: "Bonus",
                      value: "Bonus",
                    },

                    {
                      type: "imBack",
                      title: "Reimbursement",
                      value: "Reimbursement",
                    },
                    {
                      type: "imBack",
                      title: "PF",
                      value: "PF",
                    },
                    {
                      type: "imBack",
                      title: "Gratuity",
                      value: "Gratuity",
                    },
                    {
                      type: "imBack",
                      title: "Recharge",
                      value: "Recharge",
                    },
                  ])
                ),
              ],
            });

            return { status: DialogTurnStatus.waiting };
          }
        case "help":
        case "?": {
          const helpMessageText =
            "Help are some other options you can go with : ";
          await innerDc.context.sendActivity(
            helpMessageText,
            helpMessageText,
            InputHints.ExpectingInput
          );
          await innerDc.context.sendActivity({
            attachments: [
              CardFactory.heroCard(
                "Here are some options you can choose from :",
                null,
                CardFactory.actions([
                  {
                    type: "imBack",
                    title: "Salary Slip",
                    value: "Salary Slip",
                  },
                  {
                    type: "imBack",
                    title: "Bonus",
                    value: "Bonus",
                  },

                  {
                    type: "imBack",
                    title: "Reimbursement",
                    value: "Reimbursement",
                  },
                  {
                    type: "imBack",
                    title: "PF",
                    value: "PF",
                  },
                  {
                    type: "imBack",
                    title: "Gratuity",
                    value: "Gratuity",
                  },
                  {
                    type: "imBack",
                    title: "Recharge",
                    value: "Recharge",
                  },
                ])
              ),
            ],
          });

          return { status: DialogTurnStatus.waiting };
        }
        case "cancel":
        case "quit": {
          const cancelMessageText = "Cancelling..";
          await innerDc.context.sendActivity(
            cancelMessageText,
            cancelMessageText,
            InputHints.IgnoringInput
          );
          await innerDc.cancelAllDialogs();
          return await innerDc.prompt(ChoicePromptDialog, {
            prompt:
              "Do you want to quit the conversation? Choose 'Help' to see the suggestions: ",
            choices: ChoiceFactory.toChoices(["Help", "No I want to Quit"]),
          });
        }
        case "no i want to quit":
          await innerDc.context.sendActivity({
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
                        url: "https://i.pinimg.com/originals/2b/91/91/2b9191c0750915300106a457fddec474.gif",
                        width: "250px",
                      },
                    ],
                  },
                  {
                    type: "TextBlock",
                    wrap: true,
                    text: " Okay, I hope I could help you with your query! Have a nice day!",
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
          break;
        case "salary slip":
        case "bonus":
        case "reimbursement":
        case "pf":
        case "gratuity":
        case "recharge": {
          await innerDc.beginDialog(rootDialog, {
            interrupt: true,
            prevDialog: text,
          });
          return { status: DialogTurnStatus.waiting };
        }
        // default:
        //   await innerDc.prompt(ChoicePromptDialog, {
        //     prompt:
        //       "I dont understand your query. Do you need my help with something else? Choose 'Help' to see the suggestions. Choose 'Cancel' to quit conversation. ",
        //     choices: ChoiceFactory.toChoices(["Help", "Cancel"]),
        //   });
      }
    }
  }
}

module.exports.CancelAndHelpDialog = CancelAndHelpDialog;
