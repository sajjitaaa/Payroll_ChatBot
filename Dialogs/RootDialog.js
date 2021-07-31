const {
  ComponentDialog,
  WaterfallDialog,
  DialogSet,
  DialogTurnStatus,
  ChoicePrompt,
  ChoiceFactory,
} = require("botbuilder-dialogs");
const { LuisRecognizer, QnAMaker } = require("botbuilder-ai");
// const { Dis} = require("botbuilder-ai-orchestrator");

const { CardFactory } = require("botbuilder");

const {
  rootDialog,
  helpDialog,
  payrollDialog,
  salarySlipDialog,
  bonusDialog,
  gratuityDialog,
  pfDialog,
  reimbursementDialog,
  rechargeDialog,
} = require("../Constants/DialogIds");
const {
  HelpDialog,
  PayrollDialog,
  SalarySlipDialog,
  BonusDialog,
  GratuityDialog,
  PFDialog,
  ReimbursementDialog,
  RechargeDialog,
} = require("./allDialogs");

const parseMessage = "parseMessage";
const ChoicePromptDialog = "ChoicePromptDialog";

const luisConfig = {
  applicationId: process.env.LuisAppId,
  endpointKey: process.env.LuisAPIKey,
  endpoint: "https://manipal-interns-luis.cognitiveservices.azure.com/",
};

const dispatchConfig = {
  applicationId: process.env.DispatchAppID,
  endpointKey: process.env.DispatchAPIKey,
  endpoint: "https://manipal-interns-luis.cognitiveservices.azure.com/",
};

const qnaMaker = new QnAMaker({
  knowledgeBaseId: process.env.QnAKnowledgebaseId,
  endpointKey: process.env.QnAEndpointKey,
  host: "https://firstqabot.azurewebsites.net/qnamaker",
});

class RootDialog extends ComponentDialog {
  constructor(conversationState) {
    super(rootDialog);

    if (!conversationState) throw new Error("conv. state req.");

    this.conversationState = conversationState;
    this.addDialog(new ChoicePrompt(ChoicePromptDialog));

    this.addDialog(
      new WaterfallDialog(parseMessage, [this.routeMessage.bind(this)])
    );

    this.dispatchRecognizer = new LuisRecognizer(dispatchConfig, {
      apiVersion: "v3",
    });
    this.qnaMaker = qnaMaker;
    this.recognizer = new LuisRecognizer(luisConfig, {
      apiVersion: "v3",
    });

    this.addDialog(new HelpDialog(conversationState));
    this.addDialog(new PayrollDialog(conversationState));
    this.addDialog(new SalarySlipDialog(conversationState));
    this.addDialog(new BonusDialog(conversationState));
    this.addDialog(new GratuityDialog(conversationState));
    this.addDialog(new PFDialog(conversationState));
    this.addDialog(new ReimbursementDialog(conversationState));
    this.addDialog(new RechargeDialog(conversationState));

    this.initialDialogId = parseMessage;
  }

  async run(context, accessor) {
    try {
      const dialogSet = new DialogSet(accessor);
      dialogSet.add(this);
      const dialogContext = await dialogSet.createContext(context);
      const results = await dialogContext.continueDialog();

      if (results && results.status === DialogTurnStatus.empty) {
        await dialogContext.beginDialog(this.id);
      } else {
        // console.log("dialog set is empty");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async routeMessage(stepContext) {
    let dispatchResponse = await this.dispatchRecognizer.recognize(
      stepContext.context
    );
    let dispatchIntent = dispatchResponse.luisResult.prediction.topIntent;
    console.log("dispatch response : ", dispatchResponse);
    console.log("dispatch intent : ", dispatchIntent);

    switch (dispatchIntent) {
      case "l_Sajjita_Payroll":
        {
          console.log("inside payroll luis");
          let luisresponse = await this.recognizer.recognize(
            stepContext.context
          );
          let luisIntent = luisresponse.luisResult.prediction.topIntent;
          console.log("luis response : ", luisresponse);
          if (
            stepContext.context.activity.value &&
            stepContext.context.activity.value.actiontype
          ) {
            switch (stepContext.context.activity.value.actiontype) {
              case "detailsSubmit":
                let formValues = stepContext.context.activity.value;
                delete stepContext.context.activity.value;
                return await {
                  formRefill: true,
                  values: formValues,
                };
              case "monthSubmit":
                formValues = stepContext.context.activity.value;
                delete stepContext.context.activity.value;
                return await {
                  formRefill: true,
                  values: formValues,
                };
            }
          } else {
            if (stepContext.options && stepContext.options.interrupt) {
              switch (luisIntent || stepContext.context.activity.text) {
                case "View Salary Slip":
                  return await stepContext.beginDialog(salarySlipDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                    interrupt: true,
                    prevDialog: stepContext.options.prevDialog,
                  });

                case "View Bonus":
                  return await stepContext.beginDialog(bonusDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                    interrupt: true,
                    prevDialog: stepContext.options.prevDialog,
                  });
                case "Apply for Reimbursement":
                  return await stepContext.beginDialog(reimbursementDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                    interrupt: true,
                    prevDialog: stepContext.options.prevDialog,
                  });
                case "View PF":
                  return await stepContext.beginDialog(pfDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                    interrupt: true,
                    prevDialog: stepContext.options.prevDialog,
                  });
                case "View Gratuity":
                  return await stepContext.beginDialog(gratuityDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                    interrupt: true,
                    prevDialog: stepContext.options.prevDialog,
                  });
                case "Recharge":
                  return await stepContext.beginDialog(rechargeDialog, {
                    interrupt: true,
                    prevDialog: stepContext.options.prevDialog,
                  });
              }
            } else {
              switch (luisIntent || stepContext.context.activity.text) {
                case "apply leave":
                  await stepContext.context.sendActivity(
                    "Apply leave options:"
                  );
                  break;
                case "showPayroll":
                  return await stepContext.beginDialog(payrollDialog);
                case "l&d":
                  await stepContext.context.sendActivity("L&D options:");
                  break;
                case "Show Help":
                  return await stepContext.beginDialog(payrollDialog);
                case "Quit":
                  await stepContext.context.sendActivity({
                    attachments: [
                      CardFactory.adaptiveCard({
                        type: "AdaptiveCard",
                        $schema:
                          "http://adaptivecards.io/schemas/adaptive-card.json",
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
                case "View Salary Slip":
                  return await stepContext.beginDialog(salarySlipDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                  });

                case "View Bonus":
                  return await stepContext.beginDialog(bonusDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                  });
                case "Apply for Reimbursement":
                  return await stepContext.beginDialog(reimbursementDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                  });
                case "View PF":
                  return await stepContext.beginDialog(pfDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                  });
                case "View Gratuity":
                  return await stepContext.beginDialog(gratuityDialog, {
                    luisResult: true,
                    entities: luisresponse.luisResult.prediction.entities,
                  });
                case "Recharge":
                  return await stepContext.beginDialog(rechargeDialog);
                default:
                  await stepContext.prompt(ChoicePromptDialog, {
                    prompt:
                      "I dont understand your query. Do you need my help with something else? Choose 'Help' to see the suggestions. Choose 'No' to quit conversation. ",
                    choices: ChoiceFactory.toChoices(["Help", "No"]),
                  });
              }
            }
          }
        }
        break;
      case "q_qna-sajjita":
        {
          console.log("inside qna bot");

          const qnaResults = await this.qnaMaker.getAnswers(
            stepContext.context
          );

          if (qnaResults.length > 0) {
            await stepContext.context.sendActivity(`${qnaResults[0].answer}`);
          } else {
            await stepContext.context.sendActivity(
              "Sorry, could not find an answer in the Q and A system."
            );
          }
        }
        break;
      default:
        console.log(`Dispatch unrecognized intent: ${dispatchIntent}.`);
        await context.sendActivity(
          `Dispatch unrecognized intent: ${dispatchIntent}.`
        );
    }
    return await stepContext.endDialog();
  }
}

module.exports.RootDialog = RootDialog;
