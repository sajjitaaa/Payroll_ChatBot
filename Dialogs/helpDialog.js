const { ComponentDialog, WaterfallDialog } = require("botbuilder-dialogs");
const { CardFactory } = require("botbuilder");
const { helpDialog } = require("../Constants/DialogIds");

const helpDialogWF1 = "helpDialogWF1";

class HelpDialog extends ComponentDialog {
  constructor(conversationState) {
    super(helpDialog);

    if (!conversationState) throw new Error("conv. state req.");

    this.conversationState = conversationState;

    this.addDialog(
      new WaterfallDialog(helpDialogWF1, [this.sendHelpSuggestions.bind(this)])
    );

    this.initialDialogId = helpDialogWF1;
  }

  async sendHelpSuggestions(stepContext) {
    await stepContext.context.sendActivity({
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
              title: "Help",
              value: "Help",
            },
            {
              type: "imBack",
              title: "Recharge",
              value: "Recharge",
            },
            {
              type: "imBack",
              title: "Quit",
              value: "Quit",
            },
          ])
        ),
      ],
    });

    return await stepContext.endDialog();
  }
}

module.exports.HelpDialog = HelpDialog;
